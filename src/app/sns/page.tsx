'use client';

export default function SNSPage() {
  return (
    <div className="space-y-12">
      <section className="py-12">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-12">SNS</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 네이버 블로그 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">네이버 블로그</h2>
              <p className="text-gray-600 mb-4">
                청소 팁, 작업 후기, 이벤트 등 다양한 정보를 공유합니다.
              </p>
              <a
                href="https://blog.naver.com/dhcleaning"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                블로그 바로가기
              </a>
            </div>

            {/* 네이버 카페 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">네이버 카페</h2>
              <p className="text-gray-600 mb-4">
                고객님들과 소통하는 공간입니다. 다양한 이벤트와 혜택이 있습니다.
              </p>
              <a
                href="https://cafe.naver.com/dhcleaning"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition"
              >
                카페 바로가기
              </a>
            </div>

            {/* 페이스북 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">페이스북</h2>
              <p className="text-gray-600 mb-4">
                실시간 업데이트와 작업 사진을 공유합니다.
              </p>
              <a
                href="https://facebook.com/dhcleaning"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                페이스북 바로가기
              </a>
            </div>

            {/* 네이버 밴드 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">네이버 밴드</h2>
              <p className="text-gray-600 mb-4">
                정기적인 소식과 이벤트를 빠르게 받아보세요.
              </p>
              <a
                href="https://band.us/band/dhcleaning"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
              >
                밴드 바로가기
              </a>
            </div>
          </div>

          {/* SNS 이용 안내 */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">SNS 이용 안내</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• 각 SNS 채널에서 다양한 이벤트와 혜택을 제공합니다.</li>
              <li>• 실시간으로 업데이트되는 청소 팁과 정보를 확인할 수 있습니다.</li>
              <li>• 고객님들의 의견과 피드백을 적극적으로 받고 있습니다.</li>
              <li>• 문의사항은 각 SNS 채널을 통해 편하게 연락주세요.</li>
            </ul>
          </div>

          {/* 문의하기 버튼 */}
          <div className="mt-12 text-center">
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              문의하기
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 