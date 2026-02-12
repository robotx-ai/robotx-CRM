import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/app/api/_shared/backend-proxy';

export async function GET(req: NextRequest) {
  return proxyToBackend('/api/v1/machine-product-library', req);
}

export async function POST(req: NextRequest) {
  return proxyToBackend('/api/v1/machine-product-library', req);
}
