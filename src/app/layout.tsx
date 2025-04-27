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
      <body className={`${inter.className} bg-gray-50`}>
        <header className="bg-white shadow-md sticky top-0 z-50">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/blog_logo.png"
                  alt="동행청소연구소 로고"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              
              {/* 데스크톱 메뉴 */}
              <div className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">홈</Link>
                <Link href="/service" className="text-gray-600 hover:text-blue-600 transition-colors">서비스</Link>
                <Link href="/tools" className="text-gray-600 hover:text-blue-600 transition-colors">작업도구</Link>
                <Link href="/sns" className="text-gray-600 hover:text-blue-600 transition-colors">SNS</Link>
                <Link href="/schedule" className="text-gray-600 hover:text-blue-600 transition-colors">스케줄</Link>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">문의하기</Link>
                <Link href="/reviews" className="text-gray-700 hover:text-blue-600 transition-colors">리뷰</Link>
                <Link href="/board" className="text-gray-700 hover:text-blue-600 transition-colors">게시판</Link>
                <Link href="/game" className="text-gray-700 hover:text-blue-600 transition-colors">체스게임</Link>
                <Link href="/truck" className="text-gray-700 hover:text-blue-600 transition-colors">트럭게임</Link>
              </div>

              {/* 모바일 메뉴 버튼 */}
              <button 
                className="md:hidden text-gray-600 hover:text-blue-600 transition-colors"
                onClick={toggleMenu}
                aria-label="메뉴 토글"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  ) : (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 6h16M4 12h16M4 18h16" 
                    />
                  )}
                </svg>
              </button>
            </div>

            {/* 모바일 메뉴 */}
            {isMenuOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">홈</Link>
                  <Link href="/service" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">서비스</Link>
                  <Link href="/tools" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">작업도구</Link>
                  <Link href="/sns" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">SNS</Link>
                  <Link href="/schedule" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">스케줄</Link>
                  <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">문의하기</Link>
                  <Link href="/reviews" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">리뷰</Link>
                  <Link href="/board" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">게시판</Link>
                  <Link href="/game" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">체스게임</Link>
                  <Link href="/truck" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">트럭게임</Link>
                </div>
              </div>
            )}
          </nav>
        </header>

        <main className="container mx-auto px-4 py-8 min-h-screen">
          {children}
        </main>

        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
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
                <p className="text-sm text-gray-400">© 2024 동행청소연구소. All rights reserved.</p>
                <p className="text-sm text-gray-400 mt-1">홈클리닝-기업클리닝(정기청소, 계단청소)</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
