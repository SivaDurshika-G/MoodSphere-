import React, { useEffect, useState } from 'react';
import '../assets/styles/CalendarPage.css';
import MoodCarousel from '../components/MoodCarousel';
import { API } from '../services/api';
import dayjs from 'dayjs';

const startMonth = dayjs('2025-07-01');
const today = dayjs();

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(today.startOf('month'));
  const [moodData, setMoodData] = useState({});

  useEffect(() => {
    const fetchMoods = async () => {
      const res = await API.get(`/moods/monthly?month=${currentMonth.format('YYYY-MM')}`);
      setMoodData(res.data); // Expected: { "2025-08-06": [{mood1}, {mood2}], ... }
    };
    fetchMoods();
  }, [currentMonth]);

  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfWeek = currentMonth.startOf('month').day(); // 0 (Sun) - 6 (Sat)

  const handleMonthChange = (direction) => {
    const newMonth = direction === 'prev'
      ? currentMonth.subtract(1, 'month')
      : currentMonth.add(1, 'month');

    if (newMonth.isBefore(startMonth)) return;
    setCurrentMonth(newMonth);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => handleMonthChange('prev')} disabled={currentMonth.isSame(startMonth, 'month')}>‹</button>
        <h2>{currentMonth.format('MMMM YYYY')}</h2>
        <button onClick={() => handleMonthChange('next')} disabled={currentMonth.isAfter(today, 'month')}>›</button>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-name">{day}</div>
        ))}
        {Array(firstDayOfWeek).fill(null).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-cell empty"></div>
        ))}
        {Array(daysInMonth).fill(null).map((_, dayIdx) => {
          const date = currentMonth.date(dayIdx + 1);
          const formatted = date.format('YYYY-MM-DD');
          const moods = moodData[formatted] || [];

          return (
            <div key={formatted} className="calendar-cell">
              <div className="cell-date">{dayIdx + 1}</div>
              {moods.length > 0 && <MoodCarousel moods={moods} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
