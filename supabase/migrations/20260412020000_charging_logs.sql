-- ─────────────────────────────────────────────────────────────────────────────
-- Charging Station Analytics Tables
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. charger_search_logs — every location search submitted
create table if not exists charger_search_logs (
  id              uuid        not null default gen_random_uuid() primary key,
  user_id         uuid        references auth.users (id) on delete set null,
  session_id      text,
  searched_location text      not null,
  latitude        double precision,
  longitude       double precision,
  radius          integer,
  filters         jsonb       not null default '{}',
  results_count   integer     not null default 0,
  created_at      timestamptz not null default now()
);

create index if not exists charger_search_logs_user_id_idx       on charger_search_logs (user_id);
create index if not exists charger_search_logs_created_at_idx    on charger_search_logs (created_at desc);
create index if not exists charger_search_logs_location_idx      on charger_search_logs (searched_location);

-- 2. charger_click_logs — charger detail / directions clicks
create table if not exists charger_click_logs (
  id              uuid        not null default gen_random_uuid() primary key,
  user_id         uuid        references auth.users (id) on delete set null,
  session_id      text,
  charger_id      text        not null,
  charger_name    text        not null,
  network         text,
  searched_location text,
  created_at      timestamptz not null default now()
);

create index if not exists charger_click_logs_user_id_idx        on charger_click_logs (user_id);
create index if not exists charger_click_logs_charger_id_idx     on charger_click_logs (charger_id);
create index if not exists charger_click_logs_created_at_idx     on charger_click_logs (created_at desc);

-- 3. charger_cache — for future real-API response caching
create table if not exists charger_cache (
  id              uuid        not null default gen_random_uuid() primary key,
  provider        text        not null,
  cache_key       text        not null,
  response_json   jsonb       not null,
  expires_at      timestamptz not null,
  created_at      timestamptz not null default now(),
  constraint charger_cache_provider_key_unique unique (provider, cache_key)
);

create index if not exists charger_cache_expires_at_idx          on charger_cache (expires_at);

-- RLS: admin-only read/write (these are internal analytics tables)
alter table charger_search_logs  enable row level security;
alter table charger_click_logs   enable row level security;
alter table charger_cache        enable row level security;

-- Service-role key (used by createAdminClient) bypasses RLS automatically.
-- No policies needed for backend-only tables.
