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
        <div className="bg-white px-2 sm:px-6 py-2">
          <table className="w-full border-t border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-2 text-left font-semibold">제목</th>
                <th className="py-2 px-2 text-left font-semibold">작성자</th>
                <th className="py-2 px-2 text-left font-semibold">날짜</th>
                <th className="py-2 px-2 text-left font-semibold">상태</th>
                <th className="py-2 px-2 text-left font-semibold">기능</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 px-2 align-top whitespace-pre-line">{inquiry.subject}</td>
                  <td className="py-2 px-2 align-top">{inquiry.name}</td>
                  <td className="py-2 px-2 align-top text-xs text-gray-500">{new Date(inquiry.created_at).toLocaleDateString()}</td>
                  <td className="py-2 px-2 align-top">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      inquiry.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : inquiry.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {inquiry.status === 'pending' ? '대기중' : inquiry.status === 'in_progress' ? '처리중' : '완료'}
                    </span>
                  </td>
                  <td className="py-2 px-2 align-top">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(inquiry)} className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100">수정</button>
                      <button onClick={() => handleDelete(inquiry.id)} className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100">삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 