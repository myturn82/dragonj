'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.status === 429) {
        setMessage('요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.');
      } else {
        setMessage('로그인 실패: ' + error.message);
      }
    } else {
      setMessage('로그인 성공!');
      router.replace('/');
    }
  };

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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage('');
    if (!resetEmail) {
      setResetMessage('이메일을 입력해 주세요.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setResetMessage('비밀번호 재설정 메일 전송 실패: ' + error.message);
    } else {
      setResetMessage('비밀번호 재설정 메일이 전송되었습니다. 메일함을 확인해 주세요.');
    }
  };

  // SSO 버튼은 실제 구현이 필요하다면 추가 구현 필요

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff]">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md flex flex-col gap-6">
        <div className="flex flex-col items-center mb-2">
          <span className="font-bold text-lg px-6 py-1 border-2 border-black rounded-t-[12px] tracking-tight bg-white select-none whitespace-nowrap mb-4"
            style={{ fontFamily: 'Pretendard, Arial, sans-serif', letterSpacing: '-0.02em', borderBottom: '0' }}>
            Dragon.J's Project
          </span>
          <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>
        {showReset ? (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="가입한 이메일을 입력하세요"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              required
              className="border border-gray-300 rounded px-3 py-2 text-sm"
              autoFocus
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded px-4 py-2 mt-2">비밀번호 재설정 메일 보내기</button>
            <button type="button" className="text-xs text-gray-500 underline mt-2" onClick={() => { setShowReset(false); setResetMessage(''); }}>로그인 화면으로 돌아가기</button>
            {resetMessage && <div className="text-sm text-center text-blue-500 mt-2">{resetMessage}</div>}
          </form>
        ) : (
          <>
            <button
              onClick={handleGitHubLogin}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <svg width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              Continue with GitHub
            </button>
            <button
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition"
              disabled
            >
              <svg width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 24 24"><path d="M17 2H7C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2ZM17 20H7V4H17V20ZM12 18C13.1 18 14 17.1 14 16C14 14.9 13.1 14 12 14C10.9 14 10 14.9 10 16C10 17.1 10.9 18 12 18Z"/></svg>
              Continue with SSO
            </button>
            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-xs">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="border border-gray-300 rounded px-3 py-2 text-sm"
                tabIndex={1}
              />
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm">Password</label>
                <button type="button" className="text-xs text-gray-500 hover:underline" onClick={() => { setShowReset(true); setResetEmail(email); setResetMessage(''); }}>Forgot Password?</button>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="border border-gray-300 rounded px-3 py-2 text-sm"
                tabIndex={2}
              />
              <button type="submit" className="bg-green-400 hover:bg-green-500 text-white font-semibold rounded px-4 py-2 mt-2">Sign In</button>
            </form>
            {message && <div className="text-sm text-center text-red-500">{message}</div>}
            <div className="text-center text-sm text-gray-500 mt-2">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-green-600 hover:underline font-semibold">Sign Up Now</Link>
            </div>
            <div className="text-xs text-gray-400 text-center mt-4">
              By continuing, you agree to Supabase&apos;s{' '}
              <a href="https://supabase.com/terms" target="_blank" className="underline">Terms of Service</a> and{' '}
              <a href="https://supabase.com/privacy" target="_blank" className="underline">Privacy Policy</a>, and to receive periodic emails with updates.
            </div>
          </>
        )}
      </div>
    </div>
  );
} 