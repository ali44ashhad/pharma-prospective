// frontend/src/components/common/Loader.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center">
      <div className="text-center">
        {/* Animated Molecules */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-cyan-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${Math.cos((i / 3) * Math.PI * 2) * 30 + 30}px`,
                top: `${Math.sin((i / 3) * Math.PI * 2) * 30 + 30}px`,
              }}
            />
          ))}
        </div>

        {/* Loading Text */}
        <motion.p
          className="text-cyan-400 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading Research Portal...
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          className="w-48 h-1 bg-gray-700 rounded-full mt-4 mx-auto overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Loader;