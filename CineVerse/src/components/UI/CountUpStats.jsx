import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useMotionValue, useTransform } from 'framer-motion';

function AnimatedNumber({ value, duration = 2, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      setTimeout(() => motionValue.set(value), delay * 1000);
    }
  }, [isInView, value, motionValue, delay]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return <span ref={ref}>{displayValue}</span>;
}

export default function CountUpStats({ stats }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative glass rounded-3xl p-8 md:p-10 overflow-hidden"
      >
        {/* Background Glow Effects */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-cinema-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cinema-purple/10 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cinema-accent/40 to-transparent" />

        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
              className="text-center group"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: i * 0.15 + 0.2, duration: 0.5, type: 'spring', bounce: 0.5 }}
                className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: `linear-gradient(135deg, ${stat.gradient[0]}33, ${stat.gradient[1]}33)` }}
              >
                {stat.icon}
              </motion.div>

              {/* Number */}
              <div className="relative mb-1">
                <p className="font-display text-4xl md:text-5xl font-bold" style={{
                  background: `linear-gradient(135deg, ${stat.gradient[0]}, ${stat.gradient[1]})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {stat.prefix || ''}
                  <AnimatedNumber value={stat.value} duration={2} delay={i * 0.2} />
                  {stat.suffix || ''}
                </p>
                {/* Glow behind number */}
                <div className="absolute inset-0 blur-2xl opacity-20 -z-10" style={{
                  background: `radial-gradient(circle, ${stat.gradient[0]}, transparent 70%)`,
                }} />
              </div>

              {/* Label */}
              <p className="text-cinema-muted text-sm font-medium tracking-wide">{stat.label}</p>

              {/* Progress bar */}
              <motion.div
                className="mt-3 mx-auto h-1 rounded-full overflow-hidden bg-white/5"
                style={{ width: '60%' }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: '100%' } : {}}
                  transition={{ delay: i * 0.15 + 0.5, duration: 1.5, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${stat.gradient[0]}, ${stat.gradient[1]})` }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
