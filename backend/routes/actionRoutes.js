import express from "express";
import Eaction from "../models/E_action.js";

const router = express.Router();

router.post("/actions", async (req, res) => {
  try {
    const payload = req.body || {};
    const actionText =
      payload.actionText ||
      payload.text ||
      payload.action ||
      payload.Action ||
      payload.user_action ||
      "";

    const action = await Eaction.create({
      UserID: payload.userId || payload.UserID || "anonymous",
      LevelID: payload.levelId || payload.LevelID || payload.level_no || "",
      Action: actionText,
    });

    res.status(201).json({
      message: "Action recorded",
      id: action._id,
    });
  } catch (err) {
    console.error("Failed to store action:", err.message);
    res.status(500).json({ error: "Failed to store action" });
  }
});

export default router;
