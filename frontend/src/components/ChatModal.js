// src/components/ChatModal.js

import React from 'react';
import '../assets/styles/ChatModal.css';
import AssistantChat from './AssistantChat';

export default function ChatModal({ isOpen, onClose, initialMessage, initialPrompt }) {
  if (!isOpen) return null;
  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={e => e.stopPropagation()}>
        <button className="chat-modal-close" onClick={onClose}>×</button>
        {initialMessage && (
          <div className="chat-modal-intro">
            <p>{initialMessage}</p>
          </div>
        )}
        <AssistantChat initialMessage={initialMessage} initialPrompt={initialPrompt} />
      </div>
    </div>
  );
}
