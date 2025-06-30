import express from "express";
import multer from "multer";
import { uploadMedia, importCSV } from "../controllers/fileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const uploadMemory = multer({ storage });

const uploadDisk = multer({ dest: "uploads/" });

router.post("/upload", protect, uploadMemory.single("file"), uploadMedia);
router.post("/import", protect, uploadDisk.single("csv"), importCSV);

export default router;
