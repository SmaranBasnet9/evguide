-- ─────────────────────────────────────────────────────────────────────────────
-- Dealer Portal
-- Tables:
--   1. dealer_profiles  — business details + approval status
--   2. dealer_listings  — vehicles submitted by dealers
--   3. dealer_enquiries — enquiries received on dealer listings
-- ─────────────────────────────────────────────────────────────────────────────

-- Extend profiles to track dealer status independently of role
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS dealer_status TEXT;
  -- null | pending_approval | approved | rejected | suspended

-- 1. Dealer business profiles
CREATE TABLE IF NOT EXISTS dealer_profiles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name     TEXT NOT NULL,
  contact_name     TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT NOT NULL,
  address_line1    TEXT NOT NULL,
  address_line2    TEXT,
  city             TEXT NOT NULL,
  postcode         TEXT NOT NULL,
  fca_frn          TEXT,
  website          TEXT,
  status           TEXT NOT NULL DEFAULT 'pending_approval',
  -- pending_approval | approved | rejected | suspended
  rejection_reason TEXT,
  approved_at      TIMESTAMPTZ,
  approved_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dealer_profiles_user_id ON dealer_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_dealer_profiles_status  ON dealer_profiles (status);

CREATE OR REPLACE FUNCTION set_dealer_profiles_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER dealer_profiles_updated_at
  BEFORE UPDATE ON dealer_profiles
  FOR EACH ROW EXECUTE FUNCTION set_dealer_profiles_updated_at();

-- 2. Dealer vehicle listings
CREATE TABLE IF NOT EXISTS dealer_listings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id        UUID NOT NULL REFERENCES dealer_profiles(id) ON DELETE CASCADE,
  status           TEXT NOT NULL DEFAULT 'draft',
  -- draft | pending | live | rejected
  rejection_reason TEXT,
  brand            TEXT NOT NULL,
  model            TEXT NOT NULL,
  year             INTEGER NOT NULL,
  price            NUMERIC(10,2) NOT NULL,
  mileage          INTEGER NOT NULL,
  colour           TEXT,
  description      TEXT,
  images           TEXT[] DEFAULT '{}',
  -- Specs
  range_km         INTEGER,
  battery_kwh      NUMERIC(5,2),
  drive            TEXT,
  body_type        TEXT,
  charging_standard TEXT,
  seats            INTEGER,
  location         TEXT,
  -- Review
  reviewed_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dealer_listings_dealer_id  ON dealer_listings (dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_listings_status     ON dealer_listings (status);
CREATE INDEX IF NOT EXISTS idx_dealer_listings_created_at ON dealer_listings (created_at DESC);

CREATE OR REPLACE FUNCTION set_dealer_listings_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER dealer_listings_updated_at
  BEFORE UPDATE ON dealer_listings
  FOR EACH ROW EXECUTE FUNCTION set_dealer_listings_updated_at();

-- 3. Enquiries on dealer listings
CREATE TABLE IF NOT EXISTS dealer_enquiries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID NOT NULL REFERENCES dealer_listings(id) ON DELETE CASCADE,
  dealer_id   UUID NOT NULL REFERENCES dealer_profiles(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  message     TEXT,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dealer_enquiries_dealer_id  ON dealer_enquiries (dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_enquiries_listing_id ON dealer_enquiries (listing_id);
CREATE INDEX IF NOT EXISTS idx_dealer_enquiries_is_read    ON dealer_enquiries (is_read);

-- ── Row Level Security ──────────────────────────────────────────────────────

ALTER TABLE dealer_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_listings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_enquiries ENABLE ROW LEVEL SECURITY;

-- Dealers can read/update their own profile
CREATE POLICY "dealer_own_profile"
  ON dealer_profiles FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Dealers can CRUD their own listings
CREATE POLICY "dealer_own_listings"
  ON dealer_listings FOR ALL TO authenticated
  USING (
    dealer_id IN (SELECT id FROM dealer_profiles WHERE user_id = auth.uid())
  )
  WITH CHECK (
    dealer_id IN (SELECT id FROM dealer_profiles WHERE user_id = auth.uid())
  );

-- Live listings are publicly readable (for the vehicles browse page)
CREATE POLICY "public_read_live_listings"
  ON dealer_listings FOR SELECT
  TO anon, authenticated
  USING (status = 'live');

-- Dealers can read their own enquiries
CREATE POLICY "dealer_own_enquiries"
  ON dealer_enquiries FOR SELECT TO authenticated
  USING (
    dealer_id IN (SELECT id FROM dealer_profiles WHERE user_id = auth.uid())
  );

-- Anyone can submit an enquiry
CREATE POLICY "public_insert_enquiry"
  ON dealer_enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
