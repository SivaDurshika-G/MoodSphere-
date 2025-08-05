import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    api.get('/moods').then(res => setEntries(res.data));
  }, []);
  return (
    <div className="page dashboard">
      <h2>Your Mood History</h2>
      <ul className="history-list">
        {entries.map(e => (
          <li key={e._id}>
            <strong>{e.mood}</strong> on {new Date(e.date).toLocaleDateString()}
            {e.note && <p>{e.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
