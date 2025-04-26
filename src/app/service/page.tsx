'use client';

export default function ServicePage() {
  return (
    <div className="space-y-12">
      <section className="py-12">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-12">서비스 요금</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 정기청소 요금 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">정기청소 요금</h2>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="text-xl font-semibold mb-2">사무실 청소</h3>
                  <p className="text-gray-600">평당 5,000원 ~ 8,000원</p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="text-xl font-semibold mb-2">학원 청소</h3>
                  <p className="text-gray-600">평당 4,000원 ~ 7,000원</p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="text-xl font-semibold mb-2">병원 청소</h3>
                  <p className="text-gray-600">평당 6,000원 ~ 9,000원</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">상가 청소</h3>
                  <p className="text-gray-600">평당 5,000원 ~ 8,000원</p>
                </div>
              </div>
            </div>

            {/* 계단청소 요금 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">계단청소 요금</h2>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="text-xl font-semibold mb-2">빌라 청소</h3>
                  <p className="text-gray-600">층당 10,000원 ~ 15,000원</p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="text-xl font-semibold mb-2">아파트 청소</h3>
                  <p className="text-gray-600">층당 12,000원 ~ 18,000원</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">상가 청소</h3>
                  <p className="text-gray-600">층당 15,000원 ~ 20,000원</p>
                </div>
              </div>
            </div>
          </div>

          {/* 안내사항 */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">안내사항</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• 위 요금은 기본 요금이며, 현장 상황에 따라 변동될 수 있습니다.</li>
              <li>• 정기청소는 월 4회 기준입니다.</li>
              <li>• 계단청소는 주 1회 기준입니다.</li>
              <li>• 대형 건물의 경우 별도 협의 후 요금이 결정됩니다.</li>
              <li>• 청소 시간은 평균 2-3시간 소요됩니다.</li>
            </ul>
          </div>

          {/* 문의하기 버튼 */}
          <div className="mt-12 text-center">
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              상담 문의하기
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 