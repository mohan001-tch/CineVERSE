import { motion } from 'framer-motion';

export default function GlowButton({ children, onClick, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-cinema-accent to-cinema-purple text-white shadow-neon',
    secondary: 'glass border border-cinema-accent/30 text-cinema-accent hover:bg-cinema-accent/10',
    danger: 'bg-gradient-to-r from-cinema-red to-cinema-pink text-white shadow-neon-pink',
    ghost: 'bg-transparent text-cinema-text hover:bg-white/5',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`magnetic-btn px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
