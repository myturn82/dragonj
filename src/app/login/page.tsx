'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateCredentials } from "@/lib/auth";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: 'test@example.com',
    password: 'test1234'
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCredentials(formData.email, formData.password)) {
      router.push('/dashboard');
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* 사이버트럭 배경 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Cybertruck-Desktop-NA.jpg")'
        }}
      />
      
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* 컨텐츠 */}
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">로그인</h1>
          <p className="text-xl text-red-500 font-medium animate-pulse">송연우 사랑해~</p>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 text-red-500 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-black/50 p-6 rounded-lg backdrop-blur-sm">
          <div>
            <input
              type="email"
              placeholder="이메일"
              className="w-full p-4 bg-white/10 rounded text-white placeholder-gray-400 border border-white/20 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full p-4 bg-white/10 rounded text-white placeholder-gray-400 border border-white/20 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white p-4 rounded font-medium hover:bg-red-700 transition"
          >
            로그인
          </button>
        </form>
        
        <p className="mt-6 text-gray-300 text-center">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-white hover:text-red-500 transition">
            지금 가입하세요
          </Link>
        </p>
        
        <div className="mt-4 p-4 bg-white/5 rounded backdrop-blur-sm">
          <p className="text-sm text-gray-300">
            테스트 계정:<br />
            이메일: test@example.com<br />
            비밀번호: test1234
          </p>
        </div>
      </div>
    </div>
  );
} 