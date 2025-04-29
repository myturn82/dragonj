'use client';

import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Auth from '@/components/Auth';

export default function LoginPage() {
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.replace('/');
      }
    };

    checkSession();
  }, [supabase]);

  return <Auth />;
} 