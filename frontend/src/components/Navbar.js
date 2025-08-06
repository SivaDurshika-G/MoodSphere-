import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/styles/Navbar.css';

export default function Navbar() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const location = useLocation();
  const navigate = useNavigate();

  // Re-read token on every route change
  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [location]);

  function handleLogout() {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <h1>MoodSphere</h1>
      <ul>
        <li><Link to="/">Home</Link></li>

        {token ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li>
              <button 
                onClick={handleLogout} 
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  padding: '6px 10px'
                }}
              >
                Logout
              </button>
            </li>
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
