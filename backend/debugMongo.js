import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

console.log("Using URI:", MONGO_URI);

async function debugMongo() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    const conn = await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to:", conn.connection.name);

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📌 Collections:", collections.map(c => c.name));

    const levelDocs = await mongoose.connection.db
      .collection("levelDataset")
      .find({})
      .limit(40)
      .toArray();

    console.log("📄 Sample docs:", levelDocs);

    process.exit();
  } catch (err) {
    console.error("❌ MongoDB Debug Error:", err);
    process.exit(1);
  }
}

debugMongo();
