const User             = require('../models/User');
const jwt              = require('jsonwebtoken');
const sendWelcomeEmail = require('../utils/sendWelcomeEmail');
const sendOtpEmail     = require('../utils/sendOtpEmail');

// JWT helper
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─── REGISTER ───────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ username, email, password });
    await sendWelcomeEmail(user.email, user.username);
    res.status(201).json({
      _id:      user._id,
      username: user.username,
      token:    generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── LOGIN ──────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      return res.json({
        _id:      user._id,
        username: user.username,
        token:    generateToken(user._id),
      });
    }
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── SEND OTP ────────────────────────────────────────────────────────────────
exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp        = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendOtpEmail(user.email, otp);
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── VERIFY OTP ─────────────────────────────────────────────────────────────
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpires ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark that OTP was validated; you could set a flag here
    user.otpValidated = true;
    user.otp          = undefined;
    user.otpExpires   = undefined;
    await user.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── RESET PASSWORD ─────────────────────────────────────────────────────────
// ─── RESET PASSWORD ─────────────────────────────────────────────────────────

exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Optional: hash password
    user.password = password; // if password hashing is in pre-save, this is fine
    user.otp = null;          // clear old OTP
    user.otpExpiry = null;    // clear OTP expiry
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
