/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dashboard } from "../api/statsAPI";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import { FiTrendingUp, FiAward, FiCheckCircle, FiXCircle, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const Performance = () => {
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleDashboard = async () => {
      try {
        const response = await dashboard(token);
        const filteredStats = response.data.filter(
          (entry) => entry.userId === userId
        );
        setStats(filteredStats);
      } catch (err) {
        console.error("Error fetching dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    handleDashboard();
  }, [token, userId]);

  // Process data for charts
  const dates = stats.map((entry) => new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  const studied = stats.map((entry) => entry.studied);
  const correct = stats.map((entry) => entry.correct);
  const incorrect = stats.map((entry) => entry.studied - entry.correct);
  const streak = stats.map((entry) => entry.streak);

  const totalCorrect = correct.reduce((a, b) => a + b, 0);
  const totalIncorrect = incorrect.reduce((a, b) => a + b, 0);
  const totalStudied = totalCorrect + totalIncorrect;
  const accuracy = totalStudied > 0 ? (totalCorrect / totalStudied) * 100 : 0;

  // Chart options
  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    maintainAspectRatio: false,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse text-center">
          <div className="h-8 w-8 bg-sky-400 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your stats...</p>
        </div>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <FiTrendingUp className="text-2xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            No statistics yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start studying to see your performance data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 px-6 min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Your Learning Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your progress and improve your study habits
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 mr-4">
                <FiCalendar className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Days Studied</p>
                <p className="text-2xl font-semibold text-black dark:text-white">{stats.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mr-4">
                <FiCheckCircle className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Correct</p>
                <p className="text-2xl font-semibold text-black dark:text-white">{totalCorrect}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mr-4">
                <FiXCircle className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Incorrect</p>
                <p className="text-2xl font-semibold text-black dark:text-white">{totalIncorrect}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mr-4">
                <FiAward className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Accuracy</p>
                <p className="text-2xl font-semibold text-black dark:text-white">{accuracy.toFixed(1)}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activity Over Time */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center text-black dark:text-white">
              <FiTrendingUp className="mr-2 text-sky-500" />
              Daily Activity
            </h2>
            <div className="h-80">
              <Line
                data={{
                  labels: dates,
                  datasets: [
                    {
                      label: "Cards Studied",
                      data: studied,
                      borderColor: "#3B82F6",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      tension: 0.3,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  ...commonOptions,
                  plugins: {
                    ...commonOptions.plugins,
                    title: {
                      display: true,
                      text: 'Cards Studied Per Day',
                    },
                  },
                }}
              />
            </div>
          </motion.div>

          {/* Accuracy Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center text-black dark:text-white">
              <FiAward className="mr-2 text-emerald-500" />
              Answer Accuracy
            </h2>
            <div className="h-80">
              <Pie
                data={{
                  labels: ["Correct", "Incorrect"],
                  datasets: [
                    {
                      data: [totalCorrect, totalIncorrect],
                      backgroundColor: ["#FFFF33", "#FF3333"],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  ...commonOptions,
                  plugins: {
                    ...commonOptions.plugins,
                    title: {
                      display: true,
                      text: 'Overall Answer Distribution',
                    },
                  },
                }}
              />
            </div>
          </motion.div>

          {/* Correct vs Incorrect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center text-black dark:text-white">
              <FiCheckCircle className="mr-2 text-emerald-500" />
              Correct vs Incorrect
            </h2>
            <div className="h-80">
              <Bar
                data={{
                  labels: dates,
                  datasets: [
                    {
                      label: "Correct",
                      data: correct,
                      backgroundColor: "#FFFF33",
                    },
                    {
                      label: "Incorrect",
                      data: incorrect,
                      backgroundColor: "#FF3333",
                    },
                  ],
                }}
                options={{
                  ...commonOptions,
                  plugins: {
                    ...commonOptions.plugins,
                    title: {
                      display: true,
                      text: 'Daily Performance Breakdown',
                    },
                  },
                }}
              />
            </div>
          </motion.div>

          {/* Streak Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center text-black dark:text-white">
              <FiTrendingUp className="mr-2 text-amber-500" />
              Study Streak
            </h2>
            <div className="h-80">
              <Line
                data={{
                  labels: dates,
                  datasets: [
                    {
                      label: "Current Streak",
                      data: streak,
                      borderColor: "#F59E0B",
                      backgroundColor: "rgba(245, 158, 11, 0.1)",
                      tension: 0.3,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  ...commonOptions,
                  plugins: {
                    ...commonOptions.plugins,
                    title: {
                      display: true,
                      text: 'Your Study Streak Over Time',
                    },
                  },
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Performance;