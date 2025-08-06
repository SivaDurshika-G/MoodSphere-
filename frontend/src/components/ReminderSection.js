import React, { useEffect, useState, useRef } from 'react';

export default function ReminderSection({ onNotification }) {
  const [reminderTime, setReminderTime] = useState('20:00');
  const [reminderStatus, setReminderStatus] = useState('');
  const lastHHMMRef = useRef(null);
  const intervalRef = useRef(null);

  // Load saved reminder time on mount
  useEffect(() => {
    const savedTime = localStorage.getItem('reminderTime');
    if (savedTime) {
      setReminderTime(savedTime);
    }
    updateReminderUI();
    startReminderCheck();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update reminder UI when time changes
  useEffect(() => {
    updateReminderUI();
    startReminderCheck();
  }, [reminderTime]);

  // Update reminder status display
  const updateReminderUI = () => {
    if (reminderTime) {
      const label = new Date(`1970-01-01T${reminderTime}:00`)
        .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
      setReminderStatus(`Reminder set for ${label}`);
    } else {
      setReminderStatus('');
    }
  };

  // Start checking for reminder time every second
  const startReminderCheck = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      checkReminderTime();
    }, 1000);
  };

  // Check if current time matches reminder time
  const checkReminderTime = () => {
    if (!reminderTime) return;

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = now.getSeconds();
    const current = `${hh}:${mm}`;

    // Trigger when seconds === 0 and we haven't yet triggered for this minute
    if (ss === 0 && current === reminderTime && lastHHMMRef.current !== current) {
      if (onNotification) {
        onNotification({
          text: "Time to log your mood!",
          show: true,
          icon: "⏰",
          onClose: () => {}
        });
      }
      lastHHMMRef.current = current;
    }

    // Reset flag after minute passes
    if (current !== lastHHMMRef.current) {
      lastHHMMRef.current = null;
    }
  };

  // Handle setting reminder
  const handleSetReminder = () => {
    if (!reminderTime) {
      if (onNotification) {
        onNotification({
          text: 'Pick a time!',
          show: true,
          icon: "⚠️",
          onClose: () => {}
        });
      }
      return;
    }

    // Save to localStorage
    localStorage.setItem('reminderTime', reminderTime);
    updateReminderUI();
    startReminderCheck();
    
    if (onNotification) {
      onNotification({
        text: `Reminder set for ${reminderTime}`,
        show: true,
        icon: "✅",
        onClose: () => {}
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
        <button
          id="setReminderBtn"
          onClick={handleSetReminder}
        >
          Set Reminder
        </button>
      </div>
      
      {reminderStatus && (
        <div id="reminderStatus" style={{ marginTop: '10px', fontSize: '12px', color: '#7f8c8d' }}>
          {reminderStatus}
        </div>
      )}
    </div>
  );
}