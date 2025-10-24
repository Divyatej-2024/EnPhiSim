// backend/models/Level.js
const mongoose = require('mongoose');

const LevelSchema = new mongoose.Schema({
  level: { type: Number, required: true, unique: true },
  title: String,
  difficulty: String,
  category: String,
  description: String,
  sampleEmail: {
    subject: String,
    body: String,
    from: String
  },
  correctAction: String, // report, delete, click, open_attachment, reply
  baseXP: Number,
  hint: [String],
  ml_confidence_threshold: Number,
  tags: [String]
});

module.exports = mongoose.model('Level', LevelSchema);
