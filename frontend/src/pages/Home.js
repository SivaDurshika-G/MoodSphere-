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
import '../assets/styles/Home.css';


export default function Home() {
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState([]);
  const [notification, setNotification] = useState(null);

  // Load saved entries & theme on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    setHistory(saved);
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') document.body.classList.add('dark');
  }, []);

  // Save a new entry
  const handleSave = () => {
    if (!mood) return;
    const entry = { mood, note, date: new Date().toISOString() };
    const updated = [entry, ...history];
    setHistory(updated);
    localStorage.setItem('moodHistory', JSON.stringify(updated));
    setNote('');
    setMood(null);
    // trigger notification UI
    setNotification({ text: 'Mood saved!', show: true, onClose: () => setNotification(null) });
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
