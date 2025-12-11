import mongoose from "mongoose";

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
  correctAction: String,
  baseXP: Number,
  hint: [String],
  ml_confidence_threshold: Number,
  tags: [String]
});

const Level = mongoose.model("Level", LevelSchema);
export default Level;
