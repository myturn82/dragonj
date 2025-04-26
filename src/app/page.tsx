'use client';

import dynamic from 'next/dynamic';
import Link from "next/link";

// 동적 임포트로 변경
const VideoBackground = dynamic(() => import('@/components/VideoBackground'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 w-full h-full bg-black" />
  ),
});

const FAQ = dynamic(() => import('@/components/FAQ'), {
  loading: () => <div className="py-24 bg-zinc-900" />,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {/* 사이버트럭 배경 */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Cybertruck-Desktop-NA.jpg")'
          }}
        />
        
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />
        
        <div className="relative z-20 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-wide text-white">
            할 일 관리를 더 쉽고 편리하게
          </h1>
          <p className="text-xl md:text-2xl mb-12 font-light text-gray-300">
            캘린더와 게시판으로 당신의 일정을 관리하세요.
          </p>
          <Link href="/login">
            <button className="bg-white/10 backdrop-blur-sm border-[3px] border-white text-white px-12 py-3 rounded text-sm uppercase tracking-wider font-medium hover:bg-white hover:text-black transition-all duration-300">
              시작하기
            </button>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black/90 relative">
        <div className="absolute inset-0 bg-[url('https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Cybertruck-Desktop-NA.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            주요 기능
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-white">캘린더</h3>
              <p className="text-gray-300">일정을 쉽게 관리하고 계획하세요.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-white">게시판</h3>
              <p className="text-gray-300">팀원들과 소통하고 정보를 공유하세요.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-white">할 일 관리</h3>
              <p className="text-gray-300">업무를 체계적으로 관리하세요.</p>
            </div>
          </div>
        </div>
      </section>

      <FAQ />

      {/* Footer */}
      <footer className="py-8 bg-black">
        <div className="max-w-6xl mx-auto px-4 text-gray-400 text-sm">
          <p className="text-center">© 2024 Todo App. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
