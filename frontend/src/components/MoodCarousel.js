import React, { useEffect, useState, useRef } from 'react';
import '../assets/styles/MoodCarousel.css';

const moodEmojiMap = {
  Great: '😄',
  Good: '😊',
  Okay: '😐',
  'Not Great': '😕',
  Bad: '😢',
  Anxious: '😰',
};

export default function MoodCarousel({ moods }) {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState('');
  const [nextEmoji, setNextEmoji] = useState('');
  const moodBoxRef = useRef(null);
  const currentEmojiRef = useRef(null);
  const nextEmojiRef = useRef(null);

  // Initialize first emoji
  useEffect(() => {
    if (moods.length > 0) {
      const firstMood = moods[0];
      setCurrentEmoji(moodEmojiMap[firstMood.mood] || '❓');
    }
  }, [moods]);

  // Handle mood changes with slide animation
  useEffect(() => {
    if (!moods.length || isAnimating) return;

    const timer = setInterval(() => {
      setIndex(prev => {
        const newIndex = (prev + 1) % moods.length;
        const newMood = moods[newIndex];
        const newEmojiChar = moodEmojiMap[newMood.mood] || '❓';
        
        // Only animate if emoji is different
        if (newEmojiChar !== currentEmoji) {
          animateToNewEmoji(newEmojiChar, newMood.mood);
        }
        
        return newIndex;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [moods, currentEmoji, isAnimating]);

  const animateToNewEmoji = (newEmojiChar, moodType) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setNextEmoji(newEmojiChar);
    
    // Add transitioning class to mood-box for enhanced glow
    if (moodBoxRef.current) {
      moodBoxRef.current.classList.add('transitioning');
      moodBoxRef.current.setAttribute('data-mood', moodType);
    }

    // Start exit animation for current emoji
    if (currentEmojiRef.current) {
      currentEmojiRef.current.classList.remove('current');
      currentEmojiRef.current.classList.add('slide-out');
    }

    // Start enter animation for next emoji after a brief delay
    setTimeout(() => {
      if (nextEmojiRef.current) {
        nextEmojiRef.current.classList.add('slide-in');
      }
    }, 100);

    // Clean up after animation completes
    setTimeout(() => {
      setCurrentEmoji(newEmojiChar);
      setNextEmoji('');
      setIsAnimating(false);
      
      // Remove transitioning class
      if (moodBoxRef.current) {
        moodBoxRef.current.classList.remove('transitioning');
      }
      
      // Reset classes
      if (currentEmojiRef.current) {
        currentEmojiRef.current.classList.remove('slide-out');
        currentEmojiRef.current.classList.add('current');
      }
      if (nextEmojiRef.current) {
        nextEmojiRef.current.classList.remove('slide-in');
      }
    }, 1000); // Match CSS animation duration
  };

  if (!moods.length) return null;

  const currentMood = moods[index];

  return (
    <div className="mood-carousel" data-mood={currentMood.mood}>
      <div className="mood-box" ref={moodBoxRef}>
        <div className="emoji-container">
          {/* Current emoji */}
          <span 
            ref={currentEmojiRef}
            className="emoji current"
            key={`current-${currentEmoji}`}
          >
            {currentEmoji}
          </span>
          
          {/* Next emoji (only visible during animation) */}
          {nextEmoji && (
            <span 
              ref={nextEmojiRef}
              className="emoji"
              key={`next-${nextEmoji}`}
            >
              {nextEmoji}
            </span>
          )}
        </div>
      </div>
      
      {/* Note is hidden via CSS but kept for accessibility */}
      <span className="note" aria-hidden="true">{currentMood.note}</span>
    </div>
  );
}