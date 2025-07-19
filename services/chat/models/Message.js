import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  groupId: { type: String, required: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
