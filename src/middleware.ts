import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // 세션 새로고침
  const { data: { session } } = await supabase.auth.getSession();

  // 현재 경로
  const currentPath = req.nextUrl.pathname;

  // 정적 파일과 API 경로는 무시
  if (
    currentPath.startsWith('/_next') ||
    currentPath.startsWith('/api') ||
    currentPath.startsWith('/static') ||
    currentPath === '/favicon.ico'
  ) {
    return res;
  }

  // 공개 경로 목록
  const publicPaths = ['/login', '/auth/callback', '/'];

  // 공개 경로인 경우 세션 상태와 관계없이 접근 허용
  if (publicPaths.some(path => currentPath === path)) {
    return res;
  }

  // 로그인되지 않은 사용자가 보호된 경로에 접근하려는 경우
  if (!session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectTo', currentPath);
    return NextResponse.redirect(redirectUrl);
  }

  // 로그인된 사용자가 로그인 페이지에 접근하려는 경우
  if (session && currentPath === '/login') {
    return NextResponse.redirect(new URL('/inquiry', req.url));
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
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 