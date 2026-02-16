import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';

const getEnv = (name: string) => process.env[name];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

type ProfileRow = {
  full_name: string | null;
};

type MembershipRow = {
  role: string;
};

const handler = NextAuth({
  secret: getEnv('NEXTAUTH_SECRET'),
  pages: {
    signIn: '/auth/login-1', // Custom sign-in page
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'demo@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials || !supabaseUrl || !supabaseAnonKey) {
          return null;
        }

        const { email, password } = credentials;
        const supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
          },
        });

        const { data: authData, error: authError } =
          await supabaseAuthClient.auth.signInWithPassword({
            email,
            password,
          });

        if (authError || !authData.user || !authData.session) {
          return null;
        }

        const supabaseAdminClient =
          supabaseServiceRoleKey &&
          createClient(supabaseUrl, supabaseServiceRoleKey, {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
              detectSessionInUrl: false,
            },
          });

        let profileName: string | null = null;
        let role = 'member';

        if (supabaseAdminClient) {
          const { data: existingProfile } = await supabaseAdminClient
            .from('user_profiles')
            .select('full_name')
            .eq('id', authData.user.id)
            .maybeSingle<ProfileRow>();

          if (!existingProfile) {
            await supabaseAdminClient.from('user_profiles').upsert(
              {
                id: authData.user.id,
                email: authData.user.email,
                full_name:
                  authData.user.user_metadata?.full_name ??
                  authData.user.user_metadata?.name ??
                  null,
              },
              { onConflict: 'id' },
            );
          } else {
            profileName = existingProfile.full_name;
          }

          const { data: membership } = await supabaseAdminClient
            .from('organization_memberships')
            .select('role')
            .eq('user_id', authData.user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle<MembershipRow>();

          if (membership?.role) {
            role = membership.role;
          }
        }

        const userName =
          profileName ??
          authData.user.user_metadata?.full_name ??
          authData.user.user_metadata?.name ??
          authData.user.email?.split('@')[0] ??
          'Supabase User';

        const user: User = {
          id: authData.user.id,
          name: userName,
          email: authData.user.email ?? email,
          role,
          accessToken: authData.session.access_token,
        };

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || '';
        session.user.role = (token.role as string) || 'tester';
        session.user.accessToken = (token.accessToken as string) || '';
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
