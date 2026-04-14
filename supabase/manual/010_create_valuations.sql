create table if not exists public.valuations (
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

alter table if exists public.valuations
  add column if not exists vehicle_color text;

alter table if exists public.valuations
  add column if not exists vehicle_variant text;

create index if not exists valuations_created_at_idx
  on public.valuations(created_at desc);

create index if not exists valuations_status_idx
  on public.valuations(status, created_at desc);

create index if not exists valuations_registration_idx
  on public.valuations(registration_number);
