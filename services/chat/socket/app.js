import Message from "../models/Message.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinGroup", (groupId) => {
      socket.join(groupId);
      console.log(`Client joined group: ${groupId}`);
    });

    socket.on("sendMessage", async ({ groupId, senderId, senderName, message }) => {
      const msg = new Message({ groupId, senderId, senderName, message });
      await msg.save();

      io.to(groupId).emit("newMessage", msg);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}