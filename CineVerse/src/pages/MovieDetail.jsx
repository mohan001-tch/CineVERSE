import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Film, User, Heart, Bookmark, Share2, Play, Sparkles } from 'lucide-react';
import { getMovieById, getSimilarMovies } from '../data/movies';
import MovieCard from '../components/Movies/MovieCard';
import TrailerModal from '../components/Movies/TrailerModal';
import SpeakButton from '../components/UI/SpeakButton';
import { useState } from 'react';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = getMovieById(id);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  if (!movie) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🎬</span>
          <p className="text-white text-xl font-bold mb-2">Movie not found</p>
          <button onClick={() => navigate('/')} className="text-cinema-accent hover:underline">Go home</button>
        </div>
      </div>
    );
  }

  const similar = getSimilarMovies(movie, 6);
  const aiReason = `You might enjoy "${movie.title}" because it masterfully blends ${movie.genre.toLowerCase()} elements with ${movie.director}'s signature storytelling style. At ${movie.runtime} minutes, it's a ${movie.runtimeCategory.toLowerCase()} watch from ${movie.year} that ${movie.moods.length > 0 ? `perfectly captures a ${movie.moods[0].toLowerCase()} mood` : 'delivers a captivating experience'}.`;

  return (
    <div className="min-h-screen">
      {/* Hero Backdrop */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${movie.gradient[0]}, ${movie.gradient[1]}, #0a0a0f)` }} />
        {movie.backdrop_url ? (
          <img src={movie.backdrop_url} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : movie.poster_url ? (
          <img src={movie.poster_url} alt={movie.title} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm" />
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] opacity-10">{movie.emoji}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-cinema-dark/50 via-cinema-dark/30 to-cinema-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-dark/80 via-transparent to-transparent" />

        {/* Back Button */}
        <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)} className="absolute top-20 left-4 md:left-8 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition">
          <ArrowLeft size={18} />
        </motion.button>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mb-3">
              <span className="glass px-3 py-1 rounded-full text-xs font-bold text-cinema-accent">{movie.genre}</span>
              <span className="glass px-3 py-1 rounded-full text-xs font-medium text-cinema-muted">{movie.industry}</span>
              <span className="glass px-3 py-1 rounded-full text-xs font-medium text-cinema-gold flex items-center gap-1">
                <Star size={10} className="fill-cinema-gold" /> {movie.rating}
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">{movie.title}</motion.h1>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 text-gray-300 text-sm mb-6">
              <span className="flex items-center gap-1"><Film size={14} /> {movie.year}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {movie.runtime} min</span>
              <span className="flex items-center gap-1"><User size={14} /> {movie.director}</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-3">
              <button onClick={() => setShowTrailer(true)} className="magnetic-btn px-6 py-3 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white font-bold shadow-neon flex items-center gap-2">
                <Play size={16} className="fill-white" /> Watch Trailer
              </button>
              <button onClick={() => setLiked(!liked)}
                className={`magnetic-btn px-5 py-3 rounded-xl font-bold flex items-center gap-2 ${liked ? 'bg-cinema-red text-white' : 'glass text-white border border-white/10'}`}>
                <Heart size={16} className={liked ? 'fill-white' : ''} /> {liked ? 'Liked' : 'Like'}
              </button>
              <button onClick={() => setSaved(!saved)}
                className={`magnetic-btn px-5 py-3 rounded-xl font-bold flex items-center gap-2 ${saved ? 'bg-cinema-gold text-black' : 'glass text-white border border-white/10'}`}>
                <Bookmark size={16} className={saved ? 'fill-black' : ''} /> {saved ? 'Saved' : 'Save'}
              </button>
              <SpeakButton movie={movie} size="lg" />
              <button className="magnetic-btn w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center text-white">
                <Share2 size={16} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Insight */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass rounded-2xl p-6 border border-cinema-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-cinema-accent" />
                <h3 className="font-display font-bold text-white">AI Insight</h3>
              </div>
              <p className="text-cinema-muted text-sm leading-relaxed">{aiReason}</p>
            </motion.div>

            {/* Cast */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="font-display text-xl font-bold text-white mb-4">Cast</h3>
              <div className="flex flex-wrap gap-3">
                {movie.cast.map((actor, i) => (
                  <div key={i} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cinema-purple/50 to-cinema-accent/50 flex items-center justify-center text-white font-bold text-sm">
                      {actor.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className="text-white text-sm">{actor}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Mood Tags */}
            {movie.moods.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h3 className="font-display text-xl font-bold text-white mb-4">Mood Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.moods.map(mood => (
                    <span key={mood} className="glass px-4 py-2 rounded-full text-sm text-cinema-accent border border-cinema-accent/20">{mood}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display font-bold text-white mb-4">Details</h3>
              <div className="space-y-3">
                {[
                  ['Director', movie.director], ['Year', movie.year],
                  ['Runtime', `${movie.runtime} minutes`], ['Genre', movie.genre],
                  ['Industry', movie.industry], ['Decade', movie.decade],
                  ['Pacing', movie.runtimeCategory],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-cinema-muted text-sm">{label}</span>
                    <span className="text-white text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-1">{movie.rating}</div>
                <div className="flex justify-center gap-1 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={16} className={s <= Math.round(movie.rating / 2) ? 'text-cinema-gold fill-cinema-gold' : 'text-cinema-muted'} />
                  ))}
                </div>
                <p className="text-cinema-muted text-xs">CineVerse Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Movies */}
        {similar.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
            <h3 className="font-display text-2xl font-bold text-white mb-6">Similar Movies</h3>
            <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-4">
              {similar.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
            </div>
          </motion.div>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <TrailerModal
          movieId={movie.id}
          movieTitle={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
}
