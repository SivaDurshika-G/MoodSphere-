import React from 'react';
import '../assets/styles/floatingChatButton.css';
import chatIcon from '../assets/images/chat.png'; // your AI icon

export default function FloatingChatButton({ onClick }) {
  return (
    <button className="floating-chat-btn" onClick={onClick}>
      <img src={chatIcon} alt="Chat with assistant" />
    </button>
  );
}
