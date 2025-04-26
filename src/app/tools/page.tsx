'use client';

export default function ToolsPage() {
  return (
    <div className="space-y-12">
      <section className="py-12">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-12">작업도구</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 청소 도구 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">청소 도구</h2>
              <ul className="space-y-3 text-gray-600">
                <li>• 고압세척기</li>
                <li>• 진공청소기</li>
                <li>• 스팀청소기</li>
                <li>• 마루광택기</li>
                <li>• 카펫청소기</li>
                <li>• 유리청소기</li>
              </ul>
            </div>

            {/* 세척제 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">세척제</h2>
              <ul className="space-y-3 text-gray-600">
                <li>• 바닥세척제</li>
                <li>• 유리세척제</li>
                <li>• 욕실세척제</li>
                <li>• 주방세척제</li>
                <li>• 카펫세척제</li>
                <li>• 곰팡이제거제</li>
              </ul>
            </div>

            {/* 보호장비 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">보호장비</h2>
              <ul className="space-y-3 text-gray-600">
                <li>• 마스크</li>
                <li>• 장갑</li>
                <li>• 보안경</li>
                <li>• 작업복</li>
                <li>• 안전화</li>
                <li>• 방음이어폰</li>
              </ul>
            </div>
          </div>

          {/* 작업 과정 */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">작업 과정</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>현장 방문 및 청소 범위 확인</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>필요한 도구 및 세척제 준비</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>보호장비 착용 및 안전 점검</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span>체계적인 청소 작업 진행</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">5.</span>
                  <span>작업 완료 후 최종 점검</span>
                </li>
              </ol>
            </div>
          </div>

          {/* 안전 관리 */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">안전 관리</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-3 text-gray-600">
                <li>• 모든 작업자는 정기적인 안전 교육을 이수합니다.</li>
                <li>• 작업 전 안전 점검을 철저히 실시합니다.</li>
                <li>• 위험물질 취급 시 보호장비를 필수로 착용합니다.</li>
                <li>• 작업 중 발생할 수 있는 사고에 대비한 응급처치 키트를 상시 비치합니다.</li>
                <li>• 고객의 안전을 최우선으로 생각합니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 