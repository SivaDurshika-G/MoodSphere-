import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../services/api';
import '../assets/styles/Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
      window.location.reload(); // refresh to update navbar
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    // Remove any trailing slash from the base URL to avoid // in production
    const base = (process.env.REACT_APP_API_BASE || '').replace(/\/$/, '');
    window.location.href = `${base}/auth/google`;
    // Or: window.location.href = new URL('/auth/google', process.env.REACT_APP_API_BASE || '').toString();
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="page auth">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <p className="forgot-link" onClick={handleForgotPassword}>
            Forgot Password?
          </p>
          <button type="submit">Login</button>
        </form>
        <hr />
        <button className="google-btn" onClick={handleGoogleLogin}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
