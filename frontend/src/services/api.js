// frontend/src/services/api.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'https://enphisim-1.onrender.com';

const api = {
  // Get all levels
  getLevels: async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/levels`);
      return response.data;
    } catch (error) {
      console.error('API getLevels error:', error);
      throw error;
    }
  },

  // Save user action
  saveAction: async (actionData) => {
    try {
      const response = await axios.post(`${API_BASE}/api/action`, actionData);
      return response.data;
    } catch (error) {
      console.error('API saveAction error:', error);
      throw error;
    }
  },

  // Get ML prediction
  getPrediction: async ({ userId, levelId, text }) => {
    try {
      const response = await axios.post(`${API_BASE}/api/predict`, {
        user_id: userId,
        level_id: levelId,
        text: text
      });
      return {
        prediction: response.data.distilbert?.prediction || 'unknown',
        confidence: response.data.distilbert?.confidence || 0,
        probabilities: response.data
      };
    } catch (error) {
      console.error('API getPrediction error:', error);
      // Return mock data
      return {
        prediction: 'phishing',
        confidence: 0.75,
        probabilities: {
          distilbert: { prediction: 'phishing', confidence: 0.75 },
          cnn: { prediction: 'phishing', confidence: 0.70 }
        }
      };
    }
  },

  // Send user action to backend
  sendUserAction: async (actionData) => {
    try {
      const response = await axios.post(`${API_BASE}/api/action`, {
        scenario_id: actionData.levelId,
        user_action: actionData.action,
        ml_predictions: {
          distilbert: { 
            prediction: actionData.mlPrediction,
            confidence: actionData.mlConfidence 
          }
        },
        time_taken_seconds: 0,
        session_id: actionData.userId,
        level: actionData.levelId
      });
      return response.data;
    } catch (error) {
      console.error('API sendUserAction error:', error);
      throw error;
    }
  },
recordConsent: async (consentData) => {
  try {
    const response = await axios.post(`${API_BASE}/api/consent`, consentData);
    return response.data;
  } catch (error) {
    console.error('API recordConsent error:', error);
    throw error;
  }
},

  // Get analytics
  getAnalytics: async (sessionId, range = 'week') => {
    try {
      const response = await axios.get(`${API_BASE}/api/analytics/${sessionId}?range=${range}`);
      return response.data;
    } catch (error) {
      console.error('API getAnalytics error:', error);
      throw error;
    }
  }
};

// Add this method to your api object


export default api;