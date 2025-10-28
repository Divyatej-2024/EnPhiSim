// backend/seeders/seedLevels.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Level = require('../models/Level');

dotenv.config();
const uri = process.env.MONGO_URI || 'mongodb://localhost:8080/enphisim';

const levelsData = [];
const difficulties = ['Easy','Adv-Easy','Normal','Pre-Hard','Hard','Adv-Hard'];
for (let i = 1; i <= 32; i++) {
  const diffIdx = Math.floor((i - 1) / 6);
  const difficulty = difficulties[Math.min(diffIdx, difficulties.length-1)];
  levelsData.push({
    level: i,
    title: `Level ${i} - ${difficulty}`,
    difficulty,
    category: 'Email',
    description: `Simulated phishing scenario level ${i} (${difficulty})`,
    sampleEmail: {
      subject: `Important notice ${i}`,
      body: `This is a simulated phishing email body for level ${i}. Click http://example${i}.xyz to resolve an urgent issue.`,
      from: `no-reply${i}@example.com`
    },
    correctAction: 'report',
    baseXP: 10 + Math.floor((i-1)/4)*5,
    hint: ['Check sender','Hover link'],
    ml_confidence_threshold: 0.7 + diffIdx*0.05,
    tags: ['simulation']
  });
}

async function seed() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for seeding');
    for (const l of levelsData) {
      const exists = await Level.findOne({ level: l.level });
      if (!exists) {
        await Level.create(l);
        console.log(`Inserted level ${l.level}`);
      } else {
        console.log(`Level ${l.level} already exists`);
      }
    }
    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}
seed();
