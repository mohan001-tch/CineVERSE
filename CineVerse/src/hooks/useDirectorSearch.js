/**
 * useDirectorSearch.js — Custom hook for searching movies by director name
 *
 * Flow:
 *   1. Search TMDB People API for the director name
 *   2. Filter results where known_for_department === "Directing"
 *   3. Fetch that person's movie credits
 *   4. Filter crew entries where job === "Director"
 *   5. Sort by release_date descending (newest first)
 */

import { useState, useCallback } from 'react';

// TODO: Replace with your own valid TMDB API key
const API_KEY = '112cd202b9f95b77b3740d4dedc15942';
const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p';

export default function useDirectorSearch() {
  const [director, setDirector] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Step 1: Search for people matching the director name
   */
  const searchDirector = useCallback(async (name) => {
    if (!name || !name.trim()) return;

    setLoading(true);
    setError(null);
    setDirector(null);
    setMovies([]);
    setCandidates([]);

    try {
      const res = await fetch(
        `${BASE}/search/person?query=${encodeURIComponent(name.trim())}&api_key=${API_KEY}&language=en-US`
      );
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      // Filter only people known for Directing
      const directors = (data.results || []).filter(
        (p) => p.known_for_department === 'Directing'
      );

      if (directors.length === 0) {
        setError('No director found with this name');
        setLoading(false);
        return;
      }

      // If multiple directors found, show candidates for user to pick
      if (directors.length > 1) {
        setCandidates(
          directors.slice(0, 6).map((d) => ({
            id: d.id,
            name: d.name,
            photo: d.profile_path ? `${IMG}/w185${d.profile_path}` : null,
            knownFor: (d.known_for || []).map((m) => m.title || m.name).filter(Boolean),
            popularity: d.popularity,
          }))
        );
        setLoading(false);
        return;
      }

      // Single director found — fetch their credits directly
      await fetchDirectorCredits(directors[0]);
    } catch (err) {
      setError('Failed to search. Please check your connection and try again.');
      setLoading(false);
    }
  }, []);

  /**
   * Step 2: Fetch movie credits for a selected director
   */
  const fetchDirectorCredits = useCallback(async (person) => {
    setLoading(true);
    setError(null);
    setCandidates([]);

    try {
      const res = await fetch(
        `${BASE}/person/${person.id}/movie_credits?api_key=${API_KEY}&language=en-US`
      );
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      // Filter crew entries where job === "Director"
      const directed = (data.crew || [])
        .filter((m) => m.job === 'Director' && m.title)
        .sort((a, b) => {
          const da = a.release_date || '0000';
          const db = b.release_date || '0000';
          return db.localeCompare(da); // newest first
        })
        .map((m) => ({
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

      // Build director profile
      const knownMovies = directed
        .filter((m) => m.popularity > 10)
        .slice(0, 5)
        .map((m) => m.title);

      setDirector({
        id: person.id,
        name: person.name,
        photo: person.profile_path ? `${IMG}/w300${person.profile_path}` : null,
        totalMovies: directed.length,
        knownFor: knownMovies.length > 0 ? knownMovies : directed.slice(0, 3).map((m) => m.title),
      });

      if (directed.length === 0) {
        setError('No movies found for this director');
      }

      setMovies(directed);
    } catch (err) {
      setError('Failed to load director credits. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Select a specific director from candidates list
   */
  const selectDirector = useCallback((candidate) => {
    fetchDirectorCredits({
      id: candidate.id,
      name: candidate.name,
      profile_path: candidate.photo?.includes('/w185') ? candidate.photo.replace(`${IMG}/w185`, '') : null,
    });
  }, [fetchDirectorCredits]);

  /** Reset all state */
  const reset = useCallback(() => {
    setDirector(null);
    setCandidates([]);
    setMovies([]);
    setError(null);
    setLoading(false);
  }, []);

  return {
    director,
    candidates,
    movies,
    loading,
    error,
    searchDirector,
    selectDirector,
    reset,
  };
}
