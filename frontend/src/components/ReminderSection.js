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
        .reminder-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .reminder-section .switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 28px;
          transform: translateY(-28px);
        }

        .reminder-section .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .reminder-section .slider {
          position: relative;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 34px;
          width: 100%;
          height: 100%;
        }

        .reminder-section .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
          z-index: 2;
        }

        .reminder-section .slider:after {
          content: attr(data-label);
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          font-weight: bold;
          color: white;
          text-shadow: 0 1px 1px rgba(0,0,0,0.3);
          z-index: 1;
        }

        .reminder-section input:not(:checked) + .slider:after {
          content: "OFF";
          right: 8px;
        }

        .reminder-section input:checked + .slider {
          background-color: #4caf50;
        }

        .reminder-section input:checked + .slider:before {
          transform: translateX(32px);
        }

        .reminder-section input:checked + .slider:after {
          content: "ON";
          left: 8px;
        }

        .reminder-section .slider.round {
          border-radius: 34px;
        }
      `}</style>

      <div className="reminder-header">
        <div className="reminder-label">Daily Check-in Reminder</div>
        <label className="switch">
          <input type="checkbox" checked={reminderEnabled} onChange={handleToggle} />
          <span className="slider round"></span>
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
        <div id="reminderStatus" className="reminder-status" style={{ marginTop: '10px', fontSize: '12px', color: '#7f8c8d' }}>
          {reminderStatus}
        </div>
      )}
    </div>
  );
}

