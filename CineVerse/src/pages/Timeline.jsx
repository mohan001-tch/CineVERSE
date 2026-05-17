import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import MovieCard from '../components/Movies/MovieCard';
import { movies, getMoviesByDecade, decades } from '../data/movies';

const decadeStyles = {
  '1930s': { color: '#d4a574', bg: 'from-amber-900/30 to-amber-800/10' },
  '1940s': { color: '#b8860b', bg: 'from-yellow-900/30 to-yellow-800/10' },
  '1950s': { color: '#cd853f', bg: 'from-orange-900/30 to-orange-800/10' },
  '1960s': { color: '#ff6347', bg: 'from-red-900/30 to-red-800/10' },
  '1970s': { color: '#daa520', bg: 'from-amber-800/30 to-amber-700/10' },
  '1980s': { color: '#ff69b4', bg: 'from-pink-900/30 to-pink-800/10' },
  '1990s': { color: '#00ced1', bg: 'from-teal-900/30 to-teal-800/10' },
  '2000s': { color: '#4169e1', bg: 'from-blue-900/30 to-blue-800/10' },
  '2010s': { color: '#8a2be2', bg: 'from-purple-900/30 to-purple-800/10' },
  '2020s': { color: '#00d4ff', bg: 'from-cyan-900/30 to-cyan-800/10' },
};

export default function Timeline() {
  const [selectedDecade, setSelectedDecade] = useState(null);
  const decadeMovies = selectedDecade ? getMoviesByDecade(selectedDecade) : [];

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
            <Clock size={14} className="text-cinema-accent" />
            <span className="text-xs text-cinema-muted">Time Travel</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-2">Cinema Timeline</h1>
          <p className="text-cinema-muted">Journey through decades of cinematic history</p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mb-12">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cinema-accent/30 to-transparent -translate-y-1/2 hidden md:block" />
          <div className="flex flex-wrap justify-center gap-3 md:gap-0 md:justify-between">
            {decades.map((decade, i) => {
              const style = decadeStyles[decade] || { color: '#00d4ff', bg: 'from-cyan-900/30 to-cyan-800/10' };
              const count = getMoviesByDecade(decade).length;
              const isSelected = selectedDecade === decade;
              return (
                <motion.button key={decade} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }} whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDecade(isSelected ? null : decade)}
                  className={`relative flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-all ${isSelected ? 'glass shadow-neon' : 'hover:bg-white/5'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${isSelected ? 'scale-110' : ''}`}
                    style={{ background: `linear-gradient(135deg, ${style.color}33, ${style.color}11)`, color: style.color, border: `2px solid ${isSelected ? style.color : style.color + '33'}` }}>
                    {decade.slice(2)}
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: style.color }}>{decade}</span>
                  <span className="text-[10px] text-cinema-muted">{count} films</span>
                  {isSelected && <motion.div layoutId="timeline-indicator" className="absolute -bottom-1 w-2 h-2 rounded-full" style={{ background: style.color }} />}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Decade Content */}
        {selectedDecade && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} key={selectedDecade}>
            <div className={`rounded-3xl p-6 mb-6 bg-gradient-to-r ${decadeStyles[selectedDecade]?.bg || ''}`}>
              <h2 className="font-display text-2xl font-bold text-white mb-1">
                The <span style={{ color: decadeStyles[selectedDecade]?.color }}>{selectedDecade}</span>
              </h2>
              <p className="text-cinema-muted text-sm">{decadeMovies.length} movies from this era</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {decadeMovies.map((movie, i) => (
                <MovieCard key={movie.id} movie={movie} index={i} size="small" />
              ))}
            </div>
          </motion.div>
        )}

        {!selectedDecade && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <span className="text-6xl mb-4 block">🎞️</span>
            <p className="text-cinema-muted text-lg">Select a decade to explore</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
