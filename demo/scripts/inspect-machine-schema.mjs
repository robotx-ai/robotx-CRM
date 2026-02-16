import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Missing supabase env');

const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const tryTable = async (table) => {
  const { data, error } = await sb.from(table).select('*').limit(1);
  console.log('\nTABLE:', table);
  if (error) {
    console.log('ERROR:', error.message);
    return;
  }
  console.log('ROWS:', data?.length ?? 0);
  if (data && data[0]) {
    console.log('COLUMNS:', Object.keys(data[0]));
    console.log('SAMPLE:', JSON.stringify(data[0], null, 2));
  }
};

await tryTable('machineproductlibrary');
await tryTable('stores');
await tryTable('agents');
await tryTable('machine_models');
await tryTable('machine_groups');
