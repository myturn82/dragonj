import { memo } from 'react';

const FAQ = memo(function FAQ() {
  return (
    <section className="py-24 bg-zinc-900">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
          자주 묻는 질문
        </h2>
        <div className="space-y-6">
          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">어떤 기능이 있나요?</h3>
            <p className="text-gray-300">
              캘린더를 통한 일정 관리, 게시판을 통한 소통, 로그인/회원가입 기능을 제공합니다.
            </p>
          </div>
          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">무료로 사용할 수 있나요?</h3>
            <p className="text-gray-300">
              네, 모든 기능을 무료로 이용하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default FAQ; 