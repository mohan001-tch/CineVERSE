import rawMovies from './moviesData.json';
import posterMap from './posterMap.json';

const TMDB_IMG = 'https://image.tmdb.org/t/p';

const moodGenreMap = {
  'Funny': ['Comedy', 'RomCom', 'Kids'],
  'Emotional': ['Drama', 'Romance', 'Biopic'],
  'Horror': ['Horror'],
  'Romantic': ['RomCom', 'Romance'],
  'Intense': ['Action', 'Action Thriller', 'Thriller', 'Crime', 'War'],
  'Mind-bending': ['Sci-Fi', 'Mystery', 'Thriller'],
  'Cozy': ['Kids', 'Comedy', 'RomCom', 'Adventure'],
  'Inspirational': ['Biopic', 'Drama', 'Adventure'],
};

const genreGradients = {
  'Horror': ['#dc2626', '#7f1d1d'],
  'Comedy': ['#f59e0b', '#ea580c'],
  'RomCom': ['#ec4899', '#f43f5e'],
  'Action': ['#3b82f6', '#1d4ed8'],
  'Adventure': ['#10b981', '#059669'],
  'Kids': ['#a78bfa', '#7c3aed'],
  'Drama': ['#6366f1', '#4338ca'],
  'Western': ['#d97706', '#92400e'],
  'Crime': ['#64748b', '#334155'],
  'Thriller': ['#0ea5e9', '#0369a1'],
  'War': ['#78716c', '#44403c'],
  'Mystery': ['#8b5cf6', '#6d28d9'],
  'Romance': ['#f472b6', '#db2777'],
  'Sci-Fi': ['#00d4ff', '#0284c7'],
  'Biopic': ['#fbbf24', '#d97706'],
  'Action Thriller': ['#06b6d4', '#0e7490'],
};

const genreEmojis = {
  'Horror': '👻', 'Comedy': '😂', 'RomCom': '💕', 'Action': '💥',
  'Adventure': '🗺️', 'Kids': '🧸', 'Drama': '🎭', 'Western': '🤠',
  'Crime': '🔫', 'Thriller': '😰', 'War': '⚔️', 'Mystery': '🔍',
  'Romance': '❤️', 'Sci-Fi': '🚀', 'Biopic': '📽️', 'Action Thriller': '🔥',
};

function enrichMovie(movie) {
  const moods = [];
  for (const [mood, genres] of Object.entries(moodGenreMap)) {
    if (genres.includes(movie.genre)) moods.push(mood);
  }

  const decade = Math.floor(movie.year / 10) * 10 + 's';
  const runtimeCategory = movie.runtime <= 90 ? 'Quick' : movie.runtime <= 120 ? 'Standard' : 'Epic';
  
  const isOld = movie.year < 2000;
  const isNiche = ['Western', 'War', 'Mystery', 'Sci-Fi'].includes(movie.genre);
  const hiddenGemScore = (isOld ? 30 : 0) + (isNiche ? 30 : 0) + (movie.industry === 'Bollywood' ? 20 : 0) + Math.floor(Math.random() * 20);

  const rating = (6.5 + Math.random() * 2.5).toFixed(1);
  const gradient = genreGradients[movie.genre] || ['#00d4ff', '#a855f7'];
  const emoji = genreEmojis[movie.genre] || '🎬';

  const poster = posterMap[movie.id];
  const poster_url = poster?.poster_path ? `${TMDB_IMG}/w500${poster.poster_path}` : null;
  const backdrop_url = poster?.backdrop_path ? `${TMDB_IMG}/w1280${poster.backdrop_path}` : null;

  return {
    ...movie,
    moods,
    decade,
    runtimeCategory,
    hiddenGemScore,
    rating: parseFloat(rating),
    gradient,
    emoji,
    poster_url,
    backdrop_url,
    slug: movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  };
}

export const movies = rawMovies.map(enrichMovie);

export const genres = [...new Set(movies.map(m => m.genre))];
export const decades = [...new Set(movies.map(m => m.decade))].sort();
export const directors = [...new Set(movies.map(m => m.director))];
export const industries = [...new Set(movies.map(m => m.industry))];

export function getMovieById(id) {
  return movies.find(m => m.id === parseInt(id));
}

export function getMoviesByGenre(genre) {
  return movies.filter(m => m.genre === genre);
}

export function getMoviesByMood(mood) {
  return movies.filter(m => m.moods.includes(mood));
}

export function getMoviesByDecade(decade) {
  return movies.filter(m => m.decade === decade);
}

export function getSimilarMovies(movie, limit = 8) {
  return movies
    .filter(m => m.id !== movie.id)
    .map(m => ({
      ...m,
      similarity:
        (m.genre === movie.genre ? 40 : 0) +
        (m.director === movie.director ? 30 : 0) +
        (m.industry === movie.industry ? 10 : 0) +
        (Math.abs(m.year - movie.year) < 10 ? 15 : 0) +
        (m.moods.some(mood => movie.moods.includes(mood)) ? 5 : 0)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

export function getHiddenGems(limit = 12) {
  return [...movies].sort((a, b) => b.hiddenGemScore - a.hiddenGemScore).slice(0, limit);
}

export function getTrending(limit = 15) {
  return [...movies].filter(m => m.year >= 2015).sort(() => Math.random() - 0.5).slice(0, limit);
}

export function searchMovies(query) {
  const q = query.toLowerCase();
  return movies.filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.director.toLowerCase().includes(q) ||
    m.genre.toLowerCase().includes(q) ||
    m.cast.some(c => c.toLowerCase().includes(q))
  );
}

export function getSmartCollections() {
  return [
    { id: 'rainy', title: 'Rainy Night Movies', emoji: '🌧️', desc: 'Moody, atmospheric films for stormy nights', gradient: ['#1e3a5f', '#0d1b2a'], movies: movies.filter(m => ['Horror', 'Mystery', 'Thriller', 'Drama'].includes(m.genre)).slice(0, 12) },
    { id: 'feelgood', title: 'Feel Good After Work', emoji: '😊', desc: 'Light-hearted picks to lift your mood', gradient: ['#f59e0b', '#ea580c'], movies: movies.filter(m => ['Comedy', 'RomCom', 'Kids'].includes(m.genre) && m.runtime <= 130).slice(0, 12) },
    { id: 'mindbending', title: 'Mind-Bending Sci-Fi', emoji: '🧠', desc: 'Cerebral films that challenge reality', gradient: ['#7c3aed', '#4338ca'], movies: movies.filter(m => ['Sci-Fi', 'Mystery', 'Thriller'].includes(m.genre)).slice(0, 12) },
    { id: 'quick', title: 'Quick 90-Min Thrillers', emoji: '⚡', desc: 'Fast-paced action under 90 minutes', gradient: ['#dc2626', '#991b1b'], movies: movies.filter(m => m.runtime <= 95 && ['Action', 'Action Thriller', 'Thriller'].includes(m.genre)).slice(0, 12) },
    { id: 'weekend', title: 'Weekend Epic Marathon', emoji: '🌙', desc: 'Grand stories worth your weekend', gradient: ['#059669', '#064e3b'], movies: movies.filter(m => m.runtime >= 150).slice(0, 12) },
    { id: 'datenight', title: 'Date Night Picks', emoji: '❤️', desc: 'Romance and chemistry guaranteed', gradient: ['#ec4899', '#be185d'], movies: movies.filter(m => ['RomCom', 'Romance'].includes(m.genre)).slice(0, 12) },
    { id: 'bollywood', title: 'Bollywood Gems', emoji: '🇮🇳', desc: 'Best of Indian cinema', gradient: ['#f97316', '#c2410c'], movies: movies.filter(m => m.industry === 'Bollywood').sort((a,b) => b.rating - a.rating).slice(0, 12) },
    { id: 'classics', title: 'Timeless Classics', emoji: '🏛️', desc: 'Films that defined cinema', gradient: ['#6366f1', '#312e81'], movies: movies.filter(m => m.year < 1990).sort((a,b) => b.rating - a.rating).slice(0, 12) },
  ];
}

export { genreGradients, genreEmojis, moodGenreMap };
