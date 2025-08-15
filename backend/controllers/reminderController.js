// controllers/reminderController.js
const User = require('../models/User');
const { scheduleReminder } = require('../utils/sendReminderMail');

// GET /api/reminder
exports.getReminderTime = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ reminderTime: user.reminderTime });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/reminder
exports.updateReminderTime = async (req, res) => {
  const { time } = req.body;
  if (!time) return res.status(400).json({ error: 'Time is required' });

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.reminderTime = time;
    await user.save();

    // Schedule daily reminder mail
    scheduleReminder(user);

    res.json({ success: true, reminderTime: user.reminderTime });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
