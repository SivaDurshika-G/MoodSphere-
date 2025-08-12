const express = require('express');
const { createMood, getMoods, getMonthlyMoods,deleteMood, deleteAllMoods } = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createMood)
  .get(protect, getMoods);
router.get('/monthly', protect, getMonthlyMoods); // ✅ NEW ROUTE
router.delete('/:id', protect, deleteMood); // ✅ NEW ROUTE
router.delete('/all', protect, deleteAllMoods); // ✅ New route for reset

module.exports = router;
