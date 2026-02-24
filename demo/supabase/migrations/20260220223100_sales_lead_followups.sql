-- Sales lead follow-ups table + seed data for customerCenter/salesLeads/detail follow-up chain.

begin;

create extension if not exists pgcrypto;

create table if not exists public.sales_lead_followups (
  id uuid primary key default gen_random_uuid(),
  sales_lead_id uuid not null,
  owner_user_id uuid not null,
  note text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sales_lead_followups_sales_lead_id_fkey
    foreign key (sales_lead_id) references public.sales_leads(id) on delete cascade,
  constraint sales_lead_followups_owner_user_id_fkey
    foreign key (owner_user_id) references public.user_profiles(id) on delete cascade,
  constraint sales_lead_followups_note_check
    check (char_length(note) between 1 and 4000)
);

create index if not exists idx_sales_lead_followups_sales_lead_id_created_at
  on public.sales_lead_followups (sales_lead_id, created_at desc);

create index if not exists idx_sales_lead_followups_owner_user_id
  on public.sales_lead_followups (owner_user_id);

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
  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_sales_lead_followups') then
    create trigger set_updated_at_sales_lead_followups
      before update on public.sales_lead_followups
      for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.sales_lead_followups enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'sales_lead_followups'
      and policyname = 'sales_lead_followups_select_own'
  ) then
    create policy sales_lead_followups_select_own on public.sales_lead_followups
      for select using (owner_user_id = auth.uid());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'sales_lead_followups'
      and policyname = 'sales_lead_followups_insert_own'
  ) then
    create policy sales_lead_followups_insert_own on public.sales_lead_followups
      for insert with check (owner_user_id = auth.uid());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'sales_lead_followups'
      and policyname = 'sales_lead_followups_delete_own'
  ) then
    create policy sales_lead_followups_delete_own on public.sales_lead_followups
      for delete using (owner_user_id = auth.uid());
  end if;
end $$;

insert into public.sales_lead_followups (sales_lead_id, owner_user_id, note)
select
  sl.id,
  sl.owner_user_id,
  seed.note
from public.sales_leads sl
cross join (
  values
    ('Called customer and confirmed interest. Waiting for procurement sign-off.'),
    ('Sent follow-up email with pricing sheet and installation timeline.')
) as seed(note)
where sl.lead_status = 'Following Up'
  and not exists (
    select 1
    from public.sales_lead_followups f
    where f.sales_lead_id = sl.id
      and f.note = seed.note
  );

insert into public.sales_lead_followups (sales_lead_id, owner_user_id, note)
select
  sl.id,
  sl.owner_user_id,
  seed.note
from public.sales_leads sl
cross join (
  values
    ('Marked as lost after budget freeze. Requested permission to reconnect next quarter.'),
    ('No response after three attempts. Closed as lost with competitor selected.')
) as seed(note)
where sl.lead_status = 'Lost'
  and not exists (
    select 1
    from public.sales_lead_followups f
    where f.sales_lead_id = sl.id
      and f.note = seed.note
  );

commit;
