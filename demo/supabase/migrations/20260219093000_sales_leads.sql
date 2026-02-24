-- Sales leads table for customerCenter/salesLeads.
-- Designed around contact form fields: name/email/phone/product/message + location.

begin;

create extension if not exists pgcrypto;

create table if not exists public.sales_leads (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  contact_name text not null,
  contact_email text not null,
  phone_number text,
  interested_product text,
  message text,
  location text,
  lead_source text not null default 'Shopify Website',
  source_campaign text,
  lead_status text not null default 'Unfollowed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sales_leads_owner_user_id_fkey
    foreign key (owner_user_id) references public.user_profiles(id) on delete cascade,
  constraint sales_leads_lead_source_check
    check (lead_source in ('Sales Email', 'Shopify Website')),
  constraint sales_leads_lead_status_check
    check (lead_status in ('Unfollowed', 'Following Up', 'Converted', 'Lost'))
);

create index if not exists sales_leads_owner_user_id_idx
  on public.sales_leads(owner_user_id);
create index if not exists sales_leads_lead_source_idx
  on public.sales_leads(lead_source);
create index if not exists sales_leads_lead_status_idx
  on public.sales_leads(lead_status);
create index if not exists sales_leads_created_at_idx
  on public.sales_leads(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_sales_leads') then
    create trigger set_updated_at_sales_leads
      before update on public.sales_leads
      for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.sales_leads enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'sales_leads'
      and policyname = 'sales_leads_select_own'
  ) then
    create policy sales_leads_select_own on public.sales_leads
      for select using (owner_user_id = auth.uid());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'sales_leads'
      and policyname = 'sales_leads_insert_own'
  ) then
    create policy sales_leads_insert_own on public.sales_leads
      for insert with check (owner_user_id = auth.uid());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'sales_leads'
      and policyname = 'sales_leads_update_own'
  ) then
    create policy sales_leads_update_own on public.sales_leads
      for update using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'sales_leads'
      and policyname = 'sales_leads_delete_own'
  ) then
    create policy sales_leads_delete_own on public.sales_leads
      for delete using (owner_user_id = auth.uid());
  end if;
end $$;

with first_user as (
  select id
  from public.user_profiles
  order by created_at asc
  limit 1
)
insert into public.sales_leads (
  owner_user_id,
  contact_name,
  contact_email,
  phone_number,
  interested_product,
  message,
  location,
  lead_source,
  source_campaign,
  lead_status
)
select
  fu.id,
  v.contact_name,
  v.contact_email,
  v.phone_number,
  v.interested_product,
  v.message,
  v.location,
  v.lead_source,
  v.source_campaign,
  v.lead_status
from first_user fu
cross join (
  values
    (
      'Alex Carter',
      'alex.carter@harbordining.com',
      '+1-619-555-0148',
      'Pudu BellaBot',
      'Looking for a food delivery robot for 2 locations.',
      'San Diego, CA',
      'Shopify Website',
      'Q1 Landing Page',
      'Unfollowed'
    ),
    (
      'Mia Thompson',
      'mia.thompson@coastalkitchen.io',
      '+1-858-555-0187',
      'Pudu KettyBot',
      'Need pricing and deployment timeline.',
      'Los Angeles, CA',
      'Sales Email',
      'Outbound 2026-02',
      'Following Up'
    ),
    (
      'Daniel Park',
      'daniel.park@northpeakgrp.com',
      '+1-415-555-0119',
      'Pudu HolaBot',
      'Interested in a pilot for casino floor beverage runs.',
      'San Francisco, CA',
      'Shopify Website',
      'Casino Vertical',
      'Converted'
    ),
    (
      'Sophia Nguyen',
      'sophia.nguyen@summitdining.co',
      '+1-916-555-0162',
      'Pudu SwiftBot',
      'Need support for 24/7 operations and service contract.',
      'Sacramento, CA',
      'Sales Email',
      'Referral Outreach',
      'Lost'
    )
) as v(
  contact_name,
  contact_email,
  phone_number,
  interested_product,
  message,
  location,
  lead_source,
  source_campaign,
  lead_status
)
where not exists (
  select 1
  from public.sales_leads existing
  where existing.owner_user_id = fu.id
    and existing.contact_email = v.contact_email
);

commit;
