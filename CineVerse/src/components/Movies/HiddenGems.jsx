import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import MovieCard from './MovieCard';
import { getHiddenGems } from '../../data/movies';
import { useState, useEffect } from 'react';

export default function HiddenGems() {
  const [gems, setGems] = useState([]);

  useEffect(() => { setGems(getHiddenGems(12)); }, []);

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cinema-gold to-cinema-orange flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white">Hidden Gems</h2>
            <p className="text-cinema-muted text-sm">Underrated films waiting to be discovered</p>
          </div>
        </motion.div>

        {/* Featured Gem */}
        {gems[0] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8 rounded-3xl overflow-hidden relative h-64 md:h-80 cursor-pointer card-hover"
            style={{ background: `linear-gradient(135deg, ${gems[0].gradient[0]}cc, ${gems[0].gradient[1]}cc)` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-10 z-10">
              <span className="glass px-3 py-1 rounded-full text-xs font-bold text-cinema-gold mb-3 inline-block">⭐ Editor's Pick</span>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">{gems[0].title}</h3>
              <p className="text-gray-300 text-sm mb-1">{gems[0].director} • {gems[0].year} • {gems[0].runtime}min</p>
              <p className="text-gray-400 text-xs">{gems[0].cast.slice(0, 3).join(', ')}</p>
            </div>
            <div className="absolute top-1/2 right-10 -translate-y-1/2 text-8xl opacity-30">{gems[0].emoji}</div>
          </motion.div>
        )}

        {/* Gem Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {gems.slice(1, 7).map((movie, i) => (
            <MovieCard key={movie.id} movie={movie} index={i} size="small" />
          ))}
        </div>
      </div>
    </section>
  );
}
