const express = require('express');
const axios = require('axios');

const router = express.Router();

// Replace with your repo owner and repo name
const GITHUB_OWNER = 'SivaDurshika-G'; // <-- change this
const GITHUB_REPO = 'MoodSphere-'; // <-- change this

router.get('/contributors', async (req, res) => {
  try {
    const response = await axios.get(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contributors`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching contributors:', error.message);
    res.status(500).json({ message: 'Failed to fetch contributors' });
  }
});

module.exports = router;
