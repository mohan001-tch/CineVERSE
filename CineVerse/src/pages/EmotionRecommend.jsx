/**
 * EmotionRecommend.jsx — Emotion-Based Movie Recommendation Page
 * Webcam permission modal → detect mood → show genre-matched movies.
 */
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Star, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useEmotionDetect from '../hooks/useEmotionDetect';

export default function EmotionRecommend() {
  const { emotion, movies, loading, detecting, detectEmotion, setManualEmotion, EMOTION_GENRES } = useEmotionDetect();
  const [showPermission, setShowPermission] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
      setShowPermission(false);
    } catch {
      setShowPermission(false);
      alert('Camera access denied. You can manually select your mood below.');
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setCameraActive(false);
  };

  const handleDetect = () => {
    detectEmotion(videoRef);
    setTimeout(stopCamera, 2500);
  };

  useEffect(() => () => stopCamera(), []);

  const emotionConfig = emotion ? EMOTION_GENRES[emotion] : null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            <Smile className="inline mr-2 text-cinema-accent" size={36} />
            Mood <span className="gradient-text">Movies</span>
          </h1>
          <p className="text-cinema-muted">Let your mood choose your next movie</p>
        </motion.div>

        {/* Camera / Detection Area */}
        <div className="max-w-md mx-auto mb-8">
          {!cameraActive && !emotion && (
            <div className="glass rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-5xl mb-4">📸</div>
              <h3 className="text-white font-bold mb-2">Detect My Mood</h3>
              <p className="text-cinema-muted text-sm mb-4">Use your camera to detect your emotion, or choose manually below</p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowPermission(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white font-bold shadow-neon flex items-center gap-2 mx-auto"
              >
                <Camera size={18} /> Use Camera
              </motion.button>
            </div>
          )}

          {cameraActive && (
            <div className="glass rounded-2xl p-4 border border-white/10 text-center">
              <div className="rounded-xl overflow-hidden mb-4 relative">
                <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-xl transform scale-x-[-1]" />
                {detecting && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-3 border-cinema-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-white text-sm">Analyzing expression...</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 justify-center">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleDetect} disabled={detecting}
                  className="px-6 py-2.5 rounded-xl bg-cinema-accent text-white font-bold text-sm disabled:opacity-50"
                >
                  📸 Detect Emotion
                </motion.button>
                <button onClick={stopCamera} className="px-4 py-2.5 rounded-xl glass text-cinema-muted text-sm border border-white/10">
                  <CameraOff size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Manual mood selection */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {Object.entries(EMOTION_GENRES).map(([key, val]) => (
            <motion.button key={key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { stopCamera(); setManualEmotion(key); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                emotion === key ? 'bg-cinema-accent text-white shadow-neon' : 'glass text-cinema-muted border border-white/5 hover:text-white'
              }`}
            >
              {val.label}
            </motion.button>
          ))}
        </div>

        {/* Detected emotion banner */}
        {emotionConfig && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4 text-center mb-8 border border-cinema-accent/10"
          >
            <p className="text-3xl mb-1">{emotionConfig.label.split(' ')[0]}</p>
            <p className="text-white font-bold">{emotionConfig.label.split(' ').slice(1).join(' ')} Detected!</p>
            <p className="text-cinema-muted text-sm">{emotionConfig.desc}</p>
          </motion.div>
        )}

        {/* Movie results */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse"><div className="aspect-[2/3] bg-cinema-surface rounded-xl" /><div className="h-3 bg-cinema-surface rounded mt-2 w-3/4" /></div>
            ))}
          </div>
        ) : movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {movies.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/movie/${m.id}`)}
                className="cursor-pointer group rounded-xl overflow-hidden bg-cinema-card border border-white/5 hover:border-cinema-accent/20 transition-all"
              >
                <div className="aspect-[2/3] bg-cinema-surface relative">
                  {m.poster ? <img src={m.poster} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" /> :
                    <div className="w-full h-full flex items-center justify-center text-3xl">🎬</div>}
                  {m.rating && (<div className="absolute top-2 right-2 glass px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <Star size={8} className="text-cinema-gold fill-cinema-gold" /><span className="text-[9px] font-bold text-cinema-gold">{m.rating}</span></div>)}
                </div>
                <div className="p-2"><p className="text-white text-xs font-semibold truncate">{m.title}</p><p className="text-cinema-muted text-[10px]">{m.year}</p></div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Camera permission modal */}
        <AnimatePresence>
          {showPermission && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setShowPermission(false)}
            >
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                onClick={e => e.stopPropagation()}
                className="glass-strong rounded-2xl p-6 max-w-sm w-full text-center border border-white/10"
              >
                <div className="text-5xl mb-3">📷</div>
                <h3 className="text-white font-bold text-lg mb-2">Camera Permission</h3>
                <p className="text-cinema-muted text-sm mb-4">We'll use your camera briefly to detect your facial expression. No images are stored or sent anywhere.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowPermission(false)} className="flex-1 py-2.5 rounded-xl glass text-cinema-muted border border-white/10">Cancel</button>
                  <motion.button whileHover={{ scale: 1.03 }} onClick={startCamera}
                    className="flex-1 py-2.5 rounded-xl bg-cinema-accent text-white font-bold">Allow Camera</motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
