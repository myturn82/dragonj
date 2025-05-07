"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    // 1. 이메일/비밀번호 회원가입
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      if (error.status === 429) {
        setMessage("요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      setMessage("회원가입 실패: " + error.message);
      return;
    }
    // 2. user_profile 테이블에 추가 정보 저장
    if (data.user) {
      const { error: profileError } = await supabase.from("user_profile").insert({
        id: data.user.id,
        nickname,
        phone,
      });
      if (profileError) {
        setMessage("회원가입은 되었으나 프로필 저장 실패: " + profileError.message);
        return;
      }
    }
    setMessage("회원가입 성공! 이메일을 확인해 주세요.");
    setTimeout(() => router.replace("/login"), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff]">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold mb-1 text-center">Sign Up</h2>
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="전화번호"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <button type="submit" className="bg-green-400 hover:bg-green-500 text-white font-semibold rounded px-4 py-2 mt-2">Sign Up</button>
        </form>
        {message && <div className="text-sm text-center text-red-500">{message}</div>}
        <div className="text-center text-sm text-gray-500 mt-2">
          이미 계정이 있으신가요?{' '}
          <a href="/login" className="text-green-600 hover:underline font-semibold">로그인</a>
        </div>
      </div>
    </div>
  );
} 