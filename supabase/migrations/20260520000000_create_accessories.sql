-- ─────────────────────────────────────────────────────────────────────────────
-- EV & Hybrid Accessories
-- Tables:
--   1. accessory_categories  — top-level category (Charging Cables, etc.)
--   2. accessories           — individual products within a category
-- Storage:
--   accessories bucket       — product images uploaded via admin
-- ─────────────────────────────────────────────────────────────────────────────

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('accessories', 'accessories', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 1. Categories

CREATE TABLE IF NOT EXISTS public.accessory_categories (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT        NOT NULL UNIQUE,
  name          TEXT        NOT NULL,
  description   TEXT,
  icon          TEXT,                          -- lucide icon name string
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


-- 2. Products

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
  badge            TEXT,                        -- "New" | "Hot" | "Popular" | null
  rating           NUMERIC(3,1)  CHECK (rating >= 0 AND rating <= 5),
  review_count     INT           NOT NULL DEFAULT 0,
  is_featured      BOOLEAN       NOT NULL DEFAULT FALSE,
  is_active        BOOLEAN       NOT NULL DEFAULT TRUE,
  compatible_with  TEXT[]        NOT NULL DEFAULT '{}',   -- ["EV","Hybrid","PHEV"]
  display_order    INT           NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT timezone('utc', now()),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS accessories_category_id_idx
  ON public.accessories (category_id);
CREATE INDEX IF NOT EXISTS accessories_is_active_idx
  ON public.accessories (is_active);
CREATE INDEX IF NOT EXISTS accessories_is_featured_idx
  ON public.accessories (is_featured);
CREATE INDEX IF NOT EXISTS accessories_display_order_idx
  ON public.accessories (category_id, display_order ASC);

CREATE OR REPLACE FUNCTION public.set_accessories_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = timezone('utc', now()); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS accessories_updated_at ON public.accessories;
CREATE TRIGGER accessories_updated_at
  BEFORE UPDATE ON public.accessories
  FOR EACH ROW EXECUTE PROCEDURE public.set_accessories_updated_at();


-- ─────────────────────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.accessory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessories           ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read categories"
  ON public.accessory_categories FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public read accessories"
  ON public.accessories FOR SELECT USING (is_active = TRUE);

-- Service role (admin) full access bypasses RLS automatically


-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: Categories
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO public.accessory_categories (slug, name, description, icon, display_order) VALUES
  ('charging-cables',   'Charging Cables',    'Type 2, CCS & CHAdeMO cables for home and public charging.',       'Cable',          1),
  ('home-chargers',     'Home Chargers',      '7kW–22kW smart wallbox units for overnight EV charging.',           'BatteryCharging', 2),
  ('battery-covers',    'Battery Covers',     'Protective underbody guards and thermal battery wraps.',            'Shield',         3),
  ('portable-chargers', 'Portable Chargers',  'Compact emergency chargers — plug into any 3-pin socket.',         'Plug',           4),
  ('aero-accessories',  'Aero Accessories',   'Wheel covers, diffusers and spoilers to maximise range.',           'Wind',           5),
  ('range-monitors',    'Range Monitors',     'OBD2 adapters and dashboards for real-time battery insight.',       'Gauge',          6),
  ('service-kits',      'EV Service Kits',    'Tyre inflators, tow straps and breakdown kits for EVs.',           'Wrench',         7),
  ('hybrid-gadgets',    'Hybrid Gadgets',     'Regen brake optimisers, HV safety gloves and diagnostic tools.',   'Zap',            8)
ON CONFLICT (slug) DO NOTHING;


-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: Products (3 per category)
-- ─────────────────────────────────────────────────────────────────────────────

-- Charging Cables
INSERT INTO public.accessories (category_id, name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
SELECT c.id, p.name, p.slug, p.description, p.brand, p.price_gbp, p.badge, p.rating, p.review_count, p.is_featured, p.compatible_with, p.display_order
FROM public.accessory_categories c,
(VALUES
  ('Rolec 7.5m Type 2 Cable',       'rolec-type2-75m',         '7.5-metre tethered Type 2 cable, 32A rated for all UK wallboxes.',                 'Rolec',    39.99,  'Popular', 4.7, 312, TRUE,  ARRAY['EV','PHEV'],         1),
  ('Chargemaster CCS Combo Cable',  'chargemaster-ccs-combo',  '50A CCS Combo 2 rapid-charge cable with protective carry bag.',                    'Chargemaster', 59.99, NULL,  4.5, 148, FALSE, ARRAY['EV'],                2),
  ('Granny Charger 10m EVSE',       'granny-charger-10m',      '10-metre Mode 2 cable with UK 3-pin to Type 2 for emergency home charging.',       'Pod Point', 49.00,  'New', 4.3,  94, FALSE, ARRAY['EV','PHEV','Hybrid'], 3)
) AS p(name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
WHERE c.slug = 'charging-cables'
ON CONFLICT (slug) DO NOTHING;

-- Home Chargers
INSERT INTO public.accessories (category_id, name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
SELECT c.id, p.name, p.slug, p.description, p.brand, p.price_gbp, p.badge, p.rating, p.review_count, p.is_featured, p.compatible_with, p.display_order
FROM public.accessory_categories c,
(VALUES
  ('Ohme Home Pro 7kW',             'ohme-home-pro-7kw',       'Smart 7kW wallbox with dynamic load balancing and Ohme app control.',             'Ohme',     799.00, 'Popular', 4.8, 524, TRUE,  ARRAY['EV','PHEV'],         1),
  ('Zappi 7kW Solar EV Charger',    'zappi-7kw-solar',         'Eco-smart charger that prioritises surplus solar energy for charging.',            'myenergi', 699.00, 'Hot',     4.7, 390, TRUE,  ARRAY['EV','PHEV'],         2),
  ('Pod Point Solo 3 7kW',          'pod-point-solo3-7kw',     'OZEV-approved 7kW unit with remote access and load balancing.',                   'Pod Point',749.00, NULL,      4.5, 280, FALSE, ARRAY['EV','PHEV'],         3)
) AS p(name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
WHERE c.slug = 'home-chargers'
ON CONFLICT (slug) DO NOTHING;

-- Battery Covers
INSERT INTO public.accessories (category_id, name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
SELECT c.id, p.name, p.slug, p.description, p.brand, p.price_gbp, p.badge, p.rating, p.review_count, p.is_featured, p.compatible_with, p.display_order
FROM public.accessory_categories c,
(VALUES
  ('Underbody Battery Guard Plate',  'underbody-battery-guard',  '6mm aluminium skid plate protecting HV battery from road debris.',              'EV Armor',  129.00, 'New',     4.6,  82, TRUE,  ARRAY['EV'],                1),
  ('Thermal Battery Blanket',        'thermal-battery-blanket',  'Insulating wrap to maintain optimal battery temp in cold UK winters.',           'BattWrap',   79.99, NULL,      4.4,  55, FALSE, ARRAY['EV','PHEV','Hybrid'], 2),
  ('Battery Vent Cover Kit',         'battery-vent-cover-kit',   'Seals underbody vents against water ingress during heavy rain or flooding.',     'EV Shield',  34.99, NULL,      4.2,  41, FALSE, ARRAY['EV','PHEV'],         3)
) AS p(name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
WHERE c.slug = 'battery-covers'
ON CONFLICT (slug) DO NOTHING;

-- Portable Chargers
INSERT INTO public.accessories (category_id, name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
SELECT c.id, p.name, p.slug, p.description, p.brand, p.price_gbp, p.badge, p.rating, p.review_count, p.is_featured, p.compatible_with, p.display_order
FROM public.accessory_categories c,
(VALUES
  ('Mustart Level 2 Portable EVSE',  'mustart-level2-portable',  '16A portable charger with adjustable current (8/10/13/16A), 5m cable.',          'Mustart',   129.99, 'Popular', 4.6, 204, TRUE,  ARRAY['EV','PHEV'],         1),
  ('EVSE UK 3-Pin Mode 2 Charger',   'evse-uk-mode2',            'Standard 3-pin EVSE with in-cable control box, 10A for overnight top-up.',       'EVSE UK',    49.99, NULL,      4.1,  97, FALSE, ARRAY['EV','PHEV'],         2),
  ('Ratio 22kW Portable Wallbox',    'ratio-22kw-portable',      '22kW 3-phase portable unit for workplaces with CEE socket access.',              'Ratio',     349.00, 'New',     4.8,  38, FALSE, ARRAY['EV'],                3)
) AS p(name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
WHERE c.slug = 'portable-chargers'
ON CONFLICT (slug) DO NOTHING;

-- Aero Accessories
INSERT INTO public.accessories (category_id, name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
SELECT c.id, p.name, p.slug, p.description, p.brand, p.price_gbp, p.badge, p.rating, p.review_count, p.is_featured, p.compatible_with, p.display_order
FROM public.accessory_categories c,
(VALUES
  ('EV Aerocap Wheel Covers Set/4',  'ev-aerocap-wheel-covers', 'Snap-on aero wheel covers reducing drag and extending range by up to 5%.',       'AeroCap',    89.99, 'Hot',     4.5, 163, TRUE,  ARRAY['EV','PHEV'],         1),
  ('Rear Diffuser Splitter Kit',     'rear-diffuser-splitter',  'Universal rear diffuser improving high-speed stability and aero balance.',        'SplitFlow',  64.99, NULL,      4.3,  58, FALSE, ARRAY['EV','Hybrid'],       2),
  ('Roof Spoiler Lip (Universal)',   'roof-spoiler-lip',        'Adhesive roof spoiler lip reducing lift and improving EV range efficiency.',      'EvoDyn',     49.99, NULL,      4.0,  44, FALSE, ARRAY['EV','PHEV','Hybrid'], 3)
) AS p(name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
WHERE c.slug = 'aero-accessories'
ON CONFLICT (slug) DO NOTHING;

-- Range Monitors
INSERT INTO public.accessories (category_id, name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
SELECT c.id, p.name, p.slug, p.description, p.brand, p.price_gbp, p.badge, p.rating, p.review_count, p.is_featured, p.compatible_with, p.display_order
FROM public.accessory_categories c,
(VALUES
  ('LeafSpy Pro OBD2 Adapter',       'leafspy-pro-obd2',        'Bluetooth OBD2 dongle for detailed battery health monitoring via app.',           'LeafSpy',    24.99, 'Popular', 4.8, 592, TRUE,  ARRAY['EV'],                1),
  ('CarScanner EV BMS Display',      'carscanner-ev-bms',       '4" heads-up display showing live SoC, cell balancing and regen data.',            'CarScanner', 79.99, 'New',     4.4,  87, FALSE, ARRAY['EV','PHEV'],         2),
  ('FIXD EV Sensor & App',           'fixd-ev-sensor',          'OBD2 sensor and app translating fault codes into plain-English explanations.',   'FIXD',       19.99, NULL,      4.2, 340, FALSE, ARRAY['EV','PHEV','Hybrid'], 3)
) AS p(name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
WHERE c.slug = 'range-monitors'
ON CONFLICT (slug) DO NOTHING;

-- EV Service Kits
INSERT INTO public.accessories (category_id, name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
SELECT c.id, p.name, p.slug, p.description, p.brand, p.price_gbp, p.badge, p.rating, p.review_count, p.is_featured, p.compatible_with, p.display_order
FROM public.accessory_categories c,
(VALUES
  ('Ring RAC900 Tyre Inflator',      'ring-rac900-inflator',    'Digital 12V tyre inflator with auto-shutoff and LED, ideal for EV frunk storage.','Ring',       34.99, 'Popular', 4.7, 815, TRUE,  ARRAY['EV','PHEV','Hybrid'], 1),
  ('EV Breakdown Safety Kit',        'ev-breakdown-kit',        'HV-safe breakdown kit: insulating gloves, triangle, torch and first aid.',        'EVSafe',     49.99, 'New',     4.5,  72, FALSE, ARRAY['EV','PHEV','Hybrid'], 2),
  ('Heavy-Duty EV Tow Strap 5T',    'heavy-duty-tow-strap-5t', '5-tonne rated flat tow strap with shackles — EV safe, no snatch loading.',        'TowPro',     22.99, NULL,      4.3, 128, FALSE, ARRAY['EV','PHEV','Hybrid'], 3)
) AS p(name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
WHERE c.slug = 'service-kits'
ON CONFLICT (slug) DO NOTHING;

-- Hybrid Gadgets
INSERT INTO public.accessories (category_id, name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
SELECT c.id, p.name, p.slug, p.description, p.brand, p.price_gbp, p.badge, p.rating, p.review_count, p.is_featured, p.compatible_with, p.display_order
FROM public.accessory_categories c,
(VALUES
  ('Regen Brake Pedal Optimizer',    'regen-brake-optimizer',   'Plug-in module that sharpens regen braking response on compatible hybrids.',      'RegenTune',  89.99, 'Hot',     4.5,  63, TRUE,  ARRAY['Hybrid','PHEV'],     1),
  ('HV Safety Insulating Gloves',    'hv-safety-gloves-class0', 'Class 0 (1000V) rubber insulating gloves for safe hybrid/EV HV work.',           'Salisbury',  44.99, 'Popular', 4.9,  94, FALSE, ARRAY['EV','PHEV','Hybrid'], 2),
  ('Hybrid Battery Tester Probe',    'hybrid-battery-tester',   'Handheld HV battery state-of-health tester for NiMH and Li-ion hybrid packs.',   'Midtronics', 149.00,'New',     4.7,  29, FALSE, ARRAY['Hybrid','PHEV'],     3)
) AS p(name, slug, description, brand, price_gbp, badge, rating, review_count, is_featured, compatible_with, display_order)
WHERE c.slug = 'hybrid-gadgets'
ON CONFLICT (slug) DO NOTHING;
