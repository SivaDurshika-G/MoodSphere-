// src/pages/Home.js

import React, { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import MoodPicker from '../components/MoodPicker';
import NoteSection from '../components/NoteSection';
import SaveButton from '../components/SaveButton';
import ReminderSection from '../components/ReminderSection';
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
  const [assistantPrompt, setAssistantPrompt] = useState('');

  const fireNotification = ({ text, icon = '🔔' }) => {
    setNotification({
      show: true,
      text,
      icon,
      onClose: () => setNotification(n => ({ ...n, show: false })),
    });
  };

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

    // Create and append floating background elements
    createFloatingElements();
  }, []);

  const createFloatingElements = () => {
    // Create quantum field
    const quantumField = document.createElement('div');
    quantumField.className = 'home-quantum-field';
    document.body.appendChild(quantumField);

    // Create floating objects container
    const floatingContainer = document.createElement('div');
    floatingContainer.className = 'home-floating-objects';
    
    // Add cubes
    for (let i = 0; i < 3; i++) {
      const cube = document.createElement('div');
      cube.className = 'home-floating-cube';
      floatingContainer.appendChild(cube);
    }
    
    // Add orbs
    for (let i = 0; i < 2; i++) {
      const orb = document.createElement('div');
      orb.className = 'home-light-orb';
      floatingContainer.appendChild(orb);
    }
    
    document.body.appendChild(floatingContainer);

    // Create energy pulses
    for (let i = 0; i < 2; i++) {
      const pulse = document.createElement('div');
      pulse.className = 'home-energy-pulse';
      document.body.appendChild(pulse);
    }

    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'home-particle-container';
    
    // Add floating particles
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = `home-floating-particle type-${(i % 2) + 1}`;
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 25 + 's';
      particleContainer.appendChild(particle);
    }
    
    document.body.appendChild(particleContainer);

    // Create shooting star
    const shootingStar = document.createElement('div');
    shootingStar.className = 'home-shooting-star';
    shootingStar.style.top = Math.random() * 20 + '%';
    shootingStar.style.left = Math.random() * 20 + '%';
    document.body.appendChild(shootingStar);
  };

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

      // Trigger assistant with mood prompt
      const prompt = `I am feeling ${res.data.mood} today.`;
      setAssistantPrompt(prompt);
      setIntroMsg("Got it. Let's talk about it...");
      setShowChat(true);
    } catch (err) {
      console.error('Error saving mood:', err);
      fireNotification({ text: 'Error saving mood', icon: '❌' });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="main-content">
        <div className="app-container">
          <header className="header">
            <h1 className="greeting">Welcome</h1>
            <p className="subtitle">How are you feeling today?</p>
          </header>

          <StatsCard count={history.length} />
          
          <div className="mood-section">
            <h2 className="section-title">Select Your Mood</h2>
            <MoodPicker selected={mood} onSelect={setMood} />
          </div>
          
          <div className="note-section">
            <h2 className="section-title">Add a Note (Optional)</h2>
            <NoteSection note={note} onChange={setNote} />
          </div>
          
          <SaveButton onClick={handleSave} />

          <ReminderSection onNotification={fireNotification} />
        </div>
      </div>

      <Footer />

      <FloatingChatButton
        onClick={() => {
          setIntroMsg('Hi there! How can I support you today?');
          setAssistantPrompt('');
          setShowChat(true);
        }}
      />

      <ChatModal
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        initialMessage={introMsg}
        initialPrompt={assistantPrompt}
      />

      <Notification data={notification} />
    </div>
  );
}