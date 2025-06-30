import express from "express";
import { getReviewQueue, reviewCard } from "../controllers/studyController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/queue", protect, getReviewQueue);
router.post("/review", protect, reviewCard);

export default router;