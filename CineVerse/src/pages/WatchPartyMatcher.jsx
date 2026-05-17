/**
 * WatchPartyMatcher.jsx — Watch Party Page
 * Side-by-side preference forms for 2 users → AI movie match.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Popcorn, Sparkles } from 'lucide-react';
import useWatchParty from '../hooks/useWatchParty';

const ALL_GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Animation'];
const MOODS = ['Happy', 'Chill', 'Excited', 'Romantic', 'Thoughtful'];

function UserForm({ label, color, user, setUser }) {
  const toggleGenre = (g, key) => {
    const list = user[key].includes(g) ? user[key].filter(x => x !== g) : [...user[key], g];
    setUser({ ...user, [key]: list });
  };
  return (
    <div className="glass rounded-2xl p-5 border border-white/10 flex-1">
      <h3 className={`font-bold text-sm mb-4 ${color}`}>{label}</h3>
      <div className="space-y-4">
        <div>
          <p className="text-cinema-muted text-xs mb-2">Favourite Genres</p>
          <div className="flex flex-wrap gap-1.5">
            {ALL_GENRES.map(g => (
              <button key={g} onClick={() => toggleGenre(g, 'fav')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${user.fav.includes(g) ? 'bg-cinema-accent text-white' : 'glass text-cinema-muted border border-white/5'}`}
              >{g}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-cinema-muted text-xs mb-2">Avoid Genres</p>
          <div className="flex flex-wrap gap-1.5">
            {ALL_GENRES.map(g => (
              <button key={g} onClick={() => toggleGenre(g, 'avoid')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${user.avoid.includes(g) ? 'bg-cinema-red/80 text-white' : 'glass text-cinema-muted border border-white/5'}`}
              >{g}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-cinema-muted text-xs mb-2">Mood Tonight</p>
          <div className="flex flex-wrap gap-1.5">
            {MOODS.map(m => (
              <button key={m} onClick={() => setUser({ ...user, mood: m })}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${user.mood === m ? 'bg-cinema-purple text-white' : 'glass text-cinema-muted border border-white/5'}`}
              >{m}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WatchPartyMatcher() {
  const { result, loading, findMatch } = useWatchParty();
  const [u1, setU1] = useState({ fav: [], avoid: [], mood: 'Happy' });
  const [u2, setU2] = useState({ fav: [], avoid: [], mood: 'Chill' });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            <Popcorn className="inline mr-2 text-cinema-accent" size={36} />
            Watch <span className="gradient-text">Party</span>
          </h1>
          <p className="text-cinema-muted">Find the perfect movie for both of you</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <UserForm label="👤 User 1" color="text-cinema-accent" user={u1} setUser={setU1} />
          <UserForm label="👤 User 2" color="text-cinema-purple" user={u2} setUser={setU2} />
        </div>

        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => findMatch(u1, u2)} disabled={loading || u1.fav.length === 0 || u2.fav.length === 0}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white font-bold text-lg shadow-neon disabled:opacity-40 flex items-center justify-center gap-2 mb-8"
        >
          {loading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Finding...</> : <><Users size={20} /> Find Our Movie</>}
        </motion.button>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              {/* Main pick */}
              <div className="glass rounded-2xl p-8 border border-cinema-accent/20 text-center mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cinema-accent to-cinema-purple" />
                <Sparkles size={24} className="mx-auto text-cinema-gold mb-2" />
                <p className="text-cinema-gold text-xs font-bold uppercase tracking-widest mb-2">Tonight's Movie</p>
                <h2 className="font-display text-3xl font-bold text-white mb-1">{result.mainPick?.title}</h2>
                <p className="text-cinema-muted text-sm">{result.mainPick?.year}</p>
                <p className="text-cinema-text text-sm mt-3 max-w-md mx-auto">{result.mainPick?.reason}</p>
              </div>

              {/* Backups */}
              {result.backups?.length > 0 && (
                <div>
                  <h3 className="text-white font-bold text-sm mb-3">Backup Options</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {result.backups.map((b, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                        className="glass rounded-xl p-4 border border-white/5"
                      >
                        <p className="text-white font-bold text-sm">{b.title}</p>
                        <p className="text-cinema-muted text-[10px]">{b.year}</p>
                        <p className="text-cinema-text text-xs mt-1">{b.reason}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
