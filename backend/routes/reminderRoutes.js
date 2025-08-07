const express = require('express');
const router = express.Router();
const { getReminderTime, updateReminderTime } = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getReminderTime);
router.put('/', protect, updateReminderTime);

module.exports = router;
