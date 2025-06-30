import express from "express";
import {
  createCard,
  getCardsByDeck,
  updateCard,
  deleteCard,
} from "../controllers/flashcardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createCard);
router.get("/deck/:deckId", protect, getCardsByDeck);
router.put("/:id", protect, updateCard);
router.delete("/:id", protect, deleteCard);

export default router;
