/**
 * usePredictor.js — Hook for Box Office Predictor
 */
import { useState, useCallback } from 'react';
import { callAIJSON } from '../utils/aiService';

export default function usePredictor() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = useCallback(async ({ title, genre, actorPop, directorRep, budget, season }) => {
    setLoading(true);
    setResult(null);

    const prompt = `You are a Bollywood/Hollywood box office analyst. Predict the box office performance:
Movie: ${title}
Genre: ${genre}
Lead Actor Popularity: ${actorPop}/10
Director Reputation: ${directorRep}/10
Budget: ₹${budget} Crores
Release Season: ${season}

Return ONLY JSON:
{
  "collection": number (predicted collection in crores, be realistic),
  "verdict": "BLOCKBUSTER" or "HIT" or "AVERAGE" or "FLOP",
  "confidence": number (1-100),
  "reasons": ["reason 1", "reason 2", "reason 3"]
}`;

    const fallback = () => {
      const multiplier = (actorPop + directorRep) / 10;
      const seasonBonus = season === 'Festival' ? 1.5 : season === 'Summer' ? 1.3 : season === 'Winter' ? 1.1 : 1.0;
      const collection = Math.round(budget * multiplier * seasonBonus);
      const ratio = collection / budget;
      const verdict = ratio > 3 ? 'BLOCKBUSTER' : ratio > 2 ? 'HIT' : ratio > 1.2 ? 'AVERAGE' : 'FLOP';
      return {
        collection,
        verdict,
        confidence: Math.min(85, Math.round(50 + actorPop * 2 + directorRep * 1.5)),
        reasons: [
          `${genre} movies perform ${['Action','Comedy','Thriller'].includes(genre)?'well':'moderately'} at the box office`,
          `Lead actor popularity (${actorPop}/10) ${actorPop >= 7 ? 'ensures strong opening weekend' : 'may limit initial draw'}`,
          `${season} release ${seasonBonus > 1.2 ? 'provides favorable market conditions' : 'faces moderate competition'}`,
        ],
      };
    };

    const data = await callAIJSON(prompt, fallback);
    setResult(data);
    setLoading(false);
  }, []);

  return { result, loading, predict };
}
