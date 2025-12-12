import express from "express";
import Level from "../models/Level.js";

const router = express.Router();

router.get("/levels", async (req, res) => {
  try {
    const docs = await Level.find({});

    const mapped = docs.map(d => ({
      level: d.id,
      Level_no: d.Level_no,

      title: d.page_title,
      category: d.category || "general",

      description: d.level_text,

      sampleEmail: {
        subject: d.subj,
        body: d.level_text,
        from: d.phish_email
      },

      correctAction: d.correct_option,
      hint: [d.Hint],

      // actions
      options: {
        correct: d.correct_option,
        neutral: d.neutral_option,
        wrong: d.wrong_option
      },

      js_path: d.js_path,
      template_type: d.template_type
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Error fetching levels:", err);
    res.status(500).json({ error: "Failed to fetch levels" });
  }
});

export default router;
