const express = require('express');
const { createMood, getMoods } = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createMood)
  .get(protect, getMoods);

module.exports = router;
