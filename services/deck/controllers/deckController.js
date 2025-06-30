import Deck from "../models/Deck.js";

export const createDeck = async (req, res) => {
  const { title, isPublic, tags } = req.body;

  try {
    const newDeck = await Deck.create({
      title,
      userId: req.user.id,
      isPublic: isPublic || false,
      tags: tags || [],
    });
    res.status(201).json(newDeck);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyDecks = async (req, res) => {
  const decks = await Deck.find({ userId: req.user.id });
  res.json(decks);
};

export const getSharedDecks = async (req, res) => {
  const decks = await Deck.find({
    $or: [{ isPublic: true }, { sharedWith: req.user.id }],
  });
  res.json(decks);
};

export const updateDeck = async (req, res) => {
  const { id } = req.params;
  const deck = await Deck.findById(id);
  if (!deck || deck.userId !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  Object.assign(deck, req.body);
  await deck.save();
  res.json(deck);
};

export const deleteDeck = async (req, res) => {
  const { id } = req.params;
  const deck = await Deck.findById(id);
  if (!deck || deck.userId !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await deck.deleteOne();
  res.json({ message: "Deck deleted" });
};
