import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { transcribeAudio } from "../controllers/voiceController.js";
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/transcribe", protect, upload.single("audio"), transcribeAudio);

export default router;
