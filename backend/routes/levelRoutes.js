import express from "express";
import Level from "../models/Level.js";

const router = express.Router();

router.get("/levels", async (req, res) => {
  try {
    const docs = await Level.find();

    const formatted = docs.map(d => ({
      level: d.id, // or parseInt(d.Level_no.replace('l',''))
      title: d.page_title,
      difficulty: d.category,
      category: d.category,
      description: d.level_text,
      sampleEmail: {
        subject: d.subj,
        body: d.level_text,
        from: d.phish_email,
      },
      correctAction: d.correct_option,
      wrongAction: d.wrong_option,
      hint: [d.Hint],
      tags: [],
      template_type: d.template_type,
      js_path: d.js_path
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to fetch levels" });
  }
});


export default router;
