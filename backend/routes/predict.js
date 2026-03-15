// Sections: imports, configuration, logic, render/exports

import express from 'express';
import axios from 'axios';
//import { validatePredictPayload } from '../middleware/validator.js';
import logger from '../utils/logger.js';

const router = express.Router();

const ML_SERVER_URL = process.env.ML_SERVER_URL || 'https://enphisim-ol7w.onrender.com';
const ML_API_KEY = process.env.ML_API_KEY;
const REQUEST_TIMEOUT = 30000;

const mlClient = axios.create({
  baseURL: ML_SERVER_URL.replace(/\/+$/, ''),
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': ML_API_KEY,
  },
});

router.post('/', async (req, res) => {
  console.log('='.repeat(50));
  console.log('PREDICT ROUTE HIT at', new Date().toISOString());
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Headers:', req.headers['x-api-key'] ? 'API key present' : 'No API key');
  
  const startTime = Date.now();

  try {
    const { text, links } = req.body;
console.log('Extracted text length:', text?.length);
    console.log('Links present:', !!links);

    if (!text) {
      console.log('No text in request body');
      return res.status(400).json({
        success: false,
        error: 'Missing text field'
      });
    }

    console.log('Sending to ML server at:', ML_SERVER_URL);
    
    const mlResponse = await mlClient.post('/predict', {
      text,
      links: Array.isArray(links) ? links : [],
    });
  console.log('âœ… ML server responded with status:', mlResponse.status);
    console.log('âœ… ML response data:', JSON.stringify(mlResponse.data, null, 2));


    logger.info('Prediction request completed', {
      durationMs: Date.now() - startTime,
      textLength: text.length,
    });

    res.json(mlResponse.data);
  } catch (error) {
    const duration = Date.now() - startTime;
 console.error('âŒ ERROR CAUGHT:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });

    if (error.response) {
      logger.warn('ML server returned error response', {
        status: error.response.status,
        durationMs: duration,
      });

      return res.status(502).json({
        success: false,
        error: 'Prediction service error',
      });
    }

    if (error.request) {
      logger.warn('ML server did not respond', {
        code: error.code,
        durationMs: duration,
      });

      return res.status(503).json({
        success: false,
        error: 'Prediction service unavailable',
      });
    }

    logger.error('Prediction request setup failed', {
      message: error.message,
      durationMs: duration,
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to process prediction request',
    });
  } finally {
    console.log('Request processing completed in');
    console.log('='.repeat(50));
  }
});

router.get('/health', async (_req, res) => {
  try {
    const mlHealth = await mlClient.get('/health', { timeout: 5000 });

    res.json({
      status: 'healthy',
      ml_server: {
        url: ML_SERVER_URL,
        reachable: true,
        response: mlHealth.data,
      },
    });
  } catch (error) {
    logger.warn('ML health check failed', { message: error.message });

    res.status(503).json({
      status: 'degraded',
      ml_server: {
        url: ML_SERVER_URL,
        reachable: false,
      },
    });
  }
});

router.get('/info', (_req, res) => {
  res.json({
    service: 'EnPhiSim Prediction API',
    version: '1.1.0',
    timeout_ms: REQUEST_TIMEOUT,
    features: ['text_classification', 'phishing_detection'],
  });
});

export default router;
