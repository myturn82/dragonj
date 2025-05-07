import { redirect } from 'next/navigation';

export default function Home() {
  return (
    <div>
      {/* 상단 네비게이션 */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center space-x-4">
            <img src="/blog_logo.png" alt="동행청소연구소 로고" className="h-8" />
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
      </header>

      {/* 메인 배너 */}
      <section className="bg-blue-100 py-12 text-center">
        <h1 className="text-4xl font-bold mb-2">동행청소연구소 메인 배너</h1>
      </section>

      {/* 서비스 소개 */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">정기청소</h2>
            <h3 className="text-lg font-semibold mb-1">사무실 청소</h3>
            <p className="mb-2">깨끗한 사무실 환경을 위한 전문적인 청소 서비스</p>
            <a href="#" className="text-blue-600 underline">자세히 보기 →</a>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">계단청소</h2>
            <h3 className="text-lg font-semibold mb-1">아파트/빌라 청소</h3>
            <p className="mb-2">계단과 공용공간의 청결을 위한 전문 서비스</p>
            <a href="#" className="text-blue-600 underline">자세히 보기 →</a>
          </div>
        </div>
      </section>

      {/* 최근 게시물 */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">최근 게시물</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded shadow p-4">
                <h3 className="font-bold mb-2">게시물 {i}</h3>
                <h4 className="text-sm font-semibold mb-1">청소 서비스 후기 {i}</h4>
                <p className="mb-2">정기청소 서비스를 이용한 고객님의 솔직한 후기입니다.</p>
                <a href="#" className="text-blue-600 underline">자세히 보기 →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 문의하기 */}
      <section className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">문의하기</h2>
        <p className="mb-4">청소 서비스에 대해 궁금하신 점이 있으시면 언제든지 문의해주세요.</p>
        <a href="#" className="inline-block bg-blue-600 text-white px-6 py-2 rounded font-semibold">문의하기</a>
      </section>

      {/* 푸터 */}
      <footer className="bg-[#f5f5f7] text-[#86868b] py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <img src="/blog_logo.png" alt="동행청소연구소 로고" className="h-8" />
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
