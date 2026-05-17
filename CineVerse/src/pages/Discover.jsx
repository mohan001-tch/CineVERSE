import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Compass, Filter, Sparkles } from 'lucide-react';
import MovieCard from '../components/Movies/MovieCard';
import MoodChip from '../components/UI/MoodChip';
import { getSmartCollections, getMoviesByMood, getMoviesByGenre, movies, genres } from '../data/movies';

const moods = ['Funny', 'Emotional', 'Horror', 'Romantic', 'Intense', 'Mind-bending', 'Cozy', 'Inspirational'];

export default function Discover() {
  const [searchParams] = useSearchParams();
  const [selectedMood, setSelectedMood] = useState(searchParams.get('mood') || null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const collections = getSmartCollections();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedMood) {
      setFilteredMovies(getMoviesByMood(selectedMood));
      setSelectedGenre(null);
    } else if (selectedGenre) {
      setFilteredMovies(getMoviesByGenre(selectedGenre));
      setSelectedMood(null);
    } else {
      setFilteredMovies([]);
    }
  }, [selectedMood, selectedGenre]);

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cinema-accent to-cinema-purple flex items-center justify-center">
              <Compass size={20} className="text-white" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">Smart Discovery</h1>
          </div>
          <p className="text-cinema-muted ml-13">Find movies based on mood, time, and vibe</p>
        </motion.div>

        {/* Mood Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-cinema-accent" /> How are you feeling?
          </h3>
          <div className="flex flex-wrap gap-3">
            {moods.map(mood => (
              <MoodChip key={mood} mood={mood} selected={selectedMood === mood} onClick={(m) => setSelectedMood(m === selectedMood ? null : m)} />
            ))}
          </div>
        </motion.div>

        {/* Genre Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Filter size={16} className="text-cinema-purple" /> By Genre
          </h3>
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <button key={genre} onClick={() => setSelectedGenre(genre === selectedGenre ? null : genre)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${selectedGenre === genre ? 'bg-cinema-purple text-white' : 'glass text-cinema-muted hover:text-white hover:bg-white/10'}`}>
                {genre}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Filtered Results */}
        {filteredMovies.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16">
            <h3 className="font-display text-xl font-bold text-white mb-6">
              {selectedMood ? `${selectedMood} Movies` : `${selectedGenre} Movies`}
              <span className="text-cinema-muted text-sm font-normal ml-2">({filteredMovies.length} found)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {filteredMovies.map((movie, i) => (
                <MovieCard key={movie.id} movie={movie} index={i} size="small" />
              ))}
            </div>
          </motion.div>
        )}

        {/* Smart Collections */}
        {!selectedMood && !selectedGenre && (
          <div className="space-y-12">
            <h2 className="font-display text-2xl font-bold text-white">Curated Collections</h2>
            {collections.map((col, ci) => (
              <motion.div key={col.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ci * 0.1 }}>
                {/* Collection Header Card */}
                <div className="rounded-2xl p-6 mb-4 relative overflow-hidden cursor-pointer card-hover"
                  style={{ background: `linear-gradient(135deg, ${col.gradient[0]}cc, ${col.gradient[1]}cc)` }}>
                  <div className="absolute top-4 right-6 text-5xl opacity-30">{col.emoji}</div>
                  <h3 className="font-display text-xl font-bold text-white mb-1">{col.emoji} {col.title}</h3>
                  <p className="text-white/70 text-sm">{col.desc}</p>
                  <p className="text-white/50 text-xs mt-2">{col.movies.length} movies</p>
                </div>
                {/* Movies Row */}
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                  {col.movies.slice(0, 8).map((movie, i) => (
                    <MovieCard key={movie.id} movie={movie} index={i} size="small" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
