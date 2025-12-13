import express from "express";
import Level from "../models/Level.js";

const router = express.Router();

router.get("/levels", async (req, res) => {
  try {
    const count = await Level.countDocuments();
    console.log("LEVEL COUNT =", count);

    const docs = await Level.find({});
    res.json({
      count,
      sample: docs[0] || null
    });
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

export default router;
