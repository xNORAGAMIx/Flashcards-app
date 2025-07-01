/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { create, decks, remove } from "../api/deckAPI";
import { setDecks } from "../features/deck/deckSlice";
import {
  FiPlus,
  FiLock,
  FiGlobe,
  FiTag,
  FiLoader,
  FiTrash,
  FiBookOpen
} from "react-icons/fi";
import { motion } from "framer-motion";

const Deck = () => {
  const token = useSelector((state) => state.auth.token);
  const allDecks = useSelector((state) => state.deck.decks);
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const handleDeck = async () => {
      setLoading(true);
      try {
        const response = await decks(token);
        dispatch(setDecks(response.data));
      } catch (err) {
        console.error("Error fetching decks:", err);
      } finally {
        setLoading(false);
      }
    };

    handleDeck();
  }, [token, dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const response = await create(token, {
        title,
        isPublic,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      dispatch(setDecks([...allDecks, response.data]));
      setTitle("");
      setTags("");
      setIsPublic(false);
    } catch (err) {
      console.error("Error creating deck:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await remove(id, token);
      dispatch(setDecks(allDecks.filter(deck => deck._id !== id)));
    } catch (err) {
      console.error("Error deleting deck:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
            Your Decks
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {allDecks.length} {allDecks.length === 1 ? "deck" : "decks"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Deck Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiPlus className="mr-2 text-sky-500" />
                Create New Deck
              </h2>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deck Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g. Biology 101"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      id="public"
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="public"
                      className="font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      {isPublic ? (
                        <>
                          <FiGlobe className="mr-1 text-indigo-500" />
                          Public Deck
                        </>
                      ) : (
                        <>
                          <FiLock className="mr-1 text-gray-500" />
                          Private Deck
                        </>
                      )}
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isPublic ? "Visible to everyone" : "Only visible to you"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <FiTag className="mr-1" />
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white"
                    placeholder="biology, science, chapter1"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Separate tags with commas
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 disabled:opacity-70"
                >
                  {creating ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FiPlus className="mr-2" />
                      Create Deck
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Deck List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-white">
                  Your Study Decks
                </h2>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <FiLoader className="animate-spin mx-auto text-gray-400 text-2xl mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Loading your decks...
                  </p>
                </div>
              ) : allDecks.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto h-24 w-24 text-gray-400 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    <FiBookOpen className="text-2xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    No decks created yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Create your first deck to get started
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {allDecks.map((deck, index) => (
                    <motion.li
                      key={deck._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {deck.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                deck.isPublic
                                  ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {deck.isPublic ? (
                                <FiGlobe className="mr-1" />
                              ) : (
                                <FiLock className="mr-1" />
                              )}
                              {deck.isPublic ? "Public" : "Private"}
                            </span>
                            {deck.tags?.length > 0 && (
                              <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                                <FiTag className="mr-1" />
                                {deck.tags.join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-col space-x-2">
                          <button
                            onClick={() => handleDelete(deck._id)}
                            className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center space-x-1 cursor-pointer"
                          >
                            <FiTrash className="text-base" />
                          </button>
                          <Link
                            to={`/deck/${deck._id}`}
                            className="text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300"
                          >
                            Study Now →
                          </Link>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deck;
