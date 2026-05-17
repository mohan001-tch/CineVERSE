/**
 * usePersonality.js — Hook for Movie Personality Analyzer
 * Takes 5 favorite movies → AI generates personality profile.
 */
import { useState, useCallback } from 'react';
import { callAIJSON } from '../utils/aiService';

export default function usePersonality() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = useCallback(async (movieTitles) => {
    if (movieTitles.length < 3) return;
    setLoading(true);
    setProfile(null);

    const prompt = `Analyze someone's movie personality based on their top 5 favorite movies: ${movieTitles.join(', ')}.

Return ONLY JSON:
{
  "type": "The Philosophical Dreamer",
  "genres": { "Action": 20, "Drama": 30, "Thriller": 25, "Romance": 15, "Sci-Fi": 10 },
  "traits": ["Creative thinker", "Emotionally intelligent", "Loves plot twists"],
  "directors": ["Christopher Nolan", "Denis Villeneuve", "David Fincher"],
  "badge": "🎬 Cinema Connoisseur",
  "summary": "A 2-3 sentence fun personality summary"
}
Rules: genre percentages must add to 100. Be creative and fun with the type name and badge.`;

    const fallback = () => ({
      type: 'The Eclectic Cinephile',
      genres: { Action: 25, Drama: 30, Thriller: 20, Romance: 15, Comedy: 10 },
      traits: ['Open-minded viewer', 'Appreciates storytelling', 'Loves character depth', 'Enjoys surprises'],
      directors: ['Christopher Nolan', 'Quentin Tarantino', 'Martin Scorsese'],
      badge: '🎬 Film Enthusiast',
      summary: `Based on your love for ${movieTitles.slice(0, 2).join(' and ')}, you're a true cinephile who values both spectacle and substance. Your taste spans genres effortlessly!`,
    });

    const data = await callAIJSON(prompt, fallback);
    setProfile(data);
    setLoading(false);
  }, []);

  return { profile, loading, analyze };
}
