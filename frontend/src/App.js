import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import BrandLogo from './components/BrandLogo';
import ThemeToggle from './components/ThemeToggle';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import OAuthSuccess from './pages/OAuthSuccess';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import MoodCalendar from './pages/CalendarPage';
import Contributors from './pages/Contributors';
import IntroScreen from "./components/IntroScreen";


export default function App() {
  // Apply stored theme on load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);
    const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const seenIntro = localStorage.getItem("introSeen");
    if (!seenIntro) {
      setShowIntro(true);
      localStorage.setItem("introSeen", "true");
    }
  }, []);

  if (showIntro) {
    return <IntroScreen onFinish={() => setShowIntro(false)} />;
  }

  return (
    <Router>
      {/* Always visible on all pages */}
      <BrandLogo />
      <ThemeToggle />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/calendar" element={<MoodCalendar />} />
        <Route path="/contributors" element={<Contributors />} />
      </Routes>
    </Router>
  );
}
