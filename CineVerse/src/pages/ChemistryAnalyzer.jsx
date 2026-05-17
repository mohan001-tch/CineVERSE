/**
 * ChemistryAnalyzer.jsx — Cast Chemistry Check Page
 * Two actor inputs → find shared movies → chemistry score + AI description.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Search, User, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useChemistry from '../hooks/useChemistry';

export default function ChemistryAnalyzer() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const chem = useChemistry();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            <Heart className="inline mr-2 text-cinema-accent" size={36} />
            Chemistry <span className="gradient-text">Check</span>
          </h1>
          <p className="text-cinema-muted">Find out how many movies two actors share</p>
        </motion.div>

        {/* Input */}
        <div className="max-w-2xl mx-auto glass rounded-2xl p-6 border border-white/10 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="text-cinema-muted text-xs mb-1 block">Actor 1</label>
              <input value={name1} onChange={e => setName1(e.target.value)} placeholder="e.g. Leonardo DiCaprio"
                onKeyDown={e => e.key === 'Enter' && chem.analyze(name1, name2)}
                className="w-full bg-cinema-surface/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-cinema-muted focus:outline-none focus:border-cinema-accent/50" />
            </div>
            <div className="text-center text-cinema-accent text-2xl font-bold hidden sm:block">×</div>
            <div className="sm:col-span-2">
              <label className="text-cinema-muted text-xs mb-1 block">Actor 2</label>
              <input value={name2} onChange={e => setName2(e.target.value)} placeholder="e.g. Brad Pitt"
                onKeyDown={e => e.key === 'Enter' && chem.analyze(name1, name2)}
                className="w-full bg-cinema-surface/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-cinema-muted focus:outline-none focus:border-cinema-accent/50" />
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => chem.analyze(name1, name2)} disabled={chem.loading || !name1.trim() || !name2.trim()}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white font-bold shadow-neon disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {chem.loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</> : <><Search size={18} /> Check Chemistry</>}
          </motion.button>
        </div>

        {chem.error && <p className="text-center text-cinema-red text-sm mb-6">{chem.error}</p>}

        {/* Results */}
        {chem.actor1 && chem.actor2 && !chem.loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Actor cards + score */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              {[chem.actor1, chem.actor2].map((actor, i) => (
                <div key={i} className="glass rounded-2xl p-4 border border-white/10 text-center w-40">
                  <div className="w-20 h-20 rounded-full mx-auto mb-2 overflow-hidden bg-cinema-surface">
                    {actor.photo ? <img src={actor.photo} alt="" className="w-full h-full object-cover" /> :
                      <div className="w-full h-full flex items-center justify-center"><User size={30} className="text-cinema-muted/30" /></div>}
                  </div>
                  <p className="text-white font-bold text-sm truncate">{actor.name}</p>
                </div>
              ))}
            </div>

            {/* Score */}
            <div className="text-center mb-6">
              <div className="relative w-32 h-32 mx-auto mb-3">
                <svg width="128" height="128" className="-rotate-90">
                  <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <motion.circle cx="64" cy="64" r="54" fill="none" stroke="#e50914" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 54}
                    initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - chem.chemistryScore / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-display text-3xl font-bold">{chem.chemistryScore}</span>
                </div>
              </div>
              <p className="text-2xl font-bold">{chem.label}</p>
              <p className="text-cinema-muted text-sm mt-1">{chem.sharedMovies.length} movies together</p>
              {chem.description && <p className="text-cinema-text text-sm mt-3 max-w-md mx-auto italic">{chem.description}</p>}
            </div>

            {/* Shared movies grid */}
            {chem.sharedMovies.length > 0 && (
              <div>
                <h3 className="text-white font-bold mb-4">Movies Together</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {chem.sharedMovies.map((m, i) => (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      onClick={() => navigate(`/movie/${m.id}`)}
                      className="cursor-pointer group rounded-xl overflow-hidden bg-cinema-card border border-white/5 hover:border-cinema-accent/20 transition-all"
                    >
                      <div className="aspect-[2/3] bg-cinema-surface relative">
                        {m.poster ? <img src={m.poster} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" /> :
                          <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>}
                        {m.rating && m.rating !== '0.0' && (
                          <div className="absolute top-2 right-2 glass px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <Star size={8} className="text-cinema-gold fill-cinema-gold" /><span className="text-[9px] font-bold text-cinema-gold">{m.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-2"><p className="text-white text-xs font-semibold truncate">{m.title}</p><p className="text-cinema-muted text-[10px]">{m.year}</p></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
