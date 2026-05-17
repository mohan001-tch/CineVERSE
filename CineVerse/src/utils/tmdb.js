/** Shared TMDB API config */
export const TMDB_KEY = '112cd202b9f95b77b3740d4dedc15942';
export const TMDB_BASE = 'https://api.themoviedb.org/3';
export const IMG = 'https://image.tmdb.org/t/p';

export async function tmdbFetch(path) {
  const sep = path.includes('?') ? '&' : '?';
  const res = await fetch(`${TMDB_BASE}${path}${sep}api_key=${TMDB_KEY}&language=en-US`);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}
