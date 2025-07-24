/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { create, decks, remove, shared } from "../api/deckAPI";
import { setDecks, addDeck } from "../features/deck/deckSlice";
import {
  FiPlus,
  FiLock,
  FiGlobe,
  FiTag,
  FiLoader,
  FiTrash,
  FiBookOpen,
} from "react-icons/fi";
import { motion } from "framer-motion";

const Deck = () => {
  // user token from redux store
  const token = useSelector((state) => state.auth.token);
  // user Id from redux store
  const loggedInUser = useSelector((state) => state.auth.userId);
  // decks from redux store
  const allDecks = useSelector((state) => state.deck.decks);
  // dispatch function from redux
  const dispatch = useDispatch();

  // form
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState("");

  // loading states
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // search functionality
  const [searchQuery, setSearchQuery] = useState("");

  // current page and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const decksPerPage = 6;

  // Filter decks based on search query
  const filteredDecks = allDecks.filter((deck) => {
    const query = searchQuery.toLowerCase();
    return (
      deck.title.toLowerCase().includes(query) ||
      (deck.tags && deck.tags.some((tag) => tag.toLowerCase().includes(query)))
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDecks.length / decksPerPage);
  const paginatedDecks = filteredDecks.slice(
    (currentPage - 1) * decksPerPage,
    currentPage * decksPerPage
  );

  // Reset current page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Fetch decks and shared decks on component mount
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

  // Fetch shared decks
  useEffect(() => {
    const handleShared = async () => {
      try {
        const response = await shared(token);
        response.data.forEach((deck) => dispatch(addDeck(deck)));
      } catch (err) {
        console.log("Error fetching shared", err);
      }
    };

    handleShared();
  }, [token, dispatch]);

  // Handle deck creation
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

  // Handle deck deletion
  const handleDelete = async (id) => {
    try {
      const response = await remove(id, token);
      dispatch(setDecks(allDecks.filter((deck) => deck._id !== id)));
    } catch (err) {
      console.error("Error deleting deck:", err);
    }
  };

  const DeckSkeleton = () => {
    return (
      <li className="p-6 animate-pulse">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-48" />
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32" />
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pt-20 px-6">
      <div className="w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Your Decks
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {allDecks.length} {allDecks.length === 1 ? "deck" : "decks"}
          </div>
        </div>

        {/* Search Deck */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search decks by title or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full lg:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Deck Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-fit">
              <h2 className="text-2xl font-semibold mb-4 flex items-center text-black dark:text-white">
                <FiPlus className="mr-2 text-sky-500" />
                Create New Deck
              </h2>

              <form onSubmit={handleCreate} className="space-y-6 p-4">
                <div>
                  <label className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deck Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none dark:bg-gray-700 dark:text-white"
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
                      className="h-4 w-4 text-sky-600 border-gray-300 outline-none dark:border-gray-600 rounded"
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
                  <label className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <FiTag className="mr-1" />
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none dark:bg-gray-700 dark:text-white"
                    placeholder="biology, science, chapter1"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Separate tags with commas
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700  transition-all duration-200 disabled:opacity-70 outline-none cursor-pointer"
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
                <h2 className="text-2xl font-semibold dark:text-white text-black">
                  Your Study Decks
                </h2>
              </div>

              {loading ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <DeckSkeleton key={index} />
                  ))}
                </ul>
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
                  {paginatedDecks.map((deck, index) => (
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
                        <div className="flex-col space-y-2">
                          {deck.userId === loggedInUser ? (
                            <button
                              onClick={() => handleDelete(deck._id)}
                              className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center space-x-1 cursor-pointer"
                            >
                              <FiTrash className="text-lg" />
                            </button>
                          ) : (
                            " "
                          )}

                          <Link
                            to={`/deck/${deck._id}`}
                            className="text-lg font-medium text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-3 z-50">
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded-lg text-sm font-medium ${
                  currentPage === page
                    ? "bg-sky-500 text-white border-sky-500"
                    : "text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deck;
