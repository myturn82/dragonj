'use client';

import { useState } from 'react';
import Calendar from '@/components/Calendar';
import Board from '@/components/Board';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('calendar');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black/90 border-b border-gray-800">
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
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-white"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        {activeTab === 'calendar' && <Calendar />}
        {activeTab === 'board' && <Board />}
      </main>
    </div>
  );
} 