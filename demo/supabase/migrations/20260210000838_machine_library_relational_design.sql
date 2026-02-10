-- Machine library relational design (additive migration)
-- NOTE: This migration intentionally avoids dropping/renaming existing tables.

begin;

-- 1) Extend existing core tables
alter table if exists public.stores
  add column if not exists agent_id uuid;

alter table if exists public.machineproductlibrary
  add column if not exists model_id uuid,
  add column if not exists group_id uuid,
  add column if not exists site_use text,
  add column if not exists warranty_months integer,
  add column if not exists activated_at timestamptz,
  add column if not exists last_boot_at timestamptz,
  add column if not exists status_updated_at timestamptz,
  add column if not exists frozen_at timestamptz,
  add column if not exists expires_at timestamptz,
  add column if not exists import_time timestamptz;

-- Backfill newly added time columns from existing fields when possible.
update public.machineproductlibrary
set import_time = coalesce(import_time, store_installation_time),
    activated_at = coalesce(activated_at, first_active_time),
    status_updated_at = coalesce(status_updated_at, last_seen_at)
where true;

-- 2) New dimension/relationship tables
create table if not exists public.machine_models (
  id uuid primary key default gen_random_uuid(),
  product_name text not null,
  product_code text,
  model_code text,
  spec_text text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint machine_models_product_code_key unique (product_code)
);

create table if not exists public.machine_groups (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null,
  group_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.machine_operation_logs (
  id bigserial primary key,
  machine_id uuid not null,
  title text not null,
  detail_lines jsonb not null default '[]'::jsonb,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  contract_type text not null,
  contract_number text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contracts_contract_number_key unique (contract_number)
);

create table if not exists public.machine_contracts (
  id bigserial primary key,
  machine_id uuid not null,
  contract_id uuid not null,
  linked_at timestamptz not null default now(),
  constraint machine_contracts_machine_contract_unique unique (machine_id, contract_id)
);

create table if not exists public.machine_maintenance_logs (
  id bigserial primary key,
  machine_id uuid not null,
  title text not null,
  description text,
  maintenance_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.machine_accessories (
  id bigserial primary key,
  machine_id uuid not null,
  accessory_name text not null,
  quantity integer not null default 1,
  note text,
  created_at timestamptz not null default now(),
  constraint machine_accessories_quantity_positive check (quantity > 0)
);

-- 3) Add FKs (guarded by existence checks)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'stores_agent_id_fkey'
  ) then
    alter table public.stores
      add constraint stores_agent_id_fkey
      foreign key (agent_id) references public.agents(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'machine_groups_store_id_fkey'
  ) then
    alter table public.machine_groups
      add constraint machine_groups_store_id_fkey
      foreign key (store_id) references public.stores(id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'machineproductlibrary_model_id_fkey'
  ) then
    alter table public.machineproductlibrary
      add constraint machineproductlibrary_model_id_fkey
      foreign key (model_id) references public.machine_models(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'machineproductlibrary_group_id_fkey'
  ) then
    alter table public.machineproductlibrary
      add constraint machineproductlibrary_group_id_fkey
      foreign key (group_id) references public.machine_groups(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'machine_operation_logs_machine_id_fkey'
  ) then
    alter table public.machine_operation_logs
      add constraint machine_operation_logs_machine_id_fkey
      foreign key (machine_id) references public.machineproductlibrary(id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'machine_contracts_machine_id_fkey'
  ) then
    alter table public.machine_contracts
      add constraint machine_contracts_machine_id_fkey
      foreign key (machine_id) references public.machineproductlibrary(id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'machine_contracts_contract_id_fkey'
  ) then
    alter table public.machine_contracts
      add constraint machine_contracts_contract_id_fkey
      foreign key (contract_id) references public.contracts(id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'machine_maintenance_logs_machine_id_fkey'
  ) then
    alter table public.machine_maintenance_logs
      add constraint machine_maintenance_logs_machine_id_fkey
      foreign key (machine_id) references public.machineproductlibrary(id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'machine_accessories_machine_id_fkey'
  ) then
    alter table public.machine_accessories
      add constraint machine_accessories_machine_id_fkey
      foreign key (machine_id) references public.machineproductlibrary(id) on delete cascade;
  end if;
end $$;

-- 4) Helpful indexes
create index if not exists stores_agent_id_idx on public.stores(agent_id);
create index if not exists machineproductlibrary_model_id_idx on public.machineproductlibrary(model_id);
create index if not exists machineproductlibrary_group_id_idx on public.machineproductlibrary(group_id);
create index if not exists machineproductlibrary_import_time_idx on public.machineproductlibrary(import_time);
create index if not exists machine_operation_logs_machine_id_occurred_at_idx
  on public.machine_operation_logs(machine_id, occurred_at desc);
create index if not exists machine_contracts_machine_id_idx on public.machine_contracts(machine_id);
create index if not exists machine_contracts_contract_id_idx on public.machine_contracts(contract_id);
create index if not exists machine_maintenance_logs_machine_id_idx on public.machine_maintenance_logs(machine_id);
create index if not exists machine_accessories_machine_id_idx on public.machine_accessories(machine_id);

-- 5) Updated at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Attach triggers (idempotent)
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_machine_models') then
    create trigger set_updated_at_machine_models
      before update on public.machine_models
      for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_machine_groups') then
    create trigger set_updated_at_machine_groups
      before update on public.machine_groups
      for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_contracts') then
    create trigger set_updated_at_contracts
      before update on public.contracts
      for each row execute function public.set_updated_at();
  end if;
end $$;

commit;
