import mongoose from "mongoose";

const deckSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    userId: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    sharedWith: [{ type: String }],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Deck", deckSchema);
