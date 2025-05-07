'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>로그인 처리 중...</div>}>
      <AuthCallbackInner />
    </Suspense>
  );
}

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setErrorMsg('인증 코드가 없습니다. 다시 시도해주세요.');
      router.replace('/login');
      return;
    }
    const handleAuth = async () => {
      console.log('Supabase OAuth code:', code);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (errorMsg) return <div>{errorMsg}</div>;
  return <div>로그인 처리 중...</div>;
} 