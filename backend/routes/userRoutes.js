const express = require('express');
const { getProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', protect, getProfile);

module.exports = router;
