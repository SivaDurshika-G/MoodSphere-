import React from 'react';

export default function ThemeToggle() {
  const toggle = () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <div className="theme-toggle">
      <label className="switch">
        <input type="checkbox" onChange={toggle} />
        <span className="slider">
          <i className="sun-icon">☀️</i>
          <i className="moon-icon">🌙</i>
        </span>
      </label>
    </div>
  );
}
