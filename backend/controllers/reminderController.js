const User = require('../models/User');

// @desc    Get user's reminder time
// @route   GET /api/reminder
// @access  Private
const getReminderTime = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ reminderTime: user.reminderTime });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update user's reminder time
// @route   PUT /api/reminder
// @access  Private
const updateReminderTime = async (req, res) => {
  const { time } = req.body;
  if (!time) return res.status(400).json({ error: 'Time is required' });

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.reminderTime = time;
    await user.save();

    res.json({ success: true, reminderTime: user.reminderTime });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getReminderTime,
  updateReminderTime,
};
