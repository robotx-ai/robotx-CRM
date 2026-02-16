import { createClient } from '@supabase/supabase-js';

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'AUTH_TEST_USER_EMAIL',
  'AUTH_TEST_USER_PASSWORD',
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env: ${key}`);
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const email = process.env.AUTH_TEST_USER_EMAIL;
const password = process.env.AUTH_TEST_USER_PASSWORD;
const fullName = process.env.AUTH_TEST_USER_NAME ?? 'RobotX Tester';
const orgSlug = process.env.AUTH_TEST_ORG_SLUG ?? 'robotx-demo';
const orgName = process.env.AUTH_TEST_ORG_NAME ?? 'RobotX Demo';
const membershipRole = process.env.AUTH_TEST_USER_ROLE ?? 'owner';

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});

const authClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});

const getUserByEmail = async (targetEmail) => {
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const found = data.users.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase());
    if (found) return found;

    if (data.users.length < perPage) return null;
    page += 1;
  }
};

const ensureOrg = async () => {
  const { data: existing, error: selectError } = await admin
    .from('organizations')
    .select('id')
    .eq('slug', orgSlug)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing?.id) return existing.id;

  const { data: inserted, error: insertError } = await admin
    .from('organizations')
    .insert({ slug: orgSlug, name: orgName })
    .select('id')
    .single();

  if (insertError) throw insertError;
  return inserted.id;
};

const ensureUser = async () => {
  const existing = await getUserByEmail(email);
  if (existing) {
    return existing;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      name: fullName,
    },
  });

  if (error) throw error;
  return data.user;
};

const main = async () => {
  const orgId = await ensureOrg();
  const user = await ensureUser();

  const { error: profileError } = await admin.from('user_profiles').upsert(
    {
      id: user.id,
      email,
      full_name: fullName,
      default_organization_id: orgId,
    },
    { onConflict: 'id' },
  );

  if (profileError) throw profileError;

  const { error: membershipError } = await admin.from('organization_memberships').upsert(
    {
      organization_id: orgId,
      user_id: user.id,
      role: membershipRole,
      status: 'active',
    },
    { onConflict: 'organization_id,user_id' },
  );

  if (membershipError) throw membershipError;

  const { data: loginData, error: loginError } = await authClient.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError || !loginData.user || !loginData.session) {
    throw loginError ?? new Error('Supabase login verification failed');
  }

  console.log('Provisioned test user successfully');
  console.log(`email=${email}`);
  console.log(`user_id=${loginData.user.id}`);
  console.log(`organization_id=${orgId}`);
  console.log(`role=${membershipRole}`);
};

main().catch((err) => {
  console.error('Failed to provision test user');
  console.error(err);
  process.exit(1);
});
