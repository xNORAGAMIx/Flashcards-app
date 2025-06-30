import Flashcard from "../models/Flashcard.js";

export const createCard = async (req, res) => {
  const { deckId, front, back, imageURL, audioTranscript } = req.body;
  try {
    const card = await Flashcard.create({
      deckId,
      front,
      back,
      imageURL,
      audioTranscript,
    });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCardsByDeck = async (req, res) => {
  const { deckId } = req.params;
  const cards = await Flashcard.find({ deckId });
  res.json(cards);
};

export const updateCard = async (req, res) => {
  const { id } = req.params;
  try {
    const card = await Flashcard.findByIdAndUpdate(id, req.body, { new: true });
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCard = async (req, res) => {
  const { id } = req.params;
  try {
    await Flashcard.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
