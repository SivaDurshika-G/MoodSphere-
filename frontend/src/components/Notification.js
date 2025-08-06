import React from 'react';

export default function Notification({ data }) {
  if (!data) return null;
  return (
    <div className={`custom-notification ${data.show ? 'show' : ''}`}>
      <div className="notification-content">
        <span className="notification-icon">🔔</span>
        <div className="notification-text">{data.text}</div>
        <button className="notification-close" onClick={data.onClose}>
          ×
        </button>
      </div>
    </div>
  );
}
