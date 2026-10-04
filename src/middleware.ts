import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Pegamos o cookie de sessão simulado
  const session = request.cookies.get('advz_session');

  // Se o utilizador NÃO tiver sessão e tentar acessar uma rota protegida
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se tiver sessão, deixa passar
  return NextResponse.next();
}

// Configuração das rotas que o middleware vai intercetar
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/pme/:path*',
    '/subprojectos/:path*',
    '/relatorios/:path*',
    '/relatorios-tecnicos/:path*',
    '/comparacao-relatorios/:path*',
    '/estatisticas/:path*',
    '/visitas/:path*'
  ],
};
