import React from 'react';

// Mood options matching your original HTML structure
const moods = [
  { name: 'Great', emoji: '😄', className: 'great-mood' },
  { name: 'Good', emoji: '😊', className: 'good-mood' },
  { name: 'Okay', emoji: '😐', className: 'okay-mood' },
  { name: 'Not Great', emoji: '😕', className: 'not-great-mood' },
  { name: 'Bad', emoji: '😢', className: 'bad-mood' },
  { name: 'Anxious', emoji: '😰', className: 'anxious-mood' }
];

export default function MoodPicker({ selected, onSelect }) {
  return (
    <div className="mood-section">
      <h3 className="section-title">How are you feeling today?</h3>
      
      <div className="mood-grid">
        {moods.map((mood) => (
          <button
            key={mood.name}
            className={`mood-btn ${mood.className} ${
              selected === mood.name ? 'selected' : ''
            }`}
            data-mood={mood.name}
            onClick={() => onSelect(mood.name)}
          >
            <span className="mood-emoji">
              {mood.emoji}
            </span>
            {mood.name}
          </button>
        ))}
      </div>
    </div>
  );
}