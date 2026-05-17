/**
 * useCountryMovies.js — Hook for Movie World Map
 * Fetches popular movies from a country using TMDB's region/origin parameter.
 */
import { useState, useCallback } from 'react';
import { tmdbFetch, IMG } from '../utils/tmdb';

export default function useCountryMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState(null);

  const fetchCountry = useCallback(async (code, name) => {
    setLoading(true);
    setCountry({ code, name });
    setMovies([]);
    try {
      const data = await tmdbFetch(
        `/discover/movie?with_origin_country=${code}&sort_by=popularity.desc&vote_count.gte=10&page=1`
      );
      setMovies((data.results || []).slice(0, 12).map(m => ({
        id: m.id,
        title: m.title,
        poster: m.poster_path ? `${IMG}/w342${m.poster_path}` : null,
        rating: m.vote_average?.toFixed(1),
        year: m.release_date?.split('-')[0],
      })));
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { movies, loading, country, fetchCountry };
}
