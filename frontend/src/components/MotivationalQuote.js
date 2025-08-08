import React from 'react';

const quotes = [
  "You're doing better than you think 🌈",
  "Every day is a fresh start ☀️",
  "Feelings are visitors. Let them come and go 🌊",
  "You are enough, just as you are 💖",
  "Small steps every day matter 🚶‍♂️"
];

export default function MotivationalQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return (
    <div className="motivational-quote">
      <h3>{quotes[randomIndex]}</h3>
    </div>
  );
}
