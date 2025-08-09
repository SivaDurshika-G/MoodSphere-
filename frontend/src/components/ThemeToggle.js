import React, { useEffect, useState } from 'react';
import '../assets/styles/ThemeToggle.css';

export default function ThemeToggle() {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      setIsChecked(true);
    }
  }, []);

  const toggle = () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setIsChecked(isDark);
  };

  return (
    <div className="theme-toggle">
      <label className="switch">
        <input type="checkbox" onChange={toggle} checked={isChecked} />
        <span className="slider">
          <i className="sun-icon">☀️</i>
          <i className="moon-icon">🌙</i>
        </span>
      </label>
    </div>
  );
}
