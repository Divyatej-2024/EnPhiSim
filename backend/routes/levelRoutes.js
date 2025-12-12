import express from "express";
import Level from "../models/Level.js";

const router = express.Router();

router.get("/levels", async (req, res) => {
  let docs = await Level.find({});
  
  const mapped = docs.map(d => ({
    level: d.id,
    title: d.page_title,
    difficulty: "easy",
    category: "general",
    description: "",
    hint: [d.Hint],
    js_path: d.js_path
  }));

  res.json(mapped);
});


export default router;
