import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env: ${key}`);
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } },
);

const iso = (v) => new Date(v).toISOString();

const entries = [
  {
    modelName: 'PUDU CC1 Pro',
    subtitle: 'PUDU CC1 Pro, CCBC02, USA standard, Grey & Yellow Green',
    image: '/assets/images/products/pudu-cc1.png',
    sn_pid: '8880R5A16070015',
    mac_address: 'F4:AB:5C:4E:E2:83',
    importTime: iso('2026-01-12T12:24:02Z'),
    status: 'activated',
    software_version: 'SC5.14.46.2512092039-cc1',
    firmware_version: '22.2.12',
    model_code: 'CCBC02',
    product_code: '10240-000033',
  },
  {
    modelName: 'PUDU MT1 Max',
    subtitle: 'PUDU MT1 Max, MTBC03, USA standard, Black',
    image: '/assets/images/products/pudu-mt1-max.png',
    sn_pid: '868025B09070060',
    mac_address: 'F4:AB:5C:4E:E2:84',
    importTime: iso('2026-01-12T11:30:14Z'),
    status: 'activated',
    software_version: 'SC5.17.13.2511182031-mt1',
    firmware_version: '22.2.40',
    model_code: 'MTBC03',
    product_code: '10240-000034',
  },
  {
    modelName: 'PUDU MT1 Vac',
    subtitle: 'PUDU MT1 Vac, MTBC02, USA standard, Black',
    image: '/assets/images/products/pudu-mt1-vac.png',
    sn_pid: '899025921070013',
    mac_address: 'F4:AB:5C:4E:E2:85',
    importTime: iso('2026-01-12T10:13:36Z'),
    status: 'activated',
    software_version: 'SC5.16.11.2510101914-mt1',
    firmware_version: '22.2.39',
    model_code: 'MTBC02',
    product_code: '10240-000035',
  },
];

const ensureAgent = async () => {
  const { data: existing, error: selErr } = await supabase
    .from('agents')
    .select('id')
    .eq('name', 'Robotx AI Inc.')
    .maybeSingle();
  if (selErr) throw selErr;
  if (existing?.id) return existing.id;

  const { data, error } = await supabase
    .from('agents')
    .insert({ id: randomUUID(), name: 'Robotx AI Inc.' })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
};

const ensureStore = async (agentId) => {
  const { data: existing, error: selErr } = await supabase
    .from('stores')
    .select('id')
    .eq('name', 'Demo Robotx')
    .maybeSingle();
  if (selErr) throw selErr;
  if (existing?.id) return existing.id;

  const { data, error } = await supabase
    .from('stores')
    .insert({
      id: randomUUID(),
      name: 'Demo Robotx',
      code: 'DEMO-STORE-001',
      agent_id: agentId,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
};

const ensureModel = async (item) => {
  const { data, error } = await supabase
    .from('machine_models')
    .upsert(
      {
        product_name: item.modelName,
        product_code: item.product_code,
        model_code: item.model_code,
        spec_text: item.subtitle,
        image_url: item.image,
      },
      { onConflict: 'product_code' },
    )
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
};

const main = async () => {
  const agentId = await ensureAgent();
  const storeId = await ensureStore(agentId);

  const sns = entries.map((e) => e.sn_pid);
  const { error: deleteErr } = await supabase
    .from('machineproductlibrary')
    .delete()
    .in('sn_pid', sns);
  if (deleteErr) throw deleteErr;

  for (const item of entries) {
    const modelId = await ensureModel(item);

    const payload = {
      id: randomUUID(),
      product_name: item.modelName,
      product_nickname: item.modelName,
      sn_pid: item.sn_pid,
      mac_address: item.mac_address,
      store_id: storeId,
      agent_id: agentId,
      use_type: 'Purchase',
      remaining_warranty_days: 365,
      status: item.status,
      store_installation_time: item.importTime,
      first_active_time: item.importTime,
      software_version: item.software_version,
      firmware_version: item.firmware_version,
      last_seen_at: item.importTime,
      model_id: modelId,
      site_use: 'Demo',
      warranty_months: 12,
      activated_at: item.importTime,
      status_updated_at: item.importTime,
      import_time: item.importTime,
    };

    const { error: insertErr } = await supabase
      .from('machineproductlibrary')
      .insert(payload);

    if (insertErr) throw insertErr;
  }

  const { data: checkRows, error: checkErr } = await supabase
    .from('machineproductlibrary')
    .select('sn_pid,product_name,status,software_version,firmware_version,import_time')
    .in('sn_pid', sns)
    .order('import_time', { ascending: false });

  if (checkErr) throw checkErr;

  console.log('Seeded machine library entries successfully');
  console.table(checkRows);
};

main().catch((err) => {
  console.error('Failed to seed machine entries');
  console.error(err);
  process.exit(1);
});
