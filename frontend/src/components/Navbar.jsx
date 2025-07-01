import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { clearDecks } from "../features/deck/deckSlice";
import { FiHome, FiUser, FiLogOut, FiLogIn, FiUserPlus } from "react-icons/fi";
import { PiCardsBold } from "react-icons/pi";

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearDecks());
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm px-6 py-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center space-x-2">
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent"
        >
          FlashMind
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <FiHome className="h-5 w-5" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        {isAuthenticated ? (
          <>
            <Link
              to="/profile"
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <FiUser className="h-5 w-5" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <Link
              to="/deck"
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <PiCardsBold className="h-5 w-5" />
              <span className="hidden sm:inline">Deck</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <FiLogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              <FiLogIn className="h-5 w-5" />
              <span className="hidden sm:inline">Login</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:opacity-90 transition-opacity shadow-sm"
            >
              <FiUserPlus className="h-5 w-5" />
              <span className="hidden sm:inline">Register</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
