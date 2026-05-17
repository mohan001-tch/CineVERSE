import { motion } from 'framer-motion';

const moodStyles = {
  'Funny': { gradient: 'from-yellow-400 to-orange-500', icon: '😂' },
  'Emotional': { gradient: 'from-blue-400 to-indigo-600', icon: '🥺' },
  'Horror': { gradient: 'from-red-600 to-red-900', icon: '👻' },
  'Romantic': { gradient: 'from-pink-400 to-rose-600', icon: '💕' },
  'Intense': { gradient: 'from-orange-500 to-red-600', icon: '💥' },
  'Mind-bending': { gradient: 'from-purple-500 to-indigo-700', icon: '🧠' },
  'Cozy': { gradient: 'from-amber-400 to-orange-400', icon: '☕' },
  'Inspirational': { gradient: 'from-emerald-400 to-teal-600', icon: '✨' },
};

export default function MoodChip({ mood, selected, onClick }) {
  const style = moodStyles[mood] || { gradient: 'from-gray-400 to-gray-600', icon: '🎬' };

  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(mood)}
      className={`
        relative px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2
        ${selected
          ? `bg-gradient-to-r ${style.gradient} text-white shadow-lg shadow-white/10`
          : 'glass text-cinema-text hover:bg-white/10 border border-white/10'
        }
      `}
    >
      <span className="text-lg">{style.icon}</span>
      <span>{mood}</span>
      {selected && (
        <motion.div
          layoutId="mood-glow"
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${style.gradient} opacity-20 blur-xl -z-10`}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        />
      )}
    </motion.button>
  );
}
