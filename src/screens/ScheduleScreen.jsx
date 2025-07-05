import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './calendar.css';

const initialEvents = [
  { id: 1, title: 'Регистрация на дисциплины', date: '2025-06-04', color: '#ffc0cb', type: 'registration', fixed: true },
  { id: 2, title: 'Рубежный контроль 1', date: '2025-06-10', color: '#87cefa', type: 'midterm', fixed: true },
  { id: 3, title: 'Экзамен по математике', date: '2025-06-18', color: '#ff6961', type: 'exam', fixed: true },
];

export default function ScheduleScreen() {
  const [filters, setFilters] = useState({
    registration: true,
    midterm: true,
    exam: true,
  });

  const [events, setEvents] = useState(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: 'registration',
  });

  const [upcomingEvent, setUpcomingEvent] = useState(null);

  const handleFilterChange = (type) => {
    setFilters({ ...filters, [type]: !filters[type] });
  };

  const filteredEvents = events.filter(event => filters[event.type]);

  useEffect(() => {
    const now = new Date();
    const upcoming = filteredEvents
      .map(e => ({ ...e, dateObj: new Date(e.date) }))
      .filter(e => e.dateObj >= now)
      .sort((a, b) => a.dateObj - b.dateObj)[0];

    setUpcomingEvent(upcoming || null);
  }, [filteredEvents]);

  const handleDateClick = (arg) => {
    setNewEvent({ ...newEvent, date: arg.dateStr });
    setShowForm(true);
  };

  const handleAddEvent = () => {
    const colorMap = {
      registration: '#ffc0cb',
      midterm: '#87cefa',
      exam: '#ff6961',
    };

    const newId = Date.now();

    setEvents([
      ...events,
      {
        ...newEvent,
        id: newId,
        color: colorMap[newEvent.type],
        fixed: false,
      }
    ]);

    setShowForm(false);
    setNewEvent({ title: '', date: '', type: 'registration' });
  };

  const handleEventClick = (clickInfo) => {
    const { title, extendedProps } = clickInfo.event;
    const id = parseInt(clickInfo.event._def.publicId);

    if (extendedProps.fixed) {
      alert("Это системное событие и его нельзя удалить.");
      return;
    }

    const confirmDelete = window.confirm(`Удалить событие "${title}"?`);
    if (confirmDelete) {
      setEvents(events.filter(event => event.id !== id));
    }
  };

  return (
    <div className="content">
      <h2>📅 Расписание</h2>

      {upcomingEvent && (
        <div className="highlight-box">
          <strong>Ближайшее событие:</strong> {upcomingEvent.title} ({upcomingEvent.date})
        </div>
      )}

      <div className="filter-container">
        <label>
          <input type="checkbox" checked={filters.registration} onChange={() => handleFilterChange('registration')} />
          Регистрация
        </label>
        <label>
          <input type="checkbox" checked={filters.midterm} onChange={() => handleFilterChange('midterm')} />
          Рубежный контроль
        </label>
        <label>
          <input type="checkbox" checked={filters.exam} onChange={() => handleFilterChange('exam')} />
          Экзамены
        </label>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ru"
        events={filteredEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
        dayCellDidMount={(info) => {
          const today = new Date().toISOString().split('T')[0];
          if (info.dateStr === today) {
            info.el.style.backgroundColor = "#ffeaa7";
          }
        }}
      />

      {showForm && (
        <div className="event-form">
          <h4>Добавить событие на {newEvent.date}</h4>
          <input
            type="text"
            placeholder="Название"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <select
            value={newEvent.type}
            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
          >
            <option value="registration">Регистрация</option>
            <option value="midterm">Рубежный контроль</option>
            <option value="exam">Экзамен</option>
          </select>
          <button onClick={handleAddEvent}>Добавить</button>
        </div>
      )}
    </div>
  );
}
