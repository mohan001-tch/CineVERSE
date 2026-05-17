/**
 * SpeakButton.jsx — AI Voice Narrator Button Component
 * 
 * A reusable speaker icon button that reads movie details aloud using
 * the Web Speech API via the useSpeech custom hook.
 * 
 * Features:
 *   - 🔊 speaker icon with pulse animation while speaking
 *   - Click to start/stop narration
 *   - Glassmorphism design consistent with CineVerse theme
 */

import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useSpeech from '../../hooks/useSpeech';

export default function SpeakButton({ movie, size = 'sm', className = '' }) {
  const { isSpeaking, isSupported, toggleMovieNarration } = useSpeech();

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent card navigation
    e.preventDefault();
    toggleMovieNarration(movie);
  };

  if (!isSupported) return null;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      title={isSpeaking ? 'Stop narration' : 'Hear movie description'}
      className={`
        ${sizeClasses[size]} rounded-full flex items-center justify-center
        transition-all duration-300 relative
        ${isSpeaking
          ? 'bg-cinema-accent text-white shadow-neon'
          : 'glass text-white hover:text-cinema-accent hover:border-cinema-accent/30'
        }
        ${className}
      `}
    >
      {/* Pulse ring animation while speaking */}
      <AnimatePresence>
        {isSpeaking && (
          <>
            <motion.span
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-cinema-accent/40"
            />
            <motion.span
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
              className="absolute inset-0 rounded-full bg-cinema-accent/20"
            />
          </>
        )}
      </AnimatePresence>

      {/* Icon */}
      <motion.div
        animate={isSpeaking ? { scale: [1, 1.15, 1] } : {}}
        transition={isSpeaking ? { duration: 0.6, repeat: Infinity } : {}}
        className="relative z-10"
      >
        {isSpeaking ? (
          <VolumeX size={iconSizes[size]} />
        ) : (
          <Volume2 size={iconSizes[size]} />
        )}
      </motion.div>
    </motion.button>
  );
}
