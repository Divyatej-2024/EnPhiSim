// Sections: imports, configuration, logic, render/exports

// backend/routes/levelDataset.js
import express from 'express';
import { MongoClient } from 'mongodb';

const router = express.Router();

// Get all scenarios from levelDataset
router.get('/', async (req, res) => {
  let client;
  try {
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db('EnPhiSimdb'); // Your database name
    const collection = database.collection('levelDataset');
    
    const scenarios = await collection.find({}).toArray();
    
    console.log(`Found ${scenarios.length} scenarios`);
    res.json(scenarios);
    
  } catch (error) {
    console.error('Failed to fetch scenarios:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (client) await client.close();
  }
});

// Get scenarios by level
router.get('/level/:levelNo', async (req, res) => {
  let client;
  try {
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db('EnPhiSimdb');
    const collection = database.collection('levelDataset');
    
    const scenarios = await collection.find({ 
      level_no: req.params.levelNo 
    }).toArray();
    
    res.json(scenarios);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (client) await client.close();
  }
});

// Get single scenario by ID
router.get('/:id', async (req, res) => {
  let client;
  try {
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db('EnPhiSimdb');
    const collection = database.collection('levelDataset');
    
    const scenario = await collection.findOne({ 
      scenario_id: req.params.id 
    });
    
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    
    res.json(scenario);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (client) await client.close();
  }
});

export default router;
