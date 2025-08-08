const MoodEntry = require('../models/MoodEntry');
const dayjs = require('dayjs');

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
exports.getMonthlyMoods = async (req, res) => {
  const { month } = req.query; // Expected format: '2025-08'
  if (!month) return res.status(400).json({ message: 'Month is required' });

  const start = dayjs(month).startOf('month').toDate();
  const end = dayjs(month).endOf('month').toDate();

  try {
    const entries = await MoodEntry.find({
      user: req.user.id,
      createdAt: { $gte: start, $lte: end },
    });

    // Format: { "2025-08-06": [entry, entry, ...] }
    const grouped = entries.reduce((acc, entry) => {
      const dateStr = dayjs(entry.createdAt).format('YYYY-MM-DD');
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(entry);
      return acc;
    }, {});

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};