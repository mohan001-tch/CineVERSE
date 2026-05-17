import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, X, Star, RotateCcw, Zap } from 'lucide-react';
import { movies } from '../data/movies';
import { useNavigate } from 'react-router-dom';

export default function SwipeDiscovery() {
  const [deck, setDeck] = useState([]);
  const [liked, setLiked] = useState([]);
  const [saved, setSaved] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setDeck([...movies].sort(() => Math.random() - 0.5));
  }, []);

  const currentCards = deck.slice(currentIndex, currentIndex + 3);

  const handleSwipe = (action) => {
    const movie = deck[currentIndex];
    if (!movie) return;
    if (action === 'like') setLiked(p => [...p, movie]);
    if (action === 'save') setSaved(p => [...p, movie]);
    setCurrentIndex(p => p + 1);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(p => p - 1);
      setLiked(p => p.filter(m => m.id !== deck[currentIndex - 1]?.id));
      setSaved(p => p.filter(m => m.id !== deck[currentIndex - 1]?.id));
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
            <Zap size={14} className="text-cinema-accent" />
            <span className="text-xs text-cinema-muted">Swipe to Discover</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-2">Movie Swipe</h1>
          <p className="text-cinema-muted">Swipe right to like, left to skip, up to save</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Card Stack */}
          <div className="relative w-80 h-[480px] mx-auto lg:mx-0">
            <AnimatePresence>
              {currentCards.map((movie, i) => (
                <SwipeCard
                  key={movie.id}
                  movie={movie}
                  index={i}
                  onSwipe={handleSwipe}
                  isTop={i === 0}
                  navigate={navigate}
                />
              ))}
            </AnimatePresence>

            {currentIndex >= deck.length && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center glass rounded-3xl">
                <span className="text-5xl mb-4">🎬</span>
                <p className="text-white font-bold text-lg">You've seen them all!</p>
                <p className="text-cinema-muted text-sm mb-4">You liked {liked.length} movies</p>
                <button onClick={() => { setCurrentIndex(0); setDeck([...movies].sort(() => Math.random() - 0.5)); }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white font-bold magnetic-btn">
                  Shuffle & Restart
                </button>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex lg:flex-col gap-4 justify-center mx-auto lg:mx-0 lg:mt-40">
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} onClick={() => handleSwipe('skip')}
              className="w-14 h-14 rounded-full glass border-2 border-cinema-red/40 flex items-center justify-center text-cinema-red hover:bg-cinema-red/10 transition">
              <X size={24} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} onClick={handleUndo}
              className="w-14 h-14 rounded-full glass border-2 border-cinema-muted/30 flex items-center justify-center text-cinema-muted hover:bg-white/5 transition">
              <RotateCcw size={20} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} onClick={() => handleSwipe('save')}
              className="w-14 h-14 rounded-full glass border-2 border-cinema-gold/40 flex items-center justify-center text-cinema-gold hover:bg-cinema-gold/10 transition">
              <Star size={24} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} onClick={() => handleSwipe('like')}
              className="w-14 h-14 rounded-full glass border-2 border-cinema-green/40 flex items-center justify-center text-cinema-green hover:bg-cinema-green/10 transition">
              <Heart size={24} />
            </motion.button>
          </div>

          {/* Liked Sidebar */}
          <div className="w-full lg:w-72">
            <button onClick={() => setShowPanel(!showPanel)} className="lg:hidden w-full glass rounded-xl px-4 py-3 text-white text-sm font-medium mb-4 flex items-center justify-between">
              <span>Liked ({liked.length}) • Saved ({saved.length})</span>
              <span>{showPanel ? '▲' : '▼'}</span>
            </button>
            <div className={`${showPanel ? 'block' : 'hidden'} lg:block space-y-4`}>
              {liked.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2"><Heart size={14} className="text-cinema-green" /> Liked ({liked.length})</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto hide-scrollbar">
                    {liked.slice(-8).reverse().map(m => (
                      <div key={m.id} onClick={() => navigate(`/movie/${m.id}`)} className="glass rounded-xl p-2 flex items-center gap-2 cursor-pointer hover:bg-white/5 transition">
                        <div className="w-8 h-10 rounded-lg flex items-center justify-center text-sm" style={{ background: `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[1]})` }}>{m.emoji}</div>
                        <div className="min-w-0"><p className="text-white text-xs font-medium truncate">{m.title}</p><p className="text-cinema-muted text-[10px]">{m.year}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {saved.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2"><Star size={14} className="text-cinema-gold" /> Saved ({saved.length})</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto hide-scrollbar">
                    {saved.slice(-8).reverse().map(m => (
                      <div key={m.id} onClick={() => navigate(`/movie/${m.id}`)} className="glass rounded-xl p-2 flex items-center gap-2 cursor-pointer hover:bg-white/5 transition">
                        <div className="w-8 h-10 rounded-lg flex items-center justify-center text-sm" style={{ background: `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[1]})` }}>{m.emoji}</div>
                        <div className="min-w-0"><p className="text-white text-xs font-medium truncate">{m.title}</p><p className="text-cinema-muted text-[10px]">{m.year}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="max-w-md mx-auto mt-8">
          <div className="flex justify-between text-cinema-muted text-xs mb-1">
            <span>{currentIndex} / {deck.length}</span>
            <span>{Math.round((currentIndex / deck.length) * 100)}%</span>
          </div>
          <div className="h-1 bg-cinema-surface rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-cinema-accent to-cinema-purple rounded-full" animate={{ width: `${(currentIndex / deck.length) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SwipeCard({ movie, index, onSwipe, isTop, navigate }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const skipOpacity = useTransform(x, [-100, 0], [1, 0]);
  const saveOpacity = useTransform(y, [-100, 0], [1, 0]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 100) onSwipe('like');
    else if (info.offset.x < -100) onSwipe('skip');
    else if (info.offset.y < -100) onSwipe('save');
  };

  return (
    <motion.div
      style={{ x: isTop ? x : 0, y: isTop ? y : 0, rotate: isTop ? rotate : 0, zIndex: 3 - index }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: 1 - index * 0.05, y: index * 12, opacity: 1 - index * 0.15 }}
      animate={{ scale: 1 - index * 0.05, y: index * 12, opacity: 1 - index * 0.15 }}
      exit={{ x: 300, opacity: 0, transition: { duration: 0.3 } }}
      className="absolute inset-0 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
      onDoubleClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${movie.gradient[0]}, ${movie.gradient[1]}, ${movie.gradient[0]}88)` }} />
      {movie.poster_url && (
        <img src={movie.poster_url} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />
      )}
      {!movie.poster_url && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-30">{movie.emoji}</div>
      )}

      {/* Swipe Indicators */}
      {isTop && (
        <>
          <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 px-4 py-2 rounded-xl border-2 border-cinema-green bg-cinema-green/20 text-cinema-green font-bold text-lg -rotate-12">LIKE ❤️</motion.div>
          <motion.div style={{ opacity: skipOpacity }} className="absolute top-8 right-8 px-4 py-2 rounded-xl border-2 border-cinema-red bg-cinema-red/20 text-cinema-red font-bold text-lg rotate-12">SKIP ✕</motion.div>
          <motion.div style={{ opacity: saveOpacity }} className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl border-2 border-cinema-gold bg-cinema-gold/20 text-cinema-gold font-bold text-lg">SAVE ⭐</motion.div>
        </>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <span className="glass px-2 py-1 rounded-lg text-[10px] font-bold text-cinema-accent">{movie.genre}</span>
        <h2 className="font-display text-2xl font-bold text-white mt-2 leading-tight">{movie.title}</h2>
        <div className="flex items-center gap-3 mt-2 text-gray-300 text-sm">
          <span>{movie.year}</span><span>•</span><span>{movie.runtime}m</span><span>•</span><span>⭐ {movie.rating}</span>
        </div>
        <p className="text-gray-400 text-xs mt-2">{movie.director} • {movie.cast.slice(0, 2).join(', ')}</p>
      </div>
    </motion.div>
  );
}
