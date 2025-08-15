import React, { useEffect } from 'react';
import BrandLogo from '../components/BrandLogo';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';
import '../assets/styles/privacy.css';

export default function Privacy() {
  // Load theme on component mount
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  return (
    <>
      <BrandLogo />
      <ThemeToggle />
      <div className="page-wrapper">
        <div className="app-container">
          <h1>Privacy Policy</h1>
          
          <div className="intro-text">
            <p>Your privacy is important to us. This Privacy Policy explains how MoodSphere ("we", "our", or "us") collects, uses, and safeguards your information when you use our service.</p>
          </div>

          <div className="security-badge">
            Your data is protected with industry-standard security measures.
          </div>

          <h3>1. Information We Collect</h3>
          <ul>
            <li>Personal Information: Email address (if you register).</li>
            <li>Mood Entries: Emotions you log along with any notes.</li>
            <li>Usage Data: Pages you visit and actions you take.</li>
          </ul>

          <h3>2. How We Use Your Information</h3>
          <ul>
            <li>To provide and maintain the service.</li>
            <li>To personalize your experience.</li>
            <li>To send you notifications and reminders.</li>
          </ul>

          <div className="highlight-box">
            <p><strong>Data Minimization:</strong> We only collect the minimum amount of data necessary to provide our services effectively.</p>
          </div>

          <h3>3. Data Retention</h3>
          <p>We retain your mood entries and notes until you delete them or your account. You have full control over your data at all times.</p>

          <h3>4. Your Rights</h3>
          <ul>
            <li>Access: You can view all your data at any time.</li>
            <li>Deletion: You can delete any mood entry or your entire history.</li>
            <li>Opt-out: You can disable reminders and notifications in settings.</li>
            <li>Portability: You can export your data in a common format.</li>
          </ul>

          <div className="disclaimer-box">
            <p><strong>Important:</strong> MoodSphere is not a substitute for professional mental health care. If you're experiencing serious mental health issues, please consult with a qualified healthcare provider.</p>
          </div>

          <h3>5. Data Security</h3>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

          <h3>6. Contact Us</h3>
          <div className="contact-info">
            <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:privacy@moodsphere.com" className="email-link">privacy@moodsphere.com</a></p>
          </div>

          <div className="support-resources">
            <h4>Mental Health Resources:</h4>
            <p>• National Suicide Prevention Lifeline: <a href="tel:988">988</a></p>
            <p>• Crisis Text Line: Text HOME to <a href="sms:741741">741741</a></p>
            <p>• International Association for Suicide Prevention: <a href="https://www.iasp.info/resources/Crisis_Centres/" target="_blank" rel="noopener noreferrer">iasp.info</a></p>
          </div>

          <a href="/" className="back-link">Back to Home</a>
        </div>
        <Footer />
      </div>
    </>
  );
}