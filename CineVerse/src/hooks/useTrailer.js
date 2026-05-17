/**
 * useTrailer.js — Custom React hook for fetching movie trailers
 * 
 * Uses hardcoded YouTube trailer keys for popular movies as primary source,
 * with TMDB API fallback for others.
 */

import { useState, useEffect } from 'react';
import posterMap from '../data/posterMap.json';

// TODO: Replace with your own valid TMDB API key from https://www.themoviedb.org/settings/api
const TMDB_API_KEY = '112cd202b9f95b77b3740d4dedc15942';
const TMDB_BASE = 'https://api.themoviedb.org/3';

// ─── Hardcoded YouTube trailer keys for popular movies ───────
// Maps local movie ID → YouTube video key
const TRAILER_MAP = {
  1: 'S014oGZiSdI',   // The Shining
  2: 'DzfpyUB60YY',   // Get Out
  3: 'WR7cc5t7tv8',   // A Quiet Place
  4: 'V6wWKNij_1M',   // Hereditary
  5: 'xKJmEC5ieOk',   // It
  6: 'd_v1ZpBMIQM',   // The Conjuring
  7: 'T5ke9IPTIJQ',   // Halloween
  8: 'NG3-GlvKPcg',   // Psycho
  9: 'YDGw1MTEe9k',   // The Exorcist
  11: 'BhIIPbO_6xg',  // Midsommar
  23: 'kgJMq-t5kn4',  // Stree
  24: 'sN75MPxgvX8',  // Tumbbad
  29: 'VG9AGf66tXM',  // The Sixth Sense
  37: 'jQ5lPt9edzQ',  // Alien
  51: 'xvszmNXdM4w',  // 3 Idiots
  53: 'yjv-JEBpOAo',  // Hera Pheri
  56: 'SOXaKP4a5gY',  // PK
  57: 'hv0LSkbyLEo',  // Some Like It Hot
  58: '1Fg5iWmQjwk',  // The Grand Budapest Hotel
  59: '4eaZ_48ZGок',  // Superbad
  61: 'tcdUhdOlz9M',  // The Hangover
  63: 'oDU84nmSDZY',  // Mean Girls
  67: 'GDQob4AOCsQ',  // Groundhog Day
  72: 'jEDaVHmw7r4',  // Home Alone
  78: 'jdFJF-OKSgc',  // Zindagi Na Milegi Dobara
  86: 'qGqiHJTsRkQ',  // Knives Out
  98: 'T7A810duHvw',  // About Time
  101: 'KxaY0MfEFKs', // DDLJ
  102: '5IB-2ym1y4w', // Kuch Kuch Hota Hai
  103: 'meQN-r0Z-4Y', // Jab We Met
  104: 'qMHfX_TZvig', // Notting Hill
  106: '_d3QL0pOJsQ', // Pretty Woman
  112: 'GfBMqJiKE2U', // La La Land
  114: 'H9Z3_ifFheQ', // Love Actually
  126: 'mPcw8T_97Ao', // Kal Ho Naa Ho
  154: 'EXeTwQWrcwY', // The Dark Knight
  155: 'hEJnMQG9ev8', // Mad Max: Fury Road
  156: 'C0BMx-qxsP4', // John Wick
  157: '2TQ-pOaeGnY', // Die Hard
  158: 'wb49-oV0F78', // Mission Impossible Fallout
  159: 'owK1qxDselE', // Gladiator
  160: 'eOrNdBpGMv8', // The Avengers
  161: 'giXco2jaZ_4', // Top Gun Maverick
  162: 'JfVOs4VSpmA', // Spider-Man No Way Home
  163: 'xjDjIWPwcPU', // Black Panther
  164: 'CRRlbK5w8AE', // Terminator 2
  165: 'm8e-FF8MsqU', // The Matrix
  166: 'TcMBFSGVi1c', // Avengers Endgame
  167: '8ugaeA-nMTc', // Iron Man
  168: 'YoHD9XEInc0', // Inception
  172: 'GY4BgdUSpbE', // Pathaan
  173: 'JKa05nyUmuQ', // KGF Chapter 1
  174: 'f_vbAtFSEc0', // RRR
  175: 'sOEg_YZQsTI', // Baahubali
  191: 'neY2xVmOfUM', // Batman Begins
  194: 'vHMV7mU5T4g', // Sholay
  198: 'x_7YlGv9u1g', // Dangal
  201: 'Ryx-k5s_VJI', // Indiana Jones Raiders
  202: 'V75dMMIW2B4', // LOTR Fellowship
  203: 'QWBKEmWWL68', // Jurassic Park
  204: 'naQr0uTrH_s', // Pirates of the Caribbean
  208: 'AcRsKmk6v28', // Life of Pi
  209: 'ej3ioOneTy8', // The Martian
  213: '5PSNL1qE6VY', // Avatar
  215: 'zSWdZVtXT7E', // Interstellar
  234: 'Nh7bTaABUgU', // Brahmastra
  251: 'v-PjgYDrg70', // Toy Story
  253: 'TbQm5doF_Uc', // Frozen
  254: 'ORFWdXl_zJ4', // Up
  256: '_MC3XuMvsDI', // Inside Out
  257: '16aGSx9gFO4', // Shrek
  265: '-FGhx5R5sBA', // Encanto
  301: '6hB3S9bIaco', // Shawshank Redemption
  302: 'sY1S34973zA', // The Godfather
  304: 'gG22XNhtnoY', // Schindler's List
  305: 's7EdQ4FqbhY', // Pulp Fiction
  308: 'bLvqoHBptjg', // Forrest Gump
  309: 'SUXWAEX2jlg', // Fight Club
  310: '2ilzidi_J8Q', // Goodfellas
  311: 'W6Mm8Sbe__o', // Silence of the Lambs
  313: 'Ki4haFrqSrw', // The Green Mile
  315: '7d_jQycdQGo', // Whiplash
  321: 'SEUXfv87Wpk', // Parasite
  325: 'o4gHDxXljSE', // The Prestige
  334: 'oIOfxlkkMJY', // Lagaan
  337: 'ERfyxJkev30', // Swades
  351: 'mP0VHJYFOAU', // Bohemian Rhapsody
  354: 'S5CjKEFb-sM', // The Imitation Game
  359: 'lB95KLmpLR4', // The Social Network
  369: 'x_7YlGv9u1g', // Dangal (biopic)
  371: 'Bv_BkNqwjAE', // Bhaag Milkha Bhaag
  373: 'Ry1xcg_hizs', // Sanju
  398: 'uYPbbksJxIg', // Oppenheimer
  401: 'ip0IIIRMKJA', // Drishyam
  402: '2iVYI5daPCU', // Andhadhun
  403: 'pu4t-d6MBVI', // Kahaani
  409: 'Wd8H5Lk3_8U', // Raazi
  413: 'Ym3lGV30AMs', // Gone Girl
  414: 'bLGJKT19EUc', // Prisoners
  416: 'VkVv0gkPVB4', // Sicario
  441: 'L6P3nI6VnlY', // Extraction
  443: 'DIGw3IuBhko', // Bullet Train
};

export default function useTrailer(movieId) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;

    // 1. Check hardcoded map first (instant, no API needed)
    const hardcoded = TRAILER_MAP[movieId];
    if (hardcoded) {
      setTrailerKey(hardcoded);
      setError(null);
      setIsLoading(false);
      return;
    }

    // 2. Fallback: try TMDB API
    const mapping = posterMap[String(movieId)];
    const tmdbId = mapping?.tmdb_id;

    if (!tmdbId) {
      setError('Trailer not available for this movie');
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setTrailerKey(null);

    async function fetchTrailer() {
      try {
        const res = await fetch(
          `${TMDB_BASE}/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
        );

        if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);

        const data = await res.json();
        const trailer = data.results?.find(
          (v) => v.type === 'Trailer' && v.site === 'YouTube'
        ) || data.results?.find(
          (v) => v.site === 'YouTube'
        );

        if (!cancelled) {
          if (trailer) {
            setTrailerKey(trailer.key);
          } else {
            setError('Trailer not available for this movie');
          }
        }
      } catch {
        if (!cancelled) {
          setError('Trailer not available for this movie');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchTrailer();
    return () => { cancelled = true; };
  }, [movieId]);

  return { trailerKey, isLoading, error };
}
