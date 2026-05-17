import { movies, getSimilarMovies, getMoviesByMood, getMoviesByGenre } from '../data/movies';

const aiResponses = {
  greeting: [
    "Hey there! 🎬 I'm CineVerse AI. What kind of movie experience are you looking for tonight?",
    "Welcome to CineVerse! Tell me your mood and I'll find the perfect film for you.",
    "Hi! Ready to discover your next favorite movie? Tell me what you're feeling!"
  ],
  moods: {
    happy: "Sounds like you need something uplifting! Here are some feel-good picks that'll keep that smile going:",
    sad: "I've got the perfect comfort watches for you. These films will either let you feel the feels or lift you right up:",
    excited: "Let's channel that energy! These high-octane picks will match your vibe perfectly:",
    bored: "Time to shake things up! Here are some unexpected gems that'll pull you right in:",
    romantic: "Love is in the air! These picks will give you all the butterflies:",
    scared: "Ready for some thrills? These will keep you on the edge of your seat:",
    thoughtful: "In a contemplative mood? These films will give your mind a workout:"
  }
};

export function getAIGreeting() {
  return aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)];
}

export function processUserMessage(message) {
  const msg = message.toLowerCase();

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return { text: getAIGreeting(), movies: [] };
  }

  if (msg.includes('similar to') || msg.includes('like ')) {
    const titlePart = msg.replace(/.*(?:similar to|like)\s+/i, '').trim();
    const found = movies.find(m => m.title.toLowerCase().includes(titlePart));
    if (found) {
      const similar = getSimilarMovies(found, 4);
      return {
        text: `Since you enjoyed "${found.title}", you'll love these! They share similar ${found.genre} vibes and storytelling style:`,
        movies: similar
      };
    }
    return { text: "I couldn't find that movie in my database. Could you try another title?", movies: [] };
  }

  const moodKeywords = {
    happy: ['happy', 'cheerful', 'fun', 'laugh', 'funny', 'comedy', 'feel good', 'uplifting'],
    sad: ['sad', 'cry', 'emotional', 'moving', 'deep', 'touching'],
    excited: ['excited', 'action', 'thrilling', 'intense', 'adrenaline', 'fast'],
    bored: ['bored', 'something different', 'surprise', 'unique', 'new'],
    romantic: ['romantic', 'love', 'date', 'couple', 'romance', 'date night'],
    scared: ['scary', 'horror', 'creepy', 'frightening', 'spooky', 'terrifying'],
    thoughtful: ['think', 'mind', 'philosophical', 'cerebral', 'intelligent', 'smart', 'mind-bending']
  };

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some(k => msg.includes(k))) {
      const moodMap = {
        happy: 'Funny', sad: 'Emotional', excited: 'Intense',
        bored: 'Mind-bending', romantic: 'Romantic', scared: 'Horror', thoughtful: 'Mind-bending'
      };
      const recs = getMoviesByMood(moodMap[mood]).sort(() => Math.random() - 0.5).slice(0, 4);
      return { text: aiResponses.moods[mood], movies: recs };
    }
  }

  const genreMatch = ['Horror', 'Comedy', 'Action', 'Drama', 'Thriller', 'Adventure', 'RomCom', 'Sci-Fi', 'Biopic', 'Kids', 'Western', 'Crime', 'War', 'Mystery'].find(g => msg.includes(g.toLowerCase()));
  if (genreMatch) {
    const recs = getMoviesByGenre(genreMatch).sort(() => Math.random() - 0.5).slice(0, 4);
    return { text: `Great choice! Here are some amazing ${genreMatch} films I'd recommend:`, movies: recs };
  }

  if (msg.includes('short') || msg.includes('quick') || msg.includes('90')) {
    const recs = movies.filter(m => m.runtime <= 95).sort(() => Math.random() - 0.5).slice(0, 4);
    return { text: "Short on time? These quick watches pack a punch under 90 minutes:", movies: recs };
  }

  if (msg.includes('bollywood') || msg.includes('indian') || msg.includes('hindi')) {
    const recs = movies.filter(m => m.industry === 'Bollywood').sort(() => Math.random() - 0.5).slice(0, 4);
    return { text: "Here are some fantastic Bollywood picks for you:", movies: recs };
  }

  if (msg.includes('old') || msg.includes('classic') || msg.includes('retro')) {
    const recs = movies.filter(m => m.year < 1990).sort(() => Math.random() - 0.5).slice(0, 4);
    return { text: "Let's take a trip down memory lane with these timeless classics:", movies: recs };
  }

  const randomRecs = [...movies].sort(() => Math.random() - 0.5).slice(0, 4);
  return {
    text: "Here are some picks I think you might enjoy based on what's trending! Try telling me your mood, a genre, or a movie you liked for better recommendations:",
    movies: randomRecs
  };
}
