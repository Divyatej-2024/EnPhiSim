// backend/routes/modelMetrics.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', async (req, res) => {
  try {
    // Try to read metrics file
    const metricsPath = path.join(__dirname, '../../ml_server/models/model_metrics.json');
    
    if (fs.existsSync(metricsPath)) {
      const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
      res.json(metrics);
    } else {
      // Return placeholder if no metrics yet
      res.json({
        accuracy: 0.85,
        precision: 0.83,
        recall: 0.88,
        f1: 0.85,
        confusion_matrix: [[15, 3], [2, 20]],
        note: "Placeholder - Train model for real metrics"
      });
    }
  } catch (error) {
    console.error('Error loading metrics:', error);
    res.status(500).json({ error: 'Failed to load metrics' });
  }
});

export default router;