import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import deckRoutes from "./routes/deckRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Deck DB connected"))
  .catch((err) => console.error(err));

app.use("/api/decks", deckRoutes);
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Deck Service running on port ${PORT}`));
