import express from "express";
import Level from "../models/Level.js";

const router = express.Router();

router.get("/levels", async (req, res) => {
  try {
    const levels = await Level.find({});
    res.json(levels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
