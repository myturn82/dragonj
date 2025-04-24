'use client';

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black z-10"></div>
        <div className="relative z-20 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            할 일 관리를 더 쉽고 편리하게
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            캘린더와 게시판으로 당신의 일정을 관리하세요.
          </p>
          <Link href="/login">
            <button className="bg-red-600 text-white px-8 py-4 rounded text-xl hover:bg-red-700 transition">
              시작하기
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                캘린더로 일정 관리
              </h2>
              <p className="text-lg text-gray-300">
                직관적인 캘린더로 모든 일정을 한눈에 확인하고 관리하세요.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                게시판으로 소통하기
              </h2>
              <p className="text-lg text-gray-300">
                팀원들과 실시간으로 소통하고 정보를 공유하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-black/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl font-bold mb-2">어떤 기능이 있나요?</h3>
              <p className="text-gray-300">
                캘린더를 통한 일정 관리, 게시판을 통한 소통, 로그인/회원가입 기능을 제공합니다.
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl font-bold mb-2">무료로 사용할 수 있나요?</h3>
              <p className="text-gray-300">
                네, 모든 기능을 무료로 이용하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black/80">
        <div className="max-w-6xl mx-auto px-4 text-gray-400 text-sm">
          <p className="text-center">© 2024 Todo App. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
