import React, { useState, useEffect } from 'react';
import BrandLogo from '../components/BrandLogo';
import ThemeToggle from '../components/ThemeToggle';
import StatsCard from '../components/StatsCard';
import MoodPicker from '../components/MoodPicker';
import NoteSection from '../components/NoteSection';
import SaveButton from '../components/SaveButton';
import ReminderSection from '../components/ReminderSection';
import HistoryList from '../components/HistoryList';
import Notification from '../components/Notification';
import Footer from '../components/Footer';
import {API} from '../services/api'; // <-- added
import '../assets/styles/Home.css';

export default function Home() {
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState([]);
  const [notification, setNotification] = useState(null);

  // Fetch entries from backend on load
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/moods');
        setHistory(res.data);
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };
    fetchHistory();

    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') document.body.classList.add('dark');
  }, []);

  const handleSave = async () => {
    if (!mood) return;

    try {
      const res = await API.post('/moods', { mood, note });
      const newEntry = res.data;
      setHistory([newEntry, ...history]);
      setNote('');
      setMood(null);
      setNotification({ text: 'Mood saved!', show: true, onClose: () => setNotification(null) });
    } catch (err) {
      console.error('Error saving mood:', err);
      setNotification({ text: 'Error saving mood', show: true, onClose: () => setNotification(null) });
    }
  };

  return (
    <>
      <BrandLogo />
      <ThemeToggle />
      <div className="app-container">
        <header className="header">
          <h1 className="greeting">Welcome</h1>
          <p className="subtitle">How are you feeling today?</p>
        </header>
        <StatsCard count={history.length} />
        <MoodPicker selected={mood} onSelect={setMood} />
        <NoteSection note={note} onChange={setNote} />
        <SaveButton onClick={handleSave} />
        <ReminderSection />
        <HistoryList entries={history} />
      </div>
      <Notification data={notification} />
      <Footer />
    </>
  );
}
