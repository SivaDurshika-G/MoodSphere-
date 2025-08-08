const express = require('express');
const { createMood, getMoods, getMonthlyMoods } = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createMood)
  .get(protect, getMoods);
router.get('/monthly', protect, getMonthlyMoods); // ✅ NEW ROUTE

module.exports = router;
