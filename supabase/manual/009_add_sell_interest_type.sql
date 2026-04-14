-- Allow 'sell' as a lead interest type (for sell-a-car hero form)
alter table public.leads
  drop constraint if exists leads_interest_type_check;

alter table public.leads
  add constraint leads_interest_type_check
  check (interest_type in ('test_drive', 'finance', 'compare', 'sell'));
