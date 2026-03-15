// Sections: imports, configuration, logic, render/exports

// backend/scripts/fixDataStructure.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

async function fixDataStructure() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('EnPhiSimdb');
    const collection = db.collection('levelDataset');
    
    // Find all documents
    const documents = await collection.find({}).toArray();
    console.log(`Found ${documents.length} documents`);
    
    let fixed = 0;
    
    for (const doc of documents) {
      let needsUpdate = false;
      const update = {};
      
      // Fix content field if it's an array
      if (Array.isArray(doc.content)) {
        if (doc.content.length > 0) {
          // Extract the actual content string
          const contentObj = doc.content[0];
          if (typeof contentObj === 'object') {
            // Find the first string key that looks like content
            const contentString = Object.keys(contentObj).find(key => 
              typeof contentObj[key] === 'string'
            ) || Object.keys(contentObj)[0];
            
            update.content = contentString || 'Phishing scenario';
          } else {
            update.content = String(doc.content[0]);
          }
        } else {
          update.content = 'Phishing scenario';
        }
        needsUpdate = true;
      }
      
      // Fix other fields that might be nested incorrectly
      if (doc.content && Array.isArray(doc.content) && doc.content[0]) {
        const nested = doc.content[0];
        
        // Copy any valid fields from nested object
        const fieldsToCopy = [
          'category', 'taxonomy', 'correct_action', 
          'neutral_action', 'wrong_action', 'difficulty',
          'from_address', 'reply_to', 'to_address',
          'body_html', 'body_text'
        ];
        
        fieldsToCopy.forEach(field => {
          if (nested[field] !== undefined && !doc[field]) {
            update[field] = nested[field];
            needsUpdate = true;
          }
        });
      }
      
      if (needsUpdate) {
        await collection.updateOne(
          { _id: doc._id },
          { $set: update }
        );
        fixed++;
        console.log(`Fixed document ${doc.scenario_id || doc._id}`);
      }
    }
    
    console.log(`\nFixed ${fixed} documents`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixDataStructure();

