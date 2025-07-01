/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setFlashcards } from "../features/flashcard/flashcardSlice";
import { deckId, update } from "../api/deckAPI";
import { create, deckCards, remove } from "../api/flashcardAPI";
import {
  FiGlobe,
  FiLock,
  FiEdit2,
  FiCheck,
  FiX,
  FiTag,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiRotateCw,
  FiTrash,
} from "react-icons/fi";
import { motion } from "framer-motion";

const Flashcard = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const allFlashCards = useSelector((state) => state.flashcard.flashcards);

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [creatingCard, setCreatingCard] = useState(false);

  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [sharedWith, setSharedWith] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  useEffect(() => {
    const fetchDeck = async () => {
      setLoading(true);
      try {
        const res = await deckId(id, token);
        setDeck(res.data);
        setTitle(res.data.title);
        setIsPublic(res.data.isPublic);
        setSharedWith(res.data.sharedWith?.join(", ") || "");
      } catch (err) {
        console.error("Error fetching deck:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [id, token]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await deckCards(id, token);
        setCards(res.data);
        setCurrentCardIndex(0);
        dispatch(setFlashcards(res.data));
      } catch (err) {
        console.error("Error fetching flashcards:", err);
      }
    };

    fetchCards();
  }, [token, id, dispatch]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        title,
        isPublic,
        sharedWith: sharedWith
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean),
      };
      const res = await update(id, token, updated);
      setDeck(res.data);
      setEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleCreateFlashcard = async (e) => {
    e.preventDefault();
    setCreatingCard(true);
    try {
      await create(token, {
        deckId: deck._id,
        front,
        back,
      });
      setFront("");
      setBack("");
      const updated = await deckCards(id, token);
      setCards(updated.data);
      setCurrentCardIndex(updated.data.length - 1);
    } catch (err) {
      console.error("Error creating flashcard:", err);
    } finally {
      setCreatingCard(false);
    }
  };

  const handleRemove = async (fid) => {
    try {
      const res = await remove(fid, token);
      dispatch(setFlashcards(allFlashCards.filter((card) => card._id !== fid)));
      setCards(allFlashCards);
    } catch (err) {
      console.log("Error deleting card", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse text-center">
          <div className="h-8 w-8 bg-sky-400 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your deck...
          </p>
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500 dark:text-red-400">Deck not found</p>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Deck Info and Card Creation */}
        <div className="space-y-6">
          {/* Deck Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              {!editing ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-start">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {deck.title}
                    </h1>
                    <button
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30"
                    >
                      <FiEdit2 className="mr-1" /> Edit
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm">
                      {deck.isPublic ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                          <FiGlobe className="mr-1" /> Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          <FiLock className="mr-1" /> Private
                        </span>
                      )}
                    </div>

                    {deck.sharedWith?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Shared with
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {deck.sharedWith.map((id) => (
                            <span
                              key={id}
                              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                            >
                              {id}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {deck.tags?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tags
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {deck.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded flex items-center"
                            >
                              <FiTag className="mr-1" /> {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleUpdate}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Deck Title
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label
                      htmlFor="isPublic"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Make deck public
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Share with (comma separated IDs)
                    </label>
                    <input
                      value={sharedWith}
                      onChange={(e) => setSharedWith(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white"
                      placeholder="userId1, userId2"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                      <FiCheck className="mr-1" /> Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                      <FiX className="mr-1" /> Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          </div>

          {/* Add Flashcard Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Add New Flashcard
              </h2>
              <form onSubmit={handleCreateFlashcard} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Front (Question)
                  </label>
                  <textarea
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter question..."
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Back (Answer)
                  </label>
                  <textarea
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter answer..."
                    rows="3"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingCard}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 disabled:opacity-70"
                >
                  {creatingCard ? (
                    <>
                      <FiRotateCw className="animate-spin mr-2" /> Adding...
                    </>
                  ) : (
                    <>
                      <FiPlus className="mr-2" /> Add Flashcard
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column - Flashcard Viewer */}
        <div className="flex flex-col items-center justify-center">
          {cards.length > 0 ? (
            <motion.div
              key={currentCardIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <FlashcardFlip
                handleRemove={handleRemove}
                fid={currentCard._id}
                front={currentCard.front}
                back={currentCard.back}
                cardNumber={currentCardIndex + 1}
                totalCards={cards.length}
              />

              <div className="flex justify-center space-x-4 mt-6">
                <button
                  disabled={currentCardIndex === 0}
                  onClick={() => setCurrentCardIndex((i) => i - 1)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft className="mr-1" /> Previous
                </button>
                <button
                  disabled={currentCardIndex === cards.length - 1}
                  onClick={() => setCurrentCardIndex((i) => i + 1)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <FiChevronRight className="ml-1" />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <FiPlus className="text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                No flashcards yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Add your first flashcard to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FlashcardFlip = ({
  front,
  back,
  cardNumber,
  totalCards,
  handleRemove,
  fid,
}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="perspective w-full max-w-md mx-auto relative">
      {/* Delete button centered at the top */}
      <button
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center space-x-1 cursor-pointer"
        onClick={() => handleRemove(fid)}
      >
        <FiTrash className="text-2xl" />
      </button>

      <motion.div
        className={`relative h-64 w-full cursor-default transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
        onClick={() => setFlipped(!flipped)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        animate={{ rotateY: flipped ? 180 : 0 }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 flex flex-col">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Card {cardNumber} of {totalCards} • Click to flip
          </div>
          <div className="flex-grow flex items-center justify-center text-xl font-medium text-gray-800 dark:text-gray-200 text-center">
            {front}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Question
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-100 dark:bg-indigo-900 p-4 rounded-lg shadow text-lg font-medium flex flex-col text-gray-800 dark:text-white">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Card {cardNumber} of {totalCards} • Click to flip back
          </div>
          <div className="flex-grow flex items-center justify-center text-xl font-medium text-gray-800 dark:text-gray-200 text-center">
            {back}
          </div>
          <div className="text-xs text-sky-600 dark:text-sky-400 mt-2">
            Answer
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;
