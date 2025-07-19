import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("ChatDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

export default app;

