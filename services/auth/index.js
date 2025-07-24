import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { connectRabbit } from "./utils/rabbit.js";
import { initAuthConsumer } from "./utils/initAuthConsumer.js";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

const app = express();

app.use(cors({
  origin: process.env.URL, 
  credentials: true
}));
app.use(express.json());

// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Auth DB connected"))
  .catch((err) => console.error("DB error:", err));

connectRabbit().then(() => {
  console.log("Auth connected to RabbitMQ");
});

//test
app.get("/test", (req, res) => {
  res.json({
    status: "UP",
  });
});

// Routes
app.use("/api/auth", authRoutes);

initAuthConsumer();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
