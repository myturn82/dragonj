import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchKoreanHolidays } from '@/lib/koreanHolidays';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // 오늘이 공휴일인지 확인
  const todayStr = new Date().toISOString().slice(0, 10);
  const holidays = await fetchKoreanHolidays(new Date().getFullYear());
  const todayHoliday = holidays.find(h => h.date === todayStr);

  return (
    <div>
      {todayHoliday && (
        <div className="bg-red-100 text-red-700 text-center py-2 font-bold">
          오늘은 {todayHoliday.name}입니다. 즐거운 휴일 보내세요!
        </div>
      )}
      {/* 상단 네비게이션 */}
      {/* <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center space-x-4">
            <img src="/blog_logo.png" alt="동행청소연구소 로고" className="h-8" style={{ width: 'auto' }} />
            <nav className="space-x-4 text-sm font-semibold">
              <a href="/">홈</a>
              <a href="#">서비스</a>
              <a href="#">작업도구</a>
              <a href="#">SNS</a>
              <a href="#">스케줄</a>
              <a href="#">문의하기</a>
              <a href="#">리뷰게시판</a>
              <a href="#">체스게임</a>
              <a href="#">트럭게임</a>
            </nav>
          </div>
        </div>
      </header> */}

      {/* 메인 배너 */}
      <section className="bg-white py-16 text-center border-b border-gray-200">
        <h1 className="text-5xl font-bold mb-2 tracking-tight text-primary">동행청소연구소</h1>
        <p className="text-lg text-gray-500 mt-4">현대카드 스타일의 미니멀 청소 서비스 플랫폼</p>
      </section>

      {/* 서비스 소개 */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-8 md:pb-0 md:pr-8">
            <h2 className="text-2xl font-bold mb-2 text-primary">정기청소</h2>
            <h3 className="text-lg font-semibold mb-1 text-gray-600">사무실 청소</h3>
            <p className="mb-2 text-gray-500">깨끗한 사무실 환경을 위한 전문적인 청소 서비스</p>
            <a href="#" className="text-accent font-semibold underline underline-offset-4">자세히 보기 →</a>
          </div>
          <div className="pt-8 md:pt-0 md:pl-8">
            <h2 className="text-2xl font-bold mb-2 text-primary">계단청소</h2>
            <h3 className="text-lg font-semibold mb-1 text-gray-600">아파트/빌라 청소</h3>
            <p className="mb-2 text-gray-500">계단과 공용공간의 청결을 위한 전문 서비스</p>
            <a href="#" className="text-accent font-semibold underline underline-offset-4">자세히 보기 →</a>
          </div>
        </div>
      </section>

      {/* 최근 게시물 */}
      <section className="bg-secondary py-16 border-t border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-primary">최근 게시물</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="card">
                <h3 className="font-bold mb-2 text-primary">게시물 {i}</h3>
                <h4 className="text-sm font-semibold mb-1 text-gray-600">청소 서비스 후기 {i}</h4>
                <p className="mb-2 text-gray-500">정기청소 서비스를 이용한 고객님의 솔직한 후기입니다.</p>
                <a href="#" className="text-accent font-semibold underline underline-offset-4">자세히 보기 →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 문의하기 */}
      <section className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2 text-primary">문의하기</h2>
        <p className="mb-4 text-gray-500">청소 서비스에 대해 궁금하신 점이 있으시면 언제든지 문의해주세요.</p>
        <a href="#" className="inline-block border border-primary text-primary bg-white px-8 py-3 font-semibold transition hover:bg-primary hover:text-white">문의하기</a>
      </section>

      {/* 푸터 */}
      <footer className="bg-secondary text-gray-400 py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <img src="/blog_logo.png" alt="동행청소연구소 로고" className="h-8" style={{ width: 'auto' }} />
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm">© 2024 동행청소연구소. All rights reserved.</p>
            <p className="text-sm mt-1">홈클리닝-기업클리닝(정기청소, 계단청소)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
