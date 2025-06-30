import mongoose from "mongoose";

const studyLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    cardId: { type: String, required: true },
    deckId: { type: String, required: true },
    lastReviewed: Date,
    nextReview: Date,
    interval: { type: Number, default: 1 }, // days
    correctStreak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("StudyLog", studyLogSchema);
