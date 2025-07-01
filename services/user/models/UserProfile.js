import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    friends: [
      {
        _id: String, 
        userId: String,
        email: String,
        bio: String,
      },
    ], 
  },
  { timestamps: true }
);
export default mongoose.model("UserProfile", userProfileSchema);
