import express from "express";
import Level from "../models/Level.js";

const router = express.Router();

router.get("/levels", async (req, res) => {
  try {
    const docs = await Level.find({});

    const mapped = docs.map(d => ({
      id: d.id,
      level_no: d.Level_no,
      title: d.page_title,
      hint: d.Hint,
      js_path: d.js_path,
      category: d.category,
      template_type: d.template_type,
      correct_option: d.correct_option,
      neutral_option: d.neutral_option,
      wrong_option: d.wrong_option,
      text: d.level_text,
      subject: d.subj,
      from_and_to: d.from_and_to,
      phish_email: d.phish_email,
      crct_email: d.crct_email
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Error fetching levels:", err);
    res.status(500).json({ error: "Failed to fetch levels" });
  }
});

export default router;
