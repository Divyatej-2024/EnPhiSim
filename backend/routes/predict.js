// backend/routes/predict.js
import express from 'express';
import axios from 'axios';
import https from 'https';

const router = express.Router();

// ML server URL from environment variables
const ML_SERVER_URL = process.env.ML_SERVER_URL || 'https://enphisim-ol7w.onrender.com';
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Create HTTPS agent to handle potential SSL issues (optional, remove if not needed)
const httpsAgent = new https.Agent({  
  rejectUnauthorized: false  // Only use this for debugging, remove in production
});

/**
 * POST /api/predict
 * Forwards prediction requests to the ML server
 */
router.post('/', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { text, links } = req.body;
    
    console.log('='.repeat(50));
    console.log('PREDICTION REQUEST RECEIVED');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Text length: ${text?.length || 0} characters`);
    console.log(`Links: ${links?.length || 0} provided`);
    console.log(`ML Server URL: ${ML_SERVER_URL}`);
    
    // Validate input
    if (!text || text.trim().length === 0) {
      console.error('ERROR: No text provided');
      return res.status(400).json({ 
        error: 'No text provided',
        details: 'Text field is required and cannot be empty'
      });
    }
    
    // Forward request to ML server
    console.log('Forwarding request to ML server...');
    
    const mlResponse = await axios.post(`${ML_SERVER_URL}/predict`, {
      text: text,
      links: links || []
    }, {
      timeout: REQUEST_TIMEOUT,
      httpsAgent: httpsAgent, // Remove this line if you don't need custom HTTPS agent
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const duration = Date.now() - startTime;
    console.log(`ML server responded successfully in ${duration}ms`);
    console.log('Response data:', JSON.stringify(mlResponse.data).substring(0, 200));
    
    // Return the ML server's response
    res.json(mlResponse.data);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('='.repeat(50));
    console.error(`ERROR after ${duration}ms:`);
    
    if (error.response) {
      // The ML server responded with an error status
      console.error('ML server error response:');
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Data: ${JSON.stringify(error.response.data)}`);
      console.error(`  Headers: ${JSON.stringify(error.response.headers)}`);
      
      res.status(error.response.status).json({
        error: 'ML server error',
        status: error.response.status,
        details: error.response.data
      });
      
    } else if (error.request) {
      // No response received from ML server
      console.error('No response from ML server:');
      console.error(`  Code: ${error.code}`);
      console.error(`  Message: ${error.message}`);
      console.error(`  Address: ${ML_SERVER_URL}`);
      
      res.status(503).json({
        error: 'ML server unavailable',
        code: error.code,
        message: error.message,
        details: 'The ML server did not respond. Check if it is running.'
      });
      
    } else {
      // Error setting up the request
      console.error('Request setup error:');
      console.error(`  Message: ${error.message}`);
      console.error(`  Stack: ${error.stack}`);
      
      res.status(500).json({
        error: 'Failed to process prediction request',
        message: error.message,
        details: 'Error occurred while setting up the request to ML server'
      });
    }
    
    console.error('='.repeat(50));
  }
});

/**
 * GET /api/predict/health
 * Check if ML server is reachable
 */
router.get('/health', async (req, res) => {
  try {
    console.log('Checking ML server health...');
    
    const mlHealth = await axios.get(`${ML_SERVER_URL}/health`, {
      timeout: 5000
    });
    
    res.json({
      status: 'healthy',
      ml_server: {
        url: ML_SERVER_URL,
        reachable: true,
        response: mlHealth.data
      }
    });
    
  } catch (error) {
    console.error('ML server health check failed:', error.message);
    
    res.status(503).json({
      status: 'degraded',
      ml_server: {
        url: ML_SERVER_URL,
        reachable: false,
        error: error.message
      }
    });
  }
});

/**
 * GET /api/predict/info
 * Get information about the prediction service
 */
router.get('/info', (req, res) => {
  res.json({
    service: 'EnPhiSim Prediction API',
    version: '1.0.0',
    ml_server_url: ML_SERVER_URL,
    timeout_ms: REQUEST_TIMEOUT,
    features: ['text_classification', 'phishing_detection']
  });
});

export default router;
