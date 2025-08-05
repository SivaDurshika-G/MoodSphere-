import React, { useState } from 'react';
import api from '../services/api';

export default function MoodForm({ onAdd }) {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!mood) return;
    const { data } = await api.post('/moods', { mood, note });
    setMood(''); setNote('');
    if (onAdd) onAdd(data);
  };

  return (
    <form className="mood-form" onSubmit={handleSubmit}>
      <select value={mood} onChange={e => setMood(e.target.value)} required>
        <option value="">Select mood…</option>
        <option>Happy</option>
        <option>Sad</option>
        <option>Neutral</option>
        <option>Anxious</option>
        <option>Angry</option>
      </select>
      <textarea
        placeholder="Add a note (optional)"
        value={note}
        onChange={e => setNote(e.target.value)}
      />
      <button type="submit">Save Mood</button>
    </form>
  );
}
