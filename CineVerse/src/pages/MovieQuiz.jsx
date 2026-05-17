/**
 * MovieQuiz.jsx — Guess the Movie from its blurred backdrop image
 * Features: 15s timer, progressive unblur, scoring tiers, streak counter, leaderboard.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Trophy, Flame, Zap, Award, Play } from 'lucide-react';
import useQuiz from '../hooks/useQuiz';

function getBadge(score) {
  if (score >= 400) return { label: '🏆 Movie Genius!', color: 'text-cinema-gold' };
  if (score >= 200) return { label: '🎬 Good Try!', color: 'text-cinema-accent' };
  return { label: '📺 Keep Watching!', color: 'text-cinema-muted' };
}

export default function MovieQuiz() {
  const q = useQuiz();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            🎬 Movie <span className="gradient-text">Quiz</span>
          </h1>
          <p className="text-cinema-muted text-base">Guess the movie from its image — the faster, the more points!</p>
          {q.streak > 0 && (
            <div className="mt-2 flex items-center justify-center gap-1 text-cinema-accent text-sm">
              <Flame size={16} /> {q.streak} day streak!
            </div>
          )}
        </motion.div>

        {/* Idle state */}
        {q.gameState === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="glass rounded-2xl p-8 border border-white/10 max-w-md mx-auto">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-white font-display text-xl font-bold mb-2">Ready to Play?</h2>
              <p className="text-cinema-muted text-sm mb-6">5 movies, 15 seconds each. Image unblurs over time as a hint!</p>
              <div className="grid grid-cols-3 gap-3 mb-6 text-xs">
                <div className="glass rounded-xl p-3 text-center"><Zap size={16} className="mx-auto mb-1 text-cinema-gold" /><span className="text-cinema-gold font-bold">100pts</span><br/><span className="text-cinema-muted">0-5 sec</span></div>
                <div className="glass rounded-xl p-3 text-center"><Timer size={16} className="mx-auto mb-1 text-cinema-accent" /><span className="text-cinema-accent font-bold">50pts</span><br/><span className="text-cinema-muted">5-10 sec</span></div>
                <div className="glass rounded-xl p-3 text-center"><Award size={16} className="mx-auto mb-1 text-cinema-muted" /><span className="text-white font-bold">25pts</span><br/><span className="text-cinema-muted">10-15 sec</span></div>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={q.startGame}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white font-bold text-lg shadow-neon flex items-center justify-center gap-2"
              >
                <Play size={20} /> Start Quiz
              </motion.button>
            </div>

            {/* Leaderboard */}
            {q.leaderboard.length > 0 && (
              <div className="glass rounded-2xl p-5 border border-white/10 mt-6 max-w-md mx-auto">
                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><Trophy size={16} className="text-cinema-gold" /> Leaderboard</h3>
                {q.leaderboard.map((e, i) => (
                  <div key={i} className="flex justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-cinema-muted">#{i + 1} — {e.date}</span>
                    <span className="text-white font-bold">{e.score} pts</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Playing state */}
        {q.gameState === 'playing' && q.questions[q.currentQ] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={q.currentQ}>
            {/* Progress + Timer */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-cinema-muted text-sm">Q{q.currentQ + 1}/5</span>
              <span className="text-white font-bold">{q.score} pts</span>
              <div className={`flex items-center gap-1 font-bold text-sm ${q.timer <= 5 ? 'text-cinema-red animate-pulse' : 'text-cinema-accent'}`}>
                <Timer size={16} /> {q.timer}s
              </div>
            </div>
            <div className="w-full h-1 bg-cinema-surface rounded-full mb-6">
              <div className="h-1 bg-cinema-accent rounded-full transition-all" style={{ width: `${((q.timer) / 15) * 100}%` }} />
            </div>

            {/* Blurred backdrop */}
            <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative border border-white/10">
              <img
                src={q.questions[q.currentQ].backdrop}
                alt="Guess this movie"
                className="w-full h-full object-cover transition-all duration-1000"
                style={{ filter: `blur(${q.blurLevel}px)` }}
              />
              {q.answered && (
                <div className={`absolute inset-0 flex items-center justify-center text-6xl ${q.answered === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {q.answered === 'correct' ? '✅' : '❌'}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {q.questions[q.currentQ].options.map((opt) => {
                let cls = 'glass border border-white/10 hover:border-cinema-accent/30';
                if (q.answered) {
                  if (opt === q.questions[q.currentQ].correctTitle) cls = 'bg-green-500/20 border border-green-500/50';
                  else if (q.answered === 'wrong' && opt !== q.questions[q.currentQ].correctTitle) cls = 'bg-cinema-surface/50 border border-white/5 opacity-50';
                }
                return (
                  <motion.button key={opt} whileHover={!q.answered ? { scale: 1.02 } : {}} whileTap={!q.answered ? { scale: 0.98 } : {}}
                    onClick={() => q.answer(opt)} disabled={!!q.answered}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all ${cls}`}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            {q.answered && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={q.nextQuestion}
                className="w-full py-3 rounded-xl bg-cinema-accent text-white font-bold text-sm"
              >
                {q.currentQ < 4 ? 'Next Question →' : 'See Results'}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Finished state */}
        {q.gameState === 'finished' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="glass rounded-2xl p-8 border border-white/10 max-w-md mx-auto">
              <div className="text-5xl mb-3">{getBadge(q.score).label.split(' ')[0]}</div>
              <h2 className={`font-display text-2xl font-bold mb-1 ${getBadge(q.score).color}`}>
                {getBadge(q.score).label.split(' ').slice(1).join(' ')}
              </h2>
              <p className="font-display text-5xl font-bold text-white my-4">{q.score}</p>
              <p className="text-cinema-muted text-sm">points</p>
              <div className="grid grid-cols-3 gap-3 mt-6 text-xs">
                <div className="glass rounded-xl p-3"><span className="text-white font-bold text-lg">{q.correctCount}/5</span><br/><span className="text-cinema-muted">Correct</span></div>
                <div className="glass rounded-xl p-3"><span className="text-white font-bold text-lg">{q.totalTime}s</span><br/><span className="text-cinema-muted">Total Time</span></div>
                <div className="glass rounded-xl p-3"><span className="text-cinema-accent font-bold text-lg">{q.streak}🔥</span><br/><span className="text-cinema-muted">Streak</span></div>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={q.startGame}
                className="w-full py-3 mt-6 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white font-bold shadow-neon"
              >
                Play Again 🎬
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
