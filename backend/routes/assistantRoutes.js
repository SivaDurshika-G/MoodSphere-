// backend/routes/assistantRoutes.js

const express = require('express');
const { chatWithAssistant } = require('../controllers/assistantController');
const router = express.Router();

router.post('/chat', chatWithAssistant);

module.exports = router;
