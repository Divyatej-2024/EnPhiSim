// Sections: imports, configuration, logic, render/exports

import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'https://enphisim-1.onrender.com';
const BACKEND_API_KEY = process.env.REACT_APP_BACKEND_API_KEY;
const ML_API_KEY = process.env.REACT_APP_ML_API_KEY;

const PROD_BACKEND_FALLBACKS = [
  'https://enphisim-backend.onrender.com',
  'https://enphisim-1.onrender.com',
];

export const BACKEND_URL_CANDIDATES = [
  API_BASE,
  ...PROD_BACKEND_FALLBACKS,
].filter((url, index, arr) => Boolean(url) && arr.indexOf(url) === index);

const MUTATING_METHODS = new Set(['post', 'put', 'patch', 'delete']);

let csrfToken = null;
let tokenExpiryAt = 0;
let inflightTokenRequest = null;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'x-api-key': BACKEND_API_KEY,      // For backend authentication
    'X-API-Key': ML_API_KEY,           // For ML server authentication (passed through)
  },
});

async function fetchCsrfToken(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && csrfToken && now < tokenExpiryAt) {
    return csrfToken;
  }

  if (!inflightTokenRequest) {
    inflightTokenRequest = axiosInstance
      .get('/api/csrf-token')
      .then((response) => {
        const token = response?.data?.data?.csrfToken;
        const expiresIn = Number(response?.data?.data?.expiresIn || 3600);

        if (!token) {
          throw new Error('CSRF token missing from response');
        }

        csrfToken = token;
        tokenExpiryAt = Date.now() + expiresIn * 1000;
        return csrfToken;
      })
      .finally(() => {
        inflightTokenRequest = null;
      });
  }

  return inflightTokenRequest;
}

axiosInstance.interceptors.request.use(
  async (config) => {
    const method = String(config.method || 'get').toLowerCase();
    if (MUTATING_METHODS.has(method)) {
      const token = await fetchCsrfToken();
      config.headers['X-CSRF-Token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isInvalidCsrf =
      error?.response?.status === 403 &&
      error?.response?.data?.error?.code === 'INVALID_CSRF_TOKEN';

    if (isInvalidCsrf && !error.config?._retryCsrf) {
      error.config._retryCsrf = true;
      csrfToken = null;
      tokenExpiryAt = 0;
      const token = await fetchCsrfToken(true);
      error.config.headers['X-CSRF-Token'] = token;
      return axiosInstance.request(error.config);
    }

    return Promise.reject(error);
  }
);

const api = {
  getLevels: async () => {
    const response = await axiosInstance.get('/api/levels');
    return response.data;
  },

  saveAction: async (actionData) => {
    const response = await axiosInstance.post('/api/action', actionData);
    return response.data;
  },

  // This getPrediction is properly inside the api object
  getPrediction: async ({ userId, levelId, text, links = [] }) => {
    console.log(' Getting ML prediction for text:', text?.substring(0, 50) || 'empty');
    
    const response = await axiosInstance.post('/api/predict', {
      user_id: userId,
      level_id: levelId,
      text,
      links,
    });
    
    return response.data;
  },

  sendUserAction: async (actionData) => {
    const response = await axiosInstance.post('/api/action', {
      scenario_id: actionData.levelId,
      user_action: actionData.action,
      ml_predictions: {
        distilbert: {
          prediction: actionData.mlPrediction,
          confidence: actionData.mlConfidence,
        },
      },
      time_taken_seconds: actionData.timeTaken || 0,
      session_id: actionData.userId,
      level: actionData.levelId,
      is_correct: actionData.isCorrect,
    });
    return response.data;
  },

  recordConsent: async (consentData) => {
    const response = await axiosInstance.post('/api/consent', consentData);
    return response.data;
  },

  getAnalytics: async (sessionId, range = 'week') => {
    const response = await axiosInstance.get(`/api/analytics/${sessionId}?range=${range}`);
    return response.data;
  },

  getModelMetrics: async () => {
    const response = await axiosInstance.get('/api/model-metrics');
    return response.data;
  },

  checkHealth: async () => {
    const response = await axiosInstance.get('/health');
    return response.data;
  },

  clearCsrfToken: () => {
    csrfToken = null;
    tokenExpiryAt = 0;
    inflightTokenRequest = null;
  },
};

export default api;

