import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import { connectRabbit } from "./utils/rabbit.js";

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Auth DB connected"))
  .catch((err) => console.error("DB error:", err));

connectRabbit().then(() => {
  console.log("Auth connected to RabbitMQ");
});

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
