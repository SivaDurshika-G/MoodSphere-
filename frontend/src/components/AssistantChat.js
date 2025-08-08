// frontend/src/components/AssistantChat.jsx

import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/api';
import '../assets/styles/AssistantChat.css';

export default function AssistantChat({ initialMessage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]         = useState('');
  const bottomRef                 = useRef();

  // On mount, if there’s an initial prompt, add it as bot message
  useEffect(() => {
    if (initialMessage) {
      setMessages([{ from: 'bot', text: initialMessage }]);
    }
  }, [initialMessage]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    // Add user message
    setMessages(msgs => [...msgs, { from: 'user', text }]);
    setInput('');
    try {
      const { data } = await chatWithAssistant(text);
      setMessages(msgs => [...msgs, { from: 'bot', text: data.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(msgs => [...msgs, {
        from: 'bot',
        text: 'Sorry, something went wrong. Please try again later.'
      }]);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="assistant-chat">
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.from}`}>
            {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-area">
        <textarea
          className="chat-input"
          rows="1"
          value={input}
          placeholder="Type your message..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chat-send-btn" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
