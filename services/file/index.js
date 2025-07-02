import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

app.use("/api/files", fileRoutes);
const PORT = process.env.PORT || 5007;
app.listen(PORT, () => console.log(`File Service running on port ${PORT}`));
