// routes/reminderRoutes.js
const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getReminderTime,
  updateReminderTime
} = require('../controllers/reminderController');

router.get('/',  protect, getReminderTime);
router.put('/',  protect, updateReminderTime);

module.exports = router;
