const fs = require('fs');
const csv = fs.readFileSync('C:/Users/aayus/AppData/Local/Packages/5319275A.WhatsAppDesktop_cv1g1gvanyjgm/LocalState/sessions/4AB4B3CE85EDEE6CD46769E10BCEBDB25CBB6B93/transfers/2026-20/movies_database.csv', 'utf8');
const lines = csv.replace(/\r/g, '').split('\n');
const movies = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Handle quoted fields
  const parts = [];
  let current = '';
  let inQuotes = false;
  for (let c = 0; c < line.length; c++) {
    if (line[c] === '"') { inQuotes = !inQuotes; }
    else if (line[c] === ',' && !inQuotes) { parts.push(current.trim()); current = ''; }
    else { current += line[c]; }
  }
  parts.push(current.trim());
  
  if (parts.length >= 7) {
    movies.push({
      id: i,
      title: parts[0],
      year: parseInt(parts[1]),
      genre: parts[2],
      director: parts[3],
      runtime: parseInt(parts[4]),
      cast: parts[5].split(',').map(s => s.trim()).filter(Boolean),
      industry: parts[6]
    });
  }
}

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/moviesData.json', JSON.stringify(movies));
console.log('Parsed ' + movies.length + ' movies');
console.log('Genres:', [...new Set(movies.map(m => m.genre))].join(', '));
