'use client';

import { useState } from 'react';

interface Review {
  id: number;
  author: string;
  date: string;
  rating: number;
  content: string;
  serviceType: string;
}

export default function ReviewsPage() {
  const [reviews] = useState<Review[]>([
    {
      id: 1,
      author: '김서울',
      date: '2024-03-15',
      rating: 5,
      content: '정말 깔끔하게 잘 해주셨습니다. 특히 욕실 청소가 정말 만족스러웠어요. 다음에도 꼭 부탁드리겠습니다.',
      serviceType: '정기청소'
    },
    {
      id: 2,
      author: '이강남',
      date: '2024-03-10',
      rating: 4,
      content: '계단 청소를 부탁했는데, 시간 약속을 잘 지키시고 깔끔하게 해주셨습니다. 다만 가격이 조금 비싸다는 생각이 들었어요.',
      serviceType: '계단청소'
    },
    {
      id: 3,
      author: '박서초',
      date: '2024-03-05',
      rating: 5,
      content: '사무실 정기 청소를 맡겼는데, 직원분들이 매우 친절하시고 전문적으로 일해주셔서 만족스러웠습니다.',
      serviceType: '정기청소'
    }
  ]);

  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    content: '',
    serviceType: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 리뷰 제출 로직을 추가할 수 있습니다
    console.log('New review:', newReview);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-12">
      <section className="py-12">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-12">이용후기</h1>
          
          {/* 리뷰 목록 */}
          <div className="space-y-8 mb-12">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{review.author}</h3>
                    <p className="text-gray-500 text-sm">{review.date}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span>{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{review.content}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
                  {review.serviceType}
                </span>
              </div>
            ))}
          </div>

          {/* 리뷰 작성 폼 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">리뷰 작성</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={newReview.author}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                  서비스 유형
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={newReview.serviceType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">선택해주세요</option>
                  <option value="정기청소">정기청소</option>
                  <option value="계단청소">계단청소</option>
                </select>
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  평점
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={newReview.rating}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="5">5점</option>
                  <option value="4">4점</option>
                  <option value="3">3점</option>
                  <option value="2">2점</option>
                  <option value="1">1점</option>
                </select>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  후기 내용
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={newReview.content}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="서비스 이용 후기를 작성해주세요."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  후기 작성하기
                </button>
              </div>
            </form>
          </div>

          {/* 리뷰 안내 */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">리뷰 작성 안내</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• 실제 이용 경험을 바탕으로 솔직한 후기를 작성해주세요.</li>
              <li>• 욕설, 비방, 광고성 내용은 삭제될 수 있습니다.</li>
              <li>• 개인정보 보호를 위해 실명 대신 닉네임을 사용해주세요.</li>
              <li>• 서비스 개선을 위한 소중한 의견 감사합니다.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
} 