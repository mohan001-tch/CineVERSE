import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import MovieCard from './MovieCard';
import { getTrending } from '../../data/movies';

export default function TrendingCarousel() {
  const scrollRef = useRef(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMovies(getTrending(15));
      setLoading(false);
    }, 800);
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 px-4 md:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cinema-accent to-cinema-purple flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">Trending Now</h2>
              <p className="text-cinema-muted text-sm">What everyone's watching</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll(-1)} className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll(1)} className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition">
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-48 h-72 skeleton rounded-2xl" />
            ))}
          </div>
        ) : (
          <div ref={scrollRef} className="flex gap-5 overflow-x-auto hide-scrollbar pb-4 snap-x">
            {movies.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
