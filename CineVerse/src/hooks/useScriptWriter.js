/**
 * useScriptWriter.js — Hook for AI Script Generator
 */
import { useState, useCallback } from 'react';
import { callAI } from '../utils/aiService';

export default function useScriptWriter() {
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async ({ genre, mood, setting, character }) => {
    setLoading(true);
    setScript(null);

    const prompt = `You are a Hollywood screenwriter. Write a 1-page movie script with these parameters:
Genre: ${genre}
Mood: ${mood}
Setting: ${setting}
Main Character: ${character}

Return ONLY a JSON object with this exact format:
{
  "title": "Movie Title",
  "logline": "One line description",
  "characters": ["Character 1 - description", "Character 2 - description"],
  "scene": "Scene 1 description (2-3 sentences setting the scene)",
  "dialogues": [
    {"character": "Name", "line": "Dialogue line 1"},
    {"character": "Name", "line": "Dialogue line 2"},
    {"character": "Name", "line": "Dialogue line 3"}
  ],
  "twist": "The twist ending (2-3 sentences)"
}`;

    const fallback = () => ({
      title: `The ${mood} ${genre}`,
      logline: `A ${mood.toLowerCase()} ${genre.toLowerCase()} tale set in ${setting}`,
      characters: [`${character} - A determined protagonist`, `Shadow - The mysterious antagonist`],
      scene: `INT. ${setting.toUpperCase()} - NIGHT. The camera pans across ${setting}, revealing ${character} standing alone. The air is thick with tension.`,
      dialogues: [
        { character, line: `I didn't come all this way to give up now.` },
        { character: 'Shadow', line: `You don't know what you're walking into.` },
        { character, line: `Maybe not. But I know what I'm walking away from.` },
      ],
      twist: `Just as ${character} thinks it's all over, a hidden door reveals that ${setting} was never what it seemed. The real story was just beginning.`,
    });

    try {
      const raw = await callAI(prompt, () => JSON.stringify(fallback()));
      try {
        const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
        const jsonStr = jsonMatch ? jsonMatch[1].trim() : raw.trim();
        setScript(JSON.parse(jsonStr));
      } catch {
        setScript(fallback());
      }
    } catch {
      setScript(fallback());
    } finally {
      setLoading(false);
    }
  }, []);

  return { script, loading, generate };
}
