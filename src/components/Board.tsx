'use client';

import { useState } from 'react';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  comments: Comment[];
}

interface Comment {
  id: number;
  content: string;
  author: string;
  date: string;
}

export default function Board() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const post: Post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: '송연우',
      date: new Date().toLocaleDateString(),
      comments: [],
    };
    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '' });
  };

  const handleCommentSubmit = (postId: number, e: React.FormEvent) => {
    e.preventDefault();
    const commentContent = newComment[postId];
    if (!commentContent) return;

    const comment: Comment = {
      id: Date.now(),
      content: commentContent,
      author: '송연우',
      date: new Date().toLocaleDateString(),
    };

    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: [comment, ...post.comments] }
        : post
    ));
    setNewComment({ ...newComment, [postId]: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 구글 스타일 헤더 */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
          <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="#4285F4">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
          <h1 className="text-xl font-normal text-gray-800">게시판</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 글쓰기 폼 */}
        <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="제목"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="내용을 입력하세요"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                게시하기
              </button>
            </div>
          </form>
        </div>

        {/* 게시글 목록 */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-2">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {post.author} • {post.date}
                </p>
                <p className="text-gray-800 mb-6">{post.content}</p>
                
                {/* 댓글 섹션 */}
                <div className="border-t pt-4">
                  <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="댓글을 입력하세요"
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                        className="flex-1 px-4 py-2 text-gray-800 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        댓글
                      </button>
                    </div>
                  </form>

                  {/* 댓글 목록 */}
                  <div className="space-y-3">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded p-4">
                        <p className="text-sm text-gray-500 mb-1">
                          {comment.author} • {comment.date}
                        </p>
                        <p className="text-gray-800">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500">아직 게시글이 없습니다. 첫 게시글을 작성해보세요!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 