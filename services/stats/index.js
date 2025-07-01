import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import statsRoutes from "./routes/statsRoutes.js";
import { startConsumer } from "./utils/statsConsumer.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Stats DB connected");
    startConsumer();
  })
  .catch((err) => console.error(err));

app.use("/api/stats", statsRoutes);
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Stats Service running on port ${PORT}`));
