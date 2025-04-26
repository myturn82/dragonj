import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "동행청소연구소",
  description: "홈클리닝-기업클리닝(정기청소, 계단청소)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <header className="bg-white shadow-md">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-gray-800">동행청소연구소</div>
              <div className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-600 hover:text-gray-900">홈</a>
                <a href="/service" className="text-gray-600 hover:text-gray-900">서비스 요금</a>
                <a href="/tools" className="text-gray-600 hover:text-gray-900">작업도구</a>
                <a href="/sns" className="text-gray-600 hover:text-gray-900">SNS</a>
                <a href="/schedule" className="text-gray-600 hover:text-gray-900">스케줄</a>
                <a href="/contact" className="text-gray-600 hover:text-gray-900">문의하기</a>
                <a href="/reviews" className="text-gray-600 hover:text-gray-900">이용후기</a>
                <a href="/board" className="text-gray-600 hover:text-gray-900">게시판</a>
              </div>
              <div className="md:hidden">
                <button className="text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p>© 2024 동행청소연구소. All rights reserved.</p>
              <p className="mt-2">홈클리닝-기업클리닝(정기청소, 계단청소)</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
