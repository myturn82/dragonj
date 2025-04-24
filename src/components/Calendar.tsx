'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Event {
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);

  const handleDateSelect = (selectInfo: any) => {
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
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">일정 관리</h2>
      <div className="calendar-container">
        <style jsx global>{`
          .fc {
            background: #1a1a1a;
            border-radius: 0.5rem;
            padding: 1rem;
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