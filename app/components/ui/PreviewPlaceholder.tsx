import React from 'react';
import { motion } from 'framer-motion';

export const PreviewPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <div className="w-24 h-24 mb-6">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M50 10 V 90 M10 50 H 90"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke="#38bdf8"
              strokeWidth="4"
              fill="none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-300">Generating Preview...</h3>
        <p className="mt-2 text-slate-500">The preview will be available here once the code is generated.</p>
      </motion.div>
    </div>
  );
};
