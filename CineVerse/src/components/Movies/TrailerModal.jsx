/**
 * TrailerModal.jsx — Movie Trailer Popup Component
 * 
 * A premium modal that plays the official YouTube trailer when a user
 * clicks "Watch Trailer". Uses React Portal to render outside the root div.
 * 
 * Features:
 *   - Dark overlay with backdrop blur
 *   - Embedded YouTube player with autoplay
 *   - Close on ESC key or clicking outside
 *   - Responsive iframe that scales properly
 *   - Smooth open/close CSS transitions via Framer Motion
 *   - Loading state and "no trailer" fallback
 */

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import useTrailer from '../../hooks/useTrailer';

export default function TrailerModal({ movieId, movieTitle, onClose }) {
  const { trailerKey, isLoading, error } = useTrailer(movieId);
  const modalRef = useRef(null);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Click outside to close
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
        onClick={handleBackdropClick}
      >
        {/* Dark backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl z-10"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute -top-12 right-0 md:-top-14 md:-right-2 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-cinema-accent hover:bg-white/10 transition-all z-20"
          >
            <X size={20} />
          </motion.button>

          {/* Movie Title */}
          <div className="mb-3">
            <h3 className="font-display text-lg md:text-xl font-bold text-white truncate">
              {movieTitle || 'Movie Trailer'}
            </h3>
          </div>

          {/* Video Container */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-cinema-card border border-white/10 shadow-glass-lg">
            {/* Loading State */}
            {isLoading && (
              <div className="aspect-video flex flex-col items-center justify-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 size={40} className="text-cinema-accent" />
                </motion.div>
                <p className="text-cinema-muted text-sm">Loading trailer...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="aspect-video flex flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-cinema-red/10 flex items-center justify-center">
                  <AlertCircle size={32} className="text-cinema-red" />
                </div>
                <p className="text-white font-semibold text-lg">{error}</p>
                <p className="text-cinema-muted text-sm max-w-md">
                  This movie's trailer may not be available on YouTube, or it hasn't been added to the database yet.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-2 rounded-xl glass text-cinema-accent border border-cinema-accent/30 text-sm font-medium hover:bg-cinema-accent/10 transition"
                >
                  Close
                </button>
              </div>
            )}

            {/* YouTube Iframe */}
            {trailerKey && !isLoading && (
              <div className="relative aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
                  title={`${movieTitle || 'Movie'} - Official Trailer`}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Subtle hint */}
          <p className="text-cinema-muted/50 text-xs text-center mt-3">
            Press ESC or click outside to close
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  // Render via React Portal to ensure it's outside the root div hierarchy
  return createPortal(modalContent, document.body);
}
