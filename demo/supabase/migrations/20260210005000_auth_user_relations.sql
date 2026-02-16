-- Supabase auth user structure + CRM relations
-- This migration establishes:
--   auth.users -> public.user_profiles (1:1)
--   auth.users <-> public.organizations (many:many through memberships)
--   public.agents -> auth.users (optional 1:1)

begin;

create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organizations_slug_key unique (slug)
);

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  default_organization_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_profiles_email_key unique (email)
);

create table if not exists public.organization_memberships (
  id bigserial primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organization_memberships_unique unique (organization_id, user_id),
  constraint organization_memberships_role_check
    check (role in ('owner', 'admin', 'member')),
  constraint organization_memberships_status_check
    check (status in ('active', 'invited', 'disabled'))
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'user_profiles_default_organization_id_fkey'
  ) then
    alter table public.user_profiles
      add constraint user_profiles_default_organization_id_fkey
      foreign key (default_organization_id)
      references public.organizations(id)
      on delete set null;
  end if;
end $$;

create index if not exists user_profiles_default_organization_id_idx
  on public.user_profiles(default_organization_id);

create index if not exists organization_memberships_user_id_idx
  on public.organization_memberships(user_id);

create index if not exists organization_memberships_organization_id_idx
  on public.organization_memberships(organization_id);

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
  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_organizations') then
    create trigger set_updated_at_organizations
      before update on public.organizations
      for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_user_profiles') then
    create trigger set_updated_at_user_profiles
      before update on public.user_profiles
      for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_organization_memberships') then
    create trigger set_updated_at_organization_memberships
      before update on public.organization_memberships
      for each row execute function public.set_updated_at();
  end if;
end $$;

create or replace function public.handle_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.user_profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.user_profiles.avatar_url),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_auth_user_created();

-- Optional relation to existing CRM agents table
alter table if exists public.agents
  add column if not exists user_id uuid;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'agents'
  ) and not exists (
    select 1 from pg_constraint where conname = 'agents_user_id_fkey'
  ) then
    alter table public.agents
      add constraint agents_user_id_fkey
      foreign key (user_id)
      references auth.users(id)
      on delete set null;
  end if;

  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'agents'
  ) and not exists (
    select 1 from pg_constraint where conname = 'agents_user_id_key'
  ) then
    alter table public.agents
      add constraint agents_user_id_key unique (user_id);
  end if;
end $$;

-- RLS: users can read/update only their own profile and memberships.
alter table public.organizations enable row level security;
alter table public.user_profiles enable row level security;
alter table public.organization_memberships enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_profiles' and policyname = 'profiles_select_own'
  ) then
    create policy profiles_select_own on public.user_profiles
      for select using (id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_profiles' and policyname = 'profiles_update_own'
  ) then
    create policy profiles_update_own on public.user_profiles
      for update using (id = auth.uid()) with check (id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'organization_memberships' and policyname = 'memberships_select_own'
  ) then
    create policy memberships_select_own on public.organization_memberships
      for select using (user_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'organizations' and policyname = 'organizations_select_member'
  ) then
    create policy organizations_select_member on public.organizations
      for select using (
        exists (
          select 1
          from public.organization_memberships m
          where m.organization_id = organizations.id
            and m.user_id = auth.uid()
            and m.status = 'active'
        )
      );
  end if;
end $$;

insert into public.organizations (name, slug)
values ('RobotX Demo', 'robotx-demo')
on conflict (slug) do nothing;

commit;
