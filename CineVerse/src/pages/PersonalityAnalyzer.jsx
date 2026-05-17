/**
 * PersonalityAnalyzer.jsx — Movie Personality page
 * User inputs 5 favourite movies → AI returns personality type, genre chart, traits, directors.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, X, Share2, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import usePersonality from '../hooks/usePersonality';

const COLORS = ['#e50914', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4'];

export default function PersonalityAnalyzer() {
  const { profile, loading, analyze } = usePersonality();
  const [movies, setMovies] = useState(['', '', '', '', '']);

  const updateMovie = (i, val) => {
    const copy = [...movies];
    copy[i] = val;
    setMovies(copy);
  };

  const filledCount = movies.filter(m => m.trim()).length;

  const handleShare = () => {
    if (!profile) return;
    const text = `🎬 My Movie Personality: ${profile.type}\n${profile.badge}\n${profile.summary}\n\nDiscover yours at CineVerse!`;
    navigator.clipboard.writeText(text);
    alert('Personality copied to clipboard!');
  };

  const chartData = profile ? Object.entries(profile.genres || {}).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            <Brain className="inline mr-2 text-cinema-accent" size={36} />
            My Movie <span className="gradient-text">Personality</span>
          </h1>
          <p className="text-cinema-muted">Enter your top 5 movies and discover your cinema soul</p>
        </motion.div>

        {/* Input */}
        <div className="max-w-xl mx-auto glass rounded-2xl p-6 border border-white/10 mb-8 space-y-3">
          {movies.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-cinema-accent text-xs font-bold w-5">{i + 1}.</span>
              <input value={m} onChange={e => updateMovie(i, e.target.value)}
                placeholder={`Movie ${i + 1}...`}
                className="flex-1 bg-cinema-surface/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-cinema-muted focus:outline-none focus:border-cinema-accent/50" />
              {m && <button onClick={() => updateMovie(i, '')} className="text-cinema-muted hover:text-white"><X size={14} /></button>}
            </div>
          ))}
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => analyze(movies.filter(m => m.trim()))}
            disabled={loading || filledCount < 3}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white font-bold shadow-neon disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</> : <><Brain size={18} /> Analyze Me</>}
          </motion.button>
          <p className="text-cinema-muted text-[10px] text-center">Minimum 3 movies required ({filledCount}/5 filled)</p>
        </div>

        {/* Results */}
        {profile && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Personality type */}
            <div className="glass rounded-2xl p-8 border border-cinema-accent/20 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cinema-accent to-cinema-purple" />
              <p className="text-4xl mb-2">{profile.badge?.split(' ')[0]}</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">{profile.type}</h2>
              <p className="text-cinema-accent text-sm font-bold">{profile.badge}</p>
              <p className="text-cinema-text text-sm mt-3 max-w-md mx-auto">{profile.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="glass rounded-2xl p-5 border border-white/10">
                <h3 className="text-white font-bold text-sm mb-3">Genre Breakdown</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                      {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Traits + Directors */}
              <div className="space-y-4">
                <div className="glass rounded-2xl p-5 border border-white/10">
                  <h3 className="text-white font-bold text-sm mb-3">Personality Traits</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.traits?.map((t, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-cinema-accent/10 text-cinema-accent text-xs font-medium border border-cinema-accent/20">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="glass rounded-2xl p-5 border border-white/10">
                  <h3 className="text-white font-bold text-sm mb-3">Directors to Explore</h3>
                  <div className="space-y-2">
                    {profile.directors?.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-cinema-text text-sm">
                        <span className="text-cinema-gold">🎬</span> {d}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button onClick={handleShare}
              className="w-full py-3 rounded-xl glass border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 hover:border-cinema-accent/30 transition"
            >
              <Share2 size={16} /> Share My Personality
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
