/**
 * SearchPage.jsx — Advanced Search Page with 3 search modes
 *
 * Modes:
 *   🎬 Movie Name (default) — searches local movie database
 *   🎥 Director Name — TMDB People API → movie credits
 *   📅 Release Date — TMDB Discover API with date range
 *
 * Includes unified search bar with mode toggle, director disambiguation,
 * director profile card, date range picker, and paginated results.
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Film, Clapperboard, CalendarRange, ChevronDown,
  User, Star, X
} from 'lucide-react';
import { movies as localMovies } from '../data/movies';
import useDirectorSearch from '../hooks/useDirectorSearch';
import useDateSearch, { formatDateDisplay } from '../hooks/useDateSearch';
import DirectorCard from '../components/Search/DirectorCard';
import DateRangePicker from '../components/Search/DateRangePicker';
import SearchResults from '../components/Search/SearchResults';

// ─── Search Modes ────────────────────────────────────────────
const MODES = [
  { id: 'movie', label: 'Movie', icon: Film, placeholder: 'Search movie title...' },
  { id: 'director', label: 'Director', icon: Clapperboard, placeholder: 'Enter director name...' },
  { id: 'date', label: 'Date', icon: CalendarRange, placeholder: '' },
];

export default function SearchPage() {
  const navigate = useNavigate();

  // ─── State ─────────────────────────────────────────────────
  const [mode, setMode] = useState('movie');
  const [query, setQuery] = useState('');
  const [modeOpen, setModeOpen] = useState(false);
  const [localResults, setLocalResults] = useState([]);
  const [localSearched, setLocalSearched] = useState(false);

  // Date range state
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Director hook
  const directorHook = useDirectorSearch();
  // Date hook
  const dateHook = useDateSearch();

  const inputRef = useRef(null);
  const currentMode = MODES.find((m) => m.id === mode);

  // ─── Switch mode ───────────────────────────────────────────
  const switchMode = (newMode) => {
    setMode(newMode);
    setModeOpen(false);
    setQuery('');
    setLocalResults([]);
    setLocalSearched(false);
    directorHook.reset();
    dateHook.reset();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // ─── Local movie search ────────────────────────────────────
  const searchLocalMovies = (q) => {
    if (!q.trim()) { setLocalResults([]); setLocalSearched(false); return; }
    const lower = q.toLowerCase();
    const results = localMovies.filter((m) =>
      m.title.toLowerCase().includes(lower) ||
      m.genre?.toLowerCase().includes(lower) ||
      m.director?.toLowerCase().includes(lower) ||
      m.cast?.some((c) => c.toLowerCase().includes(lower))
    );
    setLocalResults(results);
    setLocalSearched(true);
  };

  // ─── Handle search submit ─────────────────────────────────
  const handleSearch = () => {
    if (mode === 'movie') {
      searchLocalMovies(query);
    } else if (mode === 'director') {
      directorHook.searchDirector(query);
    } else if (mode === 'date') {
      dateHook.searchByDate(fromDate, toDate);
    }
  };

  const handleDateChange = (from, to) => {
    setFromDate(from);
    setToDate(to);
  };

  const handleDateSearch = (from, to) => {
    setFromDate(from);
    setToDate(to);
    dateHook.searchByDate(from, to);
  };

  const handleSortChange = (sort) => {
    dateHook.searchByDate(fromDate, toDate, 1, sort);
  };

  // ─── Build header text for date results ────────────────────
  const dateHeaderText = fromDate && toDate
    ? `Movies released between ${formatDateDisplay(fromDate)} — ${formatDateDisplay(toDate)}`
    : '';

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ═══ Page Header ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            Advanced <span className="gradient-text">Search</span>
          </h1>
          <p className="text-cinema-muted text-base max-w-lg mx-auto">
            Search by movie name, director, or release date
          </p>
        </motion.div>

        {/* ═══ Search Bar ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto mb-10"
        >
          <div className="glass rounded-2xl border border-white/10 p-2 flex flex-col sm:flex-row items-stretch gap-2">
            {/* Mode Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setModeOpen(!modeOpen)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-cinema-accent/10 border border-cinema-accent/20 text-cinema-accent text-sm font-bold whitespace-nowrap w-full sm:w-auto justify-center"
              >
                <currentMode.icon size={16} />
                {currentMode.label}
                <ChevronDown size={14} className={`transition-transform ${modeOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown menu */}
              <AnimatePresence>
                {modeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute left-0 top-full mt-2 w-52 glass-strong rounded-xl border border-white/10 overflow-hidden z-50 shadow-glass-lg"
                  >
                    {MODES.map((m) => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          onClick={() => switchMode(m.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                            mode === m.id
                              ? 'bg-cinema-accent/15 text-cinema-accent font-bold'
                              : 'text-cinema-text hover:bg-white/5'
                          }`}
                        >
                          <Icon size={16} />
                          {m.id === 'movie' && '🎬'} {m.id === 'director' && '🎥'} {m.id === 'date' && '📅'} {m.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input area — changes based on mode */}
            {mode !== 'date' ? (
              <>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={currentMode.placeholder}
                  className="flex-1 bg-transparent text-white text-sm px-4 py-3 focus:outline-none placeholder:text-cinema-muted/50"
                />
                {query && (
                  <button onClick={() => { setQuery(''); setLocalResults([]); setLocalSearched(false); directorHook.reset(); }} className="text-cinema-muted hover:text-white px-2">
                    <X size={16} />
                  </button>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center px-2">
                <span className="text-cinema-muted text-xs">Use the date picker below</span>
              </div>
            )}

            {/* Search button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white font-bold text-sm flex items-center gap-2 shadow-neon whitespace-nowrap"
            >
              <Search size={16} /> Search
            </motion.button>
          </div>
        </motion.div>

        {/* ═══ Date Range Picker (shown when date mode) ═══ */}
        <AnimatePresence>
          {mode === 'date' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-3xl mx-auto mb-10"
            >
              <div className="glass rounded-2xl p-5 border border-white/10">
                <DateRangePicker
                  fromDate={fromDate}
                  toDate={toDate}
                  onChange={handleDateChange}
                  onSearch={handleDateSearch}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Director Candidates (disambiguation) ═══ */}
        <AnimatePresence>
          {directorHook.candidates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto mb-10"
            >
              <h3 className="font-display text-lg font-bold text-white mb-4">
                Multiple directors found — select one:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {directorHook.candidates.map((c) => (
                  <motion.button
                    key={c.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => directorHook.selectDirector(c)}
                    className="glass rounded-xl p-4 flex items-center gap-4 text-left hover:border-cinema-accent/30 border border-white/5 transition-all"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-cinema-surface">
                      {c.photo ? (
                        <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={24} className="text-cinema-muted/30" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm">{c.name}</p>
                      {c.knownFor.length > 0 && (
                        <p className="text-cinema-muted text-[11px] truncate">
                          Known for: {c.knownFor.slice(0, 2).join(', ')}
                        </p>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Director Profile Card ═══ */}
        {directorHook.director && (
          <div className="max-w-6xl mx-auto">
            <DirectorCard director={directorHook.director} />
          </div>
        )}

        {/* ═══ Results ═══ */}

        {/* Movie name results (local) */}
        {mode === 'movie' && localSearched && (
          <SearchResults
            movies={localResults.map((m) => ({
              id: m.id,
              title: m.title,
              poster_url: m.poster_url,
              year: m.year,
              vote_average: m.rating,
              overview: m.description || '',
              release_date: '',
            }))}
            loading={false}
            error={localResults.length === 0 ? 'No movies found matching your search' : null}
            headerText={`Results for "${query}"`}
            totalResults={localResults.length}
          />
        )}

        {/* Director results */}
        {mode === 'director' && (
          <SearchResults
            movies={directorHook.movies}
            loading={directorHook.loading}
            error={directorHook.error}
            headerText={directorHook.director ? `Movies directed by ${directorHook.director.name}` : ''}
            totalResults={directorHook.movies.length}
          />
        )}

        {/* Date results */}
        {mode === 'date' && (
          <SearchResults
            movies={dateHook.movies}
            loading={dateHook.loading}
            error={dateHook.error}
            headerText={dateHeaderText}
            totalResults={dateHook.totalResults}
            currentPage={dateHook.currentPage}
            totalPages={dateHook.totalPages}
            showPagination={true}
            showSort={true}
            sortBy={dateHook.sortBy}
            onSortChange={handleSortChange}
            onNextPage={() => dateHook.nextPage(fromDate, toDate)}
            onPrevPage={() => dateHook.prevPage(fromDate, toDate)}
          />
        )}
      </div>
    </div>
  );
}
