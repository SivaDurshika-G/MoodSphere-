const express = require('express');
const passport = require('passport');
const router = express.Router();
const {
  register,
  login,
  sendOTP,
  verifyOTP,
  resetPassword,
} = require('../controllers/authController');
const { generateToken } = require('../utils/jwt');

// Local authentication
router.post('/register', register);
router.post('/login', login);

// Forgot Password with OTP
router.post('/forgot-password', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/failure' }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
);

// Auth status
router.get('/me', (req, res) => {
  if (req.user) {
    return res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    });
  }
  res.status(401).json({ message: 'Not authenticated' });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.redirect(process.env.FRONTEND_URL);
  });
});

module.exports = router;
