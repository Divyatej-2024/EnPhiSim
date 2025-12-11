import express from "express";
import Level from "../models/Level.js";  // FIXED

const router = express.Router();

router.get("/levels", async (req, res) => {
  try {
    const allLevels = await Level.find();
    res.json(allLevels);
  } catch (err) {
    console.error("Error fetching levels:", err);
    res.status(500).json({ error: "Failed to fetch levels" });
  }
});

export default router;
