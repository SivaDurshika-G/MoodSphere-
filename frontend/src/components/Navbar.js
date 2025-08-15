import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/styles/Navbar.css';

export default function Navbar() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const location = useLocation();
  const navigate = useNavigate();

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
      <ul className="navbar-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/contributors">Contributors</Link></li>

        {token ? (
          <>
            <li><Link to="/calendar">Calendar</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
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