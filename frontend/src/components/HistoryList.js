import React from 'react';

export default function HistoryList({ entries }) {
  return (
    <div className="history">
      {entries.map((e, i) => (
        <div key={i} className="history-item">
          <div className="mood-info">
            <span className="mood-emoji-small">{e.mood}</span>
            <span className="mood-text">{e.note || 'No note'}</span>
          </div>
          <span className="mood-date">
            {new Date(e.date).toLocaleString()}
          </span>
          <button
            className="remove-btn"
            onClick={() => {
              const updated = entries.filter((_, idx) => idx !== i);
              localStorage.setItem('moodHistory', JSON.stringify(updated));
              window.location.reload();
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
