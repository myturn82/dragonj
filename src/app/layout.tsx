'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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

  useEffect(() => {
    async function checkSession() {
      const supabase = require('@supabase/auth-helpers-nextjs').createClientComponentClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setUserEmail(session?.user?.email ?? null);
    }
    checkSession();
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

  return (
    <html lang="ko">
      <body className={`${inter.className} bg-[var(--background)] text-[var(--foreground)]`}>
        <header className="bg-[#ffffff] border-b border-gray-200 sticky top-0 z-50">
          <nav className="max-w-[1440px] mx-auto flex items-center justify-between h-[64px] px-10">
            <Link href="/" className="flex items-center mr-10">
              <span className="font-bold text-lg px-6 py-1 border-2 border-black rounded-t-[12px] tracking-tight bg-white select-none whitespace-nowrap"
                style={{ fontFamily: 'Pretendard, Arial, sans-serif', letterSpacing: '-0.02em', borderBottom: '0' }}>
                Dragon.J's Project
              </span>
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
              <div className="relative xl:hidden">
                <button
                  className="p-2 h-[32px] flex items-center justify-center"
                  aria-label="메뉴 토글"
                  tabIndex={0}
                  onClick={() => setIsMenuOpen((v) => !v)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') setIsMenuOpen((v) => !v);
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
                    ref={menuRef}
                    className="absolute right-0 top-[48px] w-max bg-white shadow-lg rounded-b-2xl animate-fade-in z-50"
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
        <main className="max-w-[1440px] mx-auto px-8 py-12 min-h-screen">
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
      </body>
    </html>
  );
}
