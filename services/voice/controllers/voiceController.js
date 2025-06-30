import fs from "fs";
import { transcribeWithWhisper } from "../utils/whisperClient.js";

export const transcribeAudio = async (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "Audio file required" });

  try {
    const transcript = await transcribeWithWhisper(req.file.path);

    // delete temp file
    fs.unlinkSync(req.file.path);

    res.json({ transcript });
  } catch (err) {
    console.error("Transcription error:", err.message);
    res.status(500).json({ message: "Failed to transcribe audio" });
  }
};
