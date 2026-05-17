/**
 * aiService.js — Shared AI service with Gemini API + smart fallback
 *
 * Uses the Google Gemini API for all AI features.
 * Falls back to realistic mock data if the API call fails (CORS, invalid key, etc).
 */

const GEMINI_KEY = 'AIzaSyBywHIUXBTq0cDPJg8CmUEC1woa6aBxdoQ';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

/**
 * Call the Gemini AI API with a prompt. Returns the text response.
 * Falls back to fallbackFn() if the API call fails for any reason.
 *
 * @param {string} prompt - The prompt to send
 * @param {function} fallbackFn - A function that returns fallback data
 * @returns {Promise<string>} - The AI response text
 */
export async function callAI(prompt, fallbackFn) {
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
      }),
    });

    if (!res.ok) throw new Error(`API ${res.status}`);

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response');
    return text;
  } catch (err) {
    console.warn('AI API fallback:', err.message);
    if (fallbackFn) return fallbackFn();
    return 'AI analysis is temporarily unavailable.';
  }
}

/**
 * Call AI and parse the response as JSON.
 * Extracts JSON from markdown code blocks if present.
 */
export async function callAIJSON(prompt, fallbackFn) {
  const raw = await callAI(prompt, () => JSON.stringify(fallbackFn()));
  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : raw.trim();
    return JSON.parse(jsonStr);
  } catch {
    // If parsing fails, return fallback
    if (fallbackFn) return fallbackFn();
    return null;
  }
}
