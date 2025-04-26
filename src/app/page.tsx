'use client';

import Image from 'next/image';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[500px]">
        <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">동행청소연구소</h1>
            <p className="text-xl md:text-2xl">홈클리닝-기업클리닝(정기청소, 계단청소)</p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">안녕하세요. 동행청소연구소 입니다.</h2>
          <p className="text-lg text-gray-600 mb-8">
            정기청소 및 계단청소 전문기업입니다. 정기청소-사무실, 학원, 병원, 상가등
            계단청소-빌라, 아파트, 상가등 말보다는 행동하는 모습으로 고객님이 원하는
            모습을 보여드리겠습니다.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">서비스 소개</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">정기청소</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 사무실 청소</li>
                <li>• 학원 청소</li>
                <li>• 병원 청소</li>
                <li>• 상가 청소</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">계단청소</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 빌라 청소</li>
                <li>• 아파트 청소</li>
                <li>• 상가 청소</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">문의하기</h2>
          <p className="text-lg text-gray-600 mb-8">
            언제든지 편하게 문의해주세요. 빠르고 친절하게 답변드리겠습니다.
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            문의하기
          </a>
        </div>
      </section>
    </div>
  );
}
