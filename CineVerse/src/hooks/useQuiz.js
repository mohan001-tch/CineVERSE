/**
 * useQuiz.js — Hook for the Movie Quiz Game
 * Fetches 5 random movies, manages timer, scoring, streaks, leaderboard.
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { tmdbFetch, IMG } from '../utils/tmdb';

const POINTS = { fast: 100, medium: 50, slow: 25 };

export default function useQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [answered, setAnswered] = useState(null); // 'correct' | 'wrong' | null
  const [gameState, setGameState] = useState('idle'); // idle | playing | finished
  const [correctCount, setCorrectCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef(null);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && !answered) {
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setAnswered('wrong');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [gameState, answered, currentQ]);

  /** Start a new quiz game */
  const startGame = useCallback(async () => {
    setGameState('playing');
    setScore(0);
    setCurrentQ(0);
    setCorrectCount(0);
    setTotalTime(0);
    setAnswered(null);

    try {
      // Fetch popular movies for questions + wrong answers
      const pages = [1, 2, 3, 4, 5];
      const allMovies = [];
      for (const p of pages) {
        const data = await tmdbFetch(`/movie/popular?page=${p}`);
        allMovies.push(...(data.results || []).filter((m) => m.backdrop_path && m.title));
      }

      // Shuffle and pick 5 for questions
      const shuffled = allMovies.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 5);
      const rest = shuffled.slice(5);

      const qs = selected.map((m) => {
        // Pick 3 random wrong options
        const wrongs = rest.sort(() => Math.random() - 0.5).slice(0, 3).map((w) => w.title);
        const options = [m.title, ...wrongs].sort(() => Math.random() - 0.5);
        return {
          backdrop: `${IMG}/w1280${m.backdrop_path}`,
          correctTitle: m.title,
          options,
        };
      });

      setQuestions(qs);
      setTimer(15);
    } catch (err) {
      console.warn('Quiz fetch error:', err);
      setGameState('idle');
    }
  }, []);

  /** Answer a question */
  const answer = useCallback((choice) => {
    if (answered) return;
    clearInterval(timerRef.current);

    const timeSpent = 15 - timer;
    setTotalTime((t) => t + timeSpent);

    const correct = choice === questions[currentQ]?.correctTitle;
    if (correct) {
      const pts = timeSpent <= 5 ? POINTS.fast : timeSpent <= 10 ? POINTS.medium : POINTS.slow;
      setScore((s) => s + pts);
      setCorrectCount((c) => c + 1);
      setAnswered('correct');
    } else {
      setAnswered('wrong');
    }
  }, [answered, timer, questions, currentQ]);

  /** Go to next question or finish */
  const nextQuestion = useCallback(() => {
    if (currentQ >= questions.length - 1) {
      setGameState('finished');
      // Save to leaderboard
      const lb = JSON.parse(localStorage.getItem('cineverse_quiz_lb') || '[]');
      lb.push({ score: score, date: new Date().toLocaleDateString() });
      lb.sort((a, b) => b.score - a.score);
      localStorage.setItem('cineverse_quiz_lb', JSON.stringify(lb.slice(0, 5)));
      // Update streak
      const today = new Date().toDateString();
      const lastPlayed = localStorage.getItem('cineverse_quiz_last');
      let streak = parseInt(localStorage.getItem('cineverse_quiz_streak') || '0');
      if (lastPlayed !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        streak = lastPlayed === yesterday ? streak + 1 : 1;
        localStorage.setItem('cineverse_quiz_streak', streak.toString());
        localStorage.setItem('cineverse_quiz_last', today);
      }
    } else {
      setCurrentQ((q) => q + 1);
      setAnswered(null);
      setTimer(15);
    }
  }, [currentQ, questions.length, score]);

  const streak = parseInt(localStorage.getItem('cineverse_quiz_streak') || '0');
  const leaderboard = JSON.parse(localStorage.getItem('cineverse_quiz_lb') || '[]');

  // Blur level based on timer
  const blurLevel = timer > 10 ? 20 : timer > 5 ? 10 : 0;

  return {
    questions, currentQ, score, timer, answered, gameState, correctCount,
    totalTime, blurLevel, streak, leaderboard,
    startGame, answer, nextQuestion,
  };
}
