"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mt-20 min-h-screen"
    >
      <div className="flex flex-col items-center justify-center py-20">
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-center mb-6"
        >
          Welcome to My Digital Garden
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground text-center max-w-2xl"
        >
          A place where ideas grow and thoughts flourish. Explore my collection of
          writings, tutorials, and digital experiments.
        </motion.p>
      </div>
    </motion.div>
  );
}