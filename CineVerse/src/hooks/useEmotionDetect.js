/**
 * useEmotionDetect.js — Hook for Emotion-Based Recommendation
 * Uses simulated emotion detection (face-api.js models are too heavy for frontend)
 * + TMDB genre-based recommendations.
 */
import { useState, useCallback } from 'react';
import { tmdbFetch, IMG } from '../utils/tmdb';

const EMOTION_GENRES = {
  happy: { genres: '35,16', label: '😊 Happy', desc: 'Comedy & Animation to keep the vibes going!' },
  sad: { genres: '10749,18', label: '😢 Sad', desc: 'Feel-good Romance & Drama for comfort' },
  angry: { genres: '28,53', label: '😤 Angry', desc: 'Action & Thriller to channel that energy!' },
  surprised: { genres: '9648,878', label: '😲 Surprised', desc: 'Mystery & Sci-Fi to keep you amazed!' },
  neutral: { genres: '', label: '😐 Neutral', desc: 'Top rated movies for a great time' },
};

export default function useEmotionDetect() {
  const [emotion, setEmotion] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);

  /**
   * Detect emotion from webcam snapshot.
   * Uses a lightweight approach: capture frame → analyze skin tone/brightness as proxy,
   * then falls back to random emotion for demo. In production, use face-api.js with models.
   */
  const detectEmotion = useCallback(async (videoRef) => {
    setDetecting(true);
    // Simulate detection delay (face-api.js would take ~1-2s)
    await new Promise(r => setTimeout(r, 2000));

    // For demo: pick emotion from webcam analysis or random
    const emotions = ['happy', 'sad', 'angry', 'surprised', 'neutral'];
    let detected = emotions[Math.floor(Math.random() * emotions.length)];

    // If we have a video element, try simple brightness analysis
    if (videoRef?.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, 100, 100);
        const data = ctx.getImageData(0, 0, 100, 100).data;
        let brightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
        }
        brightness /= (data.length / 4);
        // Use brightness as a simple heuristic
        if (brightness > 140) detected = 'happy';
        else if (brightness > 120) detected = 'surprised';
        else if (brightness > 100) detected = 'neutral';
        else if (brightness > 80) detected = 'sad';
        else detected = 'angry';
      } catch {}
    }

    setEmotion(detected);
    setDetecting(false);
    await fetchMovies(detected);
  }, []);

  /** Manually set emotion */
  const setManualEmotion = useCallback(async (e) => {
    setEmotion(e);
    await fetchMovies(e);
  }, []);

  /** Fetch movies based on emotion */
  const fetchMovies = async (e) => {
    setLoading(true);
    try {
      const config = EMOTION_GENRES[e] || EMOTION_GENRES.neutral;
      let data;
      if (e === 'neutral') {
        data = await tmdbFetch('/movie/top_rated?page=1');
      } else {
        data = await tmdbFetch(`/discover/movie?with_genres=${config.genres}&sort_by=popularity.desc&vote_count.gte=100&page=1`);
      }
      setMovies((data.results || []).slice(0, 8).map(m => ({
        id: m.id,
        title: m.title,
        poster: m.poster_path ? `${IMG}/w342${m.poster_path}` : null,
        rating: m.vote_average?.toFixed(1),
        year: m.release_date?.split('-')[0],
        overview: m.overview,
      })));
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return { emotion, movies, loading, detecting, detectEmotion, setManualEmotion, EMOTION_GENRES };
}
