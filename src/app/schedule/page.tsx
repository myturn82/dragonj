'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { KOREAN_HOLIDAYS_2024 } from '@/lib/koreanHolidays';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function getMonthMatrix(year: number, month: number) {
  // month: 0-indexed
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix = [];
  let week = [];
  let day = new Date(firstDay);
  day.setDate(day.getDate() - day.getDay()); // start from Sunday of the first week
  for (let i = 0; i < 6 * 7; i++) {
    week.push(new Date(day));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
    day.setDate(day.getDate() + 1);
  }
  return matrix;
}

// 30분 단위 시간 옵션 생성
const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

export default function SchedulePage() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [yearlyView, setYearlyView] = useState(false);
  const [schedules, setSchedules] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const [userId, setUserId] = useState<string | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthMatrix = getMonthMatrix(year, month);

  // 휴일 데이터 (2024년만 예시)
  const holidays = KOREAN_HOLIDAYS_2024.reduce((acc, h) => {
    acc[h.date] = h.name;
    return acc;
  }, {} as Record<string, string>);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    }
    fetchUser();
  }, []);

  // 일정 불러오기 (userId가 있을 때만)
  useEffect(() => {
    if (!userId) return;
    async function fetchSchedules() {
      const { data, error } = await supabase.from('schedules').select('*').eq('user_id', userId);
      if (!error && data) {
        const byDate: Record<string, any[]> = {};
        data.forEach(sch => {
          const d = sch.start_date;
          if (!byDate[d]) byDate[d] = [];
          byDate[d].push(sch);
        });
        setSchedules(byDate);
      }
    }
    fetchSchedules();
  }, [userId]);

  function formatDate(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function handlePrevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }
  function handleNextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }
  function handleToday() {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  function handleDateClick(date: Date) {
    setSelectedDate(date);
    setShowInput(true);
    setInputValue('');
    setStartTime('09:00');
    setEndTime('10:00');
  }

  async function handleAddSchedule() {
    if (!selectedDate || !inputValue.trim() || !userId) return;
    setLoading(true);
    const dateStr = formatDate(selectedDate);
    const { error, data } = await supabase.from('schedules').insert([
      {
        user_id: userId,
        start_date: dateStr,
        end_date: dateStr,
        start_time: startTime,
        end_time: endTime,
        title: inputValue,
        color: 'blue',
      },
    ]).select();
    setLoading(false);
    if (!error && data && data.length > 0) {
      setSchedules(prev => ({
        ...prev,
        [dateStr]: [...(prev[dateStr] || []), data[0]],
      }));
      setShowInput(false);
      setInputValue('');
      setSelectedDate(null);
    } else {
      alert('일정 저장 실패: ' + (error?.message || ''));
    }
  }

  // 연속 일정(멀티데이) 렌더링 보조 함수
  function getMultiDaySchedules(schedules: Record<string, any[]>, matrix: Date[][]) {
    // 각 주(행)별로, 각 날짜에 걸친 멀티데이 일정 바를 계산
    const bars: any[] = [];
    Object.values(schedules).flat().forEach(sch => {
      const start = new Date(sch.start_date);
      const end = new Date(sch.end_date);
      for (let weekIdx = 0; weekIdx < matrix.length; weekIdx++) {
        const week = matrix[weekIdx];
        const weekStart = week[0];
        const weekEnd = week[6];
        // 이 주에 일정이 걸쳐 있으면 바 추가
        if (end >= weekStart && start <= weekEnd) {
          const barStart = start > weekStart ? start : weekStart;
          const barEnd = end < weekEnd ? end : weekEnd;
          bars.push({
            weekIdx,
            startCol: barStart.getDay(),
            endCol: barEnd.getDay(),
            title: sch.title,
            color: sch.color || 'bg-blue-500',
          });
        }
      }
    });
    return bars;
  }

  // 연간 뷰 렌더링
  if (yearlyView) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-2">
        <div className="flex items-center justify-between mb-6">
          <span className="text-2xl font-bold cursor-pointer" onClick={() => setYearlyView(false)}>
            {year}년 연간 달력 <span className="ml-2 text-base text-blue-500 underline">월간 보기로</span>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }, (_, m) => {
            const matrix = getMonthMatrix(year, m);
            return (
              <div key={m} className="bg-white rounded-lg shadow p-2 cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
                onClick={() => {
                  setViewDate(new Date(year, m, 1));
                  setYearlyView(false);
                }}
              >
                <div className="text-center font-bold mb-2 text-lg">{year}년 {m + 1}월</div>
                <div className="grid grid-cols-7 border-t border-l rounded-t overflow-hidden">
                  {WEEKDAYS.map((d, i) => (
                    <div key={d} className={`py-1 text-center font-bold border-b border-r select-none text-xs ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-700'}`}>{d}</div>
                  ))}
                  {matrix.flat().map((date, idx) => {
                    const isThisMonth = date.getMonth() === m;
                    const isToday = formatDate(date) === formatDate(today);
                    const holidayName = holidays[formatDate(date)];
                    const daySchedules = schedules[formatDate(date)] || [];
                    return (
                      <div
                        key={idx}
                        className={`h-14 p-0.5 border-b border-r align-top relative transition-all text-xs
                          ${isThisMonth ? '' : 'bg-gray-50 text-gray-300'}
                          ${isToday ? 'border-2 border-blue-400 z-10' : ''}
                        `}
                      >
                        <div className="flex items-center gap-0.5">
                          <span className={`font-bold ${date.getDay() === 0 ? 'text-red-500' : date.getDay() === 6 ? 'text-blue-500' : ''}`}>{date.getDate()}</span>
                          {holidayName && <span className="ml-0.5 text-[9px] px-0.5 py-0.5 rounded bg-red-100 text-red-600 font-semibold">{holidayName}</span>}
                        </div>
                        <div className="mt-0.5 space-y-0.5">
                          {daySchedules.map((s, i) => (
                            <div key={i} className={`truncate px-0.5 py-0.5 rounded text-[10px] font-medium ${s.color}`}>{s.title} <span className="text-gray-400">{s.start_time}~{s.end_time}</span></div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 월간 뷰 렌더링
  return (
    <div className="max-w-5xl mx-auto py-8 px-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={handleToday} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 font-semibold">오늘</button>
          <button onClick={handlePrevMonth} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-2xl">&#60;</button>
          <button onClick={handleNextMonth} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-2xl">&#62;</button>
          <span className="ml-4 text-xl font-bold">
            <span className="cursor-pointer hover:underline" onClick={() => setYearlyView(true)}>{year}년</span> {month + 1}월
          </span>
        </div>
      </div>
      <div className="grid grid-cols-7 border-t border-l bg-white rounded-t-lg overflow-hidden">
        {WEEKDAYS.map((d, i) => (
          <div key={d} className={`py-2 text-center font-bold border-b border-r select-none ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-700'}`}>{d}</div>
        ))}
        {monthMatrix.flat().map((date, idx) => {
          const isThisMonth = date.getMonth() === month;
          const isToday = formatDate(date) === formatDate(today);
          const isSelected = selectedDate && formatDate(date) === formatDate(selectedDate);
          const holidayName = holidays[formatDate(date)];
          const daySchedules = schedules[formatDate(date)] || [];
          return (
            <div
              key={idx}
              className={`h-28 p-1 border-b border-r align-top relative cursor-pointer group transition-all
                ${isThisMonth ? '' : 'bg-gray-50 text-gray-300'}
                ${isToday ? 'border-2 border-blue-400 z-10' : ''}
                ${isSelected ? 'bg-blue-50' : ''}
              `}
              onClick={() => isThisMonth && handleDateClick(date)}
            >
              <div className="flex items-center gap-1">
                <span className={`text-xs font-bold ${date.getDay() === 0 ? 'text-red-500' : date.getDay() === 6 ? 'text-blue-500' : ''}`}>{date.getDate()}</span>
                {holidayName && <span className="ml-1 text-[10px] px-1 py-0.5 rounded bg-red-100 text-red-600 font-semibold">{holidayName}</span>}
              </div>
              <div className="mt-1 space-y-1">
                {daySchedules.map((s, i) => (
                  <div key={i} className="truncate px-1 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-2">
                    <button
                      type="button"
                      style={{
                        width: '16px',
                        height: '16px',
                        minWidth: '16px',
                        minHeight: '16px',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        background: 'none',
                        boxShadow: 'none',
                        lineHeight: 1,
                        overflow: 'hidden',
                        flexShrink: 0,
                        marginRight: '2px'
                      }}
                      title="삭제"
                      aria-label="삭제"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!window.confirm('정말 삭제하시겠습니까?')) return;
                        if (!s.id) return alert('DB id 없음');
                        const { error } = await supabase.from('schedules').delete().eq('id', s.id).eq('user_id', userId);
                        if (!error) {
                          setSchedules(prev => {
                            const arr = (prev[formatDate(date)] || []).filter(item => item.id !== s.id);
                            return { ...prev, [formatDate(date)]: arr };
                          });
                        } else {
                          alert('삭제 실패: ' + error.message);
                        }
                      }}
                    >
                      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="4" y1="4" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="12" y1="4" x2="4" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <span>{s.title} <span className="text-gray-400">{s.start_time}~{s.end_time}</span></span>
                  </div>
                ))}
              </div>
              {isSelected && showInput && (
                <div
                  className="absolute left-0 top-8 w-[320px] max-w-[95vw] bg-white border rounded shadow-lg z-20 p-4 animate-fade-in"
                  onClick={e => e.stopPropagation()}
                >
                  <textarea
                    className="border px-3 py-2 rounded w-full text-sm mb-3 resize-y min-h-[56px]"
                    placeholder="일정 제목/내용 입력..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2 mb-3">
                    <select
                      className="border rounded px-3 py-2 text-sm min-w-[90px]"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                    >
                      {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span className="self-center text-xs">~</span>
                    <select
                      className="border rounded px-3 py-2 text-sm min-w-[90px]"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                    >
                      {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={handleAddSchedule} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-semibold min-w-[60px]">{loading ? '저장중...' : '추가'}</button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setShowInput(false);
                        setInputValue('');
                        setSelectedDate(null);
                      }}
                      className="bg-gray-200 px-4 py-2 rounded text-sm font-semibold min-w-[60px]"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 