import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Mic, Sparkles, ArrowDown, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MoodChip from '../components/UI/MoodChip';
import TubesBackground from '../components/UI/TubesBackground';
import RouletteWheel from '../components/Features/RouletteWheel';
import TrendingCarousel from '../components/Movies/TrendingCarousel';
import HiddenGems from '../components/Movies/HiddenGems';
import CountUpStats from '../components/UI/CountUpStats';
import { searchMovies, getMoviesByMood, movies } from '../data/movies';

const moods = ['Funny', 'Emotional', 'Horror', 'Romantic', 'Intense', 'Mind-bending', 'Cozy', 'Inspirational'];

const floatingPosters = [
  { emoji: '🎬', x: '10%', y: '20%', delay: 0, size: 'text-5xl' },
  { emoji: '🍿', x: '80%', y: '15%', delay: 1, size: 'text-4xl' },
  { emoji: '🎭', x: '70%', y: '70%', delay: 2, size: 'text-5xl' },
  { emoji: '🎥', x: '15%', y: '75%', delay: 0.5, size: 'text-4xl' },
  { emoji: '⭐', x: '85%', y: '45%', delay: 1.5, size: 'text-3xl' },
  { emoji: '🌟', x: '5%', y: '50%', delay: 2.5, size: 'text-3xl' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 1) {
      setSearchResults(searchMovies(query).slice(0, 6));
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [query]);

  const handleMoodClick = (mood) => {
    setSelectedMood(mood === selectedMood ? null : mood);
    navigate(`/discover?mood=${mood}`);
  };

  return (
    <div>
      {/* Hero Section with 3D Tubes Background */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Interactive 3D Tubes Canvas */}
        <TubesBackground className="absolute inset-0 min-h-screen" />

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
            >
              <Sparkles size={14} className="text-cinema-accent" />
              <span className="text-xs text-cinema-muted">AI-Powered Movie Discovery</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              <span className="text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">What's your</span>
              <br />
              <span className="gradient-text drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">vibe tonight?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-cinema-muted text-lg md:text-xl mb-10 max-w-2xl mx-auto drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]"
            >
              Discover movies through emotion, mood, and intelligent personalization.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="relative max-w-2xl mx-auto mb-10"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cinema-accent via-cinema-purple to-cinema-pink rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative flex items-center glass-strong rounded-2xl px-5 py-4">
                  <Search size={20} className="text-cinema-muted mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search movies, directors, actors..."
                    className="flex-1 bg-transparent text-white text-lg placeholder:text-cinema-muted/60 focus:outline-none"
                  />
                  <button className="ml-3 w-10 h-10 rounded-xl bg-cinema-accent/10 flex items-center justify-center text-cinema-accent hover:bg-cinema-accent/20 transition">
                    <Mic size={18} />
                  </button>
                </div>
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 left-0 right-0 glass-strong rounded-2xl overflow-hidden z-50 border border-white/10"
                >
                  {searchResults.map(m => (
                    <div
                      key={m.id}
                      onClick={() => { navigate(`/movie/${m.id}`); setShowResults(false); setQuery(''); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition border-b border-white/5 last:border-0"
                    >
                      <div className="w-10 h-12 rounded-lg flex items-center justify-center text-xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[1]})` }}>
                        {m.poster_url ? <img src={m.poster_url} alt="" className="w-full h-full object-cover" /> : m.emoji}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{m.title}</p>
                        <p className="text-cinema-muted text-xs">{m.year} • {m.genre} • {m.director}</p>
                      </div>
                      <span className="ml-auto text-cinema-gold text-xs font-bold">⭐ {m.rating}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Mood Chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {moods.map(mood => (
                <MoodChip key={mood} mood={mood} selected={selectedMood === mood} onClick={handleMoodClick} />
              ))}
            </motion.div>

            {/* Surprise Me + Mood Detect buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3 mt-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRoulette(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white font-bold shadow-neon flex items-center gap-2 text-sm"
              >
                🎰 Surprise Me!
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/mood')}
                className="px-6 py-3 rounded-xl glass text-white font-bold border border-white/10 hover:border-cinema-accent/30 flex items-center gap-2 text-sm transition"
              >
                <Smile size={16} className="text-cinema-accent" /> Detect My Mood
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <ArrowDown size={20} className="text-cinema-muted/50" />
          </motion.div>
        </div>
      </section>

      {/* Trending Section */}
      <TrendingCarousel />

      {/* Animated Stats Section */}
      <section className="py-12 px-4">
        <CountUpStats stats={[
          { value: movies.length, suffix: '+', label: 'Movies in Database', icon: '🎬', gradient: ['#00d4ff', '#0284c7'] },
          { value: 16, label: 'Genre Categories', icon: '🎭', gradient: ['#a855f7', '#7c3aed'] },
          { value: 8, label: 'AI Mood Filters', icon: '🧠', gradient: ['#f472b6', '#ec4899'] },
          { value: 90, suffix: '+', label: 'Directors Featured', icon: '🎥', gradient: ['#fbbf24', '#f59e0b'] },
        ]} />
      </section>

      {/* Hidden Gems */}
      <HiddenGems />

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">Ready to explore?</h2>
          <p className="text-cinema-muted mb-8">Swipe through movies, explore the universe, or let AI guide you.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/swipe')}
              className="magnetic-btn px-8 py-4 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white font-bold shadow-neon">
              Start Swiping
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/discover')}
              className="magnetic-btn px-8 py-4 rounded-xl glass border border-cinema-accent/30 text-cinema-accent font-bold">
              Smart Discover
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Roulette Wheel Modal */}
      <RouletteWheel isOpen={showRoulette} onClose={() => setShowRoulette(false)} />
    </div>
  );
}
