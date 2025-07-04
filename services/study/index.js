import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import studyRoutes from "./routes/studyRoutes.js";
import { connectRabbitMQ } from "./utils/amqp.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Study DB connected"))
  .catch((err) => console.error(err));

connectRabbitMQ().then(() => {
  console.log("Connected to RabbitMQ (study)");
});

//test
app.get("/test", (req, res) => {
  res.json({
    status: "UP",
  });
});

app.use("/api/study", studyRoutes);
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`Study Service running on port ${PORT}`));
