import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/app/api/_shared/backend-proxy';

type RouteContext = { params: Promise<{ sn_pid: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  const { sn_pid } = await context.params;
  return proxyToBackend(`/api/v1/machine-product-library/by-sn/${sn_pid}`, req);
}
