'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg } from '@fullcalendar/core';

interface Event {
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [selectedInfo, setSelectedInfo] = useState<DateSelectArg | null>(null);

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
      <div className="calendar-container overflow-x-auto">
        <style jsx global>{`
          .fc {
            background: #1a1a1a;
            border-radius: 0.5rem;
            padding: 0.5rem;
            min-width: 300px;
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