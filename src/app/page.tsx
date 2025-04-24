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
        <VideoBackground />

        <div className="relative z-20 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-wide">
            할 일 관리를 더 쉽고 편리하게
          </h1>
          <p className="text-xl md:text-2xl mb-12 font-light">
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
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                캘린더로 일정 관리
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                직관적인 캘린더로 모든 일정을 한눈에 확인하고 관리하세요.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                게시판으로 소통하기
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                팀원들과 실시간으로 소통하고 정보를 공유하세요.
              </p>
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
