import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Navbar.css';

export default function Navbar() {
  const token = localStorage.getItem('token');
  return (
    <nav className="navbar">
      <h1>MoodSphere</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        {token ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
        
      </ul>
    </nav>
  );
}
