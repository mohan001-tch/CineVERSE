/**
 * DebateBot.jsx — AI Movie Debate Bot Modal
 * Chat UI with quick-reply chips and AI-powered debate responses.
 */
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Swords } from 'lucide-react';
import useDebate from '../../hooks/useDebate';

export default function DebateBot({ movie, isOpen, onClose }) {
  const { messages, loading, startDebate, sendMessage, STARTERS } = useDebate();
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    if (isOpen && movie) startDebate(movie);
  }, [isOpen, movie]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    sendMessage(msg);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-strong rounded-2xl border border-white/10 w-full max-w-md h-[550px] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3 bg-gradient-to-r from-cinema-accent/10 to-cinema-purple/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cinema-accent to-cinema-purple flex items-center justify-center">
              <Swords size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-white text-sm">Movie Debate</h3>
              <p className="text-cinema-accent text-[10px]">Debating: {movie?.title}</p>
            </div>
            <button onClick={onClose} className="text-cinema-muted hover:text-white"><X size={18} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'ai' ? 'bg-gradient-to-br from-cinema-accent to-cinema-purple' : 'bg-cinema-surface'
                }`}>
                  {msg.role === 'ai' ? <Bot size={12} className="text-white" /> : <User size={12} className="text-cinema-muted" />}
                </div>
                <div className={`max-w-[80%] inline-block px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'ai' ? 'glass text-cinema-text rounded-tl-sm' : 'bg-cinema-accent/20 text-white rounded-tr-sm'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cinema-accent to-cinema-purple flex items-center justify-center">
                  <Bot size={12} className="text-white" />
                </div>
                <div className="glass px-4 py-2 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                        className="w-1.5 h-1.5 rounded-full bg-cinema-accent" />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick reply chips */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-1.5">
                {STARTERS.map((s) => (
                  <button key={s} onClick={() => handleSend(s)}
                    className="text-[10px] px-2.5 py-1.5 rounded-full glass border border-white/10 text-cinema-muted hover:text-cinema-accent hover:border-cinema-accent/30 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-white/5">
            <div className="flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Share your opinion..."
                className="flex-1 bg-cinema-surface/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-cinema-muted focus:outline-none focus:border-cinema-accent/50"
              />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                onClick={() => handleSend()}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-cinema-accent to-cinema-purple flex items-center justify-center"
              >
                <Send size={16} className="text-white" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
