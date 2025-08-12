import React from 'react';
import { API } from '../services/api';

export default function StatsCard({ count, onResetSuccess }) {
  const handleReset = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to reset.');
        return;
      }

      await API.delete('/moods/all', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Tell parent reset is complete
      if (onResetSuccess) {
        onResetSuccess();
      }
    } catch (error) {
      console.error('Error clearing mood history:', error);
    }
  };

  return (
    <div className="stats-card">
      <div className="stats-number">{count}</div>
      <div className="stats-text">Entries</div>
      <button className="reset-btn" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}
