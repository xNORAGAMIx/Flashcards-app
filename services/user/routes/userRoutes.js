import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  addFriend,
  createProfile
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.post("/add-friend", protect, addFriend);
router.post("/create-profile", protect, createProfile);

export default router;
