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
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-black/80 rounded-lg">
        <h1 className="text-3xl font-bold mb-8">로그인</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 text-red-500 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="이메일"
              className="w-full p-4 bg-gray-700 rounded text-white placeholder-gray-400"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full p-4 bg-gray-700 rounded text-white placeholder-gray-400"
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
        <p className="mt-6 text-gray-400 text-center">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-white hover:underline">
            지금 가입하세요
          </Link>
        </p>
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <p className="text-sm text-gray-400">
            테스트 계정:<br />
            이메일: test@example.com<br />
            비밀번호: test1234
          </p>
        </div>
      </div>
    </div>
  );
} 