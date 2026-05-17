/**
 * SearchResults.jsx — Unified results grid for all search types
 *
 * Displays TMDB movie results as cards with poster, title, year, rating.
 * Includes loading skeletons, empty states, pagination, and sort controls.
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Film, ChevronLeft, ChevronRight, SearchX, ArrowUpDown } from 'lucide-react';
import { formatDateDisplay, SORT_LABELS } from '../../hooks/useDateSearch';

// ─── Skeleton Loader ─────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-cinema-card border border-white/5 animate-pulse">
      <div className="aspect-[2/3] bg-cinema-surface" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-cinema-surface rounded w-3/4" />
        <div className="h-3 bg-cinema-surface rounded w-1/2" />
      </div>
    </div>
  );
}

// ─── Movie Result Card ───────────────────────────────────────
function ResultCard({ movie, index }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="rounded-2xl overflow-hidden bg-cinema-card border border-white/5 cursor-pointer group hover:border-cinema-accent/20 transition-all duration-300 hover:shadow-glass"
    >
      {/* Poster */}
      <div className="aspect-[2/3] relative overflow-hidden bg-cinema-surface">
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film size={36} className="text-cinema-muted/20" />
          </div>
        )}

        {/* Rating badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-2 right-2 glass px-2 py-0.5 rounded-lg flex items-center gap-1">
            <Star size={10} className="text-cinema-gold fill-cinema-gold" />
            <span className="text-[10px] font-bold text-cinema-gold">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <p className="text-white text-[11px] line-clamp-3 leading-relaxed">
            {movie.overview || 'No overview available'}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-display text-sm font-bold text-white truncate group-hover:text-cinema-accent transition-colors">
          {movie.title}
        </h3>
        <p className="text-cinema-muted text-[11px] mt-0.5">
          {movie.year}
          {movie.release_date && ` • ${formatDateDisplay(movie.release_date)}`}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────
export default function SearchResults({
  movies = [],
  loading = false,
  error = null,
  totalResults = 0,
  currentPage = 1,
  totalPages = 0,
  onNextPage,
  onPrevPage,
  sortBy,
  onSortChange,
  showPagination = false,
  showSort = false,
  headerText = '',
}) {
  // Loading state
  if (loading) {
    return (
      <div>
        {headerText && <p className="text-cinema-muted text-sm mb-4">{headerText}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 rounded-full bg-cinema-red/10 flex items-center justify-center mx-auto mb-4">
          <SearchX size={36} className="text-cinema-red" />
        </div>
        <p className="text-white font-display text-xl font-bold mb-2">{error}</p>
        <p className="text-cinema-muted text-sm">Try a different search term or check your spelling</p>
      </motion.div>
    );
  }

  // Empty state
  if (movies.length === 0) return null;

  return (
    <div>
      {/* Header bar with count + sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        {headerText && (
          <p className="text-cinema-muted text-sm">
            {headerText}
            {totalResults > 0 && (
              <span className="text-cinema-accent font-semibold ml-1">
                ({totalResults.toLocaleString()} results)
              </span>
            )}
          </p>
        )}

        {/* Sort dropdown */}
        {showSort && onSortChange && (
          <div className="flex items-center gap-2">
            <ArrowUpDown size={13} className="text-cinema-muted" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-cinema-card border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cinema-accent/50 appearance-none cursor-pointer"
            >
              {Object.entries(SORT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie, i) => (
          <ResultCard key={movie.id} movie={movie} index={i} />
        ))}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl glass text-sm font-medium text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-cinema-accent/30 border border-white/10 transition"
          >
            <ChevronLeft size={16} /> Prev
          </motion.button>

          <span className="text-cinema-muted text-sm">
            Page <span className="text-white font-bold">{currentPage}</span> of{' '}
            <span className="text-white font-bold">{totalPages}</span>
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl glass text-sm font-medium text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-cinema-accent/30 border border-white/10 transition"
          >
            Next <ChevronRight size={16} />
          </motion.button>
        </div>
      )}
    </div>
  );
}
