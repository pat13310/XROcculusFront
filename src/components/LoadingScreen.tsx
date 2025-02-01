import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
  backgroundColor?: string;
  textColor?: string;
  spinnerColor?: string;
}

export function LoadingScreen({ 
  message = 'Chargement de l\'aplication...', 
  backgroundColor = 'bg-gray-100', 
  textColor = 'text-gray-700', 
  spinnerColor = 'border-violet-500'
}: LoadingScreenProps) {
  return (
    <div className={`min-h-screen ${backgroundColor} flex items-center justify-center`}>
      <motion.div 
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className={`w-16 h-16 border-4 ${spinnerColor} border-opacity-25 rounded-full animate-spin`}
          style={{
            borderTopColor: spinnerColor,
            animationDuration: '1s'
          }}
        />
        <p className={`text-xl font-semibold ${textColor}`}>{message}</p>
      </motion.div>
    </div>
  );
}