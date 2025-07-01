/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { profile, friend, update } from "../api/userAPI";
import { setProfile } from "../features/auth/authSlice";
import {
  FiEdit2,
  FiCheck,
  FiUserPlus,
  FiUsers,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { motion } from "framer-motion";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [showFriendSuccess, setShowFriendSuccess] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleProfile = async () => {
      try {
        const response = await profile(token);
        dispatch(
          setProfile({
            userId: response.data.userId,
            name: response.data.name,
            bio: response.data.bio,
            friends: response.data.friends,
          })
        );
        setNameInput(response.data.name || "");
        setBioInput(response.data.bio || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) handleProfile();
  }, [token, dispatch]);

  const handleProfileUpdate = async () => {
    try {
      const response = await update(token, {
        name: nameInput,
        bio: bioInput,
      });
      dispatch(setProfile({ ...response.data }));
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleAddFriend = async () => {
    try {
      const response = await friend(token, { friendId: friendEmail });
      dispatch(setProfile({ ...response.data }));
      setFriendEmail("");
      setShowFriendSuccess(true);
      setTimeout(() => setShowFriendSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to add friend:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse text-center">
          <div className="h-8 w-8 bg-sky-400 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Account Settings
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your profile and connections
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "profile"
                    ? "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("friends")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "friends"
                    ? "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                Friends ({user.friends?.length || 0})
              </button>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.username?.charAt(0) || <FiUser />}
                </div>
                <div>
                  <h2 className="font-bold text-lg">
                    {user?.username || "Anonymous"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{user?.userId?.slice(-6)}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                    activeTab === "profile"
                      ? "bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <FiUser className="flex-shrink-0" />
                  <span>Profile Information</span>
                </button>
                <button
                  onClick={() => setActiveTab("friends")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                    activeTab === "friends"
                      ? "bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <FiUsers className="flex-shrink-0" />
                  <span>Friends & Connections</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Profile Information</h2>
                  <button
                    onClick={() => {
                      if (editing) handleProfileUpdate();
                      setEditing(!editing);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  >
                    {editing ? (
                      <>
                        <FiCheck className="mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <FiEdit2 className="mr-2" />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Display Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700"
                        placeholder="Enter your name"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        {user?.username || "Not set"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      About You
                    </label>
                    {editing ? (
                      <textarea
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700"
                        placeholder="Tell others about yourself"
                      />
                    ) : (
                      <p
                        className={`px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg ${
                          !user?.bio && "text-gray-400 italic"
                        }`}
                      >
                        {user?.bio || "No bio added"}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          User ID
                        </p>
                        <p className="text-sm font-mono text-gray-900 dark:text-gray-200">
                          {user?.userId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Account Type
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-200">
                          Standard
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Friends & Connections
                  </h2>

                  <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-sky-800 dark:text-sky-200 mb-2 flex items-center">
                      <FiUserPlus className="mr-2" /> Add New Friend
                    </h3>
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        placeholder="Enter friend's user identity code"
                        value={friendEmail}
                        onChange={(e) => setFriendEmail(e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700"
                      />
                      <button
                        onClick={handleAddFriend}
                        disabled={!friendEmail}
                        className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                    {showFriendSuccess && (
                      <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                        Friend request sent successfully!
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Your Connections ({user?.friends?.length || 0})
                  </h3>

                  {user?.friends && user?.friends.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {user?.friends.map((friend) => (
                        <li key={friend._id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white">
                                <FiUser />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {friend.username}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-300 truncate">
                                {friend.bio || "Busy"}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 dark:opacity-20 truncate">
                                {friend._id || ""}
                              </p>
                            </div>
                            <div>
                              <span className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <FiMail className="mr-1" /> {friend?.email}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-12">
                      <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        No friends yet
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Add friends to share decks and study together.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
