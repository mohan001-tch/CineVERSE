import { Film, ExternalLink, Globe, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-20">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cinema-accent/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cinema-accent to-cinema-purple flex items-center justify-center">
                <Film size={18} className="text-white" />
              </div>
              <span className="font-display text-xl font-bold gradient-text">CineVerse</span>
            </div>
            <p className="text-cinema-muted text-sm leading-relaxed max-w-md">
              Discover movies through emotion, mood, and intelligent personalization. 
              Your personal AI-powered cinematic universe.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Explore</h4>
            <div className="flex flex-col gap-2">
              {['Discover', 'Swipe', 'Universe', 'Timeline'].map(link => (
                <Link key={link} to={`/${link.toLowerCase()}`} className="text-cinema-muted text-sm hover:text-cinema-accent transition">{link}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Features</h4>
            <div className="flex flex-col gap-2">
              {['AI Assistant', 'Mood Discovery', 'Hidden Gems', 'Smart Search'].map(f => (
                <span key={f} className="text-cinema-muted text-sm">{f}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cinema-muted text-xs flex items-center gap-1">
            Made with <Heart size={12} className="text-cinema-red fill-cinema-red" /> by CineVerse Team © 2026
          </p>
          <div className="flex gap-4">
            <ExternalLink size={16} className="text-cinema-muted hover:text-white cursor-pointer transition" />
            <Globe size={16} className="text-cinema-muted hover:text-white cursor-pointer transition" />
          </div>
        </div>
      </div>
    </footer>
  );
}
