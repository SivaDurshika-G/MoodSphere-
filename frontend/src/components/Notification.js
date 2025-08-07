import React, { useEffect } from 'react';

export default function Notification({ data }) {
  useEffect(() => {
    if (data?.show) {
      const timer = setTimeout(() => {
        if (data.onClose) data.onClose();
      }, 2000);

      return () => clearTimeout(timer); // Clean up if component unmounts
    }
  }, [data?.show]);

  if (!data?.show) return null;

  return (
    <div className="custom-notification show">
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
