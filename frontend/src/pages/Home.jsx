/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiBookOpen,
  FiMic,
  FiBarChart2,
  FiUserPlus,
  FiArrowRight,
  FiCheck,
  FiGlobe,
  FiAward,
  FiClock,
} from "react-icons/fi";
import { motion } from "framer-motion";

const Home = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Hero Section */}
      <section className="px-6 md:px-12 py-24 md:py-32 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
            Master Anything with FlashMind
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            The intelligent flashcard app that uses{" "}
            <span className="font-semibold text-sky-500 dark:text-sky-400">
              spaced repetition
            </span>{" "}
            to help you remember more in less time.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="group relative overflow-hidden bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                <span className="relative z-10 flex items-center">
                  Get Started{" "}
                  <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-sky-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.6 }}
                />
              </Link>
            ) : (
              <Link
                to="/register"
                className="group relative overflow-hidden bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                <span className="relative z-10 flex items-center">
                  Get Started{" "}
                  <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-sky-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.6 }}
                />
              </Link>
            )}

            {isAuthenticated ? (
              <Link
                to="/deck"
                className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 px-8 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all duration-300 font-semibold"
              >
                Catch up
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 px-8 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all duration-300 font-semibold"
              >
                Already a member? Login
              </Link>
            )}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            {[
              "Medical Students",
              "Language Learners",
              "Exam Takers",
              "Professionals",
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="flex items-center bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <FiCheck className="text-emerald-500 mr-2" />
                <span className="text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-12 py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
              Smarter Learning Tools
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to study effectively, all in one place
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FiBookOpen className="w-6 h-6" />}
              title="Spaced Repetition"
              description="Our algorithm schedules reviews at optimal intervals for maximum retention"
              color="bg-sky-500"
              delay={0.1}
            />
            <FeatureCard
              icon={<FiMic className="w-6 h-6" />}
              title="Voice Flashcards"
              description="Create cards by speaking - perfect for language learning on the go"
              color="bg-indigo-500"
              delay={0.2}
            />
            <FeatureCard
              icon={<FiBarChart2 className="w-6 h-6" />}
              title="Progress Analytics"
              description="Track your learning with beautiful charts and insights"
              color="bg-emerald-500"
              delay={0.3}
            />
            <FeatureCard
              icon={<FiUserPlus className="w-6 h-6" />}
              title="Shared Decks"
              description="Collaborate with classmates or browse community decks"
              color="bg-orange-500"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 md:px-12 py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Simple Yet Powerful
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              FlashMind adapts to your learning style while keeping things
              simple
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiGlobe className="w-8 h-8 text-sky-500" />,
                step: "Create or Import",
                desc: "Start with our templates, create your own, or import existing decks from Anki or CSV.",
              },
              {
                icon: <FiClock className="w-8 h-8 text-indigo-500" />,
                step: "Study Smart",
                desc: "Our algorithm determines the perfect time to review each concept for long-term retention.",
              },
              {
                icon: <FiAward className="w-8 h-8 text-emerald-500" />,
                step: "Track & Improve",
                desc: "Watch your knowledge grow with detailed progress tracking and insights.",
              },
            ].map(({ icon, step, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.2 * i, duration: 0.6 }}
                whileHover={{ scale: 1.03 }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center">
                  {icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step}</h3>
                <p className="text-gray-600 dark:text-gray-300">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="px-6 md:px-12 py-20 bg-gray-50 dark:bg-gray-800/60">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Trusted by Learners Worldwide
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Join thousands who've transformed their study habits
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  "FlashMind helped me memorize 500+ medical terms in just 2 months. The spaced repetition is magic!",
                author: "Dr. Emily Chen, Resident Physician",
                role: "Medical Student",
              },
              {
                quote:
                  "I've tried every flashcard app - this is the first one that actually made me stick with studying daily.",
                author: "Carlos M., Language Learner",
                role: "Spanish Student",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-600 relative"
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white">
                  <FiCheck className="w-5 h-5" />
                </div>
                <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 md:px-12 py-24 text-center bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands who study smarter with FlashMind. It's free to get
            started!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/deck"
              className="group relative overflow-hidden bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <span className="relative z-10 flex items-center">
                Start Learning Now{" "}
                <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-sky-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.6 }}
              />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600"
  >
    <div
      className={`w-12 h-12 ${color} rounded-lg mb-6 mx-auto flex items-center justify-center text-white`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-center">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 text-center">
      {description}
    </p>
  </motion.div>
);

export default Home;
