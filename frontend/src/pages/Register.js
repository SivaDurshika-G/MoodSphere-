import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../services/api';
import '../assets/styles/Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      alert('Registered successfully!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed.');
    }
  };

  const handleGoogleRegister = () => {
    // Remove trailing slash from API base to avoid double-slash URLs
    const base = (process.env.REACT_APP_API_BASE || '').replace(/\/$/, '');
    window.location.href = `${base}/auth/google`;
    // Or: window.location.href = new URL('/auth/google', process.env.REACT_APP_API_BASE || '').toString();
  };

  return (
    <div className="page auth">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="username" 
            placeholder="Username"
            value={formData.username} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email"
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password"
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <button type="submit">Register</button>
        </form>
        <hr />
        <button className="google-btn" onClick={handleGoogleRegister}>
          Sign up with Google
        </button>
      </div>
    </div>
  );
}
