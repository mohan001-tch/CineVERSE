/**
 * useMovieDNA.js — Hook for AI Movie DNA Analyzer
 * Analyzes genre breakdown percentages using AI with smart fallback.
 */
import { useState, useCallback } from 'react';
import { callAIJSON } from '../utils/aiService';

export default function useMovieDNA() {
  const [dna, setDna] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = useCallback(async (movie) => {
    if (!movie) return;
    setLoading(true);
    setDna(null);

    const prompt = `Analyze the movie "${movie.title}" (${movie.year}, ${movie.genre}, directed by ${movie.director || 'unknown'}).
Return a JSON object with EXACTLY this format, no other text:
{
  "genres": { "Action": 25, "Romance": 10, "Comedy": 5, "Thriller": 30, "Drama": 30 },
  "matchA": "Movie A title",
  "matchB": "Movie B title"
}
Rules:
- The 5 genre percentages MUST add up to exactly 100
- matchA and matchB should be real movies that share this movie's DNA
- Be accurate to the actual genre blend of the movie`;

    const fallback = () => {
      const g = (movie.genre || 'Drama').toLowerCase();
      const base = { Action: 10, Romance: 10, Comedy: 10, Thriller: 10, Drama: 10 };
      if (g.includes('action')) base.Action = 40;
      else if (g.includes('horror')) base.Thriller = 40;
      else if (g.includes('comedy') || g.includes('romcom')) base.Comedy = 40;
      else if (g.includes('romance')) base.Romance = 40;
      else base.Drama = 40;
      // Normalize
      const total = Object.values(base).reduce((a, b) => a + b, 0);
      Object.keys(base).forEach((k) => base[k] = Math.round((base[k] / total) * 100));
      const diff = 100 - Object.values(base).reduce((a, b) => a + b, 0);
      base.Drama += diff;
      return { genres: base, matchA: 'The Shawshank Redemption', matchB: 'Inception' };
    };

    try {
      const result = await callAIJSON(prompt, fallback);
      setDna(result);
    } catch {
      setDna(fallback());
    } finally {
      setLoading(false);
    }
  }, []);

  return { dna, loading, analyze };
}
