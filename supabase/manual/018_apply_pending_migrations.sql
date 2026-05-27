-- ============================================================
-- Pending Migrations — apply in Supabase SQL Editor
-- Covers the 4 files in supabase/migrations/ that have not
-- been applied via the manual workflow yet:
--   1. 20260412000000_exchange_requests
--   2. 20260412020000_charging_logs
--   3. 20260515000000_dealer_portal
--   4. 20260520000000_create_accessories
-- All statements are idempotent (safe to re-run).
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- 1. EXCHANGE REQUESTS
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS exchange_requests (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  customer_name            TEXT NOT NULL,
  phone                    TEXT NOT NULL,
  email                    TEXT NOT NULL,
  city                     TEXT,
  preferred_contact_method TEXT DEFAULT 'phone',
  current_vehicle_brand    TEXT NOT NULL,
  current_vehicle_model    TEXT NOT NULL,
  current_vehicle_year     INTEGER NOT NULL,
  registration_year        INTEGER,
  fuel_type                TEXT NOT NULL,
  transmission             TEXT,
  ownership_type           TEXT,
  mileage                  INTEGER,
  registration_number      TEXT,
  condition                TEXT,
  accident_history         BOOLEAN DEFAULT FALSE,
  service_history          BOOLEAN DEFAULT FALSE,
  insurance_valid          BOOLEAN DEFAULT FALSE,
  vehicle_color            TEXT,
  number_of_keys           INTEGER DEFAULT 1,
  vehicle_location         TEXT,
  expected_value           NUMERIC(10,2),
  remarks                  TEXT,
  target_ev_id             TEXT,
  target_ev_slug           TEXT,
  target_ev_brand          TEXT,
  target_ev_model          TEXT,
  target_ev_price          NUMERIC(10,2),
  target_ev_image          TEXT,
  estimated_value          NUMERIC(10,2),
  valuation_confidence     TEXT,
  valuation_notes          TEXT,
  final_offer_value        NUMERIC(10,2),
  status                   TEXT NOT NULL DEFAULT 'new',
  priority                 TEXT NOT NULL DEFAULT 'medium',
  assigned_to              TEXT,
  source_page              TEXT,
  submitted_from           TEXT,
  is_read                  BOOLEAN NOT NULL DEFAULT FALSE,
  admin_notes              TEXT
);

CREATE OR REPLACE FUNCTION set_exchange_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS exchange_requests_updated_at ON exchange_requests;
CREATE TRIGGER exchange_requests_updated_at
  BEFORE UPDATE ON exchange_requests
  FOR EACH ROW EXECUTE FUNCTION set_exchange_updated_at();

CREATE INDEX IF NOT EXISTS idx_exchange_requests_status     ON exchange_requests (status);
CREATE INDEX IF NOT EXISTS idx_exchange_requests_created_at ON exchange_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exchange_requests_email      ON exchange_requests (email);
CREATE INDEX IF NOT EXISTS idx_exchange_requests_target_ev  ON exchange_requests (target_ev_id);
CREATE INDEX IF NOT EXISTS idx_exchange_requests_is_read    ON exchange_requests (is_read);

CREATE TABLE IF NOT EXISTS exchange_request_images (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_request_id UUID NOT NULL REFERENCES exchange_requests (id) ON DELETE CASCADE,
  image_type          TEXT NOT NULL,
  file_path           TEXT,
  file_url            TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exchange_images_request_id ON exchange_request_images (exchange_request_id);

CREATE TABLE IF NOT EXISTS exchange_request_activity (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_request_id UUID NOT NULL REFERENCES exchange_requests (id) ON DELETE CASCADE,
  action_type         TEXT NOT NULL,
  old_status          TEXT,
  new_status          TEXT,
  note                TEXT,
  created_by          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exchange_activity_request_id ON exchange_request_activity (exchange_request_id);
CREATE INDEX IF NOT EXISTS idx_exchange_activity_created_at ON exchange_request_activity (exchange_request_id, created_at DESC);

ALTER TABLE exchange_requests           ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_request_images     ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_request_activity   ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='exchange_requests' AND policyname='public_insert_exchange_requests') THEN
    CREATE POLICY "public_insert_exchange_requests"
      ON exchange_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='exchange_request_images' AND policyname='public_insert_exchange_images') THEN
    CREATE POLICY "public_insert_exchange_images"
      ON exchange_request_images FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='exchange_requests' AND policyname='admin_all_exchange_requests') THEN
    CREATE POLICY "admin_all_exchange_requests"
      ON exchange_requests FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='exchange_request_images' AND policyname='admin_all_exchange_images') THEN
    CREATE POLICY "admin_all_exchange_images"
      ON exchange_request_images FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='exchange_request_activity' AND policyname='admin_all_exchange_activity') THEN
    CREATE POLICY "admin_all_exchange_activity"
      ON exchange_request_activity FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
  END IF;
END $$;


-- ════════════════════════════════════════════════════════════
-- 2. CHARGING LOGS
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS charger_search_logs (
  id                uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           uuid        REFERENCES auth.users (id) ON DELETE SET NULL,
  session_id        TEXT,
  searched_location TEXT        NOT NULL,
  latitude          DOUBLE PRECISION,
  longitude         DOUBLE PRECISION,
  radius            INTEGER,
  filters           JSONB       NOT NULL DEFAULT '{}',
  results_count     INTEGER     NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS charger_search_logs_user_id_idx    ON charger_search_logs (user_id);
CREATE INDEX IF NOT EXISTS charger_search_logs_created_at_idx ON charger_search_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS charger_search_logs_location_idx   ON charger_search_logs (searched_location);

CREATE TABLE IF NOT EXISTS charger_click_logs (
  id                uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           uuid        REFERENCES auth.users (id) ON DELETE SET NULL,
  session_id        TEXT,
  charger_id        TEXT        NOT NULL,
  charger_name      TEXT        NOT NULL,
  network           TEXT,
  searched_location TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS charger_click_logs_user_id_idx    ON charger_click_logs (user_id);
CREATE INDEX IF NOT EXISTS charger_click_logs_charger_id_idx ON charger_click_logs (charger_id);
CREATE INDEX IF NOT EXISTS charger_click_logs_created_at_idx ON charger_click_logs (created_at DESC);

CREATE TABLE IF NOT EXISTS charger_cache (
  id            uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider      TEXT        NOT NULL,
  cache_key     TEXT        NOT NULL,
  response_json JSONB       NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT charger_cache_provider_key_unique UNIQUE (provider, cache_key)
);

CREATE INDEX IF NOT EXISTS charger_cache_expires_at_idx ON charger_cache (expires_at);

ALTER TABLE charger_search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE charger_click_logs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE charger_cache       ENABLE ROW LEVEL SECURITY;


-- ════════════════════════════════════════════════════════════
-- 3. DEALER PORTAL
-- ════════════════════════════════════════════════════════════

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dealer_status TEXT;

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

DROP TRIGGER IF EXISTS dealer_profiles_updated_at ON dealer_profiles;
CREATE TRIGGER dealer_profiles_updated_at
  BEFORE UPDATE ON dealer_profiles
  FOR EACH ROW EXECUTE FUNCTION set_dealer_profiles_updated_at();

CREATE TABLE IF NOT EXISTS dealer_listings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id        UUID NOT NULL REFERENCES dealer_profiles(id) ON DELETE CASCADE,
  status           TEXT NOT NULL DEFAULT 'draft',
  rejection_reason TEXT,
  brand            TEXT NOT NULL,
  model            TEXT NOT NULL,
  year             INTEGER NOT NULL,
  price            NUMERIC(10,2) NOT NULL,
  mileage          INTEGER NOT NULL,
  colour           TEXT,
  description      TEXT,
  images           TEXT[] DEFAULT '{}',
  range_km         INTEGER,
  battery_kwh      NUMERIC(5,2),
  drive            TEXT,
  body_type        TEXT,
  charging_standard TEXT,
  seats            INTEGER,
  location         TEXT,
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

DROP TRIGGER IF EXISTS dealer_listings_updated_at ON dealer_listings;
CREATE TRIGGER dealer_listings_updated_at
  BEFORE UPDATE ON dealer_listings
  FOR EACH ROW EXECUTE FUNCTION set_dealer_listings_updated_at();

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

ALTER TABLE dealer_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_listings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_enquiries ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='dealer_profiles' AND policyname='dealer_own_profile') THEN
    CREATE POLICY "dealer_own_profile"
      ON dealer_profiles FOR ALL TO authenticated
      USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='dealer_listings' AND policyname='dealer_own_listings') THEN
    CREATE POLICY "dealer_own_listings"
      ON dealer_listings FOR ALL TO authenticated
      USING (dealer_id IN (SELECT id FROM dealer_profiles WHERE user_id = auth.uid()))
      WITH CHECK (dealer_id IN (SELECT id FROM dealer_profiles WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='dealer_listings' AND policyname='public_read_live_listings') THEN
    CREATE POLICY "public_read_live_listings"
      ON dealer_listings FOR SELECT TO anon, authenticated USING (status = 'live');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='dealer_enquiries' AND policyname='dealer_own_enquiries') THEN
    CREATE POLICY "dealer_own_enquiries"
      ON dealer_enquiries FOR SELECT TO authenticated
      USING (dealer_id IN (SELECT id FROM dealer_profiles WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='dealer_enquiries' AND policyname='public_insert_enquiry') THEN
    CREATE POLICY "public_insert_enquiry"
      ON dealer_enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;
END $$;


-- ════════════════════════════════════════════════════════════
-- Storage buckets
-- ════════════════════════════════════════════════════════════

-- dealer uploads / exchange photo uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', TRUE)
ON CONFLICT (id) DO NOTHING;

-- accessories product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('accessories', 'accessories', TRUE)
ON CONFLICT (id) DO NOTHING;


-- ════════════════════════════════════════════════════════════
-- 4. ACCESSORIES
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.accessory_categories (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT        NOT NULL UNIQUE,
  name          TEXT        NOT NULL,
  description   TEXT,
  icon          TEXT,
  display_order INT         NOT NULL DEFAULT 0,
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS accessory_categories_display_order_idx
  ON public.accessory_categories (display_order ASC);

CREATE OR REPLACE FUNCTION public.set_accessory_categories_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = timezone('utc', now()); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS accessory_categories_updated_at ON public.accessory_categories;
CREATE TRIGGER accessory_categories_updated_at
  BEFORE UPDATE ON public.accessory_categories
  FOR EACH ROW EXECUTE PROCEDURE public.set_accessory_categories_updated_at();

CREATE TABLE IF NOT EXISTS public.accessories (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id      UUID          NOT NULL REFERENCES public.accessory_categories(id) ON DELETE CASCADE,
  name             TEXT          NOT NULL,
  slug             TEXT          NOT NULL UNIQUE,
  description      TEXT,
  brand            TEXT,
  price_gbp        NUMERIC(10,2),
  image_url        TEXT,
  affiliate_url    TEXT,
  badge            TEXT,
  rating           NUMERIC(3,1)  CHECK (rating >= 0 AND rating <= 5),
  review_count     INT           NOT NULL DEFAULT 0,
  is_featured      BOOLEAN       NOT NULL DEFAULT FALSE,
  is_active        BOOLEAN       NOT NULL DEFAULT TRUE,
  compatible_with  TEXT[]        NOT NULL DEFAULT '{}',
  display_order    INT           NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT timezone('utc', now()),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS accessories_category_id_idx    ON public.accessories (category_id);
CREATE INDEX IF NOT EXISTS accessories_is_active_idx      ON public.accessories (is_active);
CREATE INDEX IF NOT EXISTS accessories_is_featured_idx    ON public.accessories (is_featured);
CREATE INDEX IF NOT EXISTS accessories_display_order_idx  ON public.accessories (category_id, display_order ASC);

CREATE OR REPLACE FUNCTION public.set_accessories_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = timezone('utc', now()); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS accessories_updated_at ON public.accessories;
CREATE TRIGGER accessories_updated_at
  BEFORE UPDATE ON public.accessories
  FOR EACH ROW EXECUTE PROCEDURE public.set_accessories_updated_at();

ALTER TABLE public.accessory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessories           ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='accessory_categories' AND policyname='Public read categories') THEN
    CREATE POLICY "Public read categories"
      ON public.accessory_categories FOR SELECT USING (is_active = TRUE);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='accessories' AND policyname='Public read accessories') THEN
    CREATE POLICY "Public read accessories"
      ON public.accessories FOR SELECT USING (is_active = TRUE);
  END IF;
END $$;

-- Seed: Categories
INSERT INTO public.accessory_categories (slug, name, description, icon, display_order) VALUES
  ('charging-cables',   'Charging Cables',    'Type 2, CCS & CHAdeMO cables for home and public charging.',       'Cable',           1),
  ('home-chargers',     'Home Chargers',      '7kW–22kW smart wallbox units for overnight EV charging.',           'BatteryCharging',  2),
  ('battery-covers',    'Battery Covers',     'Protective underbody guards and thermal battery wraps.',            'Shield',          3),
  ('portable-chargers', 'Portable Chargers',  'Compact emergency chargers — plug into any 3-pin socket.',         'Plug',            4),
  ('aero-accessories',  'Aero Accessories',   'Wheel covers, diffusers and spoilers to maximise range.',           'Wind',            5),
  ('range-monitors',    'Range Monitors',     'OBD2 adapters and dashboards for real-time battery insight.',       'Gauge',           6),
  ('service-kits',      'EV Service Kits',    'Tyre inflators, tow straps and breakdown kits for EVs.',           'Wrench',          7),
  ('hybrid-gadgets',    'Hybrid Gadgets',     'Regen brake optimisers, HV safety gloves and diagnostic tools.',   'Zap',             8)
ON CONFLICT (slug) DO NOTHING;

-- Seed: Products
INSERT INTO public.accessories (category_id, name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
SELECT c.id, p.name, p.slug, p.description, p.brand, p.price_gbp, p.badge, p.rating, p.review_count, p.is_featured, p.compatible_with, p.display_order
FROM public.accessory_categories c,
(VALUES
  ('Rolec 7.5m Type 2 Cable',       'rolec-type2-75m',         '7.5-metre tethered Type 2 cable, 32A rated for all UK wallboxes.',                 'Rolec',     39.99,  'Popular', 4.7, 312, TRUE,  ARRAY['EV','PHEV'],          1),
  ('Chargemaster CCS Combo Cable',  'chargemaster-ccs-combo',  '50A CCS Combo 2 rapid-charge cable with protective carry bag.',                    'Chargemaster',59.99, NULL,    4.5, 148, FALSE, ARRAY['EV'],                 2),
  ('Granny Charger 10m EVSE',       'granny-charger-10m',      '10-metre Mode 2 cable with UK 3-pin to Type 2 for emergency home charging.',       'Pod Point', 49.00,  'New',     4.3,  94, FALSE, ARRAY['EV','PHEV','Hybrid'],  3)
) AS p(name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
WHERE c.slug = 'charging-cables'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.accessories (category_id, name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
SELECT c.id, p.name, p.slug, p.description, p.brand, p.price_gbp, p.badge, p.rating, p.review_count, p.is_featured, p.compatible_with, p.display_order
FROM public.accessory_categories c,
(VALUES
  ('Ohme Home Pro 7kW',             'ohme-home-pro-7kw',       'Smart 7kW wallbox with dynamic load balancing and Ohme app control.',             'Ohme',     799.00, 'Popular', 4.8, 524, TRUE,  ARRAY['EV','PHEV'],  1),
  ('Zappi 7kW Solar EV Charger',    'zappi-7kw-solar',         'Eco-smart charger that prioritises surplus solar energy for charging.',            'myenergi', 699.00, 'Hot',     4.7, 390, TRUE,  ARRAY['EV','PHEV'],  2),
  ('Pod Point Solo 3 7kW',          'pod-point-solo3-7kw',     'OZEV-approved 7kW unit with remote access and load balancing.',                   'Pod Point',749.00, NULL,      4.5, 280, FALSE, ARRAY['EV','PHEV'],  3)
) AS p(name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
WHERE c.slug = 'home-chargers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.accessories (category_id, name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
SELECT c.id, p.name, p.slug, p.description, p.brand, p.price_gbp, p.badge, p.rating, p.review_count, p.is_featured, p.compatible_with, p.display_order
FROM public.accessory_categories c,
(VALUES
  ('Underbody Battery Guard Plate', 'underbody-battery-guard',  '6mm aluminium skid plate protecting HV battery from road debris.',              'EV Armor',  129.00, 'New',  4.6,  82, TRUE,  ARRAY['EV'],                 1),
  ('Thermal Battery Blanket',       'thermal-battery-blanket',  'Insulating wrap to maintain optimal battery temp in cold UK winters.',           'BattWrap',   79.99, NULL,   4.4,  55, FALSE, ARRAY['EV','PHEV','Hybrid'],  2),
  ('Battery Vent Cover Kit',        'battery-vent-cover-kit',   'Seals underbody vents against water ingress during heavy rain or flooding.',     'EV Shield',  34.99, NULL,   4.2,  41, FALSE, ARRAY['EV','PHEV'],          3)
) AS p(name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
WHERE c.slug = 'battery-covers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.accessories (category_id, name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
SELECT c.id, p.name, p.slug, p.description, p.brand, p.price_gbp, p.badge, p.rating, p.review_count, p.is_featured, p.compatible_with, p.display_order
FROM public.accessory_categories c,
(VALUES
  ('Mustart Level 2 Portable EVSE', 'mustart-level2-portable',  '16A portable charger with adjustable current (8/10/13/16A), 5m cable.',          'Mustart',   129.99, 'Popular', 4.6, 204, TRUE,  ARRAY['EV','PHEV'],  1),
  ('EVSE UK 3-Pin Mode 2 Charger',  'evse-uk-mode2',            'Standard 3-pin EVSE with in-cable control box, 10A for overnight top-up.',       'EVSE UK',    49.99, NULL,      4.1,  97, FALSE, ARRAY['EV','PHEV'],  2),
  ('Ratio 22kW Portable Wallbox',   'ratio-22kw-portable',      '22kW 3-phase portable unit for workplaces with CEE socket access.',              'Ratio',     349.00, 'New',     4.8,  38, FALSE, ARRAY['EV'],         3)
) AS p(name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
WHERE c.slug = 'portable-chargers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.accessories (category_id, name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
SELECT c.id, p.name, p.slug, p.description, p.brand, p.price_gbp, p.badge, p.rating, p.review_count, p.is_featured, p.compatible_with, p.display_order
FROM public.accessory_categories c,
(VALUES
  ('EV Aerocap Wheel Covers Set/4', 'ev-aerocap-wheel-covers', 'Snap-on aero wheel covers reducing drag and extending range by up to 5%.',       'AeroCap',    89.99, 'Hot',  4.5, 163, TRUE,  ARRAY['EV','PHEV'],         1),
  ('Rear Diffuser Splitter Kit',    'rear-diffuser-splitter',  'Universal rear diffuser improving high-speed stability and aero balance.',        'SplitFlow',  64.99, NULL,   4.3,  58, FALSE, ARRAY['EV','Hybrid'],        2),
  ('Roof Spoiler Lip (Universal)',  'roof-spoiler-lip',        'Adhesive roof spoiler lip reducing lift and improving EV range efficiency.',      'EvoDyn',     49.99, NULL,   4.0,  44, FALSE, ARRAY['EV','PHEV','Hybrid'], 3)
) AS p(name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
WHERE c.slug = 'aero-accessories'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.accessories (category_id, name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
SELECT c.id, p.name, p.slug, p.description, p.brand, p.price_gbp, p.badge, p.rating, p.review_count, p.is_featured, p.compatible_with, p.display_order
FROM public.accessory_categories c,
(VALUES
  ('LeafSpy Pro OBD2 Adapter',      'leafspy-pro-obd2',        'Bluetooth OBD2 dongle for detailed battery health monitoring via app.',           'LeafSpy',    24.99, 'Popular', 4.8, 592, TRUE,  ARRAY['EV'],                 1),
  ('CarScanner EV BMS Display',     'carscanner-ev-bms',       '4" heads-up display showing live SoC, cell balancing and regen data.',            'CarScanner', 79.99, 'New',     4.4,  87, FALSE, ARRAY['EV','PHEV'],          2),
  ('FIXD EV Sensor & App',          'fixd-ev-sensor',          'OBD2 sensor and app translating fault codes into plain-English explanations.',    'FIXD',       19.99, NULL,      4.2, 340, FALSE, ARRAY['EV','PHEV','Hybrid'],  3)
) AS p(name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
WHERE c.slug = 'range-monitors'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.accessories (category_id, name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
SELECT c.id, p.name, p.slug, p.description, p.brand, p.price_gbp, p.badge, p.rating, p.review_count, p.is_featured, p.compatible_with, p.display_order
FROM public.accessory_categories c,
(VALUES
  ('Ring RAC900 Tyre Inflator',     'ring-rac900-inflator',    'Digital 12V tyre inflator with auto-shutoff and LED, ideal for EV frunk storage.','Ring',       34.99, 'Popular', 4.7, 815, TRUE,  ARRAY['EV','PHEV','Hybrid'], 1),
  ('EV Breakdown Safety Kit',       'ev-breakdown-kit',        'HV-safe breakdown kit: insulating gloves, triangle, torch and first aid.',        'EVSafe',     49.99, 'New',     4.5,  72, FALSE, ARRAY['EV','PHEV','Hybrid'], 2),
  ('Heavy-Duty EV Tow Strap 5T',   'heavy-duty-tow-strap-5t', '5-tonne rated flat tow strap with shackles — EV safe, no snatch loading.',        'TowPro',     22.99, NULL,      4.3, 128, FALSE, ARRAY['EV','PHEV','Hybrid'], 3)
) AS p(name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
WHERE c.slug = 'service-kits'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.accessories (category_id, name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
SELECT c.id, p.name, p.slug, p.description, p.brand, p.price_gbp, p.badge, p.rating, p.review_count, p.is_featured, p.compatible_with, p.display_order
FROM public.accessory_categories c,
(VALUES
  ('Regen Brake Pedal Optimizer',   'regen-brake-optimizer',   'Plug-in module that sharpens regen braking response on compatible hybrids.',      'RegenTune',  89.99, 'Hot',     4.5,  63, TRUE,  ARRAY['Hybrid','PHEV'],      1),
  ('HV Safety Insulating Gloves',   'hv-safety-gloves-class0', 'Class 0 (1000V) rubber insulating gloves for safe hybrid/EV HV work.',           'Salisbury',  44.99, 'Popular', 4.9,  94, FALSE, ARRAY['EV','PHEV','Hybrid'], 2),
  ('Hybrid Battery Tester Probe',   'hybrid-battery-tester',   'Handheld HV battery state-of-health tester for NiMH and Li-ion hybrid packs.',   'Midtronics',149.00, 'New',     4.7,  29, FALSE, ARRAY['Hybrid','PHEV'],      3)
) AS p(name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
WHERE c.slug = 'hybrid-gadgets'
ON CONFLICT (slug) DO NOTHING;
