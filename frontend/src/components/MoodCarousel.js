import React, { useEffect, useState } from 'react';
import '../assets/styles/MoodCarousel.css';

const moodEmojiMap = {
  Great: '😄',
  Good: '😊',
  Okay: '😐',
  'Not Great': '😕',
  Bad: '😢',
  Anxious: '😰',
};


export default function MoodCarousel({ moods }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % moods.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [moods]);

  if (!moods.length) return null;

  const mood = moods[index];

  return (
    <div className="mood-carousel">
      <div className="mood-box">
        <span className="emoji">{moodEmojiMap[mood.mood] || '❓'}</span>
        <span className="note">{mood.note}</span>
      </div>
    </div>
  );
}
