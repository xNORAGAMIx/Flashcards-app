import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import deckRoutes from "./routes/deckRoutes.js";

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
  .then(() => console.log("Deck DB connected"))
  .catch((err) => console.error(err));

//test
app.get("/test", (req, res) => {
  res.json({
    status: "UP",
  });
});

app.use("/api/decks", deckRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Deck Service running on port ${PORT}`));
