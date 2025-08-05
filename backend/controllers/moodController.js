const MoodEntry = require('../models/MoodEntry');

exports.createMood = async (req, res) => {
  const { mood, note } = req.body;
  try {
    const moodEntry = await MoodEntry.create({ user: req.user.id, mood, note });
    res.status(201).json(moodEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMoods = async (req, res) => {
  try {
    const moods = await MoodEntry.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
