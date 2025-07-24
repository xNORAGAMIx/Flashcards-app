import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });
const app = express();

app.use(
  cors({
    origin: process.env.URL,
  })
);
app.use(express.json());

app.use("/api/chat", chatRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("ChatDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

export default app;
