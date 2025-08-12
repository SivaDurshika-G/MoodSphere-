const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load variables from .env

const router = express.Router();

// Replace with your repo owner and repo name
const GITHUB_OWNER = 'SivaDurshika-G';
const GITHUB_REPO = 'MoodSphere-';

// Load token from .env
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

router.get('/contributors', async (req, res) => {
  try {
    // Always send Accept header
    const headers = {
      Accept: 'application/vnd.github.v3+json',
    };

    // If token is provided, add it to Authorization header
    if (GITHUB_TOKEN) {
      headers.Authorization = `token ${GITHUB_TOKEN}`;
    }

    const response = await axios.get(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contributors`,
      { headers }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      'Error fetching contributors:',
      error.response?.data || error.message
    );
    res.status(500).json({ message: 'Failed to fetch contributors' });
  }
});

module.exports = router;
