import fs from "fs";
import { uploadFile } from "../utils/s3Client.js";
import { parseCSV } from "../utils/csvParser.js";

// Upload image/audio
export const uploadMedia = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "File is required" });

  try {
    const result = await uploadFile(req.file, `${req.user.id}/`);
    res.json({ url: result.Location });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Import CSV
export const importCSV = async (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "CSV file is required" });

  try {
    const flashcards = await parseCSV(req.file.path);
    fs.unlinkSync(req.file.path); // cleanup
    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
