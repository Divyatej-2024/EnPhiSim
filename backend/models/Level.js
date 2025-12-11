import mongoose from "mongoose";

const mongoose = require("mongoose");

const LevelSchema = new mongoose.Schema({
  level: { type: Number, required: true, unique: true },
  title: String,
  difficulty: String,
  category: String,
  description: String,
  sampleEmail: {
    subject: String,
    body: String,
    from: String,
  },
  correctAction: String,
  baseXP: Number,
  hint: [String],
  ml_confidence_threshold: Number,
  tags: [String]
}, { collection: "levelDataset" }); // <--- IMPORTANT

module.exports = mongoose.model("Level", LevelSchema);
export default Level;