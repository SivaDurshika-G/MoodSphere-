import React, { useState, useEffect } from 'react';
import { API } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem('resetEmail');
  const step = localStorage.getItem('resetStep');

  // 🚫 Redirect if reached without completing OTP verification
  useEffect(() => {
    if (!email || step !== 'otpVerified') {
      navigate('/forgot-password');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await API.post('/auth/reset-password', {
        email,
        password,
      });

      setMessage('✅ Password reset successful! Redirecting...');
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetStep');

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
