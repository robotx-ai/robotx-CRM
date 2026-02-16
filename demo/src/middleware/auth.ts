import { NextRequest, NextResponse } from 'next/server';

const supportedLocales = ['en-US', 'ar-SA', 'es-ES', 'fr-FR', 'it-IT', 'zh-CN'];

const getLocaleFromPath = (pathname: string) => {
  const maybeLocale = pathname.split('/')[1];
  return supportedLocales.includes(maybeLocale) ? maybeLocale : 'en-US';
};

const getAuthToken = (request: NextRequest) =>
  request.cookies.get('__Secure-next-auth.session-token')?.value ??
  request.cookies.get('next-auth.session-token')?.value;

export function authMiddleware(request: NextRequest) {
  const token = getAuthToken(request);

  if (!token) {
    const url = request.nextUrl.clone();
    const locale = getLocaleFromPath(request.nextUrl.pathname);
    url.pathname = `/${locale}/auth/login-1`;
    return NextResponse.redirect(url);
  }

  //do we need to verify the token?
  //if not verified then redirect to /auth/login-1
  return NextResponse.next();
}

export function anonymousMiddleware(req: NextRequest) {
  const accessToken = getAuthToken(req);

  if (accessToken) {
    const url = req.nextUrl.clone();
    const locale = getLocaleFromPath(req.nextUrl.pathname);
    url.pathname = `/${locale}/welcome`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
