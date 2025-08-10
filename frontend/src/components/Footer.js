import React from 'react';
import '../assets/styles/Footer.css';

export default function Footer() {
  return (
    <footer>
      <p>
        &copy; {new Date().getFullYear()} MoodSphere.
        <a href="/privacy">Privacy</a>
        <span className="footer-divider">|</span>
        <a href="/terms">Terms</a>
      </p>
      <div className="footer-heart">❤️</div>
    </footer>
  );
}
