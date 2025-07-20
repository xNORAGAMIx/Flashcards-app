import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import studyRoutes from "./routes/studyRoutes.js";
import { connectRabbitMQ } from "./utils/amqp.js";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

const app = express();

app.use(cors({
  origin: "https://flashmind-six.vercel.app",
  credentials: true
}));
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

app.use("/", studyRoutes);
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`Study Service running on port ${PORT}`));
