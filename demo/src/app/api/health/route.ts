import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/app/api/_shared/backend-proxy';

export async function GET(req: NextRequest) {
  return proxyToBackend('/health', req);
}
