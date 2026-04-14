-- Add 'quote' to the leads interest_type check constraint
alter table public.leads
  drop constraint if exists leads_interest_type_check;

alter table public.leads
  add constraint leads_interest_type_check
  check (interest_type in ('test_drive', 'finance', 'compare', 'sell', 'quote'));
