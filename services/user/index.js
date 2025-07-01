import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import { connectRabbit } from "./utils/rabbit.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("User DB connected"))
  .catch((err) => console.error("Mongo error:", err));

connectRabbit().then(() => {
  console.log("User Service connected to RabbitMQ");
});

// Routes
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`User Service running on ${PORT}`));
