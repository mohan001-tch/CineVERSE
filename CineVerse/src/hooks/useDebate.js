/**
 * useDebate.js — Hook for AI Movie Debate Bot
 * Maintains conversation history, sends to AI for debate responses.
 */
import { useState, useCallback } from 'react';
import { callAI } from '../utils/aiService';

const STARTERS = [
  'This movie was overrated',
  'The ending was terrible',
  'Best movie of the decade',
  'The director could have done better',
];

export default function useDebate() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState(null);

  const startDebate = useCallback((m) => {
    setMovie(m);
    setMessages([{
      role: 'ai',
      text: `Hey! So you want to debate about "${m.title}"? I'm a passionate movie critic and I have STRONG opinions about this one. Bring it on! 🎬🔥`,
    }]);
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || !movie) return;
    const userMsg = { role: 'user', text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setLoading(true);

    const convoHistory = newMsgs.map((m) => `${m.role === 'user' ? 'User' : 'Critic'}: ${m.text}`).join('\n');

    const prompt = `You are a passionate movie critic. Debate the user about "${movie.title}" (${movie.year}, ${movie.genre}, directed by ${movie.director || 'unknown'}, rating: ${movie.rating}/10).
Debate with confidence, humor, and real facts. Sometimes agree if they make a good point, sometimes disagree strongly. Keep response under 3 sentences. Be entertaining and use emojis.

Conversation so far:
${convoHistory}

Respond as the Critic:`;

    const fallbackResponses = [
      `Hmm, interesting take on "${movie.title}"! But have you considered that ${movie.director || 'the director'} was clearly going for something deeper here? The ${movie.rating}/10 rating doesn't lie! 🎬`,
      `I see your point, but "${movie.title}" was a masterclass in ${movie.genre} filmmaking. You can't deny the impact it had! 🔥`,
      `Bold opinion! While I partly agree, "${movie.title}" from ${movie.year} pushed boundaries in ways most films don't dare. Give it another watch! 🎭`,
    ];

    const response = await callAI(prompt, () =>
      fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    );

    setMessages((prev) => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  }, [messages, movie]);

  return { messages, loading, movie, startDebate, sendMessage, STARTERS };
}
