import React, { useEffect, useState, useRef } from 'react';
import { API } from '../services/api';

export default function ReminderSection({ onNotification }) {
  const [reminderTime, setReminderTime] = useState('20:00');
  const [reminderStatus, setReminderStatus] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const lastTriggeredRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadReminder = async () => {
      try {
        const res = await API.get('/reminder');
        if (res.data?.reminderTime) {
          setReminderTime(res.data.reminderTime);
          setReminderEnabled(res.data.enabled ?? true);
          updateReminderUI(res.data.reminderTime);
          if (res.data.enabled !== false) startReminderCheck(res.data.reminderTime);
        }
      } catch {
        const saved = localStorage.getItem('reminderTime');
        const enabled = localStorage.getItem('reminderEnabled') !== 'false';
        setReminderEnabled(enabled);
        if (saved) {
          setReminderTime(saved);
          updateReminderUI(saved);
          if (enabled) startReminderCheck(saved);
        }
      }
    };
    loadReminder();
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (reminderTime && reminderEnabled) {
      updateReminderUI(reminderTime);
      startReminderCheck(reminderTime);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [reminderTime, reminderEnabled]);

  const updateReminderUI = (t) => {
    const label = new Date(`1970-01-01T${t}:00`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    setReminderStatus(`Reminder set for ${label}`);
  };

  const startReminderCheck = (t) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = now.getSeconds();
      const current = `${hh}:${mm}`;

      if (ss === 0 && current === t && lastTriggeredRef.current !== current && reminderEnabled) {
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
      await API.put('/reminder', { time: reminderTime, enabled: reminderEnabled });
      localStorage.setItem('reminderTime', reminderTime);
      localStorage.setItem('reminderEnabled', reminderEnabled);

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

  const handleToggle = () => {
    const updated = !reminderEnabled;
    setReminderEnabled(updated);
    localStorage.setItem('reminderEnabled', updated);
    API.put('/reminder', { time: reminderTime, enabled: updated }).catch(console.error);
  };

  return (
    <div className="reminder-section">
      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #4caf50;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .slider.round {
          border-radius: 34px;
        }

        .slider.round:after {
          content: attr(data-label);
          position: absolute;
          right: 10px;
          top: 6px;
          font-size: 12px;
          color: white;
        }
      `}</style>

      <div className="reminder-header">
        <div className="reminder-label">Daily Check-in Reminder</div>
        <label className="switch">
          <input type="checkbox" checked={reminderEnabled} onChange={handleToggle} />
          <span
            className="slider round"
            data-label={reminderEnabled ? 'ON' : 'OFF'}
          ></span>
        </label>
      </div>

      <div className="reminder-input-group">
        <input
          type="time"
          id="reminderTime"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          disabled={!reminderEnabled}
        />
        <button id="setReminderBtn" onClick={handleSetReminder} disabled={!reminderEnabled}>
          Set Reminder
        </button>
      </div>

      {reminderStatus && (
        <div id="reminderStatus" className="reminder-status">
          {reminderStatus}
        </div>
      )}
    </div>
  );
}
