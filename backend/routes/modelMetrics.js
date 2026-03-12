import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', (req, res) => {
  try {
    const metricsPath = path.join(__dirname, '../../ml_server/models/model_metrics.json');
    
    if (fs.existsSync(metricsPath)) {
      // 🔴 FIX: Read file and strip BOM
      let fileContent = fs.readFileSync(metricsPath, 'utf8');
      
      // Remove UTF-8 BOM if present (first character is U+FEFF)
      if (fileContent.charCodeAt(0) === 0xFEFF) {
        fileContent = fileContent.slice(1);
      }
      
      const metrics = JSON.parse(fileContent);
      res.json(metrics);
    } else {
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