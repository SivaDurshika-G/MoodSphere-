import React, { useState } from 'react';
import { API } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
      localStorage.setItem('resetEmail', email);        // mark step 1 done
      localStorage.setItem('resetStep', 'otpSent');     // step tracking
      navigate('/verify-otp');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="page forgot-password">
      <div className="forgot-password-card">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send OTP</button>
        </form>
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}