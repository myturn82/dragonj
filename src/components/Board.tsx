'use client';

import { useState } from 'react';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

export default function Board() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const post: Post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: '사용자',
      date: new Date().toLocaleDateString(),
    };
    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '' });
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">게시판</h2>
      
      {/* 글쓰기 폼 */}
      <form onSubmit={handleSubmit} className="mb-8 bg-black/50 p-6 rounded-lg">
        <div className="mb-4">
          <input
            type="text"
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full p-4 bg-gray-800 rounded text-white placeholder-gray-400 border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="내용"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="w-full p-4 bg-gray-800 rounded text-white placeholder-gray-400 border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-3 rounded font-medium hover:bg-red-700 transition"
        >
          게시하기
        </button>
      </form>

      {/* 게시글 목록 */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-black/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
            <p className="text-gray-400 text-sm mb-4">
              {post.author} • {post.date}
            </p>
            <p className="text-gray-300">{post.content}</p>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            아직 게시글이 없습니다. 첫 게시글을 작성해보세요!
          </div>
        )}
      </div>
    </div>
  );
} 