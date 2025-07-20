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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 overflow-hidden">
      {/* Floating background elements */}
      {/* Floating glowing background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-3xl animate-pulse-slow shadow-glow"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-sky-500/20 rounded-full filter blur-3xl animate-pulse-medium shadow-glow"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-800/30 via-sky-800/20 to-indigo-900/30 opacity-40 rounded-full blur-[160px] animate-glow-spin"></div>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 text-center max-w-6xl mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-100/50 to-transparent dark:from-indigo-900/20 pointer-events-none"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block px-4 py-2 mb-6 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
          >
            <span className="text-sm font-medium bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
              Version 2.0 Now Available
            </span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
              Accelerate Your Learning
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">With Intelligent Flashcards</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            FlashMind combines <span className="font-semibold text-sky-500 dark:text-sky-400">spaced repetition</span> with cognitive science to help you retain information 3x longer.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="group relative overflow-hidden bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                <span className="relative z-10 flex items-center">
                  Go to Dashboard
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
                  Start Free Trial
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

            <Link
              to={isAuthenticated ? "/deck" : "/login"}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-800 dark:text-gray-100 px-8 py-4 rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-700/80 shadow-sm transition-all duration-300 font-semibold"
            >
              {isAuthenticated ? "Continue Studying" : "See Demo"}
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
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
                className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50 dark:border-gray-700/50"
              >
                <FiCheck className="text-emerald-500 mr-2" />
                <span className="text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      

      {/* Features Section */}
      <section className="relative px-6 md:px-12 py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
                Cognitive Science Meets
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Intuitive Design</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Features designed to optimize your learning potential
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FiBookOpen className="w-6 h-6" />}
              title="Adaptive Spaced Repetition"
              description="Our algorithm learns your memory patterns to schedule reviews at the perfect moment for retention."
              color="bg-sky-500"
              delay={0.1}
            />
            <FeatureCard
              icon={<FiMic className="w-6 h-6" />}
              title="Voice & Image Cards"
              description="Create multimedia flashcards with voice recordings, images, and formatted text."
              color="bg-indigo-500"
              delay={0.2}
            />
            <FeatureCard
              icon={<FiBarChart2 className="w-6 h-6" />}
              title="Detailed Analytics"
              description="Track retention rates, study time, and progress with beautiful visualizations."
              color="bg-emerald-500"
              delay={0.3}
            />
            <FeatureCard
              icon={<FiUserPlus className="w-6 h-6" />}
              title="Collaborative Learning"
              description="Share decks with classmates or browse our community library of expert-created content."
              color="bg-amber-500"
              delay={0.4}
            />
            <FeatureCard
              icon={<FiClock className="w-6 h-6" />}
              title="Scheduled Study Sessions"
              description="Set study reminders that adapt to your schedule and learning pace."
              color="bg-purple-500"
              delay={0.5}
            />
            <FeatureCard
              icon={<FiAward className="w-6 h-6" />}
              title="Gamified Learning"
              description="Earn badges and milestones to stay motivated in your learning journey."
              color="bg-pink-500"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="relative px-6 md:px-12 py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
                  Beautiful Interface,
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">Powerful Functionality</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                FlashMind's clean interface eliminates distractions so you can focus on what matters - learning.
              </p>
              
              <div className="space-y-4">
                {[
                  "Dark mode optimized for night studying",
                  "Keyboard shortcuts for power users",
                  "Cross-platform sync across all devices",
                  "Offline mode for studying anywhere"
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 rounded-full bg-sky-500/10 flex items-center justify-center">
                        <FiCheck className="w-3 h-3 text-sky-500" />
                      </div>
                    </div>
                    <p className="ml-3 text-gray-700 dark:text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative mx-auto w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100/20 to-indigo-100/20 dark:from-sky-900/20 dark:to-indigo-900/20 pointer-events-none"></div>
                <div className="relative h-8 bg-gray-100 dark:bg-gray-700 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-4 w-8 rounded bg-sky-500/20"></div>
                    </div>
                    <div className="h-8 w-full rounded-lg bg-gray-100 dark:bg-gray-700"></div>
                    <div className="h-32 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-sky-500/10 flex items-center justify-center">
                          <FiBookOpen className="w-6 h-6 text-sky-500" />
                        </div>
                        <div className="h-4 w-32 mx-auto rounded bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-10 rounded-lg bg-gray-100 dark:bg-gray-700"></div>
                      <div className="h-10 rounded-lg bg-sky-500/10"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative px-6 md:px-12 py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">Trusted by</span>
              <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent"> Learners Worldwide</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join thousands of students and professionals who've transformed their learning
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "FlashMind helped me memorize 500+ medical terms in just 2 months. The spaced repetition is magic!",
                author: "Dr. Emily Chen",
                role: "Resident Physician",
                rating: 5
              },
              {
                quote: "I've tried every flashcard app - this is the first one that actually made me stick with studying daily.",
                author: "Carlos M.",
                role: "Language Learner",
                rating: 5
              },
              {
                quote: "As a professor, I recommend FlashMind to all my students. The collaborative features are exceptional.",
                author: "Prof. James Wilson",
                role: "University Lecturer",
                rating: 5
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden"
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center">
                  <FiCheck className="w-5 h-5 text-sky-500" />
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 mr-4 flex-shrink-0"></div>
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
      <section className="relative px-6 md:px-12 py-24 text-center bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSJub25lIiBzdHJva2U9IiM2ODc0OTAiIHN0cm9rZS13aWR0aD0iMC4yIiBzdHJva2Utb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMCAwaDQwNDAiLz48L3N2Zz4=')]"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join over 250,000 learners who study smarter with FlashMind.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={isAuthenticated ? "/deck" : "/register"}
              className="group relative overflow-hidden bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <span className="relative z-10 flex items-center">
                {isAuthenticated ? "Continue Learning" : "Start Free Trial"}
                <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-sky-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.6 }}
              />
            </Link>
            
            <Link
              to="/demo"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-800 dark:text-gray-100 px-8 py-4 rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-700/80 shadow-sm transition-all duration-300 font-semibold"
            >
              Take a Product Tour
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            No credit card required • 7-day free trial • Cancel anytime
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
    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
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