import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_BACKEND_ORIGIN = 'http://127.0.0.1:8000';
const backendOrigin =
  process.env.ROBOTX_CRM_API_ORIGIN?.replace(/\/$/, '') || DEFAULT_BACKEND_ORIGIN;

function buildTargetUrl(path: string, req: NextRequest): string {
  const target = new URL(path, backendOrigin);
  req.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.append(key, value);
  });
  return target.toString();
}

export async function proxyToBackend(path: string, req: NextRequest) {
  const targetUrl = buildTargetUrl(path, req);
  const method = req.method;

  const headers = new Headers();
  const incomingContentType = req.headers.get('content-type');
  if (incomingContentType) {
    headers.set('content-type', incomingContentType);
  }

  const init: RequestInit = {
    method,
    headers,
    cache: 'no-store',
  };

  if (method !== 'GET' && method !== 'HEAD') {
    init.body = await req.text();
  }

  let response: Response;
  try {
    response = await fetch(targetUrl, init);
  } catch (error) {
    return NextResponse.json(
      {
        detail: 'Failed to reach robotx-CRM-api backend',
        error: error instanceof Error ? error.message : 'Unknown fetch error',
      },
      { status: 502 },
    );
  }

  const responseBody = await response.text();
  const responseHeaders = new Headers();
  const contentType = response.headers.get('content-type');

  if (contentType && response.status !== 204 && response.status !== 304) {
    responseHeaders.set('content-type', contentType);
  }

  if (response.status === 204 || response.status === 304) {
    return new NextResponse(null, {
      status: response.status,
      headers: responseHeaders,
    });
  }

  return new NextResponse(responseBody, {
    status: response.status,
    headers: responseHeaders,
  });
}
