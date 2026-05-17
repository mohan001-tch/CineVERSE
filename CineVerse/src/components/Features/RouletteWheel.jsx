/**
 * RouletteWheel.jsx — Surprise Me! Animated Spin Wheel
 *
 * 8 genre segments, CSS spin animation, Web Audio tick sound,
 * fetches random movie from TMDB after landing.
 */
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Star, Play, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useRoulette from '../../hooks/useRoulette';

/** Generate a short click sound using Web Audio API */
function playTickSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.value = 0.1;
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {}
}

export default function RouletteWheel({ isOpen, onClose }) {
  const { spinning, selectedGenre, movie, rotation, spin, GENRES } = useRoulette();
  const navigate = useNavigate();
  const tickIntervalRef = useRef(null);

  const handleSpin = () => {
    spin();
    // Play tick sounds during spin
    let count = 0;
    tickIntervalRef.current = setInterval(() => {
      playTickSound();
      count++;
      if (count > 30) clearInterval(tickIntervalRef.current);
    }, 100);
    setTimeout(() => clearInterval(tickIntervalRef.current), 3000);
  };

  if (!isOpen) return null;

  const segAngle = 360 / GENRES.length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-strong rounded-3xl border border-white/10 p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-white">
              🎰 Surprise Me!
            </h2>
            <button onClick={onClose} className="text-cinema-muted hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Wheel */}
          <div className="relative w-64 h-64 mx-auto mb-6">
            {/* Pointer */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-cinema-accent text-2xl">▼</div>

            {/* Spinning wheel */}
            <div
              className="w-full h-full rounded-full border-4 border-white/10 overflow-hidden relative"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              }}
            >
              {GENRES.map((genre, i) => {
                const startAngle = i * segAngle;
                return (
                  <div
                    key={genre.id}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: `rotate(${startAngle + segAngle / 2}deg)`,
                      clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(((startAngle - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((startAngle - 90) * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((startAngle + segAngle - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((startAngle + segAngle - 90) * Math.PI) / 180)}%)`,
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: genre.color, opacity: 0.7 }}
                    />
                    <span className="relative text-2xl" style={{ transform: `rotate(-${startAngle + segAngle / 2}deg) translateY(-30px)` }}>
                      {genre.emoji}
                    </span>
                  </div>
                );
              })}
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-cinema-dark border-2 border-white/20 flex items-center justify-center z-10">
                <span className="text-lg">🎬</span>
              </div>
            </div>
          </div>

          {/* Genre labels ring */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {GENRES.map((g) => (
              <span
                key={g.id}
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  selectedGenre?.id === g.id ? 'text-white' : 'text-cinema-muted'
                }`}
                style={selectedGenre?.id === g.id ? { backgroundColor: g.color } : {}}
              >
                {g.emoji} {g.name}
              </span>
            ))}
          </div>

          {/* Spin button */}
          {!movie && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSpin}
              disabled={spinning}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 shadow-neon"
            >
              {spinning ? (
                <>
                  <RotateCcw size={20} className="animate-spin" /> Spinning...
                </>
              ) : (
                <>🎰 Spin the Wheel!</>
              )}
            </motion.button>
          )}

          {/* Result */}
          <AnimatePresence>
            {movie && !spinning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <p className="text-center text-cinema-accent font-bold text-sm mb-3">
                  🎯 Genre: {selectedGenre?.emoji} {selectedGenre?.name}
                </p>
                <div className="glass rounded-2xl p-4 flex gap-4 border border-white/5">
                  {movie.poster && (
                    <img src={movie.poster} alt="" className="w-24 h-36 rounded-xl object-cover flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-white text-lg leading-tight">{movie.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-cinema-muted">
                      <span>{movie.year}</span>
                      {movie.rating && (
                        <span className="flex items-center gap-0.5 text-cinema-gold">
                          <Star size={10} className="fill-cinema-gold" /> {movie.rating}
                        </span>
                      )}
                    </div>
                    <p className="text-cinema-text text-xs mt-2 line-clamp-3">{movie.overview}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => { navigate(`/movie/${movie.id}`); onClose(); }}
                        className="px-3 py-1.5 rounded-lg bg-cinema-accent text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Play size={12} /> View
                      </button>
                      <button
                        onClick={handleSpin}
                        className="px-3 py-1.5 rounded-lg glass text-cinema-muted text-xs font-bold border border-white/10 hover:text-white"
                      >
                        🎰 Spin Again
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
