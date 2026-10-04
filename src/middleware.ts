import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to login pages
  if (pathname === '/login' || pathname === '/pme/login' || pathname === '/') {
    return NextResponse.next();
  }

  // PME Portal rules
  if (pathname.startsWith('/pme')) {
    const pmeSession = request.cookies.get('pme_session');
    if (!pmeSession) {
      return NextResponse.redirect(new URL('/pme/login', request.url));
    }
    return NextResponse.next();
  }

  // Agency (Técnicos) rules
  const advzSession = request.cookies.get('advz_session');
  if (!advzSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/pmes/:path*',
    '/pme/:path*',
    '/subprojectos/:path*',
    '/relatorios/:path*',
    '/relatorios-tecnicos/:path*',
    '/comparacao-relatorios/:path*',
    '/estatisticas/:path*',
    '/visitas/:path*'
  ],
};
