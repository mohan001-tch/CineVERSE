/**
 * useWatchParty.js — Hook for Watch Party Matcher
 * Takes two users' preferences → AI finds the best matching movie.
 */
import { useState, useCallback } from 'react';
import { callAIJSON } from '../utils/aiService';

export default function useWatchParty() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const findMatch = useCallback(async (user1, user2) => {
    setLoading(true);
    setResult(null);

    const prompt = `You are a movie matchmaker for a Watch Party. Two friends want to watch a movie together tonight.

User 1 Preferences:
- Favorite genres: ${user1.fav.join(', ')}
- Avoid genres: ${user1.avoid.join(', ')}
- Mood: ${user1.mood}

User 2 Preferences:
- Favorite genres: ${user2.fav.join(', ')}
- Avoid genres: ${user2.avoid.join(', ')}
- Mood: ${user2.mood}

Return ONLY JSON:
{
  "mainPick": { "title": "Movie Title", "year": "2020", "reason": "Why this suits both" },
  "backups": [
    { "title": "Movie 2", "year": "2019", "reason": "short reason" },
    { "title": "Movie 3", "year": "2021", "reason": "short reason" },
    { "title": "Movie 4", "year": "2018", "reason": "short reason" }
  ]
}
Pick REAL, well-known movies. The main pick should perfectly balance both users' preferences.`;

    const fallback = () => {
      const shared = user1.fav.filter(g => user2.fav.includes(g));
      const pick = shared.length > 0 ? shared[0] : user1.fav[0];
      const movieMap = {
        Action: { title: 'Mad Max: Fury Road', year: '2015' },
        Comedy: { title: 'The Grand Budapest Hotel', year: '2014' },
        Drama: { title: 'The Shawshank Redemption', year: '1994' },
        Horror: { title: 'Get Out', year: '2017' },
        Romance: { title: 'La La Land', year: '2016' },
        Thriller: { title: 'Parasite', year: '2019' },
        'Sci-Fi': { title: 'Interstellar', year: '2014' },
        Animation: { title: 'Spider-Verse', year: '2018' },
      };
      const m = movieMap[pick] || movieMap.Drama;
      return {
        mainPick: { ...m, reason: `Perfect blend of ${shared.join(' & ') || pick} that matches both moods` },
        backups: [
          { title: 'Inception', year: '2010', reason: 'Universal crowd-pleaser' },
          { title: 'The Dark Knight', year: '2008', reason: 'Satisfies action and drama lovers' },
          { title: 'Coco', year: '2017', reason: 'Feel-good for any mood' },
        ],
      };
    };

    const data = await callAIJSON(prompt, fallback);
    setResult(data);
    setLoading(false);
  }, []);

  return { result, loading, findMatch };
}
