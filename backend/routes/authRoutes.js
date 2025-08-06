const express = require('express');
const passport = require('passport');
const { register, login } = require('../controllers/authController');
const router = express.Router();
const { generateToken } = require('../utils/jwt'); // You'll create this helper


// Local auth
router.post('/register', register);
router.post('/login', login);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/failure' }),
  (req, res) => {
    const token = generateToken(req.user._id); // Generate JWT for the logged-in user
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
);

// Auth status
router.get('/me', (req, res) => {
  if (req.user) {
    return res.json({ id: req.user._id, username: req.user.username, email: req.user.email });
  }
  res.status(401).json({ message: 'Not authenticated' });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.FRONTEND_URL);
});

module.exports = router;
