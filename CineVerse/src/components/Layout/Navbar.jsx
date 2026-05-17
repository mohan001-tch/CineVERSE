import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Search, Menu, X, Sun, Moon, Compass, Layers, Clock, Zap, Crown, FlaskConical,
  Rewind, Brain, Gamepad2, Pen, TrendingUp, Heart, Users, Smile, Globe, MapPin } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  { path: '/', label: 'Home', icon: Film },
  { path: '/discover', label: 'Discover', icon: Compass },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/swipe', label: 'Swipe', icon: Zap },
  { path: '/universe', label: 'Universe', icon: Layers },
  { path: '/timeline', label: 'Timeline', icon: Clock },
  { path: '/subscribe', label: 'Premium', icon: Crown },
];

const labLinks = [
  { path: '/timemachine', label: 'Time Machine', icon: Rewind, emoji: '⏰' },
  { path: '/quiz', label: 'Movie Quiz', icon: Gamepad2, emoji: '🎮' },
  { path: '/mood', label: 'Mood Movies', icon: Smile, emoji: '😊' },
  { path: '/chemistry', label: 'Chemistry Check', icon: Heart, emoji: '💕' },
  { path: '/script', label: 'Script Writer', icon: Pen, emoji: '📝' },
  { path: '/predictor', label: 'Box Office', icon: TrendingUp, emoji: '📊' },
  { path: '/watchparty', label: 'Watch Party', icon: Users, emoji: '🎉' },
  { path: '/personality', label: 'My Personality', icon: Brain, emoji: '🧠' },
  { path: '/map', label: 'World Map', icon: Globe, emoji: '🌍' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [labsOpen, setLabsOpen] = useState(false);
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const labsRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);
  useEffect(() => { setLabsOpen(false); }, [location]);

  // Close labs dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (labsRef.current && !labsRef.current.contains(e.target)) setLabsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isLabRoute = labLinks.some(l => location.pathname === l.path);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-strong shadow-glass' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cinema-accent to-cinema-purple flex items-center justify-center group-hover:shadow-neon transition-shadow duration-300">
              <Film size={18} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold gradient-text hidden sm:block">CineVerse</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === path
                    ? 'bg-cinema-accent/15 text-cinema-accent'
                    : 'text-cinema-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}

            {/* Labs Dropdown */}
            <div className="relative" ref={labsRef}>
              <button
                onClick={() => setLabsOpen(!labsOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isLabRoute || labsOpen
                    ? 'bg-cinema-purple/15 text-cinema-purple'
                    : 'text-cinema-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <FlaskConical size={16} />
                Labs
                <motion.span animate={{ rotate: labsOpen ? 180 : 0 }} className="text-[10px]">▼</motion.span>
              </button>

              <AnimatePresence>
                {labsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-56 glass-strong rounded-2xl border border-white/10 shadow-glass overflow-hidden py-2"
                  >
                    {labLinks.map(({ path, label, icon: Icon, emoji }) => (
                      <Link
                        key={path}
                        to={path}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${
                          location.pathname === path
                            ? 'bg-cinema-accent/10 text-cinema-accent'
                            : 'text-cinema-muted hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="text-sm">{emoji}</span>
                        {label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-xl glass flex items-center justify-center text-cinema-muted hover:text-white transition">
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="md:hidden w-9 h-9 rounded-xl glass flex items-center justify-center text-cinema-muted" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-20 glass-strong md:hidden overflow-y-auto"
          >
            <div className="flex flex-col items-center gap-2 p-6">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 w-full px-6 py-4 rounded-xl text-lg font-medium transition-all ${
                    location.pathname === path
                      ? 'bg-cinema-accent/15 text-cinema-accent'
                      : 'text-cinema-muted hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              ))}
              <div className="w-full border-t border-white/10 my-2" />
              <p className="text-cinema-purple text-xs font-bold uppercase tracking-wider self-start px-6 mb-1">🧪 Labs</p>
              {labLinks.map(({ path, label, emoji }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 w-full px-6 py-3 rounded-xl text-base font-medium transition-all ${
                    location.pathname === path
                      ? 'bg-cinema-accent/15 text-cinema-accent'
                      : 'text-cinema-muted hover:text-white'
                  }`}
                >
                  <span>{emoji}</span>
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
