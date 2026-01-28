/**
 * API Service
 *
 * Handles communication with the Flask backend API
 */

import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 by clearing token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
    }
    return Promise.reject(error);
  }
);

// ============================================
// Health Check
// ============================================

/**
 * Health check
 * @returns {Promise} API response
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// ============================================
// Food Prediction
// ============================================

/**
 * Predict food from image
 * @param {File} imageFile - Image file to analyze
 * @returns {Promise} Prediction results
 */
export const predictFood = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Prediction failed:', error);

    if (error.response) {
      throw new Error(error.response.data.error || 'Prediction failed');
    } else if (error.request) {
      throw new Error('Could not connect to server. Please ensure the backend is running.');
    } else {
      throw new Error('Error preparing request');
    }
  }
};

/**
 * Get healthier alternatives for a food item
 * @param {string} foodName - Food name
 * @returns {Promise} Alternative suggestions
 */
export const getAlternatives = async (foodName) => {
  try {
    const response = await api.get(`/alternatives/${encodeURIComponent(foodName)}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get alternatives:', error);
    throw error;
  }
};

// ============================================
// Authentication
// ============================================

/**
 * Register a new user
 * @param {string} username
 * @param {string} password
 * @returns {Promise} User data
 */
export const register = async (username, password) => {
  const response = await api.post('/auth/register', { username, password });
  return response.data;
};

/**
 * Login user
 * @param {string} username
 * @param {string} password
 * @returns {Promise} User data
 */
export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

/**
 * Logout user
 * @returns {Promise}
 */
export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

/**
 * Get current user
 * @returns {Promise} User data or null
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// ============================================
// User Profile
// ============================================

/**
 * Get user profile
 * @returns {Promise} Profile data
 */
export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} Updated profile
 */
export const updateProfile = async (profileData) => {
  const response = await api.put('/profile', profileData);
  return response.data;
};

/**
 * Get profile options (health goals, dietary restrictions)
 * @returns {Promise} Available options
 */
export const getProfileOptions = async () => {
  const response = await api.get('/profile/options');
  return response.data;
};

// ============================================
// Meal History
// ============================================

/**
 * Get meal history
 * @param {number} days - Days to look back
 * @param {string} food - Filter by food name
 * @returns {Promise} List of meals
 */
export const getMeals = async (days = 7, food = null) => {
  const params = new URLSearchParams({ days });
  if (food) params.append('food', food);

  const response = await api.get(`/meals?${params}`);
  return response.data;
};

/**
 * Log a meal
 * @param {Object} mealData - Meal data
 * @returns {Promise} Created meal
 */
export const logMeal = async (mealData) => {
  const response = await api.post('/meals', mealData);
  return response.data;
};

/**
 * Get today's meals and totals
 * @returns {Promise} Today's data
 */
export const getTodayMeals = async () => {
  const response = await api.get('/meals/today');
  return response.data;
};

/**
 * Get meal statistics
 * @param {string} period - 'daily' or 'weekly'
 * @param {string} date - Date for daily stats (YYYY-MM-DD)
 * @returns {Promise} Statistics
 */
export const getMealStats = async (period = 'weekly', date = null) => {
  const params = new URLSearchParams({ period });
  if (date) params.append('date', date);

  const response = await api.get(`/meals/stats?${params}`);
  return response.data;
};

/**
 * Get frequently logged foods
 * @param {number} days - Days to look back
 * @returns {Promise} Frequent foods
 */
export const getFrequentFoods = async (days = 30) => {
  const response = await api.get(`/meals/frequent?days=${days}`);
  return response.data;
};

// ============================================
// Chat / Diet Advisor
// ============================================

/**
 * Send a message to the Diet Advisor
 * @param {string} message - User message
 * @param {number} conversationId - Optional conversation ID
 * @returns {Promise} Agent response
 */
export const sendChatMessage = async (message, conversationId = null) => {
  const data = { message };
  if (conversationId) data.conversation_id = conversationId;

  const response = await api.post('/chat', data);
  return response.data;
};

/**
 * Get conversation list
 * @returns {Promise} List of conversations
 */
export const getConversations = async () => {
  const response = await api.get('/conversations');
  return response.data;
};

/**
 * Get a specific conversation with messages
 * @param {number} conversationId
 * @returns {Promise} Conversation data
 */
export const getConversation = async (conversationId) => {
  const response = await api.get(`/conversations/${conversationId}`);
  return response.data;
};

/**
 * Delete a conversation
 * @param {number} conversationId
 * @returns {Promise}
 */
export const deleteConversation = async (conversationId) => {
  const response = await api.delete(`/conversations/${conversationId}`);
  return response.data;
};

/**
 * Create a new conversation
 * @param {string} title - Optional title
 * @returns {Promise} Created conversation
 */
export const createConversation = async (title = null) => {
  const data = title ? { title } : {};
  const response = await api.post('/conversations', data);
  return response.data;
};

export default api;
