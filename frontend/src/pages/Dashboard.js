import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../services/api';

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/moods')
      .then(res => setEntries(res.data))
      .catch(err => {
        // If unauthorized (token expired/missing), send back to login
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      });
  }, [navigate]);

  return (
    <div className="page dashboard">
      <h2>Your Mood History</h2>
      <ul className="history-list">
        {entries.map(e => (
          <li key={e._id}>
            <strong>{e.mood}</strong> on{' '}
            {new Date(e.createdAt).toLocaleDateString()}
            {e.note && <p>{e.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
