begin;

alter table if exists public.stores
  add column if not exists owner_user_id uuid references auth.users(id) on delete set null;

alter table if exists public.machineproductlibrary
  add column if not exists owner_user_id uuid references auth.users(id) on delete set null;

create index if not exists stores_owner_user_id_idx
  on public.stores(owner_user_id);

create index if not exists machineproductlibrary_owner_user_id_idx
  on public.machineproductlibrary(owner_user_id);

-- Backfill legacy ownership to designated admin for existing global rows.
update public.stores
set owner_user_id = '15900330-2e49-4e90-965e-ba10029cafaf'::uuid
where owner_user_id is null;

-- Prefer deriving machine ownership from linked store ownership when possible.
update public.machineproductlibrary m
set owner_user_id = s.owner_user_id
from public.stores s
where m.owner_user_id is null
  and m.store_id = s.id
  and s.owner_user_id is not null;

update public.machineproductlibrary
set owner_user_id = '15900330-2e49-4e90-965e-ba10029cafaf'::uuid
where owner_user_id is null;

-- Keep agent ownership aligned for owner-scoped option queries.
update public.agents a
set user_id = s.owner_user_id
from public.stores s
where a.user_id is null
  and s.agent_id = a.id
  and s.owner_user_id is not null;

alter table public.stores enable row level security;
alter table public.machineproductlibrary enable row level security;
alter table public.agents enable row level security;

drop policy if exists "auth full stores" on public.stores;
drop policy if exists "auth full devices" on public.machineproductlibrary;
drop policy if exists "auth full agents" on public.agents;

drop policy if exists stores_select_own on public.stores;
drop policy if exists stores_insert_own on public.stores;
drop policy if exists stores_update_own on public.stores;
drop policy if exists stores_delete_own on public.stores;

create policy stores_select_own on public.stores
  for select using (owner_user_id = auth.uid());
create policy stores_insert_own on public.stores
  for insert with check (owner_user_id = auth.uid());
create policy stores_update_own on public.stores
  for update using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());
create policy stores_delete_own on public.stores
  for delete using (owner_user_id = auth.uid());

drop policy if exists machineproductlibrary_select_own on public.machineproductlibrary;
drop policy if exists machineproductlibrary_insert_own on public.machineproductlibrary;
drop policy if exists machineproductlibrary_update_own on public.machineproductlibrary;
drop policy if exists machineproductlibrary_delete_own on public.machineproductlibrary;

create policy machineproductlibrary_select_own on public.machineproductlibrary
  for select using (owner_user_id = auth.uid());
create policy machineproductlibrary_insert_own on public.machineproductlibrary
  for insert with check (owner_user_id = auth.uid());
create policy machineproductlibrary_update_own on public.machineproductlibrary
  for update using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());
create policy machineproductlibrary_delete_own on public.machineproductlibrary
  for delete using (owner_user_id = auth.uid());

drop policy if exists agents_select_own on public.agents;
drop policy if exists agents_insert_own on public.agents;
drop policy if exists agents_update_own on public.agents;
drop policy if exists agents_delete_own on public.agents;

create policy agents_select_own on public.agents
  for select using (user_id = auth.uid());
create policy agents_insert_own on public.agents
  for insert with check (user_id = auth.uid());
create policy agents_update_own on public.agents
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy agents_delete_own on public.agents
  for delete using (user_id = auth.uid());

commit;
