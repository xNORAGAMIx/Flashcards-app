/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setFlashcards } from "../features/flashcard/flashcardSlice";
import { deckId, update } from "../api/deckAPI";
import { review, queue } from "../api/studyAPI";
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
  FiTrash2,
} from "react-icons/fi";
import CSVImporter from "../components/CSVImporter";
import GroupChat from "../components/GroupChat";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  atomDark,
  vscDarkPlus,
  dracula,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Flashcard = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const username = useSelector((state) => state.auth.username);
  const allFlashCards = useSelector((state) => state.flashcard.flashcards);

  const [toggle, setToggle] = useState(false);
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [creatingCard, setCreatingCard] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [sharedWith, setSharedWith] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const [study, setStudy] = useState(null);

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

  useEffect(() => {
    fetchCards();
  }, [token, id, dispatch]);

  useEffect(() => {
    const handleQueue = async () => {
      try {
        const response = await queue(token);
        //console.log(response.data);
        setStudy(response.data);
      } catch (err) {
        console.log("Error fetching queue", err);
      }
    };
    handleQueue();
  }, [token]);

  const studyForThisDeck = study?.filter(
    (item) => item.userId === userId && item.deckId === id
  );

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
      const filteredCards = allFlashCards.filter((card) => card._id !== fid);
      dispatch(setFlashcards(filteredCards));
      setCards(filteredCards);

      setCurrentCardIndex((prevIndex) =>
        prevIndex >= filteredCards.length
          ? Math.max(0, filteredCards.length - 1)
          : prevIndex
      );
    } catch (err) {
      console.log("Error deleting card", err);
    }
  };

  const handleReview = async (isCorrect) => {
    try {
      await review(token, {
        deckId: id,
        cardId: cards[currentCardIndex]._id,
        correct: isCorrect,
      });
      //console.log("Review submitted:", isCorrect);
    } catch (err) {
      console.log("Error creating review", err);
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

  const currentStudy = studyForThisDeck?.find(
    (item) => item.cardId === currentCard?._id
  );

  //console.log(toggle);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-6 md:px-12 lg:px-20">
      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 ">
        {/* Left Column - Deck Info and Card Creation */}
        <div className="space-y-1 ">
          {/* Deck Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(253,224,71,0.2),0_0_30px_rgba(251,191,36,0.2)]
">
            <div className="p-6">
              {!editing ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-start">
                    <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
                      {deck.title}
                    </h1>
                    {deck.userId === userId ? (
                      <button
                        onClick={() => setEditing(true)}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30"
                      >
                        <FiEdit2 className="ml-4 mt-4" />
                      </button>
                    ) : (
                      " "
                    )}
                  </div>

                  <div className="mt-6 space-y-6">
                    <div className="flex items-center text-sm">
                      {deck.isPublic ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                          <FiGlobe className="mr-1" /> Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          <FiLock className="mr-1" /> Private
                        </span>
                      )}
                    </div>

                    {deck.sharedWith?.length > 0 && (
                      <div>
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                          Shared with
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {deck.sharedWith.map((id) => (
                            <span
                              key={id}
                              className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                            >
                              {id}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {deck.tags?.length > 0 && (
                      <div>
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                          Tags
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {deck.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded flex items-center text-gray-400"
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
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
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

          <div className="flex justify-center items-center w-full my-4">
            <div className="bg-white/10 backdrop-blur-md p-1 rounded-full flex shadow-inner dark:bg-white/5">
              <button
                onClick={() => setToggle(false)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  !toggle
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                    : "dark:text-white hover:bg-white/10"
                }`}
              >
                FlashCard
              </button>
              <button
                onClick={() => setToggle(true)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  toggle
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                    : "dark:text-white hover:bg-white/10"
                }`}
              >
                Chat
              </button>
            </div>
          </div>

          {toggle === true ? (
            <GroupChat groupId={id} userId={userId} username={username} />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8  shadow-[0_0_30px_rgba(168,85,247,0.2),0_0_30px_rgba(236,72,153,0.2)]
">
              {/* CSV Import Section */}
              <div className="w-full lg:w-1/2">
                <CSVImporter deckId={id} onImportSuccess={fetchCards} />
              </div>

              {/* Add Flashcard Form */}
              <div className="w-full lg:w-1/2">
                <div className="bg-white dark:bg-gray-800 rounded-xl h-full">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
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
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-2xl outline-none dark:bg-gray-700 dark:text-white"
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
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-2xl outline-none dark:bg-gray-700 dark:text-white"
                        placeholder="Enter answer..."
                        rows="3"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={creatingCard}
                      className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 disabled:opacity-70 cursor-pointer"
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
          )}
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

              <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-6 space-y-4 sm:space-y-0 mt-10">
                <button
                  disabled={currentCardIndex === 0}
                  onClick={() => setCurrentCardIndex((i) => i - 1)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft className="mr-1" /> Previous
                </button>

                <motion.button
                  onClick={() => handleReview(true)}
                  whileTap={{ scale: 0.95 }} // Press down slightly
                  animate={{
                    opacity: [1, 0.8, 1], // Quick opacity pulse on render (optional)
                  }}
                  transition={{
                    scale: { type: "spring", stiffness: 300 }, // Bouncy press
                    opacity: { duration: 0.5 }, // Smooth opacity
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 outline-none"
                >
                  Correct
                </motion.button>

                <motion.button
                  onClick={() => handleReview(false)}
                  whileTap={{ scale: 0.95 }} // Press down slightly
                  animate={{
                    opacity: [1, 0.8, 1], // Quick opacity pulse on render (optional)
                  }}
                  transition={{
                    scale: { type: "spring", stiffness: 300 }, // Bouncy press
                    opacity: { duration: 0.5 }, // Smooth opacity
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 outline-none"
                >
                  Incorrect
                </motion.button>

                <button
                  disabled={currentCardIndex === cards.length - 1}
                  onClick={() => setCurrentCardIndex((i) => i + 1)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-sky-600 hover:bg-sky-700 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <FiChevronRight className="ml-1" />
                </button>
              </div>

              {currentStudy && (
                <div className="mt-8 w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
                        Your Review Schedule
                      </span>
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Card scheduled for review
                    </span>
                  </div>

                  <motion.div
                    key={currentStudy._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    {/* RGB Glow Background */}
                    <div
                      className={`absolute inset-0 rounded-xl opacity-20 blur-md transition-all duration-500 ${
                        currentStudy.correctStreak > 3
                          ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                          : "bg-gradient-to-br from-amber-400 to-orange-500"
                      }`}
                    ></div>

                    {/* Glass Card */}
                    <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 border border-white/20 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-start space-x-3">
                        {/* Streak Indicator with Pulse Animation */}
                        <motion.div
                          className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-inner ${
                            currentStudy.correctStreak > 3
                              ? "bg-emerald-400/20 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300/30 dark:border-emerald-500/30"
                              : "bg-amber-400/20 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300/30 dark:border-amber-500/30"
                          }`}
                          animate={{
                            scale: [1, 1.05, 1],
                            boxShadow:
                              currentStudy.correctStreak > 3
                                ? [
                                    "0 0 0 0 rgba(16, 185, 129, 0.3)",
                                    "0 0 0 6px rgba(16, 185, 129, 0)",
                                    "0 0 0 0 rgba(16, 185, 129, 0)",
                                  ]
                                : [
                                    "0 0 0 0 rgba(245, 158, 11, 0.3)",
                                    "0 0 0 6px rgba(245, 158, 11, 0)",
                                    "0 0 0 0 rgba(245, 158, 11, 0)",
                                  ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                          }}
                        >
                          <motion.span
                            key={currentStudy.correctStreak}
                            initial={{ scale: 1.5 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {currentStudy.correctStreak}
                          </motion.span>
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {/* Next Review */}
                            <motion.div
                              whileHover={{ x: 3 }}
                              className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg"
                            >
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Next Review
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {new Date(
                                  currentStudy.nextReview
                                ).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </motion.div>

                            {/* Last Reviewed */}
                            <motion.div
                              whileHover={{ x: 3 }}
                              className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg"
                            >
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Last Reviewed
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {currentStudy.lastReviewed
                                  ? new Date(
                                      currentStudy.lastReviewed
                                    ).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "Never"}
                              </p>
                            </motion.div>

                            {/* Streak */}
                            <motion.div
                              whileHover={{ x: 3 }}
                              className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg"
                            >
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Streak
                              </p>
                              <motion.p
                                className="font-medium text-gray-900 dark:text-white"
                                key={currentStudy.correctStreak}
                                initial={{
                                  color:
                                    currentStudy.correctStreak > 3
                                      ? "#10b981"
                                      : "#f59e0b",
                                }}
                                animate={{ color: "#111827" }}
                                transition={{ duration: 1 }}
                              >
                                {currentStudy.correctStreak} correct
                                {currentStudy.correctStreak > 3 && (
                                  <span className="ml-1 text-emerald-500">
                                    🔥
                                  </span>
                                )}
                              </motion.p>
                            </motion.div>

                            {/* Interval */}
                            <motion.div
                              whileHover={{ x: 3 }}
                              className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg"
                            >
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Interval
                              </p>
                              <motion.p
                                className="font-medium text-gray-900 dark:text-white"
                                key={currentStudy.interval}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                {currentStudy.interval} day
                                {currentStudy.interval !== 1 ? "s" : ""}
                              </motion.p>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
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
    <div className="perspective w-full max-w-3xl mx-auto relative">
      {/* Delete button centered at the top */}
      <button
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center space-x-1 cursor-pointer"
        onClick={() => handleRemove(fid)}
      >
        <FiTrash2 className="text-2xl" />
      </button>

      {/* RGB Glow Container */}
      <div className="relative">
        {/* RGB Glow Effect */}
        <div
          className={`absolute inset-0 rounded-xl opacity-70 blur-lg transition-all duration-1000 ${
            flipped
              ? "bg-gradient-to-br from-purple-500 to-pink-500"
              : "bg-gradient-to-br from-cyan-400 to-blue-500"
          }`}
        ></div>

        {/* Animated RGB border */}
        <div
          className={`absolute inset-0 rounded-xl border-2 opacity-80 transition-all duration-1000 ${
            flipped ? "border-pink-400" : "border-cyan-300"
          }`}
        ></div>

        <motion.div
          className={`relative h-96 w-full mt-4 cursor-default transform-style-preserve-3d ${
            flipped ? "rotate-y-180" : ""
          }`}
          onClick={() => setFlipped(!flipped)}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          animate={{ rotateY: flipped ? 180 : 0 }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-gray-800 dark:bg-zinc-800 rounded-xl shadow-lg p-6 flex flex-col overflow-y-auto max-h-96">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Card {cardNumber} of {totalCards} • Click to flip
            </div>
            <div className="flex-grow flex items-center justify-center text-xl font-medium text-gray-100 dark:text-gray-200 text-center whitespace-pre-wrap prose dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          padding: "1em",
                          borderRadius: "0.5rem",
                          fontSize: "0.9rem",
                          backgroundColor: "transparent",
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {front}
              </ReactMarkdown>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Question
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-black dark:bg-zinc-900 p-4 rounded-lg shadow text-lg font-medium flex flex-col text-gray-800 dark:text-white overflow-y-auto max-h-96">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Card {cardNumber} of {totalCards} • Click to flip back
            </div>
            <div className="flex-grow flex-col items-center justify-evenly text-xl font-medium text-gray-100 dark:text-gray-200 break-words whitespace-pre-wrap text-center font-mono">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={dracula}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          padding: "1em",
                          borderRadius: "0.5rem",
                          fontSize: "0.9rem",
                          backgroundColor: "transparent",
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {back}
              </ReactMarkdown>
            </div>
            <div className="text-xs text-sky-600 dark:text-sky-400 mt-2">
              Answer
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Flashcard;
