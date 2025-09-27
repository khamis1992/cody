import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './logo';

export const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1,
          ease: 'easeInOut',
          delay: 0.2,
        }}
      >
        <Logo className="w-48 h-48" />
      </motion.div>
    </motion.div>
  );
};
