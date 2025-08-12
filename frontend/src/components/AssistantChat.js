// src/components/AssistantChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/api';
import '../assets/styles/AssistantChat.css';

export default function AssistantChat({ initialMessage, initialPrompt }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();
  const chatWindowRef = useRef();
  const textareaRef = useRef();

  useEffect(() => {
    const init = async () => {
      if (initialMessage) {
        setMessages([{ from: 'bot', text: formatBotMessage(initialMessage) }]);
      }

      if (initialPrompt) {
        setTyping(true);
        try {
          const { data } = await chatWithAssistant(initialPrompt);
          let reply = data.reply || 'Hmm... I didn\'t get that 🤔';
          if (reply.length > 400) {
            reply = reply.slice(0, 350) + '... 😅';
          }
          setMessages((msgs) => [
            ...msgs,
            { from: 'bot', text: formatBotMessage(reply) },
          ]);
        } catch (err) {
          console.error('Chat error:', err);
          setMessages((msgs) => [
            ...msgs,
            {
              from: 'bot',
              text: 'Oops! Something went wrong 💥 Please try again.',
            },
          ]);
        } finally {
          setTyping(false);
        }
      }
    };

    init();
  }, [initialMessage, initialPrompt]);

  // Auto-scroll to bottom with smooth behavior
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end',
        inline: 'nearest'
      });
    }
  }, [messages, typing]);

  // Auto-resize textarea with proper ref
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px';
    }
  }, [input]);

  const formatBotMessage = (msg) => {
    const greetings = ['😊', '💬', '👋', '✨'];
    const randomEmoji = greetings[Math.floor(Math.random() * greetings.length)];
    return `${msg} ${randomEmoji}`;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages((msgs) => [...msgs, { from: 'user', text }]);
    setInput('');
    setTyping(true);

    try {
      const { data } = await chatWithAssistant(text);
      let reply = data.reply || 'Hmm... I didn\'t get that 🤔';
      if (reply.length > 400) {
        reply = reply.slice(0, 350) + '... 😅';
      }

      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: formatBotMessage(reply) },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((msgs) => [
        ...msgs,
        {
          from: 'bot',
          text: 'Oops! Something went wrong 💥 Please try again.',
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="assistant-chat">
      <div className="chat-window" ref={chatWindowRef}>
        {messages.length === 0 && !typing && (
          <div className="empty-state">
            <p>Hi! How can I help you today? 💬</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.from}`}>
            {m.text}
          </div>
        ))}

        {typing && (
          <div className="chat-msg bot typing-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          ref={textareaRef}
          className="chat-input"
          rows="1"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Chat message input"
        />
        <button 
          className="chat-send-btn" 
          onClick={sendMessage}
          disabled={!input.trim() || typing}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
}