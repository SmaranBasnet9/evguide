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
