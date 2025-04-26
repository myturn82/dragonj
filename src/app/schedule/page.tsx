'use client';

import { useState } from 'react';

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 예시 스케줄 데이터
  const schedules = [
    {
      date: '2024-03-20',
      time: '09:00',
      location: '서울시 강남구',
      type: '정기청소',
      status: '예정'
    },
    {
      date: '2024-03-20',
      time: '14:00',
      location: '서울시 서초구',
      type: '계단청소',
      status: '예정'
    },
    {
      date: '2024-03-21',
      time: '10:00',
      location: '서울시 송파구',
      type: '정기청소',
      status: '예정'
    }
  ];

  return (
    <div className="space-y-12">
      <section className="py-12">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-12">스케줄</h1>
          
          {/* 달력 */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">달력</h2>
            <div className="grid grid-cols-7 gap-2">
              {/* 요일 표시 */}
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <div key={day} className="text-center font-bold py-2">
                  {day}
                </div>
              ))}
              {/* 달력 날짜 */}
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date(selectedDate);
                date.setDate(1);
                date.setDate(date.getDate() - date.getDay() + i);
                return (
                  <div
                    key={i}
                    className={`text-center py-2 cursor-pointer ${
                      date.getMonth() === selectedDate.getMonth()
                        ? 'text-gray-800'
                        : 'text-gray-400'
                    } ${
                      date.toDateString() === new Date().toDateString()
                        ? 'bg-blue-100 rounded'
                        : ''
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 스케줄 목록 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">스케줄 목록</h2>
            <div className="space-y-4">
              {schedules.map((schedule, index) => (
                <div
                  key={index}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {schedule.type} - {schedule.location}
                      </h3>
                      <p className="text-gray-600">
                        {schedule.date} {schedule.time}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      schedule.status === '예정'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {schedule.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 스케줄 안내 */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">스케줄 안내</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• 스케줄은 최소 3일 전에 예약해주세요.</li>
              <li>• 예약 변경은 최소 24시간 전에 연락주세요.</li>
              <li>• 긴급 청소는 별도 문의 바랍니다.</li>
              <li>• 정기청소는 월 4회 기준입니다.</li>
              <li>• 계단청소는 주 1회 기준입니다.</li>
            </ul>
          </div>

          {/* 문의하기 버튼 */}
          <div className="mt-12 text-center">
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              스케줄 문의하기
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 