import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { deckId, update } from "../api/deckAPI";
import { FiGlobe, FiLock, FiEdit3, FiCheck, FiX, FiTag } from "react-icons/fi";

const Flashcard = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  // Edit form states
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [sharedWith, setSharedWith] = useState("");

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

  if (loading) return <p className="p-6">Loading...</p>;
  if (!deck) return <p className="p-6 text-red-500">Deck not found</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      {!editing ? (
        <>
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {deck.title}
            </h1>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300"
            >
              <FiEdit3 /> Edit
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Visibility:{" "}
            {deck.isPublic ? (
              <span className="inline-flex items-center">
                <FiGlobe className="mr-1" /> Public
              </span>
            ) : (
              <span className="inline-flex items-center">
                <FiLock className="mr-1" /> Private
              </span>
            )}
          </p>

          {deck.sharedWith?.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Shared with: {deck.sharedWith.join(", ")}
            </p>
          )}

          {deck.tags?.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tags: {deck.tags.join(", ")}
            </p>
          )}
        </>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <label
              htmlFor="isPublic"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              {isPublic ? "Public Deck" : "Private Deck"}
            </label>
          </div>

          <div>
            <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <FiTag className="mr-1" />
              Shared With (comma-separated user IDs)
            </label>
            <input
              value={sharedWith}
              onChange={(e) => setSharedWith(e.target.value)}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="userId1, userId2"
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <FiCheck className="mr-1" /> Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              <FiX className="mr-1" /> Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Flashcard;
