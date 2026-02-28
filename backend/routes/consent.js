import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    res.status(200).json({ message: "Consent saved" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;