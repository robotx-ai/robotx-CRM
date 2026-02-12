import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/app/api/_shared/backend-proxy';

type RouteContext = { params: Promise<{ row_id: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  const { row_id } = await context.params;
  return proxyToBackend(`/api/v1/machine-product-library/${row_id}`, req);
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { row_id } = await context.params;
  return proxyToBackend(`/api/v1/machine-product-library/${row_id}`, req);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const { row_id } = await context.params;
  return proxyToBackend(`/api/v1/machine-product-library/${row_id}`, req);
}
