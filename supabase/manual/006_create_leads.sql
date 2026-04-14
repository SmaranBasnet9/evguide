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
