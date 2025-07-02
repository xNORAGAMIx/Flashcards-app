import express from "express";
import {
  getMyDecks,
  createDeck,
  getSharedDecks,
  updateDeck,
  deleteDeck,
  getDeckById
} from "../controllers/deckController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createDeck);
router.get("/mine", protect, getMyDecks);
router.get("/shared", protect, getSharedDecks);
router.get("/:deckId", protect, getDeckById);
router.put("/:id", protect, updateDeck);
router.delete("/:id", protect, deleteDeck);

export default router;
