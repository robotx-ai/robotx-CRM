import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function resolveCurrentUserId(
  req: NextRequest
): Promise<string | null> {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || typeof token.id !== 'string' || !token.id.trim()) {
    return null;
  }

  return token.id;
}
