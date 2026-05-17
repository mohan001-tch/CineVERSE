/**
 * BoxOfficePredictor.jsx — Predict box office performance using AI
 * Form inputs → AI prediction → Big collection display + verdict badge + bar chart + reason cards.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, IndianRupee, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import usePredictor from '../hooks/usePredictor';

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Biopic'];
const SEASONS = ['Summer', 'Winter', 'Festival', 'Normal'];
const VERDICT_COLORS = { BLOCKBUSTER: '#e50914', HIT: '#10b981', AVERAGE: '#f59e0b', FLOP: '#6b7280' };

export default function BoxOfficePredictor() {
  const { result, loading, predict } = usePredictor();
  const [form, setForm] = useState({ title: '', genre: 'Action', actorPop: 7, directorRep: 7, budget: 100, season: 'Summer' });

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    predict(form);
  };

  const chartData = result ? [
    { name: 'Budget', value: form.budget, fill: '#6366f1' },
    { name: 'Predicted', value: result.collection, fill: VERDICT_COLORS[result.verdict] || '#e50914' },
  ] : [];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            <TrendingUp className="inline mr-2 text-cinema-accent" size={36} />
            Box Office <span className="gradient-text">Predictor</span>
          </h1>
          <p className="text-cinema-muted">AI-powered box office prediction</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6 border border-white/10 space-y-4">
            <div>
              <label className="text-cinema-muted text-xs mb-1 block">Movie Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter movie title"
                className="w-full bg-cinema-surface/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-cinema-muted focus:outline-none focus:border-cinema-accent/50" />
            </div>
            <div>
              <label className="text-cinema-muted text-xs mb-1 block">Genre</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(g => (
                  <button key={g} onClick={() => setForm({ ...form, genre: g })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${form.genre === g ? 'bg-cinema-accent text-white' : 'glass text-cinema-muted border border-white/5'}`}
                  >{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-cinema-muted text-xs mb-1 block">Lead Actor Popularity: {form.actorPop}/10</label>
              <input type="range" min={1} max={10} value={form.actorPop} onChange={e => setForm({ ...form, actorPop: +e.target.value })}
                className="w-full accent-cinema-accent" />
            </div>
            <div>
              <label className="text-cinema-muted text-xs mb-1 block">Director Reputation: {form.directorRep}/10</label>
              <input type="range" min={1} max={10} value={form.directorRep} onChange={e => setForm({ ...form, directorRep: +e.target.value })}
                className="w-full accent-cinema-purple" />
            </div>
            <div>
              <label className="text-cinema-muted text-xs mb-1 block">Budget (₹ Crores)</label>
              <input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: +e.target.value })} min={1}
                className="w-full bg-cinema-surface/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cinema-accent/50" />
            </div>
            <div>
              <label className="text-cinema-muted text-xs mb-1 block">Release Season</label>
              <div className="flex gap-2">
                {SEASONS.map(s => (
                  <button key={s} onClick={() => setForm({ ...form, season: s })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex-1 ${form.season === s ? 'bg-cinema-purple text-white' : 'glass text-cinema-muted border border-white/5'}`}
                  >{s}</button>
                ))}
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={loading || !form.title.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white font-bold shadow-neon disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Predicting...</> : <><Zap size={18} /> Predict</>}
            </motion.button>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {result ? (
              <div className="space-y-4">
                {/* Big number */}
                <div className="glass rounded-2xl p-6 border border-white/10 text-center">
                  <p className="text-cinema-muted text-xs mb-1">Predicted Collection</p>
                  <div className="flex items-center justify-center gap-1">
                    <IndianRupee size={28} className="text-cinema-gold" />
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="font-display text-5xl font-bold text-white">
                      {result.collection}
                    </motion.span>
                    <span className="text-cinema-muted text-lg mt-2">Cr</span>
                  </div>
                  <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="inline-block mt-3 px-4 py-1.5 rounded-full font-bold text-sm text-white"
                    style={{ backgroundColor: VERDICT_COLORS[result.verdict] }}
                  >
                    {result.verdict === 'BLOCKBUSTER' ? '🏆' : result.verdict === 'HIT' ? '✅' : result.verdict === 'AVERAGE' ? '⚖️' : '📉'} {result.verdict}
                  </motion.span>
                  <p className="text-cinema-muted text-xs mt-2">Confidence: {result.confidence}%</p>
                </div>

                {/* Bar chart */}
                <div className="glass rounded-2xl p-4 border border-white/10">
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={chartData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} width={70} />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={30}>
                        {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Reasons */}
                <div className="space-y-2">
                  {result.reasons?.map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.15 }}
                      className="glass rounded-xl p-3 border border-white/5 text-xs text-cinema-text flex gap-2"
                    >
                      <span className="text-cinema-accent font-bold">{i + 1}.</span> {r}
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-10 border border-white/10 text-center h-full flex flex-col items-center justify-center">
                <div className="text-5xl mb-4">📊</div>
                <p className="text-cinema-muted text-sm">Fill in the form to predict box office performance</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
