/**
 * WorldMap.jsx — Interactive Movie World Map using Leaflet
 * Click any country → see its top movies in a side panel.
 * Uses CartoDB Dark Matter tiles for dark theme.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, X, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCountryMovies from '../hooks/useCountryMovies';

// Leaflet CSS must be imported
import 'leaflet/dist/leaflet.css';

// Notable countries with coordinates for markers
const COUNTRIES = [
  { code: 'US', name: 'United States', lat: 39.8, lng: -98.5 },
  { code: 'IN', name: 'India', lat: 20.5, lng: 78.9 },
  { code: 'GB', name: 'United Kingdom', lat: 55.3, lng: -3.4 },
  { code: 'FR', name: 'France', lat: 46.2, lng: 2.2 },
  { code: 'JP', name: 'Japan', lat: 36.2, lng: 138.2 },
  { code: 'KR', name: 'South Korea', lat: 35.9, lng: 127.7 },
  { code: 'DE', name: 'Germany', lat: 51.1, lng: 10.4 },
  { code: 'IT', name: 'Italy', lat: 41.8, lng: 12.5 },
  { code: 'ES', name: 'Spain', lat: 40.4, lng: -3.7 },
  { code: 'BR', name: 'Brazil', lat: -14.2, lng: -51.9 },
  { code: 'AU', name: 'Australia', lat: -25.2, lng: 133.7 },
  { code: 'CN', name: 'China', lat: 35.8, lng: 104.1 },
  { code: 'MX', name: 'Mexico', lat: 23.6, lng: -102.5 },
  { code: 'NG', name: 'Nigeria', lat: 9.0, lng: 8.6 },
  { code: 'SE', name: 'Sweden', lat: 60.1, lng: 18.6 },
  { code: 'DK', name: 'Denmark', lat: 56.2, lng: 9.5 },
  { code: 'RU', name: 'Russia', lat: 61.5, lng: 105.3 },
  { code: 'CA', name: 'Canada', lat: 56.1, lng: -106.3 },
  { code: 'AR', name: 'Argentina', lat: -38.4, lng: -63.6 },
  { code: 'TH', name: 'Thailand', lat: 15.8, lng: 100.9 },
];

export default function WorldMap() {
  const { movies, loading, country, fetchCountry } = useCountryMovies();
  const [MapComponent, setMapComponent] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Dynamically import react-leaflet (avoids SSR issues)
  useEffect(() => {
    import('react-leaflet').then((mod) => {
      setMapComponent(() => mod);
    });
  }, []);

  const handleCountryClick = (c) => {
    fetchCountry(c.code, c.name);
    setPanelOpen(true);
  };

  const filteredCountries = search.trim()
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Header overlay */}
      <div className="absolute top-20 left-4 right-4 z-[1000] flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
          <Globe size={24} className="text-cinema-accent" />
          Movie <span className="gradient-text">World Map</span>
        </h1>
        <div className="relative flex-1 max-w-xs">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search country..."
            className="w-full bg-cinema-dark/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-cinema-muted focus:outline-none focus:border-cinema-accent/50" />
          {filteredCountries.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-cinema-dark/95 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden max-h-48 overflow-y-auto z-50">
              {filteredCountries.map(c => (
                <button key={c.code} onClick={() => { handleCountryClick(c); setSearch(''); }}
                  className="w-full px-4 py-2 text-left text-sm text-cinema-text hover:bg-white/5 transition flex items-center gap-2"
                >
                  <MapPin size={12} className="text-cinema-accent" /> {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="w-full h-[calc(100vh-5rem)]">
        {MapComponent ? (
          <MapComponent.MapContainer
            center={[20, 0]} zoom={2} minZoom={2} maxZoom={6}
            style={{ width: '100%', height: '100%', background: '#0a0a0a' }}
            zoomControl={false}
          >
            <MapComponent.TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; CartoDB'
            />
            {COUNTRIES.map(c => (
              <MapComponent.CircleMarker
                key={c.code}
                center={[c.lat, c.lng]}
                radius={8}
                pathOptions={{
                  color: country?.code === c.code ? '#e50914' : '#6366f1',
                  fillColor: country?.code === c.code ? '#e50914' : '#6366f1',
                  fillOpacity: 0.7,
                  weight: 2,
                }}
                eventHandlers={{ click: () => handleCountryClick(c) }}
              >
                <MapComponent.Tooltip direction="top" offset={[0, -10]} className="custom-tooltip">
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{c.name}</span>
                </MapComponent.Tooltip>
              </MapComponent.CircleMarker>
            ))}
          </MapComponent.MapContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-cinema-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {panelOpen && country && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 w-full sm:w-96 h-full z-[1001] bg-cinema-dark/95 backdrop-blur-xl border-l border-white/10 overflow-y-auto"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">{country.name}</h2>
                  <p className="text-cinema-muted text-xs">Top movies from this country</p>
                </div>
                <button onClick={() => setPanelOpen(false)} className="text-cinema-muted hover:text-white"><X size={20} /></button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-16 h-24 bg-cinema-surface rounded-lg" />
                      <div className="flex-1 space-y-2"><div className="h-3 bg-cinema-surface rounded w-3/4" /><div className="h-2 bg-cinema-surface rounded w-1/2" /></div>
                    </div>
                  ))}
                </div>
              ) : movies.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-cinema-muted text-sm">No movies found for this country</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {movies.map((m, i) => (
                    <motion.div key={m.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      onClick={() => navigate(`/movie/${m.id}`)}
                      className="flex gap-3 p-2 rounded-xl cursor-pointer hover:bg-white/5 transition group"
                    >
                      <div className="w-14 h-20 rounded-lg overflow-hidden bg-cinema-surface flex-shrink-0">
                        {m.poster ? <img src={m.poster} alt="" className="w-full h-full object-cover" loading="lazy" /> :
                          <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate group-hover:text-cinema-accent transition-colors">{m.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-cinema-muted text-[10px]">{m.year}</span>
                          {m.rating && <span className="flex items-center gap-0.5 text-cinema-gold text-[10px]">
                            <Star size={8} className="fill-cinema-gold" /> {m.rating}
                          </span>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
