import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import studyRoutes from "./routes/studyRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Study DB connected"))
  .catch((err) => console.error(err));

app.use("/api/study", studyRoutes);
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`Study Service running on port ${PORT}`));
