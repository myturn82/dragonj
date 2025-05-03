'use client';

import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import Auth from '@/components/Auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const redirectTo = searchParams.get('redirectTo') || '/inquiry';
          router.replace(redirectTo);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();
  }, [supabase, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="w-full max-w-[400px] card flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-3xl font-bold text-[var(--foreground)]">로그인</h2>
          <p className="text-base text-gray-500 text-center">GitHub 계정으로<br />간편하게 로그인하세요</p>
        </div>
        <Auth />
      </div>
    </div>
  );
} 