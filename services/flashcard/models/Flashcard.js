import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema(
  {
    deckId: { type: String, required: true },
    front: { type: String, required: true },
    back: { type: String, required: true },
    imageURL: String,
    audioTranscript: String,
  },
  { timestamps: true }
);

export default mongoose.model("Flashcard", flashcardSchema);
