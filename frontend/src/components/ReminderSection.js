import React, { useEffect, useState, useRef } from 'react';
import { API } from '../services/api';

export default function ReminderSection({ onNotification }) {
  const [reminderTime, setReminderTime] = useState('20:00');
  const [reminderStatus, setReminderStatus] = useState('');
  const lastTriggeredRef = useRef(null);
  const intervalRef = useRef(null);

  // Load saved reminder from backend or localStorage
  useEffect(() => {
    const loadReminder = async () => {
      try {
        const res = await API.get('/reminder');
        if (res.data?.reminderTime) {
          setReminderTime(res.data.reminderTime);
          updateReminderUI(res.data.reminderTime);
          startReminderCheck(res.data.reminderTime);
        }
      } catch {
        const saved = localStorage.getItem('reminderTime');
        if (saved) {
          setReminderTime(saved);
          updateReminderUI(saved);
          startReminderCheck(saved);
        }
      }
    };
    loadReminder();
    return () => clearInterval(intervalRef.current);
  }, []);

  // Whenever time changes, re-render status & restart checker
  useEffect(() => {
    if (reminderTime) {
      updateReminderUI(reminderTime);
      startReminderCheck(reminderTime);
    }
  }, [reminderTime]);

  // Format "20:00" → "8:00 PM"
  const updateReminderUI = (t) => {
    const label = new Date(`1970-01-01T${t}:00`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    setReminderStatus(`Reminder set for ${label}`);
  };

  // Check every second for exact match
  const startReminderCheck = (t) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = now.getSeconds();
      const current = `${hh}:${mm}`;

      if (ss === 0 && current === t && lastTriggeredRef.current !== current) {
        onNotification?.({
          text: 'Time to log your mood!',
          icon: '⏰',
          show: true,
          onClose: () => {},
        });
        lastTriggeredRef.current = current;
      }
      if (current !== lastTriggeredRef.current) {
        lastTriggeredRef.current = null;
      }
    }, 1000);
  };

  const handleSetReminder = async () => {
    if (!reminderTime) {
      onNotification?.({
        text: 'Pick a time!',
        icon: '⚠️',
        show: true,
        onClose: () => {},
      });
      return;
    }

    try {
      // Save to backend
      await API.put('/reminder', { time: reminderTime });
      // Also save locally
      localStorage.setItem('reminderTime', reminderTime);

      updateReminderUI(reminderTime);
      startReminderCheck(reminderTime);

      onNotification?.({
        text: `Reminder set for ${reminderTime}`,
        icon: '✅',
        show: true,
        onClose: () => {},
      });
    } catch (err) {
      console.error('Failed to save reminder to backend:', err);
      onNotification?.({
        text: 'Failed to set reminder. Try again.',
        icon: '❌',
        show: true,
        onClose: () => {},
      });
    }
  };

  return (
    <div className="reminder-section">
      <div className="reminder-label">Daily Check-in Reminder</div>

      <div className="reminder-input-group">
        <input
          type="time"
          id="reminderTime"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
        />
        <button id="setReminderBtn" onClick={handleSetReminder}>
          Set Reminder
        </button>
      </div>

      {reminderStatus && (
        <div id="reminderStatus">{reminderStatus}</div>
      )}
    </div>
  );
}
