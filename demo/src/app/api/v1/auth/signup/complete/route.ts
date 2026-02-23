import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/app/api/_shared/backend-proxy';

export async function POST(req: NextRequest) {
  return proxyToBackend('/api/v1/auth/signup/complete', req);
}
