'use client';

import { useState, useEffect, Suspense } from 'react';
import Calendar from '@/components/Calendar';
import Board from '@/components/Board';
import Photos from '@/app/photos/page';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="text-white text-center py-8">로딩 중...</div>}>
      <DashboardInner />
    </Suspense>
  );
}

function DashboardInner() {
  const [activeTab, setActiveTab] = useState('calendar');
  const router = useRouter();
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState('');

  const handleGitHubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: false,
      },
    });
    if (error) setMessage('GitHub 로그인 실패: ' + error.message);
  };

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setErrorMsg('인증 코드가 없습니다. 다시 시도해주세요.');
      router.replace('/login');
      return;
    }
    const handleAuth = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        alert('로그인에 성공했습니다! 메인 페이지로 이동합니다.');
        router.replace('/');
      } else {
        await supabase.auth.signOut();
        alert('로그인 실패: ' + error.message + '\n로그인 페이지로 이동합니다.');
        router.replace('/login');
      }
    };
    handleAuth();
  }, [searchParams, supabase, router]);

  return (
    <div className="relative min-h-screen bg-black text-white">
      <Navbar />
      {/* 사이버트럭 배경 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Cybertruck-Desktop-NA.jpg")'
        }}
      />
      
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
      
      {/* 컨텐츠 */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="bg-black/50 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('calendar')}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      activeTab === 'calendar'
                        ? 'border-red-600 text-white'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    캘린더
                  </button>
                  <button
                    onClick={() => setActiveTab('board')}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      activeTab === 'board'
                        ? 'border-red-600 text-white'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    게시판
                  </button>
                  <button
                    onClick={() => setActiveTab('photos')}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      activeTab === 'photos'
                        ? 'border-red-600 text-white'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    포토
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-400 hover:text-white transition"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="w-full overflow-hidden">
            {activeTab === 'calendar' && <Calendar />}
            {activeTab === 'board' && <Board />}
            {activeTab === 'photos' && <Photos />}
          </div>
        </main>
      </div>
    </div>
  );
} 