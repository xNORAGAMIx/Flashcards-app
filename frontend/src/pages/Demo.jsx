import { motion } from "framer-motion";

const Demo = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] dark:from-black dark:via-slate-900 dark:to-black overflow-hidden text-white">
      {/* Background Gradient Blur */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/2 w-[600px] h-[600px] bg-teal-400/30 blur-3xl rounded-full opacity-30" />
        <div className="absolute top-60 right-10 w-[400px] h-[400px] bg-purple-500/20 blur-2xl rounded-full opacity-20" />
      </div>

      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-teal-400 to-purple-500 text-transparent bg-clip-text"
        >
          Experience FlashMind in Action
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto"
        >
          Dive into how FlashMind helps you learn faster, smarter, and better.
        </motion.p>
      </section>

      {/* Demo Screenshots Section */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="backdrop-blur-xl bg-white/5 dark:bg-white/10 border border-white/10 rounded-2xl p-4 shadow-md hover:scale-[1.02] transition-transform"
          >
            <img
              src={`/screenshots/demo${img}.png`} // Replace with actual paths
              alt={`FlashMind Screenshot ${img}`}
              className="rounded-xl object-cover w-full h-60"
            />
            <p className="text-center text-sm mt-4 text-gray-300">
              {img === 1 && "Smart Flashcard Review Flow"}
              {img === 2 && "Detailed Progress & Stats"}
              {img === 3 && "Voice-Enabled Learning Interface"}
            </p>
          </motion.div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block bg-gradient-to-r from-purple-600 to-teal-400 p-[1px] rounded-xl"
        >
          <div className="bg-gray-900 dark:bg-black rounded-xl px-8 py-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              Ready to Boost Your Memory?
            </h2>
            <p className="text-gray-400 mb-4">Sign up to start your flashcard journey today.</p>
            <a
              href="/deck"
              className="inline-block px-5 py-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-lg transition"
            >
              Get Started
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Demo;
