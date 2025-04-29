import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // 세션 새로고침
  const { data: { session } } = await supabase.auth.getSession();

  // 공개 경로 목록
  const publicPaths = ['/login', '/auth/callback', '/_next', '/favicon.ico', '/api'];

  // 현재 경로가 공개 경로인지 확인
  const isPublicPath = publicPaths.some(path => req.nextUrl.pathname.startsWith(path));

  // 로그인하지 않은 사용자가 보호된 페이지에 접근하려고 할 때
  if (!session && !isPublicPath) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 로그인한 사용자가 로그인 페이지에 접근하려고 할 때
  if (session && req.nextUrl.pathname === '/login') {
    const redirectUrl = new URL('/inquiries', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 