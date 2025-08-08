// src/pages/Home.js

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
import FloatingChatButton from '../components/FloatingChatButton';
import ChatModal from '../components/ChatModal';
import { API } from '../services/api';
import '../assets/styles/Home.css';

export default function Home() {
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    text: '',
    icon: '',
    onClose: () => setNotification(n => ({ ...n, show: false })),
  });

  // AI Chat states
  const [showChat, setShowChat] = useState(false);
  const [introMsg, setIntroMsg] = useState('');

  // Helper to fire any notification
  const fireNotification = ({ text, icon = '🔔' }) => {
    setNotification({
      show: true,
      text,
      icon,
      onClose: () => setNotification(n => ({ ...n, show: false })),
    });
  };

  // Fetch history + apply theme on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await API.get('/moods');
        setHistory(res.data);
      } catch (err) {
        console.error('Error fetching history:', err);
        fireNotification({ text: 'Failed to load history', icon: '❌' });
      }
    })();

    const theme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark', theme === 'dark');
  }, []);

  const handleSave = async () => {
    if (mood == null) {
      fireNotification({ text: 'Select a mood first!', icon: '⚠️' });
      return;
    }

    try {
      const res = await API.post('/moods', { mood, note });
      setHistory([res.data, ...history]);
      setNote('');
      setMood(null);
      fireNotification({ text: 'Mood saved!', icon: '✅' });

      // If mood is low (e.g. 1–3), auto-open the chat modal
      if (res.data.mood <= 3) {
        setIntroMsg("I’m here for you—want to talk about what’s on your mind?");
        setShowChat(true);
      }
    } catch (err) {
      console.error('Error saving mood:', err);
      fireNotification({ text: 'Error saving mood', icon: '❌' });
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

        {/* ReminderSection can still trigger notifications */}
        <ReminderSection onNotification={fireNotification} />

        <HistoryList entries={history} />
      </div>

      {/* Floating AI chat button */}
      <FloatingChatButton
        onClick={() => {
          setIntroMsg('Hi there! How can I support you today?');
          setShowChat(true);
        }}
      />

      {/* Chat modal */}
      <ChatModal
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        initialMessage={introMsg}
      />

      <Notification data={notification} />
      <Footer />
    </>
  );
}
