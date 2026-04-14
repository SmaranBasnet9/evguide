-- ============================================================
-- Migration 008 — EV-Native Schema Extensions
-- Date: 2026-04-10
-- Purpose: Add EV-specific columns to ev_models and create
--          saved_vehicles, government_grants, and
--          tco_calculations tables.
-- ============================================================

-- ── 1. EV-native columns on ev_models ───────────────────────

ALTER TABLE ev_models
  ADD COLUMN IF NOT EXISTS range_miles              SMALLINT,
  ADD COLUMN IF NOT EXISTS real_world_range_miles   SMALLINT,
  ADD COLUMN IF NOT EXISTS charging_speed_ac_kw     DECIMAL(5,1),
  ADD COLUMN IF NOT EXISTS charging_speed_dc_kw     DECIMAL(5,1),
  ADD COLUMN IF NOT EXISTS charge_port_type         VARCHAR(20),   -- CCS | CHAdeMO | NACS | Type2
  ADD COLUMN IF NOT EXISTS charge_time_to80_mins    SMALLINT,
  ADD COLUMN IF NOT EXISTS charge_time_full_mins    SMALLINT,
  ADD COLUMN IF NOT EXISTS battery_warranty_years   SMALLINT,
  ADD COLUMN IF NOT EXISTS v2g_capable              BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS annual_energy_cost_gbp   DECIMAL(8,2),
  ADD COLUMN IF NOT EXISTS co2_saving_kg_per_year   INTEGER;

COMMENT ON COLUMN ev_models.range_miles            IS 'WLTP official range in miles';
COMMENT ON COLUMN ev_models.real_world_range_miles IS 'Estimated real-world range (approx 82% of WLTP)';
COMMENT ON COLUMN ev_models.charging_speed_ac_kw   IS 'Max AC (home) charge rate in kW';
COMMENT ON COLUMN ev_models.charging_speed_dc_kw   IS 'Max DC (rapid) charge rate in kW';
COMMENT ON COLUMN ev_models.charge_port_type       IS 'Primary charge port standard';
COMMENT ON COLUMN ev_models.charge_time_to80_mins  IS 'DC fast charge time from 10-80% in minutes';
COMMENT ON COLUMN ev_models.battery_warranty_years IS 'Battery warranty period in years';
COMMENT ON COLUMN ev_models.v2g_capable            IS 'Supports Vehicle-to-Grid';
COMMENT ON COLUMN ev_models.annual_energy_cost_gbp IS 'Estimated annual energy cost at 7,500 mi/yr, 28p/kWh';
COMMENT ON COLUMN ev_models.co2_saving_kg_per_year IS 'Annual CO2 saving vs avg UK petrol car (kg)';

-- ── 2. saved_vehicles — user shortlists ─────────────────────

CREATE TABLE IF NOT EXISTS saved_vehicles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id      TEXT,
  vehicle_id      TEXT NOT NULL,           -- ev_models.id
  vehicle_label   TEXT NOT NULL,           -- e.g. "Tesla Model Y"
  vehicle_price   INTEGER,
  saved_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT saved_vehicles_identity_check CHECK (
    user_id IS NOT NULL OR session_id IS NOT NULL
  ),
  UNIQUE (user_id, vehicle_id),
  UNIQUE (session_id, vehicle_id)
);

ALTER TABLE saved_vehicles ENABLE ROW LEVEL SECURITY;

-- Users can only see and manage their own saved vehicles
CREATE POLICY "Users see own saved vehicles"
  ON saved_vehicles FOR SELECT
  USING (
    auth.uid() = user_id
    OR session_id = current_setting('request.cookie.evg_session', true)
  );

CREATE POLICY "Users insert own saved vehicles"
  ON saved_vehicles FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR session_id IS NOT NULL
  );

CREATE POLICY "Users delete own saved vehicles"
  ON saved_vehicles FOR DELETE
  USING (
    auth.uid() = user_id
    OR session_id = current_setting('request.cookie.evg_session', true)
  );

-- Service role bypass
CREATE POLICY "Service role full access saved_vehicles"
  ON saved_vehicles FOR ALL
  USING (auth.role() = 'service_role');

-- ── 3. government_grants ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS government_grants (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grant_name          TEXT NOT NULL,
  authority           TEXT NOT NULL,             -- OZEV, DVLA, Local Council
  grant_amount_gbp    DECIMAL(8,2) NOT NULL,
  description         TEXT,
  eligibility_notes   TEXT,
  vehicle_types       TEXT[] DEFAULT ARRAY['car'],
  price_cap_gbp       DECIMAL(10,2),
  is_active           BOOLEAN DEFAULT TRUE,
  expires_at          DATE,
  source_url          TEXT,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial UK grants (2026)
INSERT INTO government_grants
  (grant_name, authority, grant_amount_gbp, description, eligibility_notes, vehicle_types, price_cap_gbp, is_active, source_url)
VALUES
  (
    'Electric Vehicle Homecharge Scheme (EVHS)',
    'OZEV',
    350.00,
    'Grant toward installing a home EV chargepoint',
    'Must be a homeowner with off-street parking. Available for new EV purchases.',
    ARRAY['car','van'],
    NULL,
    TRUE,
    'https://www.gov.uk/electric-vehicle-homecharge-scheme'
  ),
  (
    'Workplace Charging Scheme (WCS)',
    'OZEV',
    350.00,
    'Grant toward installing workplace EV charge points (up to 40 sockets)',
    'For businesses, charities, and public sector organisations. Up to £350 per socket, max 40 sockets.',
    ARRAY['car','van'],
    NULL,
    TRUE,
    'https://www.gov.uk/apply-for-workplace-charging-scheme-voucher'
  ),
  (
    'EV Salary Sacrifice — BiK Rate Incentive',
    'HMRC',
    0.00,
    'EVs attract just 3% Benefit-in-Kind tax rate (2026–2028), making salary sacrifice very tax-efficient',
    'Available through employer salary sacrifice schemes. Saves 20–40% vs personal contract hire depending on tax band.',
    ARRAY['car'],
    NULL,
    TRUE,
    'https://www.gov.uk/expenses-and-benefits-company-cars'
  ),
  (
    'Zero-Rate Vehicle Excise Duty (VED)',
    'DVLA',
    0.00,
    'Fully electric cars pay £0 VED (road tax) — saving £190–£600/year vs petrol equivalent',
    'Applies to all zero-emission cars registered in the UK.',
    ARRAY['car'],
    NULL,
    TRUE,
    'https://www.gov.uk/vehicle-tax-rate-tables'
  )
ON CONFLICT DO NOTHING;

-- ── 4. tco_calculations — stored TCO sessions ────────────────

CREATE TABLE IF NOT EXISTS tco_calculations (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id                  TEXT,
  vehicle_id                  TEXT NOT NULL,
  annual_mileage              INTEGER NOT NULL DEFAULT 7500,
  home_energy_rate_pence      DECIMAL(6,4) DEFAULT 28.0,
  public_charge_mix_pct       SMALLINT DEFAULT 20,
  finance_apr                 DECIMAL(5,2),
  term_months                 SMALLINT,
  deposit_gbp                 DECIMAL(8,2),
  monthly_finance_cost        DECIMAL(8,2),
  annual_energy_cost          DECIMAL(8,2),
  annual_insurance_est        DECIMAL(8,2),
  annual_servicing_est        DECIMAL(8,2),
  annual_tax_cost             DECIMAL(8,2) DEFAULT 0,
  total_3yr_cost              DECIMAL(10,2),
  vs_comparable_ice_annual_saving DECIMAL(8,2),
  created_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 5. updated_at trigger for new tables ────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'set_updated_at_government_grants'
  ) THEN
    CREATE TRIGGER set_updated_at_government_grants
      BEFORE UPDATE ON government_grants
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END
$$;
