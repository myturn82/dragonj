"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!password || !confirm) {
      setMessage("비밀번호를 모두 입력해 주세요.");
      return;
    }
    if (password !== confirm) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    setLoading(true);
    // Supabase는 reset 링크로 접속 시 세션을 자동으로 부여함
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setMessage("비밀번호 변경 실패: " + error.message);
    } else {
      setMessage("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해 주세요.");
      setTimeout(() => router.replace("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff]">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold mb-4 text-center">비밀번호 재설정</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="새 비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            minLength={6}
            autoFocus
          />
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            minLength={6}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded px-4 py-2 mt-2"
            disabled={loading}
          >
            {loading ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>
        {message && <div className="text-center text-sm mt-2 text-blue-600">{message}</div>}
      </div>
    </div>
  );
} 