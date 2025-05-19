'use client';

import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fetchKoreanHolidays } from '@/lib/koreanHolidays';

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

// 1. 달력 테이블 스타일 고정
const calendarTableStyle = {
  tableLayout: 'fixed',
  width: '100%',
};
const cellStyle = {
  height: '64px',
  minWidth: '80px',
  verticalAlign: 'top',
  padding: '4px',
};

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
  const [holidays, setHolidays] = useState<Record<string, string>>({});
  const [editSchedule, setEditSchedule] = useState<any | null>(null);
  const [editInputValue, setEditInputValue] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editStartTime, setEditStartTime] = useState('09:00');
  const [editEndTime, setEditEndTime] = useState('10:00');
  const [editLoading, setEditLoading] = useState(false);
  const [inputStartDate, setInputStartDate] = useState('');
  const [inputEndDate, setInputEndDate] = useState('');
  const [inputColor, setInputColor] = useState('blue');
  const [editColor, setEditColor] = useState('blue');
  const colorOptions = [
    { value: 'blue', label: '파랑', className: 'bg-blue-100 text-blue-700' },
    { value: 'red', label: '빨강', className: 'bg-red-100 text-red-700' },
    { value: 'green', label: '초록', className: 'bg-green-100 text-green-700' },
    { value: 'yellow', label: '노랑', className: 'bg-yellow-100 text-yellow-700' },
    { value: 'purple', label: '보라', className: 'bg-purple-100 text-purple-700' },
    { value: 'gray', label: '회색', className: 'bg-gray-200 text-gray-700' },
  ];
  const [inputRepeat, setInputRepeat] = useState('none');
  const [editRepeat, setEditRepeat] = useState('none');
  const repeatOptions = [
    { value: 'none', label: '반복 없음' },
    { value: 'weekly', label: '매주 반복' },
    { value: 'monthly', label: '매월 반복' },
  ];
  const [detailSchedule, setDetailSchedule] = useState<any | null>(null);
  const [detailEditMode, setDetailEditMode] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  // 드래그 상태 관리
  const [draggedSchedule, setDraggedSchedule] = useState<any | null>(null);
  // 이미 알림 보낸 일정 id 저장
  const notifiedIds = useRef<Set<any>>(new Set());
  const [inputTimeMode, setInputTimeMode] = useState<'select' | 'manual'>('select');
  const [editTimeMode, setEditTimeMode] = useState<'select' | 'manual'>('select');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthMatrix = getMonthMatrix(year, month);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function loadHolidays() {
      try {
        const year = viewDate.getFullYear();
        const holidaysArr = await fetchKoreanHolidays(year);
        const holidaysObj = holidaysArr.reduce((acc, h) => {
          acc[h.date] = h.name;
          return acc;
        }, {} as Record<string, string>);
        setHolidays(holidaysObj);
      } catch (e) {
        setHolidays({});
      }
    }
    loadHolidays();
  }, [viewDate]);

  // 일정 불러오기 (userId가 있을 때만)
  useEffect(() => {
    if (!userId) return;
    async function fetchSchedules() {
      const { data, error } = await supabase.from('schedules').select('*').eq('user_id', userId);
      if (!error && data) {
        const byDate: Record<string, any[]> = {};
        data.forEach(sch => {
          // 시작~종료 날짜 모두에 이 일정을 넣는다
          let d = new Date(sch.start_date);
          const end = new Date(sch.end_date);
          while (d <= end) {
            const key = formatDate(d);
            if (!byDate[key]) byDate[key] = [];
            byDate[key].push(sch);
            d.setDate(d.getDate() + 1);
          }
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
    setInputStartDate(formatDate(date));
    setInputEndDate(formatDate(date));
  }

  async function handleAddSchedule() {
    if (!inputStartDate || !inputEndDate || !inputValue.trim() || !userId) return;
    setLoading(true);
    let inserts = [];
    if (inputRepeat === 'none') {
      inserts.push({
        user_id: userId,
        start_date: inputStartDate,
        end_date: inputEndDate,
        start_time: startTime,
        end_time: endTime,
        title: inputValue,
        color: inputColor,
      });
    } else {
      // 반복 일정 생성 (최대 12회)
      let start = new Date(inputStartDate);
      let end = new Date(inputEndDate);
      for (let i = 0; i < 12; i++) {
        const s = new Date(start);
        const e = new Date(end);
        if (inputRepeat === 'weekly') {
          s.setDate(s.getDate() + 7 * i);
          e.setDate(e.getDate() + 7 * i);
        } else if (inputRepeat === 'monthly') {
          s.setMonth(s.getMonth() + i);
          e.setMonth(e.getMonth() + i);
        }
        inserts.push({
          user_id: userId,
          start_date: formatDate(s),
          end_date: formatDate(e),
          start_time: startTime,
          end_time: endTime,
          title: inputValue,
          color: inputColor,
        });
      }
    }
    const { error, data } = await supabase.from('schedules').insert(inserts).select();
    setLoading(false);
    if (!error && data && data.length > 0) {
      // 저장 후 DB에서 다시 fetch
      if (userId) {
        const { data: newData, error: fetchError } = await supabase.from('schedules').select('*').eq('user_id', userId);
        if (!fetchError && newData) {
          const byDate: Record<string, any[]> = {};
          newData.forEach(sch => {
            let d = new Date(sch.start_date);
            const end = new Date(sch.end_date);
            while (d <= end) {
              const key = formatDate(d);
              if (!byDate[key]) byDate[key] = [];
              byDate[key].push(sch);
              d.setDate(d.getDate() + 1);
            }
          });
          setSchedules(byDate);
        }
      }
      setShowInput(false);
      setInputValue('');
      setSelectedDate(null);
      setInputColor('blue');
      setInputRepeat('none');
    } else {
      alert('일정 저장 실패: ' + (error?.message || ''));
    }
  }

  // 1. 월간 뷰에서 멀티데이 스케줄 연속 bar 계산
  function getMultiDayBars(schedules: Record<string, any[]>, matrix: Date[][]) {
    // 각 주(행)별로, 각 날짜에 걸친 멀티데이 일정 바를 계산
    const bars: any[] = [];
    const seen = new Set();
    Object.values(schedules).flat().forEach(sch => {
      if (seen.has(sch.id)) return;
      seen.add(sch.id);
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
            sch,
          });
        }
      }
    });
    return bars;
  }

  // 필터링된 일정만 렌더링
  const filteredSchedules = searchKeyword.trim() === '' ? schedules : (() => {
    const result: Record<string, any[]> = {};
    Object.keys(schedules).forEach(date => {
      result[date] = schedules[date].filter(sch => sch.title.toLowerCase().includes(searchKeyword.toLowerCase()));
    });
    return result;
  })();

  // 구글 캘린더 .ics 파일 업로드 핸들러 (직접 파싱)
  async function handleIcsUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const events = [];
    const vevents = text.split('BEGIN:VEVENT').slice(1);
    for (const vevent of vevents) {
      const summary = /SUMMARY:(.+)/.exec(vevent)?.[1]?.trim();
      const dtstart = /DTSTART(?:;[^:]+)?:([0-9T]+)/.exec(vevent)?.[1]?.trim();
      const dtend = /DTEND(?:;[^:]+)?:([0-9T]+)/.exec(vevent)?.[1]?.trim();
      if (summary && dtstart && dtend) {
        const start = dtstart.length >= 8 ? `${dtstart.slice(0,4)}-${dtstart.slice(4,6)}-${dtstart.slice(6,8)}` : '';
        const end = dtend.length >= 8 ? `${dtend.slice(0,4)}-${dtend.slice(4,6)}-${dtend.slice(6,8)}` : '';
        events.push({
          user_id: userId,
          start_date: start,
          end_date: end,
          start_time: '09:00',
          end_time: '10:00',
          title: summary,
          color: 'green',
        });
      }
    }
    if (events.length > 0) {
      const { error } = await supabase.from('schedules').insert(events);
      if (!error) {
        // UI 갱신
        if (userId) {
          const { data: newData, error: fetchError } = await supabase.from('schedules').select('*').eq('user_id', userId);
          if (!fetchError && newData) {
            const byDate: Record<string, any[]> = {};
            newData.forEach(sch => {
              let d = new Date(sch.start_date);
              const end = new Date(sch.end_date);
              while (d <= end) {
                const key = formatDate(d);
                if (!byDate[key]) byDate[key] = [];
                byDate[key].push(sch);
                d.setDate(d.getDate() + 1);
              }
            });
            setSchedules(byDate);
          }
        }
        alert('일정이 성공적으로 추가되었습니다!');
      } else {
        alert('DB 저장 실패: ' + error.message);
      }
    } else {
      alert('일정이 없습니다.');
    }
  }

  // 브라우저 알림 권한 요청 (최초 진입 시)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // 일정 시작 1분 전 알림
  useEffect(() => {
    if (!schedules || !userId) return;
    const interval = setInterval(() => {
      const now = new Date();
      Object.values(schedules).flat().forEach(sch => {
        if (!sch.start_date || !sch.start_time) return;
        const [h, m] = sch.start_time.split(':').map(Number);
        const start = new Date(sch.start_date + 'T' + sch.start_time);
        const diff = (start.getTime() - now.getTime()) / 60000; // 분 단위
        if (diff > 0 && diff <= 1 && !notifiedIds.current.has(sch.id)) {
          // 1분 전 이내에만 알림
          if (window.Notification && Notification.permission === 'granted') {
            new Notification('일정 알림', {
              body: `${sch.title}\n${sch.start_date} ${sch.start_time} 시작`,
            });
            notifiedIds.current.add(sch.id);
          }
        }
      });
    }, 60000); // 1분마다 체크
    return () => clearInterval(interval);
  }, [schedules, userId]);

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
                    const daySchedules = filteredSchedules[formatDate(date)] || [];
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
                            <div key={i} className={`truncate px-0.5 py-0.5 rounded text-[10px] font-medium ${s.color}`}>{s.title}</div>
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

  // 2. 월간 뷰 렌더링: 날짜 셀 내부에 bar(스케줄) 렌더링
  return (
    <div className="max-w-5xl mx-auto py-8 px-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handlePrevMonth} className="w-10 h-10 flex items-center justify-center rounded border border-gray-400 hover:bg-gray-200 text-2xl">&#60;</button>
          <button onClick={handleToday} className="w-10 h-10 flex items-center justify-center rounded border border-gray-400 hover:bg-gray-200 font-semibold">오늘</button>
          <button onClick={handleNextMonth} className="w-10 h-10 flex items-center justify-center rounded border border-gray-400 hover:bg-gray-200 text-2xl">&#62;</button>
          <span className="ml-4 text-xl font-bold">
            <span className="cursor-pointer hover:underline" onClick={() => setYearlyView(true)}>{year}년</span> {month + 1}월
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label className="bg-gray-200 px-3 py-2 rounded cursor-pointer text-sm font-semibold hover:bg-gray-300">
            구글 캘린더 가져오기
            <input type="file" accept=".ics" onChange={handleIcsUpload} className="hidden" />
          </label>
        </div>
        <input
          type="text"
          placeholder="일정 검색..."
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
          className="border rounded px-3 py-2 text-sm min-w-[120px] sm:min-w-[180px] ml-0 sm:ml-4 w-full sm:w-auto"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="bg-white rounded-t-lg overflow-hidden border-collapse min-w-[600px] w-full text-xs sm:text-sm" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              {WEEKDAYS.map((d, i) => (
                <th key={d} style={{ height: '64px', minWidth: '80px', verticalAlign: 'top', padding: '4px' }} className={`text-center font-bold border-b border-r select-none ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-700'}`}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthMatrix.map((week, weekIdx) => (
              <tr key={weekIdx}>
                {week.map((date, col) => {
                  const isThisMonth = date.getMonth() === month;
                  const isToday = formatDate(date) === formatDate(today);
                  const isSelected = selectedDate && formatDate(date) === formatDate(selectedDate);
                  const holidayName = holidays[formatDate(date)];
                  // 해당 날짜에 걸친 모든 bar(스케줄) 찾기
                  const dayBars = filteredSchedules[formatDate(date)] || [];
                  return (
                    <td
                      key={col}
                      style={{ height: '64px', minWidth: '80px', verticalAlign: 'top', padding: '4px' }}
                      className={`border-b border-r align-top group transition-all ${isThisMonth ? '' : 'bg-gray-50 text-gray-300'} ${isToday ? 'border-2 border-blue-400 z-10' : ''} ${isSelected ? 'bg-blue-50' : ''}`}
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedDate(date);
                        setShowInput(true);
                        setInputValue('');
                        setStartTime('09:00');
                        setEndTime('10:00');
                        setInputStartDate(formatDate(date));
                        setInputEndDate(formatDate(date));
                      }}
                      onDragOver={e => {
                        if (draggedSchedule) e.preventDefault();
                      }}
                      onDrop={async e => {
                        if (!draggedSchedule) return;
                        const oldStart = new Date(draggedSchedule.start_date);
                        const oldEnd = new Date(draggedSchedule.end_date);
                        const newStart = new Date(formatDate(date));
                        const diff = (oldEnd.getTime() - oldStart.getTime()) / (1000 * 60 * 60 * 24);
                        const newEnd = new Date(newStart);
                        newEnd.setDate(newEnd.getDate() + diff);
                        // DB 업데이트
                        const { error } = await supabase.from('schedules')
                          .update({
                            start_date: formatDate(newStart),
                            end_date: formatDate(newEnd),
                          })
                          .eq('id', draggedSchedule.id)
                          .eq('user_id', userId);
                        if (!error) {
                          // UI 갱신
                          if (userId) {
                            const { data: newData, error: fetchError } = await supabase.from('schedules').select('*').eq('user_id', userId);
                            if (!fetchError && newData) {
                              const byDate: Record<string, any[]> = {};
                              newData.forEach(sch => {
                                let d = new Date(sch.start_date);
                                const end = new Date(sch.end_date);
                                while (d <= end) {
                                  const key = formatDate(d);
                                  if (!byDate[key]) byDate[key] = [];
                                  byDate[key].push(sch);
                                  d.setDate(d.getDate() + 1);
                                }
                              });
                              setSchedules(byDate);
                            }
                          }
                        } else {
                          alert('이동 실패: ' + error.message);
                        }
                        setDraggedSchedule(null);
                      }}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <span className={`text-xs font-bold ${date.getDay() === 0 ? 'text-red-500' : date.getDay() === 6 ? 'text-blue-500' : ''}`}>{date.getDate()}</span>
                        {holidayName && <span className="ml-1 text-[10px] px-1 py-0.5 rounded bg-red-100 text-red-600 font-semibold">{holidayName}</span>}
                      </div>
                      <div className="flex flex-col gap-1">
                        {dayBars.map((sch, i) => {
                          const isStart = formatDate(date) === sch.start_date;
                          const isEnd = formatDate(date) === sch.end_date;
                          return (
                            <div
                              key={sch.id + '-' + i}
                              draggable
                              onDragStart={e => {
                                setDraggedSchedule(sch);
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                              onDragEnd={() => setDraggedSchedule(null)}
                              className={`text-xs font-medium px-2 py-1 truncate cursor-pointer flex-1 ${sch.color ? `bg-${sch.color}-100 text-${sch.color}-700` : 'bg-blue-100 text-blue-700'} ${isStart ? 'rounded-l-full' : ''} ${isEnd ? 'rounded-r-full' : ''}`}
                              style={{ margin: '1px 0', minHeight: '22px', borderRadius: isStart && isEnd ? '9999px' : isStart ? '9999px 0 0 9999px' : isEnd ? '0 9999px 9999px 0' : '0' }}
                              onClick={e => {
                                e.stopPropagation();
                                setDetailSchedule(sch);
                              }}
                            >
                              {sch.title}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showInput && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50"
          onClick={() => {
            setShowInput(false);
            setInputValue('');
            setSelectedDate(null);
          }}
        >
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">일정 추가</h3>
            <textarea
              className="border px-3 py-2 rounded w-full text-sm mb-3 resize-y min-h-[56px]"
              placeholder="일정 제목/내용 입력..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              autoFocus
            />
            <label className="block text-sm font-medium mb-1">기간</label>
            <div className="flex gap-2 mb-3">
              <input type="date" value={inputStartDate} onChange={e => setInputStartDate(e.target.value)} className="border rounded px-2 py-1" />
              <span className="self-center">~</span>
              <input type="date" value={inputEndDate} onChange={e => setInputEndDate(e.target.value)} className="border rounded px-2 py-1" />
            </div>
            <label className="block text-sm font-medium mb-1">시간</label>
            <div className="flex gap-2 mb-3 items-center">
              <button type="button" className={`px-2 py-1 rounded text-xs border ${inputTimeMode === 'select' ? 'bg-blue-100' : ''}`} onClick={() => setInputTimeMode('select')}>선택</button>
              <button type="button" className={`px-2 py-1 rounded text-xs border ${inputTimeMode === 'manual' ? 'bg-blue-100' : ''}`} onClick={() => setInputTimeMode('manual')}>직접입력</button>
            </div>
            <div className="flex gap-2 mb-3">
              {inputTimeMode === 'select' ? (
                <>
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
                </>
              ) : (
                <>
                  <input type="time" className="border rounded px-3 py-2 text-sm min-w-[90px]" value={startTime} onChange={e => setStartTime(e.target.value)} />
                  <span className="self-center text-xs">~</span>
                  <input type="time" className="border rounded px-3 py-2 text-sm min-w-[90px]" value={endTime} onChange={e => setEndTime(e.target.value)} />
                </>
              )}
            </div>
            <label className="block text-sm font-medium mb-1">색상</label>
            <select
              className="border rounded px-3 py-2 text-sm min-w-[90px] mb-3"
              value={inputColor}
              onChange={e => setInputColor(e.target.value)}
            >
              {colorOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <label className="block text-sm font-medium mb-1">반복</label>
            <select
              className="border rounded px-3 py-2 text-sm min-w-[90px] mb-3"
              value={inputRepeat}
              onChange={e => setInputRepeat(e.target.value)}
            >
              {repeatOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="flex gap-2 justify-end">
              <button onClick={handleAddSchedule} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-semibold min-w-[60px]">{loading ? '저장중...' : '저장'}</button>
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
        </div>
      )}
      {detailSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">일정 상세</h3>
            {detailEditMode ? (
              <>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">제목</label>
                  <input
                    type="text"
                    value={editInputValue}
                    onChange={e => setEditInputValue(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-2"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">기간</label>
                  <div className="flex gap-2 mb-2">
                    <input type="date" value={editStartDate} onChange={e => setEditStartDate(e.target.value)} className="border rounded px-2 py-1" />
                    <span className="self-center">~</span>
                    <input type="date" value={editEndDate} onChange={e => setEditEndDate(e.target.value)} className="border rounded px-2 py-1" />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">시간</label>
                  <div className="flex gap-2 mb-3 items-center">
                    <button type="button" className={`px-2 py-1 rounded text-xs border ${editTimeMode === 'select' ? 'bg-blue-100' : ''}`} onClick={() => setEditTimeMode('select')}>선택</button>
                    <button type="button" className={`px-2 py-1 rounded text-xs border ${editTimeMode === 'manual' ? 'bg-blue-100' : ''}`} onClick={() => setEditTimeMode('manual')}>직접입력</button>
                  </div>
                  <div className="flex gap-2 mb-3">
                    {editTimeMode === 'select' ? (
                      <>
                        <select value={editStartTime} onChange={e => setEditStartTime(e.target.value)} className="border rounded px-2 py-1">
                          {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <span className="self-center">~</span>
                        <select value={editEndTime} onChange={e => setEditEndTime(e.target.value)} className="border rounded px-2 py-1">
                          {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </>
                    ) : (
                      <>
                        <input type="time" className="border rounded px-2 py-1" value={editStartTime} onChange={e => setEditStartTime(e.target.value)} />
                        <span className="self-center">~</span>
                        <input type="time" className="border rounded px-2 py-1" value={editEndTime} onChange={e => setEditEndTime(e.target.value)} />
                      </>
                    )}
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">색상</label>
                  <select
                    className="border rounded px-3 py-2 text-sm min-w-[90px] mb-3"
                    value={editColor}
                    onChange={e => setEditColor(e.target.value)}
                  >
                    {colorOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">반복</label>
                  <select
                    className="border rounded px-3 py-2 text-sm min-w-[90px] mb-3"
                    value={editRepeat}
                    onChange={e => setEditRepeat(e.target.value)}
                    disabled
                  >
                    {repeatOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <button
                    onClick={async () => {
                      setEditLoading(true);
                      const { error } = await supabase.from('schedules')
                        .update({
                          title: editInputValue,
                          start_date: editStartDate,
                          end_date: editEndDate,
                          start_time: editStartTime,
                          end_time: editEndTime,
                          color: editColor,
                        })
                        .eq('id', detailSchedule.id)
                        .eq('user_id', userId);
                      setEditLoading(false);
                      if (!error) {
                        if (userId) {
                          const { data: newData, error: fetchError } = await supabase.from('schedules').select('*').eq('user_id', userId);
                          if (!fetchError && newData) {
                            const byDate: Record<string, any[]> = {};
                            newData.forEach(sch => {
                              let d = new Date(sch.start_date);
                              const end = new Date(sch.end_date);
                              while (d <= end) {
                                const key = formatDate(d);
                                if (!byDate[key]) byDate[key] = [];
                                byDate[key].push(sch);
                                d.setDate(d.getDate() + 1);
                              }
                            });
                            setSchedules(byDate);
                          }
                        }
                        setDetailEditMode(false);
                        setDetailSchedule(null);
                      } else {
                        alert('수정 실패: ' + error.message);
                      }
                    }}
                    disabled={editLoading}
                    className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-semibold min-w-[60px]"
                  >저장</button>
                  <button
                    onClick={() => setDetailEditMode(false)}
                    className="bg-gray-200 px-4 py-2 rounded text-sm font-semibold min-w-[60px]"
                  >취소</button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2"><b>제목:</b> {detailSchedule.title}</div>
                <div className="mb-2"><b>기간:</b> {detailSchedule.start_date} ~ {detailSchedule.end_date}</div>
                <div className="mb-2"><b>시간:</b> {detailSchedule.start_time} ~ {detailSchedule.end_time}</div>
                <div className="mb-2"><b>색상:</b> <span className={`inline-block px-2 py-1 rounded ${detailSchedule.color ? `bg-${detailSchedule.color}-100 text-${detailSchedule.color}-700` : 'bg-blue-100 text-blue-700'}`}>{detailSchedule.color || 'blue'}</span></div>
                <div className="mb-2"><b>반복:</b> <span>{editRepeat === 'weekly' ? '매주' : editRepeat === 'monthly' ? '매월' : '없음'}</span></div>
                <div className="flex gap-2 justify-end mt-4">
                  <button
                    onClick={() => {
                      setEditInputValue(detailSchedule.title);
                      setEditStartDate(detailSchedule.start_date);
                      setEditEndDate(detailSchedule.end_date);
                      setEditStartTime(detailSchedule.start_time);
                      setEditEndTime(detailSchedule.end_time);
                      setEditColor(detailSchedule.color || 'blue');
                      setDetailEditMode(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-semibold min-w-[60px]"
                  >수정</button>
                  <button
                    onClick={async () => {
                      const { error } = await supabase.from('schedules').delete().eq('id', detailSchedule.id).eq('user_id', userId);
                      if (!error) {
                        setSchedules(prev => {
                          const newPrev = { ...prev };
                          Object.keys(newPrev).forEach(date => {
                            newPrev[date] = newPrev[date].filter(item => item.id !== detailSchedule.id);
                          });
                          return newPrev;
                        });
                        setDetailSchedule(null);
                      } else {
                        alert('삭제 실패: ' + error.message);
                      }
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded text-sm font-semibold min-w-[60px]"
                  >삭제</button>
                  <button
                    onClick={() => setDetailSchedule(null)}
                    className="bg-gray-200 px-4 py-2 rounded text-sm font-semibold min-w-[60px]"
                  >닫기</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 