/**
 * useTimeMachine.js — Hook for Time Machine feature
 * Fetches top movies by year from TMDB + AI fun facts with fallback.
 */
import { useState, useCallback } from 'react';
import { tmdbFetch, IMG } from '../utils/tmdb';
import { callAI } from '../utils/aiService';

export default function useTimeMachine() {
  const [movies, setMovies] = useState([]);
  const [funFact, setFunFact] = useState('');
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(2000);

  const fetchYear = useCallback(async (y) => {
    setYear(y);
    setLoading(true);
    setFunFact('');
    try {
      const data = await tmdbFetch(
        `/discover/movie?primary_release_year=${y}&sort_by=vote_average.desc&vote_count.gte=200&page=1`
      );
      const results = (data.results || []).slice(0, 10).map((m) => ({
        id: m.id,
        title: m.title,
        poster: m.poster_path ? `${IMG}/w342${m.poster_path}` : null,
        rating: m.vote_average?.toFixed(1),
        year: m.release_date?.split('-')[0],
      }));
      setMovies(results);

      // Fetch fun fact from AI
      const titles = results.slice(0, 3).map((m) => m.title).join(', ');
      const fact = await callAI(
        `Give me one fun, surprising fact about movies released in the year ${y}. Mention specific movies like ${titles} if relevant. Keep it to 1-2 sentences. Be entertaining and use an emoji.`,
        () => `In ${y}, cinema gave us amazing films like ${titles}! 🎬 A truly iconic year for movie lovers.`
      );
      setFunFact(fact);
    } catch (err) {
      console.warn('TimeMachine error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { movies, funFact, loading, year, fetchYear };
}
