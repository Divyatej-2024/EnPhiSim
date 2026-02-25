import express from "express";
import Level from "../models/Level.js";

const router = express.Router();

router.get("/levels", async (req, res) => {
  try {
    const levels = await Level.aggregate([
      { $match: { Level_no: { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: { Level_no: "$Level_no", category: "$category" },
          doc: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $sort: { Level_no: 1 } },
    ]);
    res.json(levels);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch levels" });
  }
});

export default router;
