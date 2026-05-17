/**
 * ChatBot.jsx — CineVerse AI Assistant with Voice Support
 * 
 * Features:
 *   - Text chat with AI movie recommendations
 *   - 🎤 Voice Input: Click mic to speak your query (Speech Recognition API)
 *   - 🔊 Voice Output: AI reads its responses aloud (Speech Synthesis API)
 *   - Animated mic button with listening state
 *   - Auto-scroll, typing indicator, movie card results
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, Bot, User, Sparkles,
  Mic, MicOff, Volume2, VolumeX
} from 'lucide-react';
import { processUserMessage, getAIGreeting } from '../../utils/recommendations';
import { useNavigate } from 'react-router-dom';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [micSupported, setMicSupported] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // ─── Check browser support ─────────────────────────────────
  useEffect(() => {
    if (!('speechSynthesis' in window)) setSpeechSupported(false);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicSupported(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Auto-send after voice input
        setTimeout(() => {
          handleSendMessage(transcript);
        }, 300);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // ─── Greeting on first open ────────────────────────────────
  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting = getAIGreeting();
      setMessages([{ role: 'ai', text: greeting, movies: [] }]);
      if (voiceEnabled && speechSupported) speakText(greeting);
    }
  }, [open]);

  // ─── Auto-scroll ───────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // ─── Speak text aloud (TTS) ────────────────────────────────
  const speakText = useCallback((text) => {
    if (!speechSupported || !voiceEnabled) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to pick a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google'))
      || voices.find(v => v.lang.startsWith('en-US'))
      || voices.find(v => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [speechSupported, voiceEnabled]);

  // ─── Stop speaking ─────────────────────────────────────────
  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // ─── Toggle voice input (STT) ─────────────────────────────
  const toggleListening = () => {
    if (!micSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Stop any ongoing speech first
      stopSpeaking();
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  // ─── Send message ──────────────────────────────────────────
  const handleSendMessage = useCallback((text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg, movies: [] }]);
    setTyping(true);

    // Stop any ongoing speech
    stopSpeaking();

    setTimeout(() => {
      const response = processUserMessage(msg);
      setMessages(prev => [...prev, { role: 'ai', text: response.text, movies: response.movies }]);
      setTyping(false);

      // Speak the AI response
      if (voiceEnabled && speechSupported) {
        speakText(response.text);
      }
    }, 800 + Math.random() * 800);
  }, [input, voiceEnabled, speechSupported, speakText, stopSpeaking]);

  const handleSend = () => handleSendMessage();

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => { setOpen(!open); if (open) stopSpeaking(); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-cinema-accent to-cinema-purple shadow-neon-lg flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={22} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] glass-strong rounded-2xl border border-cinema-accent/20 flex flex-col overflow-hidden shadow-glass-lg"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3 bg-gradient-to-r from-cinema-accent/10 to-cinema-purple/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cinema-accent to-cinema-purple flex items-center justify-center relative">
                <Bot size={16} className="text-white" />
                {/* Speaking indicator */}
                {isSpeaking && (
                  <motion.span
                    animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-cinema-accent/40"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-white text-sm">CineVerse AI</h3>
                <p className="text-cinema-accent text-[10px] flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-cinema-red animate-pulse' : isSpeaking ? 'bg-cinema-accent animate-pulse' : 'bg-cinema-green animate-pulse'}`} />
                  {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Online • Voice enabled'}
                </p>
              </div>
              {/* Voice toggle button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { setVoiceEnabled(!voiceEnabled); if (isSpeaking) stopSpeaking(); }}
                title={voiceEnabled ? 'Disable voice responses' : 'Enable voice responses'}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  voiceEnabled ? 'bg-cinema-accent/20 text-cinema-accent' : 'bg-white/5 text-cinema-muted'
                }`}
              >
                {voiceEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              </motion.button>
              <Sparkles size={16} className="text-cinema-accent animate-glow-pulse" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'ai' ? 'bg-gradient-to-br from-cinema-accent to-cinema-purple' : 'bg-cinema-surface'
                  }`}>
                    {msg.role === 'ai' ? <Bot size={12} className="text-white" /> : <User size={12} className="text-cinema-muted" />}
                  </div>
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'ai' ? 'glass text-cinema-text rounded-tl-sm' : 'bg-cinema-accent/20 text-white rounded-tr-sm'
                    }`}>
                      {msg.role === 'user' && msg.isVoice && (
                        <span className="inline-flex items-center gap-1 text-cinema-accent text-[10px] mb-1">
                          <Mic size={9} /> Voice
                        </span>
                      )}
                      {msg.text}
                    </div>
                    {msg.movies && msg.movies.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {msg.movies.map(m => (
                          <motion.div
                            key={m.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => { navigate(`/movie/${m.id}`); setOpen(false); stopSpeaking(); }}
                            className="glass rounded-xl p-2 flex items-center gap-2 cursor-pointer hover:bg-white/5 transition"
                          >
                            <div className="w-8 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-lg overflow-hidden"
                              style={{ background: `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[1]})` }}>
                              {m.poster_url ? <img src={m.poster_url} alt="" className="w-full h-full object-cover" /> : m.emoji}
                            </div>
                            <div className="min-w-0">
                              <p className="text-white text-xs font-semibold truncate">{m.title}</p>
                              <p className="text-cinema-muted text-[10px]">{m.year} • {m.genre} • ⭐{m.rating}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cinema-accent to-cinema-purple flex items-center justify-center">
                    <Bot size={12} className="text-white" />
                  </div>
                  <div className="glass px-4 py-2 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 rounded-full bg-cinema-accent"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area with Voice Controls */}
            <div className="p-3 border-t border-white/5">
              {/* Listening indicator */}
              <AnimatePresence>
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-2 flex items-center justify-center gap-2 py-2"
                  >
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ scaleY: [1, 2.5, 1] }}
                          transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                          className="w-1 h-3 bg-cinema-red rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-cinema-red text-xs font-medium">Listening...</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ scaleY: [1, 2.5, 1] }}
                          transition={{ repeat: Infinity, duration: 0.5, delay: (4 - i) * 0.1 }}
                          className="w-1 h-3 bg-cinema-red rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2">
                {/* Mic Button */}
                {micSupported && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleListening}
                    title={isListening ? 'Stop listening' : 'Speak your query'}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${
                      isListening
                        ? 'bg-cinema-red text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                        : 'bg-cinema-surface/50 border border-white/10 text-cinema-muted hover:text-cinema-accent hover:border-cinema-accent/30'
                    }`}
                  >
                    {isListening && (
                      <motion.span
                        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        className="absolute inset-0 rounded-xl bg-cinema-red/30"
                      />
                    )}
                    {isListening ? <MicOff size={16} className="relative z-10" /> : <Mic size={16} />}
                  </motion.button>
                )}

                {/* Text Input */}
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={isListening ? 'Listening...' : 'Type or speak...'}
                  disabled={isListening}
                  className="flex-1 bg-cinema-surface/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-cinema-muted focus:outline-none focus:border-cinema-accent/50 transition disabled:opacity-50"
                />

                {/* Send Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-cinema-accent to-cinema-purple flex items-center justify-center"
                >
                  <Send size={16} className="text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
