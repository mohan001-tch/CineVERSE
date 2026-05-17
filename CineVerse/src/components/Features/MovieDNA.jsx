/**
 * MovieDNA.jsx — AI Movie DNA Analyzer Modal
 * Shows animated circular progress bars for genre breakdown.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dna } from 'lucide-react';
import useMovieDNA from '../../hooks/useMovieDNA';
import { useEffect } from 'react';

const GENRE_COLORS = {
  Action: '#e50914',
  Romance: '#ec4899',
  Comedy: '#f59e0b',
  Thriller: '#10b981',
  Drama: '#8b5cf6',
};

const GENRE_EMOJI = {
  Action: '💥',
  Romance: '💕',
  Comedy: '😂',
  Thriller: '🔪',
  Drama: '🎭',
};

function CircleProgress({ percent, color, label, emoji, delay }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }}
      className="flex flex-col items-center"
    >
      <div className="relative w-20 h-20">
        <svg width="80" height="80" className="-rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <motion.circle
            cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, delay: delay + 0.3, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-sm">{percent}%</span>
        </div>
      </div>
      <span className="text-[11px] text-cinema-muted mt-1">{emoji} {label}</span>
    </motion.div>
  );
}

export default function MovieDNA({ movie, isOpen, onClose }) {
  const { dna, loading, analyze } = useMovieDNA();

  useEffect(() => {
    if (isOpen && movie) analyze(movie);
  }, [isOpen, movie]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-strong rounded-2xl border border-white/10 p-6 max-w-md w-full"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Dna size={20} className="text-cinema-accent" /> Movie DNA
            </h2>
            <button onClick={onClose} className="text-cinema-muted hover:text-white"><X size={20} /></button>
          </div>

          <p className="text-cinema-accent font-bold text-sm mb-4">{movie?.title}</p>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-2 border-cinema-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : dna ? (
            <>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {Object.entries(dna.genres || {}).map(([genre, percent], i) => (
                  <CircleProgress
                    key={genre}
                    percent={percent}
                    color={GENRE_COLORS[genre] || '#6366f1'}
                    label={genre}
                    emoji={GENRE_EMOJI[genre] || '🎬'}
                    delay={i * 0.15}
                  />
                ))}
              </div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                className="glass rounded-xl p-3 text-center border border-white/5"
              >
                <p className="text-cinema-muted text-xs">This movie's DNA matches:</p>
                <p className="text-white font-bold text-sm mt-1">
                  {dna.matchA} <span className="text-cinema-accent">+</span> {dna.matchB}
                </p>
              </motion.div>
            </>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
