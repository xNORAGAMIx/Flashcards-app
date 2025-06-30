import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import flashcardRoutes from "./routes/flashcardRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Flashcard DB connected"))
  .catch((err) => console.error(err));

app.use("/api/flashcards", flashcardRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () =>
  console.log(`Flashcard Service running on port ${PORT}`)
);
