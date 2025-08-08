// src/components/AssistantChat.jsx

import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/api';
import '../assets/styles/AssistantChat.css';

export default function AssistantChat({ initialMessage, initialPrompt }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    const init = async () => {
      if (initialMessage) {
        setMessages([{ from: 'bot', text: formatBotMessage(initialMessage) }]);
      }

      if (initialPrompt) {
        setTyping(true);
        try {
          const { data } = await chatWithAssistant(initialPrompt);
          let reply = data.reply || 'Hmm... I didn’t get that 🤔';
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      let reply = data.reply || 'Hmm... I didn’t get that 🤔';
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
      <div className="chat-window">
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
          className="chat-input"
          rows="1"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chat-send-btn" onClick={sendMessage}>
          ➤
        </button>
      </div>
    </div>
  );
}
