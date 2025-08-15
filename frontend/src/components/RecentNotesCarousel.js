import React, { useEffect, useState } from 'react';
import '../assets/styles/RecentNotesCarousel.css';

export default function RecentNotesCarousel({ notes }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (!notes || notes.length <= 1) return;

    const interval = setInterval(() => {
      handleTransition();
    }, 5000); // 5 seconds auto-scroll

    return () => clearInterval(interval);
  }, [notes?.length]);

  const handleTransition = () => {
    setIsTransitioning(true);
    setAnimationClass('slide-out');

    // After slide-out animation completes, change content and slide-in
    setTimeout(() => {
      setCurrent(prev => (prev + 1) % notes.length);
      setAnimationClass('slide-in');
      
      // Reset animation state after slide-in completes
      setTimeout(() => {
        setIsTransitioning(false);
        setAnimationClass('');
      }, 1200); // Match the CSS animation duration (1.2s)
    }, 1200); // Match the CSS animation duration (1.2s)
  };

  // Manual navigation function (if you want to add navigation buttons later)
  const goToSlide = (index) => {
    if (isTransitioning || index === current) return;
    
    setIsTransitioning(true);
    setAnimationClass('slide-out');
    
    setTimeout(() => {
      setCurrent(index);
      setAnimationClass('slide-in');
      
      setTimeout(() => {
        setIsTransitioning(false);
        setAnimationClass('');
      }, 1200);
    }, 1200);
  };

  if (!notes || notes.length === 0) {
    return (
      <div className="carousel-container">
        <div className="note-card">
          <h4>No Notes Available</h4>
          <p>Start adding notes to see them here!</p>
          <small>Get started today</small>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-container">
      {/* Add floating particles for extra cosmic effect */}
      <div className="floating-particles">
        {[...Array(6)].map((_, i) => (
          <div 
            key={`carousel-particle-${i}`}
            className="floating-particle"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Main note card with animation classes */}
      <div className={`note-card ${animationClass}`}>
        <h4>{`Note ${current + 1} of ${notes.length}`}</h4>
        <p>{notes[current].note}</p>
        <small>{new Date(notes[current].date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</small>
      </div>

      {/* Optional: Navigation dots */}
      {notes.length > 1 && (
        <div className="carousel-dots">
          {notes.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === current ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              aria-label={`Go to note ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress indicator overlay */}
      {!isTransitioning && notes.length > 1 && (
        <div 
          className="progress-overlay"
          key={current} // Force re-render to restart animation
        />
      )}
    </div>
  );
}