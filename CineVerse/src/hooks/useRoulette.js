/**
 * useRoulette.js — Hook for the Surprise Me Roulette Wheel
 * Spins a wheel, picks a random genre, fetches a random movie from TMDB.
 */
import { useState, useCallback } from 'react';
import { tmdbFetch, IMG } from '../utils/tmdb';

const GENRES = [
  { id: 28, name: 'Action', color: '#e50914', emoji: '💥' },
  { id: 35, name: 'Comedy', color: '#f59e0b', emoji: '😂' },
  { id: 27, name: 'Horror', color: '#7c3aed', emoji: '👻' },
  { id: 10749, name: 'Romance', color: '#ec4899', emoji: '💕' },
  { id: 878, name: 'Sci-Fi', color: '#06b6d4', emoji: '🚀' },
  { id: 53, name: 'Thriller', color: '#10b981', emoji: '🔪' },
  { id: 16, name: 'Animation', color: '#f97316', emoji: '🎨' },
  { id: 18, name: 'Drama', color: '#8b5cf6', emoji: '🎭' },
];

export default function useRoulette() {
  const [spinning, setSpinning] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movie, setMovie] = useState(null);
  const [rotation, setRotation] = useState(0);

  const spin = useCallback(async () => {
    setSpinning(true);
    setMovie(null);

    // Pick random genre
    const idx = Math.floor(Math.random() * GENRES.length);
    const genre = GENRES[idx];

    // Calculate rotation: 3+ full spins + land on segment
    const segAngle = 360 / GENRES.length;
    const spins = 3 + Math.floor(Math.random() * 3);
    const finalRotation = rotation + spins * 360 + (360 - idx * segAngle - segAngle / 2);
    setRotation(finalRotation);

    // Wait for spin animation
    await new Promise((r) => setTimeout(r, 3500));
    setSelectedGenre(genre);

    // Fetch random movie from that genre
    try {
      const page = Math.floor(Math.random() * 5) + 1;
      const data = await tmdbFetch(
        `/discover/movie?with_genres=${genre.id}&sort_by=vote_average.desc&vote_count.gte=100&page=${page}`
      );
      const results = data.results || [];
      if (results.length > 0) {
        const m = results[Math.floor(Math.random() * results.length)];
        setMovie({
          id: m.id,
          title: m.title,
          poster: m.poster_path ? `${IMG}/w500${m.poster_path}` : null,
          backdrop: m.backdrop_path ? `${IMG}/w1280${m.backdrop_path}` : null,
          year: m.release_date?.split('-')[0] || 'TBA',
          rating: m.vote_average?.toFixed(1),
          overview: m.overview,
        });
      }
    } catch (err) {
      console.warn('Roulette fetch error:', err);
    } finally {
      setSpinning(false);
    }
  }, [rotation]);

  return { spinning, selectedGenre, movie, rotation, spin, GENRES };
}
