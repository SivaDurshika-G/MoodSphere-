import React, { useEffect, useState } from 'react';
import '../assets/styles/RecentNotesCarousel.css';

export default function RecentNotesCarousel({ notes }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % notes.length);
    }, 5000); // 5 seconds auto-scroll
    return () => clearInterval(interval);
  }, [notes.length]);

  if (!notes || notes.length === 0) {
    return <div className="note-card">No notes yet</div>;
  }

  return (
    <div className="carousel-container">
      <div className="note-card">
        <h4>{`Note ${current + 1}`}</h4>
        <p>{notes[current].note}</p>
        <small>{notes[current].date}</small>
      </div>
    </div>
  );
}
