import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import { connectRabbit } from "./utils/rabbit.js";

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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("User DB connected"))
  .catch((err) => console.error("Mongo error:", err));

connectRabbit().then(() => {
  console.log("User Service connected to RabbitMQ");
});

//test
app.get("/test", (req, res) => {
  res.json({
    status: "UP",
  });
});

// Routes
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`User Service running on ${PORT}`)
);
