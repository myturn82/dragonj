'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: '',
    location: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 폼 제출 로직을 추가할 수 있습니다
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-12">
      <section className="py-12">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-center mb-12">문의하기</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이름 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 전화번호 */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                전화번호
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 서비스 유형 */}
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                서비스 유형
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">선택해주세요</option>
                <option value="정기청소">정기청소</option>
                <option value="계단청소">계단청소</option>
                <option value="기타">기타</option>
              </select>
            </div>

            {/* 위치 */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                위치
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="예: 서울시 강남구"
              />
            </div>

            {/* 문의 내용 */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                문의 내용
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="상세한 문의 내용을 입력해주세요."
              />
            </div>

            {/* 제출 버튼 */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                문의하기
              </button>
            </div>
          </form>

          {/* 문의 안내 */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">문의 안내</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• 문의하신 내용은 빠른 시일 내에 답변드리겠습니다.</li>
              <li>• 전화 문의: 02-123-4567</li>
              <li>• 이메일: contact@dhcleaning.com</li>
              <li>• 운영시간: 평일 09:00 ~ 18:00</li>
              <li>• 주말 및 공휴일은 휴무입니다.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
} 