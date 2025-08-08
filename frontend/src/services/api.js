// frontend/src/services/api.js

import axios from 'axios';

// Create a reusable axios instance with base URL and token auth
export const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:5000/api',
});

// Automatically attach auth token if available
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

/**
 * Send a message (prompt) to the AI assistant
 * @param {string} message - The user's message
 * @returns {Promise<{reply: string}>}
 */
export function chatWithAssistant(message) {
  return API.post('/assistant/chat', { prompt: message }); // ✅ FIXED: using "prompt"
}

/**
 * Get coping strategies for a given emotion
 * @param {string} emotion
 * @returns {Promise<{tips: string[]}>}
 */
export function getCopingStrategies(emotion) {
  return API.post('/ai/strategies', { emotion });
}
