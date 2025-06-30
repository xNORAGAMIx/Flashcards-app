import express from "express";
import { recordStudy, getStats } from "../controllers/statsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/update", protect, recordStudy);
router.get("/dashboard", protect, getStats);

export default router;