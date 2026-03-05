import express from 'express';
import axios from 'axios';

const router = express.Router();

// Your ML server URL - set this in environment variables
const ML_SERVER_URL = process.env.ML_SERVER_URL || 'https://enphisim-ol7w.onrender.com';

router.post('/', async (req, res) => {
  try {
    const { text, links } = req.body;
    console.log(' Forwarding prediction request to ML server...');
    console.log(' Text length:', text?.length);
    
    // Forward the request to your real ML server
    const mlResponse = await axios.post(`${ML_SERVER_URL}/predict`, {
      text: text,
      links: links || []
    });
    
    console.log(' ML server responded successfully');
    res.json(mlResponse.data);
    
  } catch (error) {
    console.error(' Error calling ML server:', error.message);
    
    // If ML server fails, return error (don't fall back to random)
    res.status(500).json({ 
      error: 'ML server unavailable',
      details: error.message 
    });
  }
});

export default router;
