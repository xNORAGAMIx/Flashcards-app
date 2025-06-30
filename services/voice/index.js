import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import voiceRoutes from "./routes/voiceRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

app.use("/api/voice", voiceRoutes);
const PORT = process.env.PORT || 5006;
app.listen(PORT, () => console.log(`Voice Service running on port ${PORT}`));
