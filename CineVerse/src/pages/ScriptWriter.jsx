/**
 * ScriptWriter.jsx — AI Script Generator Page
 * User selects genre, mood, setting, character → AI generates a movie script.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pen, Download, RotateCcw, Clapperboard } from 'lucide-react';
import useScriptWriter from '../hooks/useScriptWriter';

const GENRES = ['Horror', 'Comedy', 'Romance', 'Thriller', 'Sci-Fi', 'Action'];
const MOODS = ['Dark', 'Funny', 'Emotional', 'Suspenseful', 'Inspirational'];

export default function ScriptWriter() {
  const { script, loading, generate } = useScriptWriter();
  const [genre, setGenre] = useState('Thriller');
  const [mood, setMood] = useState('Suspenseful');
  const [setting, setSetting] = useState('');
  const [character, setCharacter] = useState('');

  const handleGenerate = () => {
    if (!setting.trim() || !character.trim()) return;
    generate({ genre, mood, setting, character });
  };

  const handleDownload = () => {
    if (!script) return;
    const text = `TITLE: ${script.title}\n\n${script.logline}\n\nCHARACTERS:\n${script.characters?.join('\n')}\n\nSCENE 1:\n${script.scene}\n\n${script.dialogues?.map(d => `${d.character.toUpperCase()}\n  ${d.line}`).join('\n\n')}\n\nTWIST:\n${script.twist}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${script.title || 'script'}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            <Pen className="inline mr-2 text-cinema-accent" size={36} />
            Script <span className="gradient-text">Generator</span>
          </h1>
          <p className="text-cinema-muted">Let AI write your next movie script</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-bold mb-4">Script Parameters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-cinema-muted text-xs mb-1 block">Genre</label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(g => (
                    <button key={g} onClick={() => setGenre(g)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${genre === g ? 'bg-cinema-accent text-white' : 'glass text-cinema-muted border border-white/5'}`}
                    >{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-cinema-muted text-xs mb-1 block">Mood</label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map(m => (
                    <button key={m} onClick={() => setMood(m)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${mood === m ? 'bg-cinema-purple text-white' : 'glass text-cinema-muted border border-white/5'}`}
                    >{m}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-cinema-muted text-xs mb-1 block">Setting</label>
                <input value={setting} onChange={e => setSetting(e.target.value)} placeholder="e.g. Space station, Small Indian village..."
                  className="w-full bg-cinema-surface/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-cinema-muted focus:outline-none focus:border-cinema-accent/50" />
              </div>
              <div>
                <label className="text-cinema-muted text-xs mb-1 block">Main Character Name</label>
                <input value={character} onChange={e => setCharacter(e.target.value)} placeholder="e.g. Arjun, Sarah..."
                  className="w-full bg-cinema-surface/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-cinema-muted focus:outline-none focus:border-cinema-accent/50" />
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleGenerate} disabled={loading || !setting.trim() || !character.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white font-bold shadow-neon disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</> : <><Clapperboard size={18} /> Generate Script</>}
              </motion.button>
            </div>
          </motion.div>

          {/* Script Output */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {script ? (
              <div className="bg-[#1a1a0e] rounded-2xl p-6 border border-cinema-gold/20 font-mono text-sm space-y-4" style={{ fontFamily: "'Courier New', monospace" }}>
                <div className="text-center">
                  <h2 className="text-cinema-gold font-bold text-xl uppercase tracking-widest">{script.title}</h2>
                  <p className="text-cinema-muted text-xs italic mt-1">{script.logline}</p>
                </div>
                <hr className="border-cinema-gold/20" />
                <div>
                  <p className="text-cinema-gold text-xs font-bold mb-1">CHARACTERS:</p>
                  {script.characters?.map((c, i) => <p key={i} className="text-cinema-text text-xs ml-4">• {c}</p>)}
                </div>
                <div>
                  <p className="text-cinema-gold text-xs font-bold mb-1">SCENE 1:</p>
                  <p className="text-cinema-text text-xs italic">{script.scene}</p>
                </div>
                <div className="space-y-3">
                  {script.dialogues?.map((d, i) => (
                    <div key={i}>
                      <p className="text-cinema-gold text-xs font-bold text-center uppercase">{d.character}</p>
                      <p className="text-white text-xs text-center ml-8 mr-8">"{d.line}"</p>
                    </div>
                  ))}
                </div>
                <hr className="border-cinema-gold/20" />
                <div>
                  <p className="text-cinema-accent text-xs font-bold mb-1">🔄 TWIST:</p>
                  <p className="text-cinema-text text-xs italic">{script.twist}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={handleDownload} className="flex-1 py-2 rounded-lg glass text-cinema-gold text-xs font-bold border border-cinema-gold/20 flex items-center justify-center gap-1">
                    <Download size={14} /> Download
                  </button>
                  <button onClick={handleGenerate} className="flex-1 py-2 rounded-lg glass text-cinema-accent text-xs font-bold border border-cinema-accent/20 flex items-center justify-center gap-1">
                    <RotateCcw size={14} /> Generate Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-10 border border-white/10 text-center h-full flex flex-col items-center justify-center">
                <div className="text-5xl mb-4">📝</div>
                <p className="text-cinema-muted text-sm">Fill in the parameters and click Generate to create your movie script</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
