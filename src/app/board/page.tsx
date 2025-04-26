'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  comments: number;
}

export default function BoardPage() {
  const [posts] = useState<Post[]>([
    {
      id: 1,
      title: '청소 서비스 이용 후기',
      author: '김서울',
      date: '2024-03-15',
      content: '정말 깔끔하게 잘 해주셨습니다. 특히 욕실 청소가 정말 만족스러웠어요.',
      comments: 3
    },
    {
      id: 2,
      title: '계단 청소 서비스 문의',
      author: '이강남',
      date: '2024-03-14',
      content: '아파트 계단 청소 서비스에 대해 문의드립니다.',
      comments: 1
    },
    {
      id: 3,
      title: '정기 청소 서비스 후기',
      author: '박서초',
      date: '2024-03-13',
      content: '매월 정기적으로 이용하고 있는데 항상 만족스럽습니다.',
      comments: 2
    }
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">게시판</h1>
        <Link 
          href="/board/write"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          글쓰기
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">댓글</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      href={`/board/${post.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.comments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center space-x-2">
        <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">
          1
        </button>
        <button className="px-3 py-1 rounded hover:bg-gray-200">
          2
        </button>
        <button className="px-3 py-1 rounded hover:bg-gray-200">
          3
        </button>
      </div>
    </div>
  );
} 