import React, { useEffect } from "react";
import "../assets/styles/IntroScreen.css";

export default function IntroScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 4000); // 4 seconds animation
    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleDarkModeSwitch = () => {
    document.body.classList.add("dark"); // or call your dark mode logic
  };

  return (
    <div className="intro-screen">
      <div className="intro-text">Entering the immersive world of <span>MoodSphere</span>...</div>
      <div className="darkmode-hint">
        <button onClick={handleDarkModeSwitch}>Switch to Dark Mode for Best Experience</button>
      </div>
    </div>
  );
}
