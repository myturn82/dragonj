'use client';

import { useState } from 'react';
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <html lang="ko">
      <body className={`${inter.className} bg-[var(--background)] text-[var(--foreground)]`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <nav className="max-w-[1440px] mx-auto flex items-center justify-between h-[64px] px-10">
            <Link href="/" className="flex items-center">
              <Image
                src="/blog_logo.png"
                alt="동행청소연구소 로고"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <ul className="hidden md:flex gap-10 text-lg font-semibold text-[#1d1d1f]">
              <li><Link href="/" className="hover:text-[var(--primary)] transition">홈</Link></li>
              <li><Link href="/service" className="hover:text-[var(--primary)] transition">서비스</Link></li>
              <li><Link href="/tools" className="hover:text-[var(--primary)] transition">작업도구</Link></li>
              <li><Link href="/sns" className="hover:text-[var(--primary)] transition">SNS</Link></li>
              <li><Link href="/schedule" className="hover:text-[var(--primary)] transition">스케줄</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--primary)] transition">문의하기</Link></li>
              <li><Link href="/reviews" className="hover:text-[var(--primary)] transition">리뷰</Link></li>
              <li><Link href="/board" className="hover:text-[var(--primary)] transition">게시판</Link></li>
              <li><Link href="/game" className="hover:text-[var(--primary)] transition">체스게임</Link></li>
              <li><Link href="/truck" className="hover:text-[var(--primary)] transition">트럭게임</Link></li>
            </ul>
            <div className="flex items-center gap-4">
              <button className="hidden md:inline-block p-2 rounded-full hover:bg-gray-100 transition">
                <svg width="24" height="24" fill="none" stroke="#1d1d1f" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              </button>
              <button className="hidden md:inline-block p-2 rounded-full hover:bg-gray-100 transition">
                <svg width="24" height="24" fill="none" stroke="#1d1d1f" strokeWidth="2"><path d="M6 6h12v12H6z"/></svg>
              </button>
              <button
                className="md:hidden p-2"
                onClick={toggleMenu}
                aria-label="메뉴 토글"
              >
                <svg className="w-7 h-7" fill="none" stroke="#1d1d1f" strokeWidth="2" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </nav>
          {isMenuOpen && (
            <div className="md:hidden bg-white shadow-lg rounded-b-2xl animate-fade-in">
              <ul className="px-6 pt-4 pb-6 space-y-2 text-lg font-semibold">
                <li><Link href="/" className="block hover:text-[var(--primary)] transition">홈</Link></li>
                <li><Link href="/service" className="block hover:text-[var(--primary)] transition">서비스</Link></li>
                <li><Link href="/tools" className="block hover:text-[var(--primary)] transition">작업도구</Link></li>
                <li><Link href="/sns" className="block hover:text-[var(--primary)] transition">SNS</Link></li>
                <li><Link href="/schedule" className="block hover:text-[var(--primary)] transition">스케줄</Link></li>
                <li><Link href="/contact" className="block hover:text-[var(--primary)] transition">문의하기</Link></li>
                <li><Link href="/reviews" className="block hover:text-[var(--primary)] transition">리뷰</Link></li>
                <li><Link href="/board" className="block hover:text-[var(--primary)] transition">게시판</Link></li>
                <li><Link href="/game" className="block hover:text-[var(--primary)] transition">체스게임</Link></li>
                <li><Link href="/truck" className="block hover:text-[var(--primary)] transition">트럭게임</Link></li>
              </ul>
            </div>
          )}
        </header>
        <main className="max-w-[1440px] mx-auto px-8 py-12 min-h-screen">
          {children}
        </main>
        <footer className="bg-[#f5f5f7] text-[#86868b] py-12 border-t border-gray-200">
          <div className="max-w-[1440px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image
                src="/blog_logo.png"
                alt="동행청소연구소 로고"
                width={100}
                height={30}
                className="h-8 w-auto"
              />
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
