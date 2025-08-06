import React from 'react';

export default function StatsCard({ count }) {
  return (
    <div className="stats-card">
      <div className="stats-number">{count}</div>
      <div className="stats-text">Entries</div>
      <button className="reset-btn" onClick={() => {
        localStorage.removeItem('moodHistory');
        window.location.reload();
      }}>Reset</button>
    </div>
  );
}
