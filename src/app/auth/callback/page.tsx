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
    // code_verifier는 Supabase가 sessionStorage에 저장함
    const codeVerifier = typeof window !== 'undefined' ? window.sessionStorage.getItem('supabase.auth.code_verifier') : null;
    if (!code) {
      setErrorMsg('인증 코드가 없습니다. 다시 시도해주세요.');
      router.replace('/login');
      return;
    }
    if (!codeVerifier) {
      setErrorMsg('인증 정보가 유실되었습니다. 다시 로그인 해주세요. (로그인 중 새로고침하거나 시크릿 모드에서는 인증이 실패할 수 있습니다.)');
      router.replace('/login');
      return;
    }
    const handleAuth = async () => {
      const { error, ...rest } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        console.log('로그인 성공:', rest);
        window.location.replace('/');
      } else {
        console.log('로그인 실패:', error);
        await supabase.auth.signOut();
        alert('로그인 실패: ' + error.message + '\n다시 로그인 해주세요.\n로그인 페이지로 이동합니다.');
        router.replace('/login');
      }
    };
    handleAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (errorMsg) return <div>{errorMsg}<br/>로그인 중 새로고침하거나 시크릿 모드에서는 인증이 실패할 수 있습니다.</div>;
  return <div>로그인 처리 중...<br/>로그인 중 새로고침하거나 시크릿 모드에서는 인증이 실패할 수 있습니다.</div>;
} 