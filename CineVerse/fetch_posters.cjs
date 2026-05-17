const fs = require('fs');
const https = require('https');

const API_KEY = '112cd202b9f95b77b3740d4dedc15942';
const movies = JSON.parse(fs.readFileSync('src/data/moviesData.json', 'utf8'));

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function fetchPoster(movie) {
  const query = encodeURIComponent(movie.title);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&year=${movie.year}`;
  try {
    const data = await fetchJSON(url);
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        id: movie.id,
        poster_path: result.poster_path,
        backdrop_path: result.backdrop_path,
        tmdb_id: result.id,
      };
    }
    // Try without year
    const url2 = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;
    const data2 = await fetchJSON(url2);
    if (data2.results && data2.results.length > 0) {
      return {
        id: movie.id,
        poster_path: data2.results[0].poster_path,
        backdrop_path: data2.results[0].backdrop_path,
        tmdb_id: data2.results[0].id,
      };
    }
    return { id: movie.id, poster_path: null, backdrop_path: null, tmdb_id: null };
  } catch(e) {
    console.error(`Error fetching ${movie.title}:`, e.message);
    return { id: movie.id, poster_path: null, backdrop_path: null, tmdb_id: null };
  }
}

async function main() {
  console.log(`Fetching posters for ${movies.length} movies...`);
  const posterMap = {};
  const batchSize = 5;
  
  for (let i = 0; i < movies.length; i += batchSize) {
    const batch = movies.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(fetchPoster));
    results.forEach(r => { posterMap[r.id] = r; });
    
    const found = Object.values(posterMap).filter(p => p.poster_path).length;
    process.stdout.write(`\r  ${i + batch.length}/${movies.length} processed (${found} posters found)`);
    
    // Rate limit: TMDB allows ~40 requests per 10 seconds
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log('\nSaving poster data...');
  fs.writeFileSync('src/data/posterMap.json', JSON.stringify(posterMap));
  
  const total = Object.values(posterMap).filter(p => p.poster_path).length;
  console.log(`Done! ${total}/${movies.length} posters found.`);
}

main();
