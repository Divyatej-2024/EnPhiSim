import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.get('/', (req, res) => {
  try {
    // Construct the path to your metrics file.
    // Adjust this path if your ml_server folder is located elsewhere.
    const metricsPath = path.join(__dirname, '../../ml_server/models/model_metrics.json');
    
    if (fs.existsSync(metricsPath)) {
      const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
      res.json(metrics);
    } else {
      // Return a clear error if the file isn't found.
      res.status(404).json({ 
        error: 'Model metrics not found. Please train the model first.' 
      });
    }
  } catch (error) {
    console.error('Error reading metrics:', error);
    res.status(500).json({ error: 'Failed to load model metrics' });
  }
});

export default router;