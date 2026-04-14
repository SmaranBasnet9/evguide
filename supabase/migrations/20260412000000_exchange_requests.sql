-- ─────────────────────────────────────────────────────────────────────────────
-- Exchange Requests Module
-- Three tables:
--   1. exchange_requests       — one row per submission
--   2. exchange_request_images — uploaded vehicle photos
--   3. exchange_request_activity — status-change + note timeline
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Main exchange requests table
CREATE TABLE IF NOT EXISTS exchange_requests (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Customer
  customer_name            TEXT NOT NULL,
  phone                    TEXT NOT NULL,
  email                    TEXT NOT NULL,
  city                     TEXT,
  preferred_contact_method TEXT DEFAULT 'phone', -- phone | email | whatsapp

  -- Current vehicle
  current_vehicle_brand    TEXT NOT NULL,
  current_vehicle_model    TEXT NOT NULL,
  current_vehicle_year     INTEGER NOT NULL,
  registration_year        INTEGER,
  fuel_type                TEXT NOT NULL,        -- petrol | diesel | hybrid | ev | other
  transmission             TEXT,                 -- automatic | manual
  ownership_type           TEXT,                 -- first_owner | second_owner | third_owner_plus
  mileage                  INTEGER,              -- km driven
  registration_number      TEXT,
  condition                TEXT,                 -- excellent | good | average | poor
  accident_history         BOOLEAN DEFAULT FALSE,
  service_history          BOOLEAN DEFAULT FALSE,
  insurance_valid          BOOLEAN DEFAULT FALSE,
  vehicle_color            TEXT,
  number_of_keys           INTEGER DEFAULT 1,
  vehicle_location         TEXT,
  expected_value           NUMERIC(10,2),        -- user's own expectation (optional)
  remarks                  TEXT,

  -- Target EV (auto-attached from selected listing)
  target_ev_id             TEXT,
  target_ev_slug           TEXT,
  target_ev_brand          TEXT,
  target_ev_model          TEXT,
  target_ev_price          NUMERIC(10,2),
  target_ev_image          TEXT,

  -- System-generated instant valuation
  estimated_value          NUMERIC(10,2),
  valuation_confidence     TEXT,                 -- low | medium | high
  valuation_notes          TEXT,

  -- Admin-set final offer
  final_offer_value        NUMERIC(10,2),

  -- Lifecycle management
  status                   TEXT NOT NULL DEFAULT 'new',
  -- new | contacted | valuation_reviewed | inspection_scheduled |
  -- offer_sent | converted | rejected | archived
  priority                 TEXT NOT NULL DEFAULT 'medium', -- low | medium | high | urgent
  assigned_to              TEXT,                           -- staff member name
  source_page              TEXT,                           -- which page/component triggered it
  submitted_from           TEXT,                           -- user-agent or device hint
  is_read                  BOOLEAN NOT NULL DEFAULT FALSE,
  admin_notes              TEXT
);

-- Auto-update updated_at on every write
CREATE OR REPLACE FUNCTION set_exchange_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER exchange_requests_updated_at
  BEFORE UPDATE ON exchange_requests
  FOR EACH ROW EXECUTE FUNCTION set_exchange_updated_at();

-- Index for common admin queries
CREATE INDEX idx_exchange_requests_status      ON exchange_requests (status);
CREATE INDEX idx_exchange_requests_created_at  ON exchange_requests (created_at DESC);
CREATE INDEX idx_exchange_requests_email       ON exchange_requests (email);
CREATE INDEX idx_exchange_requests_target_ev   ON exchange_requests (target_ev_id);
CREATE INDEX idx_exchange_requests_is_read     ON exchange_requests (is_read);


-- 2. Uploaded vehicle images
CREATE TABLE IF NOT EXISTS exchange_request_images (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_request_id UUID NOT NULL REFERENCES exchange_requests (id) ON DELETE CASCADE,
  image_type          TEXT NOT NULL, -- front | rear | side | interior | odometer | damage | other
  file_path           TEXT,
  file_url            TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_exchange_images_request_id ON exchange_request_images (exchange_request_id);


-- 3. Activity / follow-up log
CREATE TABLE IF NOT EXISTS exchange_request_activity (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_request_id UUID NOT NULL REFERENCES exchange_requests (id) ON DELETE CASCADE,
  action_type         TEXT NOT NULL,
  -- status_change | note_added | assigned | valuation_updated |
  -- offer_sent | inspection_scheduled | contacted
  old_status          TEXT,
  new_status          TEXT,
  note                TEXT,
  created_by          TEXT,   -- staff name or "system"
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_exchange_activity_request_id ON exchange_request_activity (exchange_request_id);
CREATE INDEX idx_exchange_activity_created_at ON exchange_request_activity (exchange_request_id, created_at DESC);


-- ── Row Level Security ───────────────────────────────────────────────────────
-- Public: INSERT only (anyone can submit a request; no SELECT)
-- Admin (service role key, used via createAdminClient): bypasses RLS entirely

ALTER TABLE exchange_requests           ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_request_images     ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_request_activity   ENABLE ROW LEVEL SECURITY;

-- Allow anonymous/public inserts
CREATE POLICY "public_insert_exchange_requests"
  ON exchange_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "public_insert_exchange_images"
  ON exchange_request_images FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated admins (or service role) can SELECT / UPDATE / DELETE
-- The Next.js admin layer uses the service role key so it bypasses RLS.
-- These policies block direct anon reads just in case.
CREATE POLICY "admin_all_exchange_requests"
  ON exchange_requests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

CREATE POLICY "admin_all_exchange_images"
  ON exchange_request_images FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

CREATE POLICY "admin_all_exchange_activity"
  ON exchange_request_activity FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );
