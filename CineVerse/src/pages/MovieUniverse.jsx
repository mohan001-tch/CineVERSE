import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { movies, genres, genreGradients } from '../data/movies';
import { useNavigate } from 'react-router-dom';

export default function MovieUniverse() {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [zoom, setZoom] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const genreNodes = genres.map((genre, i) => {
      const angle = (i / genres.length) * Math.PI * 2;
      const radius = 250;
      return {
        id: `genre-${genre}`, label: genre,
        x: 400 + Math.cos(angle) * radius, y: 350 + Math.sin(angle) * radius,
        color: genreGradients[genre]?.[0] || '#00d4ff',
        movies: movies.filter(m => m.genre === genre),
      };
    });
    setNodes(genreNodes);
  }, []);

  const genreMovies = selectedGenre ? movies.filter(m => m.genre === selectedGenre) : [];

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
            <Layers size={14} className="text-cinema-accent" />
            <span className="text-xs text-cinema-muted">Interactive Exploration</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-2">Movie Universe</h1>
          <p className="text-cinema-muted">Explore connections between genres and films</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative glass rounded-3xl overflow-hidden mb-8" style={{ height: '600px' }}>
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white hover:bg-white/10"><ZoomIn size={16} /></button>
            <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white hover:bg-white/10"><ZoomOut size={16} /></button>
            <button onClick={() => setZoom(1)} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white hover:bg-white/10"><Maximize2 size={16} /></button>
          </div>

          <div className="w-full h-full" style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s' }}>
            <svg width="100%" height="100%" viewBox="0 0 800 700">
              <circle cx="400" cy="350" r="45" fill="url(#cg)" opacity="0.9" />
              <text x="400" y="345" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">CINE</text>
              <text x="400" y="360" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">VERSE</text>

              {nodes.map(n => (
                <line key={`l-${n.id}`} x1="400" y1="350" x2={n.x} y2={n.y}
                  stroke={selectedGenre === n.label ? n.color : 'rgba(255,255,255,0.06)'} strokeWidth={selectedGenre === n.label ? 2 : 1} strokeDasharray={selectedGenre === n.label ? '' : '4,4'} />
              ))}

              {nodes.map(n => (
                <g key={n.id} className="cursor-pointer" onClick={() => setSelectedGenre(selectedGenre === n.label ? null : n.label)}
                  onMouseEnter={() => setHoveredNode(n.id)} onMouseLeave={() => setHoveredNode(null)}>
                  <circle cx={n.x} cy={n.y} r={selectedGenre === n.label ? 35 : hoveredNode === n.id ? 30 : 25}
                    fill={n.color} opacity={selectedGenre && selectedGenre !== n.label ? 0.3 : 0.8} style={{ transition: 'all 0.3s' }} />
                  <text x={n.x} y={n.y + 1} textAnchor="middle" fill="white" fontSize="9" fontWeight="600" dominantBaseline="middle">{n.label}</text>
                  <text x={n.x} y={n.y + 14} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">{n.movies.length}</text>
                </g>
              ))}

              <defs><radialGradient id="cg"><stop offset="0%" stopColor="#00d4ff" /><stop offset="100%" stopColor="#a855f7" /></radialGradient></defs>
            </svg>
          </div>
        </motion.div>

        {selectedGenre && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="font-display text-xl font-bold text-white mb-4">{selectedGenre} ({genreMovies.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {genreMovies.slice(0, 12).map((m, i) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/movie/${m.id}`)} className="glass rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-white/5 card-hover">
                  <div className="w-12 h-16 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl" style={{ background: `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[1]})` }}>{m.emoji}</div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{m.title}</p>
                    <p className="text-cinema-muted text-xs">{m.year} • {m.runtime}m • ⭐{m.rating}</p>
                    <p className="text-cinema-muted text-[10px] truncate">{m.director}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
