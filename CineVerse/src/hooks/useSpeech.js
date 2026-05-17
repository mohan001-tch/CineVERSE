/**
 * useSpeech.js — Custom React hook for AI Voice Narrator
 * 
 * Uses the Web Speech API (SpeechSynthesis) to read movie details aloud.
 * Provides speak() and stop() functions with speaking state tracking.
 * 
 * Voice Settings:
 *   - Rate: 0.85 (natural, slightly slower)
 *   - Pitch: 1.0
 *   - Volume: 1.0
 *   - Language: en-US
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export default function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef(null);

  // Check browser support on mount
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  // Cleanup: stop any ongoing speech when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /**
   * Speak the given text aloud using the Web Speech API.
   * @param {string} text - The text to be spoken
   */
  const speak = useCallback((text) => {
    if (!isSupported) {
      alert('Sorry, your browser does not support text-to-speech. Please use Chrome, Firefox, or Edge.');
      return;
    }

    // Stop any currently playing speech first
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;   // Slightly slower for natural narration
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to select a natural-sounding English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('google')
    ) || voices.find(
      (v) => v.lang.startsWith('en-US')
    ) || voices.find(
      (v) => v.lang.startsWith('en')
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Event handlers
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  /**
   * Stop any ongoing speech narration.
   */
  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  /**
   * Build a narration script from movie data and speak or stop it.
   * @param {object} movie - The movie object with title, year, genre, etc.
   */
  const toggleMovieNarration = useCallback((movie) => {
    if (isSpeaking) {
      stop();
      return;
    }

    // Build the narration text
    const description = movie.description
      || `A ${movie.genre.toLowerCase()} film directed by ${movie.director}, featuring ${movie.cast?.slice(0, 2).join(' and ') || 'a talented cast'}. This ${movie.runtimeCategory?.toLowerCase() || ''} ${movie.runtime}-minute ${movie.industry} movie is a must-watch.`;

    const narrationText = `${movie.title}. Released in ${movie.year}. Genre: ${movie.genre}. ${description}`;

    speak(narrationText);
  }, [isSpeaking, speak, stop]);

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
    toggleMovieNarration,
  };
}
