import Link from "next/link";

export default function Signup() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-black/80 rounded-lg">
        <h1 className="text-3xl font-bold mb-8">회원가입</h1>
        <form className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="이름"
              className="w-full p-4 bg-gray-700 rounded text-white placeholder-gray-400"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="이메일"
              className="w-full p-4 bg-gray-700 rounded text-white placeholder-gray-400"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full p-4 bg-gray-700 rounded text-white placeholder-gray-400"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호 확인"
              className="w-full p-4 bg-gray-700 rounded text-white placeholder-gray-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white p-4 rounded font-medium hover:bg-red-700 transition"
          >
            회원가입
          </button>
        </form>
        <p className="mt-6 text-gray-400 text-center">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-white hover:underline">
            로그인하기
          </Link>
        </p>
        <div className="mt-6 text-sm text-gray-400">
          <p className="text-center">
            가입하시면{" "}
            <Link href="/terms" className="text-white hover:underline">
              서비스 약관
            </Link>
            {" "}및{" "}
            <Link href="/privacy" className="text-white hover:underline">
              개인정보 처리방침
            </Link>
            에 동의하시는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  );
} 