import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
      window.location.reload(); // triggers navbar + theme from localStorage
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
}
