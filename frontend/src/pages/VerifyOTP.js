import React, { useState, useEffect } from 'react';
import { API } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail');
  const step = localStorage.getItem('resetStep');

  // 🚫 Redirect if reached without completing previous step
  useEffect(() => {
    if (!email || step !== 'otpSent') {
      navigate('/forgot-password');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/auth/verify-otp', {
        email,
        otp: otp.trim(),
      });

      setMessage(res.data.message);
      localStorage.setItem('resetStep', 'otpVerified'); // next step allowed
      navigate('/reset-password');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid or expired OTP');
    }
  };

  return (
    <div className="form-container">
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
