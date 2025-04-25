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
      author: '사용자',
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
      author: '사용자',
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
    <div className="relative min-h-screen">
      {/* 바다 배경 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
        }}
      />
      
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-blue-800/30 to-blue-900/50" />
      
      {/* 컨텐츠 */}
      <div className="relative z-10 p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">게시판</h2>
        
        {/* 글쓰기 폼 */}
        <form onSubmit={handleSubmit} className="mb-8 bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
          <div className="mb-4">
            <input
              type="text"
              placeholder="제목"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full p-4 bg-white/10 rounded text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="내용"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full p-4 bg-white/10 rounded text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              rows={4}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 transition"
          >
            게시하기
          </button>
        </form>

        {/* 게시글 목록 */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-white/20">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{post.title}</h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                {post.author} • {post.date}
              </p>
              <p className="text-gray-200 text-sm sm:text-base mb-4">{post.content}</p>
              
              {/* 댓글 작성 폼 */}
              <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="댓글을 입력하세요"
                    value={newComment[post.id] || ''}
                    onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                    className="flex-1 p-2 bg-white/10 rounded text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition"
                  >
                    댓글
                  </button>
                </div>
              </form>

              {/* 댓글 목록 */}
              <div className="space-y-3 mt-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="bg-white/5 p-3 rounded border border-white/10">
                    <p className="text-gray-300 text-xs mb-1">
                      {comment.author} • {comment.date}
                    </p>
                    <p className="text-gray-200 text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center text-gray-300 py-6 sm:py-8">
              아직 게시글이 없습니다. 첫 게시글을 작성해보세요!
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 