'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* 메인 배너 */}
      <div className="relative h-[400px] w-full">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1581094794329-c8112c4e0e0d?auto=format&fit=crop&w=1920&q=80"
            alt="다이슨 청소기 메인 배너"
            fill
            style={{ objectFit: 'cover' }}
            priority
            quality={100}
            sizes="100vw"
            loading="eager"
            unoptimized={true}
          />
        </div>
      </div>

      {/* 서비스 소개 */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 정기청소 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">정기청소</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1581094794329-c8112c4e0e0d?auto=format&fit=crop&w=240&q=80"
                    alt="다이슨 무선 청소기"
                    width={120}
                    height={120}
                    className="rounded-lg"
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 120px"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">사무실 청소</h3>
                  <p className="text-gray-600">
                    깨끗한 사무실 환경을 위한 전문적인 청소 서비스
                  </p>
                  <Link 
                    href="/service"
                    className="inline-block mt-2 text-blue-600 hover:text-blue-800"
                  >
                    자세히 보기 →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 계단청소 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">계단청소</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1581094794329-c8112c4e0e0d?auto=format&fit=crop&w=240&q=80"
                    alt="다이슨 무선 청소기"
                    width={120}
                    height={120}
                    className="rounded-lg"
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 120px"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">아파트/빌라 청소</h3>
                  <p className="text-gray-600">
                    계단과 공용공간의 청결을 위한 전문 서비스
                  </p>
                  <Link 
                    href="/service"
                    className="inline-block mt-2 text-blue-600 hover:text-blue-800"
                  >
                    자세히 보기 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 게시물 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">최근 게시물</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1581094794329-c8112c4e0e0d?auto=format&fit=crop&w=400&q=80"
                  alt={`다이슨 청소기 게시물 ${index}`}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">청소 서비스 후기 {index}</h3>
                  <p className="text-gray-600 mb-4">
                    정기청소 서비스를 이용한 고객님의 솔직한 후기입니다.
                  </p>
                  <Link 
                    href={`/board/${index}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    자세히 보기 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 문의하기 섹션 */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">문의하기</h2>
          <p className="text-gray-600 mb-6">
            청소 서비스에 대해 궁금하신 점이 있으시면 언제든지 문의해주세요.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            문의하기
          </Link>
        </div>
      </div>
    </div>
  );
}
