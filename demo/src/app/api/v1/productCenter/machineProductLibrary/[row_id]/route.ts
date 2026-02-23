import { NextRequest, NextResponse } from 'next/server';

import { proxyToBackend } from '@/app/api/_shared/backend-proxy';
import { resolveCurrentUserId } from '@/app/api/_shared/current-user';

type RouteContext = { params: Promise<{ row_id: string }> };

function unauthorizedResponse() {
  return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
}

export async function GET(req: NextRequest, context: RouteContext) {
  const userId = await resolveCurrentUserId(req);
  if (!userId) {
    return unauthorizedResponse();
  }

  const { row_id } = await context.params;
  return proxyToBackend(`/api/v1/productCenter/machineProductLibrary/${row_id}`, req, {
    extraHeaders: {
      'x-robotx-user-id': userId,
    },
  });
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const userId = await resolveCurrentUserId(req);
  if (!userId) {
    return unauthorizedResponse();
  }

  const { row_id } = await context.params;
  return proxyToBackend(`/api/v1/productCenter/machineProductLibrary/${row_id}`, req, {
    extraHeaders: {
      'x-robotx-user-id': userId,
    },
  });
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const userId = await resolveCurrentUserId(req);
  if (!userId) {
    return unauthorizedResponse();
  }

  const { row_id } = await context.params;
  return proxyToBackend(`/api/v1/productCenter/machineProductLibrary/${row_id}`, req, {
    extraHeaders: {
      'x-robotx-user-id': userId,
    },
  });
}
