// src/components/ChatModal.jsx
import React, { useEffect, useRef } from 'react';
import '../assets/styles/ChatModal.css';
import AssistantChat from './AssistantChat';

export default function ChatModal({ isOpen, onClose, initialMessage, initialPrompt }) {
  const widgetRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        // Check if click is on floating button
        if (!event.target.closest('.floating-chat-btn')) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <div 
      ref={widgetRef}
      className={`chat-modal-overlay ${isOpen ? 'show' : ''}`}
    >
      <div className="chat-modal">
        <button 
          className="chat-modal-close" 
          onClick={onClose}
          aria-label="Close chat"
        >
          ×
        </button>
        
        <div className="chat-modal-intro">
          <h3>
            <div className="bot-avatar">🤖</div>
            AI Assistant
          </h3>
          {initialMessage && <p>{initialMessage}</p>}
        </div>
        
        <AssistantChat 
          initialMessage={initialMessage} 
          initialPrompt={initialPrompt} 
        />
      </div>
    </div>
  );
}