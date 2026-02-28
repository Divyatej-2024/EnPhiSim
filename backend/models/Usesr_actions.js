import mongoose from 'mongoose';

const userActionSchema = new mongoose.Schema({
  session_id: String,
  user_action: String,
  correct_action: String,
  correct: Boolean,
  taxonomy: String,
  time_taken_seconds: Number,
  timestamp: Date,
  ml_predictions: {
    distilbert: {
      prediction: String
    },
    cnn: {
      prediction: String
    }
  }
}, { collection: 'user_actions' });

export default mongoose.model('UserAction', userActionSchema);