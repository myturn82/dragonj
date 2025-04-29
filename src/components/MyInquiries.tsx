'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: string;
}

export default function MyInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Inquiry>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      fetchInquiries(session.user.email!);
    };

    checkAuth();
  }, [router]);

  const fetchInquiries = async (email: string) => {
    setStatus('loading');
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
      setStatus('idle');
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setStatus('error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setInquiries(inquiries.filter(inquiry => inquiry.id !== id));
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = (inquiry: Inquiry) => {
    setEditingId(inquiry.id);
    setEditForm({
      subject: inquiry.subject,
      message: inquiry.message
    });
  };

  const handleUpdate = async (id: number) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update(editForm)
        .eq('id', id);

      if (error) throw error;
      
      setInquiries(inquiries.map(inquiry => 
        inquiry.id === id 
          ? { ...inquiry, ...editForm }
          : inquiry
      ));
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating inquiry:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">내 문의 내역</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push('/contact')}
            className="text-indigo-600 hover:text-indigo-800"
          >
            새 문의 작성
          </button>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800"
          >
            로그아웃
          </button>
        </div>
      </div>

      {status === 'error' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          오류가 발생했습니다. 다시 시도해주세요.
        </div>
      )}

      {status === 'loading' ? (
        <div className="text-center">로딩 중...</div>
      ) : inquiries.length === 0 ? (
        <div className="text-center text-gray-500">문의 내역이 없습니다.</div>
      ) : (
        <div className="space-y-6">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="border rounded-lg p-4">
              {editingId === inquiry.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">제목</label>
                    <input
                      type="text"
                      value={editForm.subject}
                      onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">내용</label>
                    <textarea
                      value={editForm.message}
                      onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdate(inquiry.id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{inquiry.subject}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(inquiry.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(inquiry)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{inquiry.message}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      inquiry.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {inquiry.status === 'pending' ? '처리 중' : '답변 완료'}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 