'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// 환경에 따라 서버 타입 표시
function getServerLabel() {
  // Vercel 환경
  if (process.env.VERCEL === '1') {
    const branch = process.env.VERCEL_GIT_COMMIT_REF;
    console.log("123213 = ", branch); 
    if (branch === 'main') return 'Prod';
    if (branch === 'dev') return 'Dev';
    return branch || 'Vercel';
  }
  // 로컬 개발환경
  if (process.env.NODE_ENV === 'development') return 'Local';
  // 기타(테스트, 미설정 등)
  return 'Unknown';
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuHover, setIsMenuHover] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const branch = process.env.VERCEL_GIT_COMMIT_REF || '';

  useEffect(() => {
    const supabase = require('@supabase/auth-helpers-nextjs').createClientComponentClient();

    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setUserEmail(session?.user?.email ?? null);
    }

    checkSession();

    // 인증 상태 변경 이벤트 구독
    const { data: listener } = supabase.auth.onAuthStateChange((_event: any, _session: any) => {
      checkSession();
    });

    // 언마운트 시 구독 해제
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function handleMenuKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') setIsMenuOpen(false);
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 햄버거 메뉴 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (branch) alert(`branch: ${branch}`);
  }, []);

  return (
    <html lang="ko">
      <head>
        <style jsx global>{`
          body${isMenuOpen ? '' : ''} {
            ${isMenuOpen ? 'overflow: hidden !important;' : ''}
          }
        `}</style>
      </head>
      <body
        className={`${inter.className} bg-[var(--background)] text-[var(--foreground)] flex flex-col min-h-screen w-full`}
        style={{
          backgroundImage: "url('/starry-night.jpg')",
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          position: 'relative',
        }}
      >
        {/* 화이트 투명 오버레이: 메뉴가 열려있지 않을 때만 렌더링 */}
        {!isMenuOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(99, 97, 97, 0.51)',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        )}
        {/* 실제 컨텐츠 */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <header className="bg-[#ffffff] border-b border-gray-200 sticky top-0 z-50 w-full min-w-0 max-w-none px-0">
            <nav className="w-full min-w-0 max-w-none flex items-center justify-between h-[64px] px-4 sm:px-8 md:px-10 mx-auto" style={{ maxWidth: 1440 }}>
              <Link href="/" className="flex items-center mr-10">
                <span className="font-bold text-lg px-6 py-1 border-2 border-black rounded-t-[12px] tracking-tight bg-white select-none whitespace-nowrap"
                  style={{ fontFamily: 'Pretendard, Arial, sans-serif', letterSpacing: '-0.02em', borderBottom: '0' }}>
                  Dragon.J's Project <span className="ml-1 text-xs align-middle font-mono text-gray-500">{getServerLabel()}</span>
                </span>
                <span className="ml-2 text-xs font-mono text-gray-500 align-middle">{process.env.NEXT_PUBLIC_APP_VERSION ? `V${process.env.NEXT_PUBLIC_APP_VERSION}` : 'V0.001'}</span>
              </Link>
              <ul className="hidden xl:flex gap-10 text-lg font-semibold text-[#1d1d1f] whitespace-nowrap">
                <li><Link href="/" className="hover:text-[var(--primary)] transition whitespace-nowrap">홈</Link></li>
                <li><Link href="/service" className="hover:text-[var(--primary)] transition whitespace-nowrap">서비스</Link></li>
                <li><Link href="/tools" className="hover:text-[var(--primary)] transition whitespace-nowrap">작업도구</Link></li>
                <li><Link href="/sns" className="hover:text-[var(--primary)] transition whitespace-nowrap">SNS</Link></li>
                <li><Link href="/schedule" className="hover:text-[var(--primary)] transition whitespace-nowrap">스케줄</Link></li>
                <li><Link href="/inquiry" className="hover:text-[var(--primary)] transition whitespace-nowrap">문의하기</Link></li>
                <li><Link href="/reviews" className="hover:text-[var(--primary)] transition whitespace-nowrap">리뷰</Link></li>
                <li><Link href="/board" className="hover:text-[var(--primary)] transition whitespace-nowrap">게시판</Link></li>
                <li><Link href="/game" className="hover:text-[var(--primary)] transition whitespace-nowrap">체스게임</Link></li>
                <li><Link href="/truck" className="hover:text-[var(--primary)] transition whitespace-nowrap">트럭게임</Link></li>
              </ul>
              <div className="flex items-center gap-4">
                <div className="relative xl:hidden" ref={menuRef}>
                  <button
                    className="p-2 h-[32px] flex items-center justify-center focus:outline-none border-none"
                    style={{ border: 'none' }}
                    aria-label="메뉴 토글"
                    tabIndex={0}
                    onClick={() => isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true);
                    }}
                  >
                    <svg className="w-7 h-7" fill="none" stroke="#1d1d1f" strokeWidth="2" viewBox="0 0 24 24">
                      {isMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                  {isMenuOpen && (
                    <div
                      className="absolute right-0 top-[48px] w-max bg-white shadow-lg rounded-b-2xl animate-fade-in"
                      style={{ zIndex: 100 }}
                      tabIndex={-1}
                      onKeyDown={handleMenuKeyDown}
                    >
                      <ul className="px-6 pt-4 pb-6 space-y-2 text-lg font-semibold">
                        <li><Link href="/" className="block hover:text-[var(--primary)] transition" onClick={() => setIsMenuOpen(false)}>홈</Link></li>
                        <li><Link href="/service" className="block hover:text-[var(--primary)] transition" onClick={() => setIsMenuOpen(false)}>서비스</Link></li>
                        <li><Link href="/tools" className="block hover:text-[var(--primary)] transition" onClick={() => setIsMenuOpen(false)}>작업도구</Link></li>
                        <li><Link href="/sns" className="block hover:text-[var(--primary)] transition" onClick={() => setIsMenuOpen(false)}>SNS</Link></li>
                        <li><Link href="/schedule" className="block hover:text-[var(--primary)] transition" onClick={() => setIsMenuOpen(false)}>스케줄</Link></li>
                        <li><Link href="/inquiry" className="block hover:text-[var(--primary)] transition" onClick={() => setIsMenuOpen(false)}>문의하기</Link></li>
                        <li><Link href="/reviews" className="block hover:text-[var(--primary)] transition" onClick={() => setIsMenuOpen(false)}>리뷰</Link></li>
                        <li><Link href="/board" className="block hover:text-[var(--primary)] transition" onClick={() => setIsMenuOpen(false)}>게시판</Link></li>
                        <li><Link href="/game" className="block hover:text-[var(--primary)] transition" onClick={() => setIsMenuOpen(false)}>체스게임</Link></li>
                        <li><Link href="/truck" className="block hover:text-[var(--primary)] transition" onClick={() => setIsMenuOpen(false)}>트럭게임</Link></li>
                      </ul>
                      {isLoggedIn === null ? null : isLoggedIn ? (
                        <button
                          onClick={async () => {
                            const supabase = require('@supabase/auth-helpers-nextjs').createClientComponentClient();
                            try {
                              const { error } = await supabase.auth.signOut();
                              if (error) throw error;
                            } catch (e) {
                              alert('로그아웃 중 오류가 발생했습니다.');
                            } finally {
                              window.location.href = '/login';
                            }
                          }}
                          className="w-full mt-4 px-2 py-0 rounded bg-gray-200 text-gray-700 text-base font-semibold hover:bg-gray-300 transition whitespace-nowrap min-w-fit flex flex-col items-center justify-center"
                          style={{ minHeight: 'unset', lineHeight: 1.1 }}
                          {...(userEmail ? { title: userEmail } : {})}
                        >
                          Logout
                        </button>
                      ) : (
                        <button
                          onClick={() => { window.location.href = '/login'; }}
                          className="w-full mt-4 px-1 py-0 rounded bg-green-500 text-white text-base font-semibold hover:bg-green-600 transition flex items-center justify-center whitespace-nowrap min-w-fit h-[32px]"
                        >
                          Login
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {isLoggedIn === null ? null : isLoggedIn ? (
                  <>
                    <button
                      onClick={async () => {
                        const supabase = require('@supabase/auth-helpers-nextjs').createClientComponentClient();
                        try {
                          const { error } = await supabase.auth.signOut();
                          if (error) throw error;
                        } catch (e) {
                          alert('로그아웃 중 오류가 발생했습니다.');
                        } finally {
                          window.location.href = '/login';
                        }
                      }}
                      className="ml-2 px-1 py-0 rounded bg-gray-200 text-gray-700 text-base font-semibold hover:bg-gray-300 transition hidden xl:inline-flex flex-col items-center justify-center whitespace-nowrap min-w-fit h-[32px]"
                      style={{ minHeight: 'unset', lineHeight: 1.1 }}
                      {...(userEmail ? { title: userEmail } : {})}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { window.location.href = '/login'; }}
                    className="ml-2 px-1 py-0 rounded bg-green-500 text-white text-base font-semibold hover:bg-green-600 transition hidden xl:inline-flex items-center justify-center whitespace-nowrap min-w-fit h-[32px]"
                  >
                    Login
                  </button>
                )}
              </div>
            </nav>
          </header>
          <main className="flex-1 max-w-[1440px] mx-auto px-8 py-12 w-full">
            {children}
          </main>
          <footer className="bg-[#f5f5f7] text-[#86868b] py-12 border-t border-gray-200">
            <div className="max-w-[1440px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <span className="font-bold text-base px-5 py-1 border-2 border-black rounded-[10px] tracking-tight bg-white select-none whitespace-nowrap"
                  style={{ fontFamily: 'Pretendard, Arial, sans-serif', letterSpacing: '-0.02em', borderBottom: '0' }}>
                  Dragon.J's Project
                </span>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm">© 2024 동행청소연구소. All rights reserved.</p>
                <p className="text-sm mt-1">홈클리닝-기업클리닝(정기청소, 계단청소)</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
