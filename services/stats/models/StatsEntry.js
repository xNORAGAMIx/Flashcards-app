import mongoose from "mongoose";

const statsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    studied: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    streak: { type: Number, default: 1 },
  },
  { timestamps: true }
);

statsSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("StatsEntry", statsSchema);
