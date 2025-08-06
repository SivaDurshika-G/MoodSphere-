import React, { useEffect } from 'react';
import BrandLogo from '../components/BrandLogo';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';
import '../assets/styles/terms.css';

export default function Terms() {
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
          <h1>Terms & Conditions</h1>
          
          <div className="acceptance-box">
            <p>Welcome to MoodSphere. By accessing or using our service, you agree to be bound by these Terms & Conditions.</p>
          </div>

          <p>These terms and conditions ("Terms") govern your use of the MoodSphere application and services. Please read them carefully before using our service.</p>

          <h3>1. Use of Service</h3>
          <div className="terms-section">
            <ul>
              <li>You must be at least 13 years old to use MoodSphere.</li>
              <li>Do not use the service for unlawful purposes.</li>
              <li>You are responsible for maintaining the confidentiality of your account.</li>
              <li>You agree to use the service in compliance with all applicable laws and regulations.</li>
            </ul>
          </div>

          <h3>2. User Accounts</h3>
          <ul>
            <li>You are responsible for safeguarding your login credentials.</li>
            <li>All activities under your account are your responsibility.</li>
            <li>You must provide accurate and complete information when creating an account.</li>
            <li>You may not create multiple accounts or share your account with others.</li>
          </ul>

          <div className="highlight-box">
            <p><strong>Account Security:</strong> We recommend using a strong, unique password and enabling two-factor authentication when available.</p>
          </div>

          <h3>3. Intellectual Property</h3>
          <p>All content, features, and functionality of MoodSphere, including but not limited to text, graphics, logos, and software, are the property of MoodSphere and its licensors and are protected by copyright, trademark, and other intellectual property laws.</p>

          <h3>4. User Content</h3>
          <div className="terms-section">
            <p>You retain ownership of the mood entries and notes you create. However, by using our service, you grant us a license to store, process, and display your content as necessary to provide the service.</p>
          </div>

          <h3>5. Prohibited Uses</h3>
          <p>You may not use MoodSphere for any of the following purposes:</p>
          <ul>
            <li>Violating any applicable laws or regulations</li>
            <li>Harassing, abusing, or harming others</li>
            <li>Transmitting malicious code or attempting to compromise system security</li>
            <li>Collecting personal information about other users without consent</li>
          </ul>

          <h3>6. Limitation of Liability</h3>
          <div className="legal-disclaimer">
            <p>In no event shall MoodSphere be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses.</p>
          </div>

          <h3>7. Service Availability</h3>
          <p>While we strive to maintain continuous service availability, MoodSphere may be temporarily unavailable due to maintenance, updates, or technical issues. We are not liable for any inconvenience caused by service interruptions.</p>

          <div className="disclaimer-box">
            <p><strong>Medical Disclaimer:</strong> MoodSphere is not a medical device or healthcare service. Our app is designed for mood tracking and personal wellness only and should not replace professional medical advice or treatment.</p>
          </div>

          <h3>8. Changes to Terms</h3>
          <p>We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through the app. Continued use of the service after changes indicates acceptance of the new terms.</p>

          <h3>9. Termination</h3>
          <p>We may terminate or suspend your account and access to the service at our discretion, with or without notice, if you violate these Terms or engage in harmful behavior.</p>

          <h3>10. Contact Information</h3>
          <div className="contact-info">
            <p>If you have any questions about these Terms & Conditions, please contact us at: <a href="mailto:legal@moodsphere.com" className="email-link">legal@moodsphere.com</a></p>
          </div>

          <div className="support-resources">
            <h4>Need Help?</h4>
            <p>• Support Email: <a href="mailto:support@moodsphere.com">support@moodsphere.com</a></p>
            <p>• Help Center: <a href="/help" target="_blank" rel="noopener noreferrer">moodsphere.com/help</a></p>
            <p>• Community Guidelines: <a href="/community" target="_blank" rel="noopener noreferrer">moodsphere.com/community</a></p>
          </div>

          <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

          <a href="/" className="back-link">Back to Home</a>
        </div>
        <Footer />
      </div>
    </>
  );
}