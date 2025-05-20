'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg } from '@fullcalendar/core';
import { addMonths, subMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';

interface Event {
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
}

function MiniCalendar({ monthDate, label }: { monthDate: Date; label: string }) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const dateFormat = 'd';
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = '';

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      days.push(
        <td
          key={day.toString()}
          style={{
            textAlign: 'center',
            color: isSameMonth(day, monthStart) ? '#fff' : '#888',
            fontWeight: isSameDay(day, new Date()) ? 'bold' : 'normal',
            background: isSameDay(day, new Date()) ? '#e50914' : 'transparent',
            borderRadius: '50%',
            width: 22,
            height: 22,
          }}
        >
          {formattedDate}
        </td>
      );
      day = addDays(day, 1);
    }
    rows.push(<tr key={day.toString()}>{days}</tr>);
    days = [];
  }

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-label">{label}</div>
      <table className="mini-calendar-table">
        <thead>
          <tr>
            {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
              <th key={d} style={{ color: '#bbb', fontWeight: 'normal', padding: 2 }}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [selectedInfo, setSelectedInfo] = useState<DateSelectArg | null>(null);
  const today = new Date();
  const [mainDate, setMainDate] = useState(today);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedInfo(selectInfo);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle.trim() && selectedInfo) {
      const calendarApi = selectedInfo.view.calendar;
      calendarApi.unselect();

      setEvents([
        ...events,
        {
          title: newEventTitle.trim(),
          start: selectedInfo.start,
          end: selectedInfo.end,
          allDay: selectedInfo.allDay,
        },
      ]);

      setNewEventTitle('');
      setShowModal(false);
      setSelectedInfo(null);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">일정 관리</h2>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 24, width: '100%' }}>
        <div style={{ minWidth: 180, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <MiniCalendar monthDate={subMonths(mainDate, 1)} label="전월" />
          <MiniCalendar monthDate={addMonths(mainDate, 1)} label="다음월" />
        </div>
        <div className="calendar-container overflow-x-auto" style={{ flex: 1, minWidth: 0 }}>
          <style jsx>{`
            .calendar-container {
              width: 100%;
              max-width: 100vw;
              overflow-x: auto;
            }
          `}</style>
          <style jsx global>{`
            .fc {
              width: 100%;
              min-width: unset;
              max-width: 100%;
              background: #1a1a1a;
              border-radius: 0.5rem;
              padding: 0.5rem;
              box-sizing: border-box;
            }
            .fc-toolbar-title {
              font-size: 1.2rem !important;
              color: #ffffff !important;
            }
            .fc-col-header-cell-cushion {
              color: #ffffff !important;
            }
            .fc-daygrid-day-number {
              color: #ffffff !important;
            }
            .fc-daygrid-event {
              background: #e50914 !important;
              border-color: #e50914 !important;
              color: #ffffff !important;
              padding: 2px 4px !important;
            }
            @media (max-width: 640px) {
              .fc {
                min-width: 0 !important;
                width: 100vw !important;
                max-width: 100vw !important;
                padding: 0.25rem !important;
              }
              .fc-toolbar {
                flex-direction: column;
                gap: 1rem;
              }
              .fc-toolbar-title {
                font-size: 1rem !important;
              }
              .fc-header-toolbar {
                margin-bottom: 1rem !important;
              }
              .fc-button {
                padding: 0.2rem 0.5rem !important;
                font-size: 0.875rem !important;
              }
            }
            .fc-theme-standard td, .fc-theme-standard th {
              border-color: #333;
            }
            .fc-theme-standard .fc-scrollgrid {
              border-color: #333;
            }
            .fc-day-today {
              background: #2a2a2a !important;
            }
            .fc-button {
              background: #333 !important;
              border-color: #444 !important;
              color: #ffffff !important;
            }
            .fc-button:hover {
              background: #444 !important;
            }
            .fc-button-active {
              background: #e50914 !important;
              border-color: #e50914 !important;
            }
            .fc-timegrid-slot-label {
              color: #ffffff !important;
            }
            .fc-timegrid-axis-cushion {
              color: #ffffff !important;
            }
            /* 커스텀 내비게이션 버튼 스타일 */
            .fc .fc-button {
              background: #fff !important;
              color: #222 !important;
              border: 2px solid #222 !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              font-weight: 500 !important;
              transition: none !important;
              min-width: 48px !important;
              min-height: 48px !important;
              height: 48px !important;
              width: 48px !important;
              margin: 0 4px !important;
              display: inline-flex !important;
              align-items: center;
              justify-content: center;
              font-size: 1.2rem !important;
              padding: 0 !important;
            }
            .fc .fc-button:focus,
            .fc .fc-button:active,
            .fc .fc-button:hover {
              background: #fff !important;
              color: #222 !important;
              border: 2px solid #222 !important;
              box-shadow: none !important;
            }
            .fc .fc-button-primary:not(:disabled).fc-button-active,
            .fc .fc-button-primary:not(:disabled):active {
              background: #fff !important;
              color: #222 !important;
              border: 2px solid #222 !important;
              box-shadow: none !important;
            }
            .fc .fc-prev-button .fc-icon,
            .fc .fc-next-button .fc-icon {
              font-size: 1.2rem !important;
              vertical-align: middle;
            }
            .mini-calendar {
              margin-bottom: 16px;
              background: #222;
              border-radius: 8px;
              padding: 8px;
              width: 180px;
            }
            .mini-calendar-label {
              color: #fff;
              font-weight: bold;
              margin-bottom: 4px;
              text-align: center;
            }
            .mini-calendar-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }
            .mini-calendar-table th {
              color: #bbb;
              font-weight: normal;
              padding: 2px;
            }
          `}</style>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            select={handleDateSelect}
            height="auto"
            locale="ko"
          />
        </div>
      </div>

      {/* 일정 입력 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">새 일정 추가</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="일정 제목을 입력하세요"
                className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setNewEventTitle('');
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 