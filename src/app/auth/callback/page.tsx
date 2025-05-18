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
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

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
      try {
        const { error, data } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error) {
          console.log('로그인 성공:', data);
          // 세션이 확실히 반영될 때까지 대기
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
              router.replace('/');
            }
          });
          // 3초 후에도 이동이 안 되면 fallback
          setTimeout(() => {
            router.replace('/');
          }, 3000);
        } else {
          if (error.status === 429 && retryCount < MAX_RETRIES) {
            // Rate limit hit - implement exponential backoff
            const backoffTime = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
            console.log(`Rate limit hit. Retrying in ${backoffTime/1000} seconds...`);
            setErrorMsg(`요청이 너무 많습니다. ${backoffTime/1000}초 후 다시 시도합니다...`);
            setRetryCount(prev => prev + 1);
            setTimeout(handleAuth, backoffTime);
          } else {
            console.log('로그인 실패:', error);
            await supabase.auth.signOut();
            alert('로그인 실패: ' + error.message + '\n다시 로그인 해주세요.\n로그인 페이지로 이동합니다.');
            router.replace('/login');
          }
        }
      } catch (err) {
        console.error('Unexpected error during authentication:', err);
        setErrorMsg('예기치 않은 오류가 발생했습니다. 다시 시도해주세요.');
        router.replace('/login');
      }
    };
    handleAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]);

  if (errorMsg) return <div className="text-center p-4">{errorMsg}</div>;
  return <div className="text-center p-4">로그인 처리 중...<br/>잠시만 기다려주세요.</div>;
} 