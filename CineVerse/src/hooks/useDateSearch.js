/**
 * useDateSearch.js — Custom hook for searching movies by release date
 *
 * Uses TMDB Discover API with primary_release_date filters.
 * Handles pagination, sorting, and date formatting.
 */

import { useState, useCallback } from 'react';

// TODO: Replace with your own valid TMDB API key
const API_KEY = '112cd202b9f95b77b3740d4dedc15942';
const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p';

/** Get today's date as YYYY-MM-DD */
const today = () => new Date().toISOString().split('T')[0];

/** Get start of current week (Monday) */
const startOfWeek = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
};

/** Get start of current month */
const startOfMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
};

/** Get start of current year */
const startOfYear = () => `${new Date().getFullYear()}-01-01`;

/** Format YYYY-MM-DD → DD/MM/YYYY for display */
export function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

/** Sort options for the API */
const SORT_OPTIONS = {
  popularity: 'popularity.desc',
  rating: 'vote_average.desc',
  release_date: 'primary_release_date.desc',
  revenue: 'revenue.desc',
};

export const SORT_LABELS = {
  popularity: 'Popularity',
  rating: 'Rating',
  release_date: 'Release Date',
  revenue: 'Revenue',
};

export const QUICK_FILTERS = [
  { id: 'week', label: 'This Week', getRange: () => ({ from: startOfWeek(), to: today() }) },
  { id: 'month', label: 'This Month', getRange: () => ({ from: startOfMonth(), to: today() }) },
  { id: 'year', label: 'This Year', getRange: () => ({ from: startOfYear(), to: today() }) },
  { id: 'custom', label: 'Custom Range', getRange: null },
];

export default function useDateSearch() {
  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('popularity');

  /**
   * Search movies by date range
   * @param {string} fromDate - YYYY-MM-DD format
   * @param {string} toDate   - YYYY-MM-DD format
   * @param {number} page     - Page number (1-indexed)
   * @param {string} sort     - Sort key from SORT_OPTIONS
   */
  const searchByDate = useCallback(async (fromDate, toDate, page = 1, sort = 'popularity') => {
    if (!fromDate || !toDate) {
      setError('Please select both dates');
      return;
    }

    // Validate date range
    if (fromDate > toDate) {
      setError('From date cannot be after To date');
      return;
    }

    setLoading(true);
    setError(null);
    setSortBy(sort);

    try {
      const sortParam = SORT_OPTIONS[sort] || SORT_OPTIONS.popularity;
      const url = `${BASE}/discover/movie?primary_release_date.gte=${fromDate}&primary_release_date.lte=${toDate}&api_key=${API_KEY}&language=en-US&sort_by=${sortParam}&page=${page}&vote_count.gte=5`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      const results = (data.results || []).map((m) => ({
        id: m.id,
        title: m.title,
        poster_path: m.poster_path,
        poster_url: m.poster_path ? `${IMG}/w500${m.poster_path}` : null,
        backdrop_url: m.backdrop_path ? `${IMG}/w1280${m.backdrop_path}` : null,
        release_date: m.release_date || '',
        year: m.release_date ? m.release_date.split('-')[0] : 'TBA',
        overview: m.overview || '',
        vote_average: m.vote_average || 0,
        popularity: m.popularity || 0,
        genre_ids: m.genre_ids || [],
      }));

      setMovies(results);
      setTotalResults(data.total_results || 0);
      setTotalPages(Math.min(data.total_pages || 0, 500)); // TMDB caps at 500
      setCurrentPage(page);

      if (results.length === 0) {
        setError('No movies found in this date range');
      }
    } catch (err) {
      setError('Failed to search movies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  /** Go to next page */
  const nextPage = useCallback((fromDate, toDate) => {
    if (currentPage < totalPages) {
      searchByDate(fromDate, toDate, currentPage + 1, sortBy);
    }
  }, [currentPage, totalPages, sortBy, searchByDate]);

  /** Go to previous page */
  const prevPage = useCallback((fromDate, toDate) => {
    if (currentPage > 1) {
      searchByDate(fromDate, toDate, currentPage - 1, sortBy);
    }
  }, [currentPage, sortBy, searchByDate]);

  /** Reset all state */
  const reset = useCallback(() => {
    setMovies([]);
    setTotalResults(0);
    setTotalPages(0);
    setCurrentPage(1);
    setError(null);
    setLoading(false);
  }, []);

  return {
    movies,
    totalResults,
    totalPages,
    currentPage,
    loading,
    error,
    sortBy,
    searchByDate,
    nextPage,
    prevPage,
    reset,
  };
}
