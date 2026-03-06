// frontend/src/services/api.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'https://enphisim-1.onrender.com';

// CSRF token management
let csrfToken = null;
let tokenExpiry = null;

// Create axios instance with defaults
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Required for cookies
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add CSRF token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Skip CSRF for GET requests and health check
    if (config.method === 'get' || config.url.includes('/health')) {
      return config;
    }

    // Get CSRF token for state-changing requests
    const token = await getCsrfToken();
    if (token) {
      config.headers['X-CSRF-Token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle CSRF token errors
    if (error.response?.status === 403 && 
        error.response?.data?.error?.code === 'INVALID_CSRF_TOKEN') {
      console.warn('CSRF token invalid, clearing and retrying...');
      csrfToken = null;
      tokenExpiry = null;
    }
    return Promise.reject(error);
  }
);

/**
 * Fetch CSRF token from server
 * @returns {Promise<string>} CSRF token
 */
const getCsrfToken = async () => {
  // Check if we have a valid token
  if (csrfToken && tokenExpiry && Date.now() < tokenExpiry) {
    return csrfToken;
  }

  try {
    const response = await axiosInstance.get('/api/csrf-token');
    if (response.data.success) {
      csrfToken = response.data.data.csrfToken;
      // Token expires in 1 hour (3600 seconds)
      tokenExpiry = Date.now() + (response.data.data.expiresIn * 1000);
      return csrfToken;
    }
    throw new Error('Failed to get CSRF token');
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return null;
  }
};

const api = {
  // Get all levels
  getLevels: async () => {
    try {
      const response = await axiosInstance.get('/api/levels');
      return response.data;
    } catch (error) {
      console.error('API getLevels error:', error);
      throw error;
    }
  },

  // Save user action
  saveAction: async (actionData) => {
    try {
      const response = await axiosInstance.post('/api/action', actionData);
      return response.data;
    } catch (error) {
      console.error('API saveAction error:', error);
      throw error;
    }
  },

  // Get ML prediction
  getPrediction: async ({ userId, levelId, text }) => {
    try {
      const response = await axiosInstance.post('/api/predict', {
        user_id: userId,
        level_id: levelId,
        text: text
      });
      
      // Handle different response formats
      if (response.data.distilbert) {
        return {
          prediction: response.data.distilbert?.prediction || 'unknown',
          confidence: response.data.distilbert?.confidence || 0,
          probabilities: response.data
        };
      }
      
      // Fallback if format is different
      return {
        prediction: response.data.prediction || 'unknown',
        confidence: response.data.confidence || 0,
        probabilities: response.data
      };
    } catch (error) {
      console.error('API getPrediction error:', error);
      // Return error state
      return {
        prediction: 'error',
        confidence: 0,
        probabilities: {
          distilbert: { prediction: 'error', confidence: 0 },
          cnn: { prediction: 'error', confidence: 0 }
        }
      };
    }
  },

  // Send user action to backend (alternative method)
  sendUserAction: async (actionData) => {
    try {
      const response = await axiosInstance.post('/api/action', {
        scenario_id: actionData.levelId,
        user_action: actionData.action,
        ml_predictions: {
          distilbert: { 
            prediction: actionData.mlPrediction,
            confidence: actionData.mlConfidence 
          }
        },
        time_taken_seconds: actionData.timeTaken || 0,
        session_id: actionData.userId,
        level: actionData.levelId,
        is_correct: actionData.isCorrect
      });
      return response.data;
    } catch (error) {
      console.error('API sendUserAction error:', error);
      throw error;
    }
  },

  // Record user consent
  recordConsent: async (consentData) => {
    try {
      const response = await axiosInstance.post('/api/consent', consentData);
      return response.data;
    } catch (error) {
      console.error('API recordConsent error:', error);
      throw error;
    }
  },

  // Get analytics for session
  getAnalytics: async (sessionId, range = 'week') => {
    try {
      const response = await axiosInstance.get(`/api/analytics/${sessionId}?range=${range}`, {
        withCredentials: false
      });
      return response.data;
  },

  // Get model metrics
  getModelMetrics: async () => {
    try {
      const response = await axiosInstance.get('/api/model-metrics');
      return response.data;
    } catch (error) {
      console.error('API getModelMetrics error:', error);
      throw error;
    }
  },

  // Health check
  checkHealth: async () => {
    try {
      const response = await axiosInstance.get('/health');
      return response.data;
    } catch (error) {
      console.error('API health check error:', error);
      throw error;
    }
  },

  // Clear CSRF token (useful for logout)
  clearCsrfToken: () => {
    csrfToken = null;
    tokenExpiry = null;
  }
};

export default api;
