import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

//test
router.get("/test", (req, res) => {
  res.json({
    status: "UP",
  });
});

router.get("/:groupId", async (req, res) => {
  try {
    const messages = await Message.find({ groupId: req.params.groupId }).sort({ sentAt: 1 });
    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;
