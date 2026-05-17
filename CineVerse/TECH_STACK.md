# ═══════════════════════════════════════════════════════════════
#          CineVerse — Technology Stack & Architecture
# ═══════════════════════════════════════════════════════════════
#
# Project: CineVerse — AI-Powered Movie Discovery Platform
# Author:  Aayush
# Version: 2.0
#
# ═══════════════════════════════════════════════════════════════


# ╔═══════════════════════════════════════════════════════════╗
# ║                   FRONTEND TECHNOLOGIES                   ║
# ╚═══════════════════════════════════════════════════════════╝

# ─── Core Language ──────────────────────────────────────────
# 
# JavaScript (ES6+)
#   - The primary programming language for the entire application.
#   - Uses modern features: arrow functions, destructuring,
#     async/await, template literals, spread operators,
#     optional chaining (?.), and nullish coalescing (??).
#   - Functional programming patterns throughout.
#
# JSX (JavaScript XML)
#   - HTML-like syntax extension used inside React components.
#   - Allows writing UI markup directly in JavaScript files (.jsx).


# ─── Frontend Framework ────────────────────────────────────
#
# React.js (v18+)
#   - Component-based UI library by Meta (Facebook).
#   - Uses functional components with React Hooks:
#     • useState    — Local state management
#     • useEffect   — Side effects (API calls, subscriptions)
#     • useCallback — Memoized functions for performance
#     • useRef      — DOM references (webcam, scroll targets)
#   - Custom Hooks pattern for reusable business logic
#     (12 custom hooks: useQuiz, useDebate, useChemistry, etc.)


# ─── Styling ───────────────────────────────────────────────
#
# Tailwind CSS (v3+)
#   - Utility-first CSS framework for rapid UI development.
#   - Custom theme with cinema-specific design tokens:
#     • Colors: cinema-dark, cinema-accent, cinema-purple, etc.
#     • Fonts: Inter (body), Outfit (display headings)
#     • Custom animations: float, glow, shimmer, particle, etc.
#     • Glassmorphism effects via custom utility classes
#   - Fully responsive (mobile/tablet/desktop breakpoints).
#
# Vanilla CSS
#   - Used for Leaflet map tooltip dark-theming.
#   - Custom scrollbar-hide utility.
#   - Keyframe animations for roulette spin.


# ─── Routing ───────────────────────────────────────────────
#
# React Router DOM (v6+)
#   - Client-side routing for Single Page Application (SPA).
#   - 16+ routes: /, /discover, /swipe, /search, /quiz,
#     /timemachine, /chemistry, /script, /predictor,
#     /watchparty, /personality, /mood, /map, etc.
#   - useNavigate hook for programmatic navigation.
#   - useLocation hook for active route highlighting.


# ─── Animation Library ─────────────────────────────────────
#
# Framer Motion (v10+)
#   - Production-ready animation library for React.
#   - Used for: page transitions, card hover effects,
#     modal open/close, staggered list animations,
#     progress bar animations, typing indicators.
#   - AnimatePresence for exit animations.
#   - motion.div, motion.button for declarative animations.


# ─── Charts & Data Visualization ──────────────────────────
#
# Recharts
#   - Composable charting library built on D3.js for React.
#   - Used in:
#     • PieChart — Movie Personality Analyzer (genre breakdown)
#     • BarChart — Box Office Predictor (budget vs collection)
#   - Responsive containers with custom dark-themed tooltips.


# ─── Maps ──────────────────────────────────────────────────
#
# Leaflet.js + React-Leaflet
#   - Open-source interactive mapping library.
#   - CartoDB Dark Matter tile layer for dark theme.
#   - CircleMarker components for 20+ country locations.
#   - Tooltip popups on hover.
#   - Dynamic import to avoid SSR issues.


# ─── Icons ─────────────────────────────────────────────────
#
# Lucide React
#   - Modern, clean icon library (fork of Feather Icons).
#   - 50+ icons used throughout: Film, Star, Heart, Search,
#     Brain, Dna, Swords, Globe, Camera, Timer, Trophy, etc.


# ─── Typography ────────────────────────────────────────────
#
# Google Fonts
#   - Inter (wght 300-900): Body text, UI elements
#   - Outfit (wght 300-900): Display headings, titles


# ╔═══════════════════════════════════════════════════════════╗
# ║                   BACKEND / API SERVICES                  ║
# ╚═══════════════════════════════════════════════════════════╝
#
# NOTE: This project is a frontend-only SPA (Single Page
# Application). There is NO traditional backend server.
# All data comes from external APIs called directly
# from the browser.

# ─── TMDB API (The Movie Database) ────────────────────────
#
#   Purpose: All movie data — titles, posters, ratings,
#            cast, trailers, and discovery.
#   Version: v3 REST API
#   Base URL: https://api.themoviedb.org/3
#
#   Endpoints used:
#     • /search/movie      — Search movies by title
#     • /search/person     — Search actors/directors by name
#     • /discover/movie    — Advanced discovery with filters
#     • /movie/popular     — Popular movies (for Quiz)
#     • /movie/top_rated   — Top rated movies
#     • /movie/{id}        — Movie details
#     • /movie/{id}/videos — Trailers (YouTube keys)
#     • /person/{id}/movie_credits — Actor filmography
#
#   Features powered by TMDB:
#     → Home, Discover, Swipe, Universe, Timeline pages
#     → Director Search, Date Search
#     → Movie Quiz (backdrop images)
#     → Time Machine (yearly discovery)
#     → Chemistry Check (shared filmography)
#     → Emotion-based Recommendations (genre filtering)
#     → World Map (country-based discovery)
#     → Roulette Wheel (random genre movies)


# ─── Google Gemini AI API ──────────────────────────────────
#
#   Purpose: AI-powered text generation for intelligent
#            movie analysis and creative features.
#   Model:   gemini-2.0-flash
#   Base URL: https://generativelanguage.googleapis.com/v1beta
#
#   Features powered by Gemini AI:
#     → Movie DNA Analyzer (genre % breakdown)
#     → AI Debate Bot (movie debate conversations)
#     → Script Writer (screenplay generation)
#     → Box Office Predictor (collection prediction)
#     → Watch Party Matcher (movie recommendation)
#     → Movie Personality Analyzer (personality type)
#     → Time Machine Fun Facts
#
#   Fallback System:
#     → Every AI call has a built-in fallback function.
#     → If the API fails (CORS, rate limit, invalid key),
#       realistic mock data is generated automatically.
#     → This ensures the UI always works for demos.


# ╔═══════════════════════════════════════════════════════════╗
# ║                   WEB APIs (Browser-Native)               ║
# ╚═══════════════════════════════════════════════════════════╝

# Web Speech API
#   - SpeechRecognition: Voice input for chatbot (STT)
#   - SpeechSynthesis:   AI responses read aloud (TTS)
#   - Best supported in Chrome/Edge browsers.

# MediaDevices API (getUserMedia)
#   - Webcam access for Emotion Detection feature.
#   - Canvas API for frame capture and brightness analysis.

# Web Audio API (AudioContext)
#   - Generates tick sound effects during roulette spin.
#   - No external audio files needed.

# Clipboard API
#   - "Share My Personality" copies text summary to clipboard.

# LocalStorage API
#   - Quiz high scores and leaderboard (top 5).
#   - Daily streak counter for quiz game.
#   - Persistent across browser sessions.


# ╔═══════════════════════════════════════════════════════════╗
# ║                   BUILD TOOLS & DEV SERVER                ║
# ╚═══════════════════════════════════════════════════════════╝

# Vite (v5+)
#   - Next-generation frontend build tool.
#   - Blazing fast Hot Module Replacement (HMR).
#   - ES modules-based dev server.
#   - Optimized production builds with Rollup.
#   - Dev server: http://localhost:5173

# Node.js + npm
#   - Runtime: Node.js (for running Vite dev server)
#   - Package manager: npm
#   - 151 total packages installed


# ╔═══════════════════════════════════════════════════════════╗
# ║                   PROJECT ARCHITECTURE                    ║
# ╚═══════════════════════════════════════════════════════════╝
#
#   src/
#   ├── components/          # Reusable UI components
#   │   ├── AI/              # ChatBot (voice assistant)
#   │   ├── Features/        # MovieDNA, DebateBot, RouletteWheel
#   │   ├── Layout/          # Navbar, Footer
#   │   ├── Movies/          # MovieCard, TrailerModal, Carousels
#   │   ├── Search/          # DirectorCard, DateRangePicker
#   │   └── UI/              # Particles, MoodChip, SpeakButton
#   │
#   ├── hooks/               # Custom React hooks (12 feature hooks)
#   │   ├── useQuiz.js       # Movie Quiz logic
#   │   ├── useDebate.js     # AI Debate Bot logic
#   │   ├── useChemistry.js  # Cast Chemistry logic
#   │   ├── useMovieDNA.js   # DNA Analyzer logic
#   │   ├── useRoulette.js   # Roulette Wheel logic
#   │   ├── useTimeMachine.js
#   │   ├── useScriptWriter.js
#   │   ├── usePredictor.js
#   │   ├── useWatchParty.js
#   │   ├── usePersonality.js
#   │   ├── useEmotionDetect.js
#   │   └── useCountryMovies.js
#   │
#   ├── pages/               # Route-level page components
#   │   ├── Home.jsx
#   │   ├── Discover.jsx
#   │   ├── MovieQuiz.jsx
#   │   ├── TimeMachine.jsx
#   │   ├── ChemistryAnalyzer.jsx
#   │   ├── ScriptWriter.jsx
#   │   ├── BoxOfficePredictor.jsx
#   │   ├── WatchPartyMatcher.jsx
#   │   ├── PersonalityAnalyzer.jsx
#   │   ├── EmotionRecommend.jsx
#   │   ├── WorldMap.jsx
#   │   └── ... (16 pages total)
#   │
#   ├── utils/               # Shared utilities
#   │   ├── aiService.js     # Gemini AI API + fallback system
#   │   ├── tmdb.js          # TMDB API config
#   │   └── recommendations.js
#   │
#   ├── data/                # Static movie data & poster maps
#   ├── context/             # React Context (ThemeContext)
#   ├── App.jsx              # Root component + all routes
#   └── index.css            # Global styles + Tailwind config


# ╔═══════════════════════════════════════════════════════════╗
# ║                   SUMMARY TABLE                           ║
# ╚═══════════════════════════════════════════════════════════╝
#
#   Category          | Technology         | Purpose
#   ──────────────────|────────────────────|─────────────────
#   Language          | JavaScript (ES6+)  | Core language
#   UI Framework      | React.js 18        | Component UI
#   Styling           | Tailwind CSS 3     | Utility CSS
#   Animations        | Framer Motion      | Smooth transitions
#   Routing           | React Router 6     | SPA navigation
#   Charts            | Recharts           | Data visualization
#   Maps              | Leaflet.js         | Interactive maps
#   Icons             | Lucide React       | Modern icons
#   Fonts             | Google Fonts       | Inter + Outfit
#   Movie Data API    | TMDB API v3        | All movie data
#   AI API            | Google Gemini      | Text generation
#   Voice             | Web Speech API     | STT + TTS
#   Camera            | MediaDevices API   | Emotion detection
#   Sound             | Web Audio API      | Tick effects
#   Storage           | localStorage       | Quiz scores
#   Build Tool        | Vite 5             | Dev server + build
#   Package Manager   | npm                | Dependencies
#
# ═══════════════════════════════════════════════════════════════
