/**
 * useChemistry.js — Hook for Cast Chemistry Analyzer
 * Searches two actors on TMDB, finds shared movies, generates chemistry score.
 */
import { useState, useCallback } from 'react';
import { tmdbFetch, IMG } from '../utils/tmdb';
import { callAI } from '../utils/aiService';

export default function useChemistry() {
  const [actor1, setActor1] = useState(null);
  const [actor2, setActor2] = useState(null);
  const [sharedMovies, setSharedMovies] = useState([]);
  const [chemistryScore, setChemistryScore] = useState(0);
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = useCallback(async (name1, name2) => {
    if (!name1.trim() || !name2.trim()) return;
    setLoading(true);
    setError(null);
    setSharedMovies([]);

    try {
      // Search both actors
      const [p1, p2] = await Promise.all([
        tmdbFetch(`/search/person?query=${encodeURIComponent(name1)}`),
        tmdbFetch(`/search/person?query=${encodeURIComponent(name2)}`),
      ]);

      const person1 = p1.results?.[0];
      const person2 = p2.results?.[0];
      if (!person1) { setError(`Could not find "${name1}"`); setLoading(false); return; }
      if (!person2) { setError(`Could not find "${name2}"`); setLoading(false); return; }

      setActor1({ name: person1.name, photo: person1.profile_path ? `${IMG}/w185${person1.profile_path}` : null });
      setActor2({ name: person2.name, photo: person2.profile_path ? `${IMG}/w185${person2.profile_path}` : null });

      // Get movie credits for both
      const [c1, c2] = await Promise.all([
        tmdbFetch(`/person/${person1.id}/movie_credits`),
        tmdbFetch(`/person/${person2.id}/movie_credits`),
      ]);

      const ids1 = new Set((c1.cast || []).map(m => m.id));
      const shared = (c2.cast || []).filter(m => ids1.has(m.id)).map(m => ({
        id: m.id, title: m.title,
        poster: m.poster_path ? `${IMG}/w342${m.poster_path}` : null,
        year: m.release_date?.split('-')[0] || 'TBA',
        rating: m.vote_average?.toFixed(1),
      }));

      setSharedMovies(shared);

      // Chemistry score based on collaborations
      const score = Math.min(100, shared.length * 20 + (shared.length > 0 ? 30 : 0));
      setChemistryScore(score);
      setLabel(
        shared.length >= 5 ? '🔥 Legendary Pair!' :
        shared.length >= 3 ? '⭐ Dynamic Duo!' :
        shared.length >= 1 ? '🎬 Rare Combo!' :
        '❓ Never Paired'
      );

      // AI description
      const desc = await callAI(
        `Write a fun, witty 2-line description of the on-screen chemistry between ${person1.name} and ${person2.name}. They have appeared in ${shared.length} movies together${shared.length > 0 ? ': ' + shared.slice(0, 3).map(m => m.title).join(', ') : ''}. Be entertaining! Use emojis.`,
        () => shared.length > 0
          ? `${person1.name} and ${person2.name} are like cinema magic together! 🎬 Their ${shared.length} film collaboration(s) prove some duos are just meant to be. ✨`
          : `${person1.name} and ${person2.name} haven't shared the screen yet, but imagine the possibilities! 🌟 Hollywood, make it happen! 🎬`
      );
      setDescription(desc);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { actor1, actor2, sharedMovies, chemistryScore, label, description, loading, error, analyze };
}
