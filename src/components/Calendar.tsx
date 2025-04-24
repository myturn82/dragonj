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

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt('일정 제목을 입력하세요');
    if (title) {
      setEvents([
        ...events,
        {
          title,
          start: selectInfo.start,
          end: selectInfo.end,
          allDay: selectInfo.allDay,
        },
      ]);
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
            padding: 0.5rem sm:1rem;
            min-width: 300px;
          }
          .fc-toolbar-title {
            font-size: 1.2rem !important;
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
          }
          .fc-button:hover {
            background: #444 !important;
          }
          .fc-button-active {
            background: #e50914 !important;
            border-color: #e50914 !important;
          }
          .fc-event {
            background: #e50914;
            border-color: #e50914;
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
        />
      </div>
    </div>
  );
} 