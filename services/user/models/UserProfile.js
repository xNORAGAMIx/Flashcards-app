import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    friends: [{ type: String }], // Array of userIds
  },
  { timestamps: true }
);
export default mongoose.model("UserProfile", userProfileSchema);
