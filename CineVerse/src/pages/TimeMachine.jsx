/**
 * TimeMachine.jsx — Travel through movie history by year
 * Year slider, decade quick-jump buttons, horizontal scroll movie row, AI fun facts.
 */
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useTimeMachine from '../hooks/useTimeMachine';

const DECADES = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

export default function TimeMachine() {
  const { movies, funFact, loading, year, fetchYear } = useTimeMachine();
  const navigate = useNavigate();

  useEffect(() => { fetchYear(2000); }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            <Clock className="inline mr-2 text-cinema-accent" size={36} />
            Time <span className="gradient-text">Machine</span>
          </h1>
          <p className="text-cinema-muted text-base">Travel through movie history — drag the slider to any year</p>
        </motion.div>

        {/* Decade quick-jump buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {DECADES.map((d) => {
            const y = parseInt(d);
            return (
              <motion.button key={d} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => fetchYear(y)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  year >= y && year < y + 10
                    ? 'bg-cinema-accent text-white shadow-neon'
                    : 'glass text-cinema-muted border border-white/5 hover:text-white'
                }`}
              >
                {d}
              </motion.button>
            );
          })}
        </div>

        {/* Year slider */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between text-cinema-muted text-xs mb-2">
            <span>1950</span>
            <span className="text-cinema-accent font-display text-3xl font-bold">{year}</span>
            <span>2024</span>
          </div>
          <input
            type="range" min={1950} max={2024} value={year}
            onChange={(e) => fetchYear(parseInt(e.target.value))}
            className="w-full h-2 bg-cinema-surface rounded-full appearance-none cursor-pointer accent-cinema-accent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cinema-accent [&::-webkit-slider-thumb]:shadow-neon"
          />
        </div>

        {/* Fun fact */}
        {funFact && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass rounded-2xl p-4 max-w-2xl mx-auto mb-8 border border-cinema-accent/10 text-center"
          >
            <p className="text-cinema-text text-sm">{funFact}</p>
          </motion.div>
        )}

        {/* Movie row */}
        <div className="relative">
          <h3 className="font-display text-lg font-bold text-white mb-4">
            Top Movies of {year} <ChevronRight size={18} className="inline text-cinema-accent" />
          </h3>
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-40 flex-shrink-0 animate-pulse">
                  <div className="aspect-[2/3] bg-cinema-surface rounded-xl" />
                  <div className="h-3 bg-cinema-surface rounded mt-2 w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
              {movies.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/movie/${m.id}`)}
                  className="w-40 flex-shrink-0 cursor-pointer group snap-start"
                >
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-cinema-surface border border-white/5 group-hover:border-cinema-accent/30 transition-all relative">
                    {m.poster ? (
                      <img src={m.poster} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-cinema-muted/30 text-3xl">🎬</div>
                    )}
                    {m.rating && (
                      <div className="absolute top-2 right-2 glass px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <Star size={8} className="text-cinema-gold fill-cinema-gold" />
                        <span className="text-[9px] font-bold text-cinema-gold">{m.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-white text-xs font-semibold mt-2 truncate group-hover:text-cinema-accent transition-colors">{m.title}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
