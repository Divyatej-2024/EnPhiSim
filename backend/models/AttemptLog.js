<<<<<<< HEAD
// backend/models/AttemptLog.js
const mongoose = require('mongoose');

const AttemptLogSchema = new mongoose.Schema({
  userId: String,
  level: Number,
  action: String,
  timeTaken: Number,
  hintsUsed: Number,
  mlPrediction: String,
  mlConfidence: Number,
  correct: Boolean,
  xpAwarded: Number,
  timestamp: Date
});

module.exports = mongoose.model('AttemptLog', AttemptLogSchema);
=======
// backend/models/AttemptLog.js
const mongoose = require('mongoose');

const AttemptLogSchema = new mongoose.Schema({
  userId: String,
  level: Number,
  action: String,
  timeTaken: Number,
  hintsUsed: Number,
  mlPrediction: String,
  mlConfidence: Number,
  correct: Boolean,
  xpAwarded: Number,
  timestamp: Date
});

module.exports = mongoose.model('AttemptLog', AttemptLogSchema);
>>>>>>> 622a2f58a21cb608242fa59b8e4c35dfb00d67b0
