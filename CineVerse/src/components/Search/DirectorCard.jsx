/**
 * DirectorCard.jsx — Director profile card shown above search results
 *
 * Displays: profile photo, name, total movies directed, known-for titles
 */

import { motion } from 'framer-motion';
import { Film, Award, User } from 'lucide-react';

export default function DirectorCard({ director }) {
  if (!director) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 md:p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 border border-cinema-accent/10"
    >
      {/* Profile Photo */}
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-cinema-surface border border-white/10">
        {director.photo ? (
          <img
            src={director.photo}
            alt={director.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User size={40} className="text-cinema-muted/30" />
          </div>
        )}
      </div>

      {/* Director Info */}
      <div className="flex-1 text-center sm:text-left">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
          {director.name}
        </h2>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-3">
          <div className="flex items-center gap-1.5 text-cinema-accent">
            <Film size={15} />
            <span className="text-sm font-semibold">
              {director.totalMovies} Movies Directed
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-cinema-gold">
            <Award size={15} />
            <span className="text-sm font-semibold">Director</span>
          </div>
        </div>

        {director.knownFor && director.knownFor.length > 0 && (
          <div>
            <p className="text-cinema-muted text-xs mb-1.5">Known For</p>
            <div className="flex flex-wrap gap-2">
              {director.knownFor.map((title, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-cinema-accent/10 text-cinema-accent text-xs font-medium border border-cinema-accent/20"
                >
                  {title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
