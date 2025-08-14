import React, { useEffect, useState } from "react";
import "../assets/styles/IntroScreen.css";

export default function IntroScreen({ onFinish }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    const timer = setTimeout(() => {
      onFinish();
    }, 7500); // Extended to 12 seconds for the enhanced experience
    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleDarkModeSwitch = () => {
    document.body.classList.add("dark");
  };

  // Generate dynamic particles with different types (reduced count for performance)
  const particles = Array.from({ length: 25 }, (_, i) => (
    <div
      key={i}
      className={`intro-particle intro-particle-${(i % 4) + 1}`}
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${12 + Math.random() * 12}s`,
      }}
    />
  ));

  // Neural network nodes (reduced count)
  const networkNodes = Array.from({ length: 8 }, (_, i) => (
    <div
      key={i}
      className="intro-network-node"
      style={{
        left: `${15 + Math.random() * 70}%`,
        top: `${15 + Math.random() * 70}%`,
        animationDelay: `${Math.random() * 4}s`,
      }}
    />
  ));

  // Generate data stream elements (reduced count)
  const dataStreams = Array.from({ length: 8 }, (_, i) => (
    <div
      key={i}
      className="intro-data-stream"
      style={{
        left: `${Math.random() * 100}%`,
        animationDuration: `${4 + Math.random() * 6}s`,
        animationDelay: `${Math.random() * 8}s`,
        height: `${60 + Math.random() * 40}px`,
      }}
    />
  ));

  return (
    <div className={`intro-screen ${loaded ? 'intro-loaded' : ''}`}>
      {/* Enhanced Atmospheric Layer */}
      <div className="intro-atmosphere"></div>
      
      {/* Cyberpunk Grid Overlay */}
      <div className="intro-cyber-grid"></div>
      
      {/* Data Stream Matrix Effect */}
      <div className="intro-data-streams">
        {dataStreams}
      </div>

      {/* Dynamic Neural Network Background */}
      <div className="intro-neural-network">
        {networkNodes}
        <svg className="intro-network-connections">
          <defs>
            <linearGradient id="introConnectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(64, 224, 255, 0.8)" />
              <stop offset="50%" stopColor="rgba(255, 127, 80, 0.8)" />
              <stop offset="100%" stopColor="rgba(138, 43, 226, 0.8)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Advanced Hexagonal Grid */}
      <div className="intro-hexagon-grid-container">
        <div className="intro-hexagon-grid intro-layer-1"></div>
        <div className="intro-hexagon-grid intro-layer-2"></div>
        <div className="intro-hexagon-grid intro-layer-3"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="intro-geometric-shapes">
        <div className="intro-shape intro-shape-hex-1"></div>
        <div className="intro-shape intro-shape-hex-2"></div>
        <div className="intro-shape intro-shape-circle-1"></div>
        <div className="intro-shape intro-shape-triangle-1"></div>
        <div className="intro-shape intro-shape-pentagon-1"></div>
      </div>

      {/* Enhanced particle system */}
      <div className="intro-particle-system">
        {particles}
      </div>

      {/* Morphing energy orbs */}
      <div className="intro-energy-orbs">
        <div className="intro-orb intro-orb-1"></div>
        <div className="intro-orb intro-orb-2"></div>
        <div className="intro-orb intro-orb-3"></div>
      </div>

      {/* Main content */}
      <div className="intro-content">
        <div className="intro-logo-container">
          <div className="intro-logo-symbol">◈</div>
          <div className="intro-logo-rings">
            <div className="intro-ring intro-ring-1"></div>
            <div className="intro-ring intro-ring-2"></div>
            <div className="intro-ring intro-ring-3"></div>
          </div>
        </div>
        
        <div className="intro-text">
          <div className="intro-text-line-1">Entering the immersive world of</div>
          <div className="intro-text-line-2">
            <span className="intro-brand-name">MoodSphere</span>
            <div className="intro-brand-underline"></div>
          </div>
          <div className="intro-text-line-3">Where emotions become reality</div>
        </div>
        
        <div className="intro-progress-indicator">
          <div className="intro-progress-bar">
            <div className="intro-progress-fill"></div>
          </div>
          <div className="intro-progress-text">Loading immersive experience...</div>
        </div>
      </div>
      
      <div className="intro-darkmode-hint">
        <div className="intro-hint-text">
          Switch to <span className="intro-highlight">Dark Mode</span> for better experience
        </div>
      </div>
    </div>
  );
}