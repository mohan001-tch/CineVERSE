import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Bookmark, Play, Star, Film, Dna, Swords } from 'lucide-react';
import { useState } from 'react';
import SpeakButton from '../UI/SpeakButton';
import TrailerModal from './TrailerModal';
import MovieDNA from '../Features/MovieDNA';
import DebateBot from '../Features/DebateBot';

export default function MovieCard({ movie, index = 0, size = 'normal' }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showDNA, setShowDNA] = useState(false);
  const [showDebate, setShowDebate] = useState(false);

  const sizes = {
    small: 'w-40 h-56',
    normal: 'w-48 h-72',
    large: 'w-56 h-80',
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.5 }}
        className={`flex-shrink-0 ${sizes[size]} relative group cursor-pointer rounded-2xl overflow-hidden`}
        onClick={() => navigate(`/movie/${movie.id}`)}
      >
        {/* Gradient Fallback */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${movie.gradient[0]}, ${movie.gradient[1]}, ${movie.gradient[0]}88)`,
          }}
        />

        {/* Real TMDB Poster Image */}
        {movie.poster_url && (
          <img
            src={movie.poster_url}
            alt={movie.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Emoji fallback if no poster */}
        {!movie.poster_url && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-125 transform">
            {movie.emoji}
          </div>
        )}

        {/* Top Info */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <span className="glass px-2 py-1 rounded-lg text-[10px] font-bold text-cinema-accent">
            {movie.genre}
          </span>
          <div className="flex items-center gap-1 glass px-2 py-1 rounded-lg">
            <Star size={10} className="text-cinema-gold fill-cinema-gold" />
            <span className="text-[10px] font-bold text-cinema-gold">{movie.rating}</span>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <h3 className="font-display font-bold text-white text-sm leading-tight line-clamp-2 mb-1">{movie.title}</h3>
          <div className="flex items-center gap-2 text-[10px] text-gray-300">
            <span>{movie.year}</span>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <span>{movie.runtime}m</span>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <span>{movie.industry}</span>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          {/* Watch Trailer Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-cinema-accent/90 flex items-center justify-center shadow-neon"
            onClick={(e) => { e.stopPropagation(); setShowTrailer(true); }}
          >
            <Play size={20} className="text-white fill-white ml-0.5" />
          </motion.button>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${liked ? 'bg-cinema-red text-white' : 'glass text-white'}`}
            >
              <Heart size={13} className={liked ? 'fill-white' : ''} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${saved ? 'bg-cinema-gold text-black' : 'glass text-white'}`}
            >
              <Bookmark size={13} className={saved ? 'fill-black' : ''} />
            </motion.button>
            {/* 🔊 Speak Button */}
            <SpeakButton movie={movie} size="sm" />
          </div>
          {/* DNA + Debate buttons */}
          <div className="flex gap-2 mt-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setShowDNA(true); }}
              className="px-2.5 py-1 rounded-lg bg-cinema-accent/80 text-white text-[9px] font-bold flex items-center gap-1"
            >
              <Dna size={10} /> DNA
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setShowDebate(true); }}
              className="px-2.5 py-1 rounded-lg bg-cinema-purple/80 text-white text-[9px] font-bold flex items-center gap-1"
            >
              <Swords size={10} /> Debate
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Trailer Modal */}
      {showTrailer && (
        <TrailerModal
          movieId={movie.id}
          movieTitle={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}

      {/* Movie DNA Modal */}
      <MovieDNA movie={movie} isOpen={showDNA} onClose={() => setShowDNA(false)} />

      {/* Debate Bot Modal */}
      <DebateBot movie={movie} isOpen={showDebate} onClose={() => setShowDebate(false)} />
    </>
  );
}
