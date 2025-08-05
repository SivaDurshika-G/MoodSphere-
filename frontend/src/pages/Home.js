import React, { useState, useEffect } from 'react';
import MoodForm from '../components/MoodForm';
import MoodChart from '../components/MoodChart';
import api from '../services/api';

export default function Home() {
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    api.get('/moods').then(res => setEntries(res.data));
  }, []);
  return (
    <div className="page home">
      <MoodForm onAdd={entry => setEntries([entry, ...entries])} />
      <MoodChart entries={entries} />
    </div>
  );
}
