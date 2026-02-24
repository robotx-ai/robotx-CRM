import { NextRequest, NextResponse } from 'next/server';

import { proxyToBackend } from '@/app/api/_shared/backend-proxy';
import { resolveCurrentUserId } from '@/app/api/_shared/current-user';

function unauthorizedResponse() {
  return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
}

export async function GET(req: NextRequest) {
  const userId = await resolveCurrentUserId(req);
  if (!userId) {
    return unauthorizedResponse();
  }

  return proxyToBackend('/api/v1/auth/organization-options', req, {
    extraHeaders: {
      'x-robotx-user-id': userId,
    },
  });
}
