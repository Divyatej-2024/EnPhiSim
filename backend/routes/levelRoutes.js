import express from "express";
import Level from "../models/Level.js";

const router = express.Router();

router.get("/levels", async (req, res) => {
  const docs = await Level.find({});

  const mapped = docs.map(d => ({
    _id: d._id,                 // ✅ REQUIRED
    Level_no: d.Level_no,       // ✅ REQUIRED
    title: d.page_title,
    category: d.category,
    description: d.level_text,
    sampleEmail: {
      subject: d.subj,
      body: d.level_text,
      from: d.phish_email
    },
    correctAction: d.correct_option,
    hint: [d.Hint],
    js_path: d.js_path
  }));

  res.json(mapped);
});

export default router;
