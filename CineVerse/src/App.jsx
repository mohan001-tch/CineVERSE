import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ChatBot from './components/AI/ChatBot';
import ParticleBackground from './components/UI/ParticleBackground';
import Home from './pages/Home';
import Discover from './pages/Discover';
import SwipeDiscovery from './pages/SwipeDiscovery';
import MovieUniverse from './pages/MovieUniverse';
import Timeline from './pages/Timeline';
import MovieDetail from './pages/MovieDetail';
import SubscribePage from './pages/SubscribePage';
import SearchPage from './pages/SearchPage';
// ─── Advanced Features ───────────────────────────────────
import TimeMachine from './pages/TimeMachine';
import MovieQuiz from './pages/MovieQuiz';
import ScriptWriter from './pages/ScriptWriter';
import BoxOfficePredictor from './pages/BoxOfficePredictor';
import ChemistryAnalyzer from './pages/ChemistryAnalyzer';
import WatchPartyMatcher from './pages/WatchPartyMatcher';
import PersonalityAnalyzer from './pages/PersonalityAnalyzer';
import EmotionRecommend from './pages/EmotionRecommend';
import WorldMap from './pages/WorldMap';

export default function App() {
  return (
    <div className="min-h-screen bg-cinema-dark text-cinema-text cinema-gradient-bg">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/swipe" element={<SwipeDiscovery />} />
            <Route path="/universe" element={<MovieUniverse />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/subscribe" element={<SubscribePage />} />
            <Route path="/search" element={<SearchPage />} />
            {/* Advanced Features */}
            <Route path="/timemachine" element={<TimeMachine />} />
            <Route path="/quiz" element={<MovieQuiz />} />
            <Route path="/script" element={<ScriptWriter />} />
            <Route path="/predictor" element={<BoxOfficePredictor />} />
            <Route path="/chemistry" element={<ChemistryAnalyzer />} />
            <Route path="/watchparty" element={<WatchPartyMatcher />} />
            <Route path="/personality" element={<PersonalityAnalyzer />} />
            <Route path="/mood" element={<EmotionRecommend />} />
            <Route path="/map" element={<WorldMap />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}
