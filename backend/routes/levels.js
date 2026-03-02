import express from 'express';
import { MongoClient } from 'mongodb';

const router = express.Router();

// GET all levels/scenarios
router.get('/', async (req, res) => {
  let client;
  try {
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db('EnPhiSimdb');
    const collection = database.collection('levelDataset');
    
    const scenarios = await collection.find({}).toArray();
    console.log(`✅ Levels API: Found ${scenarios.length} scenarios`);
    res.json(scenarios);
    
  } catch (error) {
    console.error('❌ Levels API Error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (client) await client.close();
  }
});

// GET by level
router.get('/:level', async (req, res) => {
  let client;
  try {
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db('EnPhiSimdb');
    const collection = database.collection('levelDataset');
    
    const scenarios = await collection.find({ 
      level_no: req.params.level 
    }).toArray();
    
    res.json(scenarios);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (client) await client.close();
  }
});

export default router;