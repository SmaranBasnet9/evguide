-- ============================================================
-- Run all pending migrations (006 → 009)
-- Paste this entire script into Supabase SQL Editor and run it.
-- All statements are idempotent (safe to re-run).
-- ============================================================

-- ── 006: leads table ────────────────────────────────────────

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  vehicle_id uuid references public.ev_models(id) on delete set null,
  interest_type text not null check (interest_type in ('test_drive', 'finance', 'compare')),
  budget numeric,
  message text,
  created_at timestamptz not null default timezone('utc', now()),
  status text not null default 'new'
);

create index if not exists leads_interest_type_created_at_idx
  on public.leads(interest_type, created_at desc);
create index if not exists leads_status_created_at_idx
  on public.leads(status, created_at desc);
create index if not exists leads_vehicle_id_created_at_idx
  on public.leads(vehicle_id, created_at desc);

-- ── 007: finance_enquiries table ────────────────────────────

create table if not exists public.finance_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  selected_bank text not null,
  selected_bank_interest_rate numeric not null,
  vehicle_id text not null,
  vehicle_name text not null,
  vehicle_price numeric not null,
  down_payment numeric not null default 0,
  insurance_cost numeric not null default 0,
  processing_fee numeric not null default 0,
  total_insurance_cost numeric not null default 0,
  loan_years integer not null,
  monthly_emi numeric not null,
  total_payable numeric not null,
  status text not null default 'new',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists finance_enquiries_created_at_idx
  on public.finance_enquiries(created_at desc);
create index if not exists finance_enquiries_status_idx
  on public.finance_enquiries(status, created_at desc);
create index if not exists finance_enquiries_vehicle_id_idx
  on public.finance_enquiries(vehicle_id, created_at desc);

-- ── 008: EV-native columns on ev_models ─────────────────────

ALTER TABLE ev_models
  ADD COLUMN IF NOT EXISTS range_miles              SMALLINT,
  ADD COLUMN IF NOT EXISTS real_world_range_miles   SMALLINT,
  ADD COLUMN IF NOT EXISTS charging_speed_ac_kw     DECIMAL(5,1),
  ADD COLUMN IF NOT EXISTS charging_speed_dc_kw     DECIMAL(5,1),
  ADD COLUMN IF NOT EXISTS charge_port_type         VARCHAR(20),
  ADD COLUMN IF NOT EXISTS charge_time_to80_mins    SMALLINT,
  ADD COLUMN IF NOT EXISTS charge_time_full_mins    SMALLINT,
  ADD COLUMN IF NOT EXISTS battery_warranty_years   SMALLINT,
  ADD COLUMN IF NOT EXISTS v2g_capable              BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS annual_energy_cost_gbp   DECIMAL(8,2),
  ADD COLUMN IF NOT EXISTS co2_saving_kg_per_year   INTEGER;

-- ── 008: saved_vehicles ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS saved_vehicles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id      TEXT,
  vehicle_id      TEXT NOT NULL,
  vehicle_label   TEXT NOT NULL,
  vehicle_price   INTEGER,
  saved_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT saved_vehicles_identity_check CHECK (
    user_id IS NOT NULL OR session_id IS NOT NULL
  ),
  UNIQUE (user_id, vehicle_id),
  UNIQUE (session_id, vehicle_id)
);

ALTER TABLE saved_vehicles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='saved_vehicles' AND policyname='Users see own saved vehicles') THEN
    CREATE POLICY "Users see own saved vehicles" ON saved_vehicles FOR SELECT
      USING (auth.uid() = user_id OR session_id = current_setting('request.cookie.evg_session', true));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='saved_vehicles' AND policyname='Users insert own saved vehicles') THEN
    CREATE POLICY "Users insert own saved vehicles" ON saved_vehicles FOR INSERT
      WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='saved_vehicles' AND policyname='Users delete own saved vehicles') THEN
    CREATE POLICY "Users delete own saved vehicles" ON saved_vehicles FOR DELETE
      USING (auth.uid() = user_id OR session_id = current_setting('request.cookie.evg_session', true));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='saved_vehicles' AND policyname='Service role full access saved_vehicles') THEN
    CREATE POLICY "Service role full access saved_vehicles" ON saved_vehicles FOR ALL
      USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ── 008: government_grants ───────────────────────────────────

CREATE TABLE IF NOT EXISTS government_grants (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grant_name          TEXT NOT NULL,
  authority           TEXT NOT NULL,
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

INSERT INTO government_grants
  (grant_name, authority, grant_amount_gbp, description, eligibility_notes, vehicle_types, price_cap_gbp, is_active, source_url)
VALUES
  ('Electric Vehicle Homecharge Scheme (EVHS)', 'OZEV', 350.00,
   'Grant toward installing a home EV chargepoint',
   'Must be a homeowner with off-street parking. Available for new EV purchases.',
   ARRAY['car','van'], NULL, TRUE, 'https://www.gov.uk/electric-vehicle-homecharge-scheme'),
  ('Workplace Charging Scheme (WCS)', 'OZEV', 350.00,
   'Grant toward installing workplace EV charge points (up to 40 sockets)',
   'For businesses, charities, and public sector organisations. Up to £350 per socket, max 40 sockets.',
   ARRAY['car','van'], NULL, TRUE, 'https://www.gov.uk/apply-for-workplace-charging-scheme-voucher'),
  ('EV Salary Sacrifice — BiK Rate Incentive', 'HMRC', 0.00,
   'EVs attract just 3% Benefit-in-Kind tax rate (2026–2028)',
   'Available through employer salary sacrifice schemes.',
   ARRAY['car'], NULL, TRUE, 'https://www.gov.uk/expenses-and-benefits-company-cars'),
  ('Zero-Rate Vehicle Excise Duty (VED)', 'DVLA', 0.00,
   'Fully electric cars pay £0 VED — saving £190–£600/year vs petrol equivalent',
   'Applies to all zero-emission cars registered in the UK.',
   ARRAY['car'], NULL, TRUE, 'https://www.gov.uk/vehicle-tax-rate-tables')
ON CONFLICT DO NOTHING;

-- ── 008: tco_calculations ────────────────────────────────────

CREATE TABLE IF NOT EXISTS tco_calculations (
  id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id                      TEXT,
  vehicle_id                      TEXT NOT NULL,
  annual_mileage                  INTEGER NOT NULL DEFAULT 7500,
  home_energy_rate_pence          DECIMAL(6,4) DEFAULT 28.0,
  public_charge_mix_pct           SMALLINT DEFAULT 20,
  finance_apr                     DECIMAL(5,2),
  term_months                     SMALLINT,
  deposit_gbp                     DECIMAL(8,2),
  monthly_finance_cost            DECIMAL(8,2),
  annual_energy_cost              DECIMAL(8,2),
  annual_insurance_est            DECIMAL(8,2),
  annual_servicing_est            DECIMAL(8,2),
  annual_tax_cost                 DECIMAL(8,2) DEFAULT 0,
  total_3yr_cost                  DECIMAL(10,2),
  vs_comparable_ice_annual_saving DECIMAL(8,2),
  created_at                      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 009: allow 'sell' in leads interest_type ────────────────

ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_interest_type_check;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_interest_type_check
  CHECK (interest_type IN ('test_drive', 'finance', 'compare', 'sell'));

-- ── Finance consultations: add 'finance' sector support ─────

ALTER TABLE public.consultation_requests
  ADD COLUMN IF NOT EXISTS consultation_type text;

-- Backfill existing rows so the sector value is preserved
UPDATE public.consultation_requests
  SET consultation_type = sector
  WHERE consultation_type IS NULL;

-- -- 010: valuations table ----------------------------------------

CREATE TABLE IF NOT EXISTS public.valuations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  registration_number text not null,
  vehicle_model text not null,
  vehicle_color text not null,
  vehicle_variant text not null,
  purchase_year integer not null,
  owner_history text not null
    check (owner_history in ('first_owner', 'second_owner', 'third_plus')),
  current_user_count integer not null default 1
    check (current_user_count >= 1 and current_user_count <= 10),
  status text not null default 'new',
  created_at timestamptz not null default timezone('utc', now())
);

ALTER TABLE IF EXISTS public.valuations
  ADD COLUMN IF NOT EXISTS vehicle_color text;

ALTER TABLE IF EXISTS public.valuations
  ADD COLUMN IF NOT EXISTS vehicle_variant text;

CREATE INDEX IF NOT EXISTS valuations_created_at_idx
  ON public.valuations(created_at desc);

CREATE INDEX IF NOT EXISTS valuations_status_idx
  ON public.valuations(status, created_at desc);

CREATE INDEX IF NOT EXISTS valuations_registration_idx
  ON public.valuations(registration_number);
