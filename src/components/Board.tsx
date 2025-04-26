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
      author: '익명',
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
      author: '익명',
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
    <div className="p-4">
      <h1>게시판</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          required
        />
        <textarea
          placeholder="내용"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          rows={4}
          required
        />
        <button type="submit">게시하기</button>
      </form>

      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.author} • {post.date}</p>
            <p>{post.content}</p>
            
            <form onSubmit={(e) => handleCommentSubmit(post.id, e)}>
              <input
                type="text"
                placeholder="댓글"
                value={newComment[post.id] || ''}
                onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                required
              />
              <button type="submit">댓글</button>
            </form>

            <div>
              {post.comments.map((comment) => (
                <div key={comment.id}>
                  <p>{comment.author} • {comment.date}</p>
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div>아직 게시글이 없습니다.</div>
        )}
      </div>
    </div>
  );
} 