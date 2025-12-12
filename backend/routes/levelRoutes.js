import express from "express";
import Level from "../models/Level.js";

const router = express.Router();

router.get("/levels", async (req, res) => {
  try {
    const docs = await Level.find();

    const formatted = docs.map(d => ({
      _id: d._id,
      level: d.id || null, // numeric level id
      Level_no: d.Level_no || null, // old string id
      
      // main UI fields
      title: d.page_title || "Untitled Level",
      category: d.category || "general",
      difficulty: d.category || "easy",
      description: d.level_text || "",
      
      // sample email (converted)
      sampleEmail: {
        subject: d.subj || "",
        from: d.phish_email || "",
        body: d.level_text || ""
      },

      // action mapping
      correctAction: d.correct_option || "",
      wrongAction: d.wrong_option || "",
      neutralAction: d.neutral_option || "",

      // hint array
      hint: d.Hint ? [d.Hint] : [],

      // tags (none in old schema)
      tags: [],

      // extra needed for frontend
      template_type: d.template_type || "",
      js_path: d.js_path || "",
      from_and_to: d.from_and_to || "",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching levels:", err);
    res.status(500).json({ error: "Failed to fetch levels" });
  }
});

export default router;
