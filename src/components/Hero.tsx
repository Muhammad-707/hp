import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Confetti } from './Confetti';

export function AgeCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 48;
    const duration = 2000; // 2 seconds
    const incrementTime = duration / end;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="inline-block tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-700 dark:from-rose-400 dark:to-rose-600 drop-shadow-sm font-black">
      {count}
    </span>
  );
}

export function Hero() {
  const { t } = useLanguage();
  const controls = useAnimation();

  useEffect(() => {
    controls.start(i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 0.8, ease: "easeOut" }
    }));
  }, [controls]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <Confetti />
      
      {/* Background glowing effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-400/20 dark:bg-rose-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/20 dark:bg-rose-800/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-rose-500 blur-2xl opacity-20 rounded-full" />
          <div className="relative bg-white/40 dark:bg-black/40 backdrop-blur-md border border-rose-200 dark:border-rose-900 rounded-3xl px-8 py-4 shadow-xl">
            <h2 className="text-4xl md:text-6xl font-black text-rose-950 dark:text-rose-100 tracking-tight">
              <AgeCounter />
            </h2>
          </div>
        </motion.div>

        <motion.h1 
          custom={1}
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-rose-900 dark:text-white leading-tight mb-6 drop-shadow-lg"
          style={{ textShadow: "0 4px 20px rgba(255,45,120,0.3)" }}
        >
          {t.hero.title}
        </motion.h1>

        <motion.div 
          custom={2}
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          className="space-y-4"
        >
          <p className="text-2xl md:text-3xl font-semibold text-rose-600 dark:text-rose-400 tracking-widest uppercase">
            {t.hero.subtitle}
          </p>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50" />
          <p className="text-xl md:text-2xl text-rose-800/80 dark:text-rose-200/80 font-medium">
            {t.hero.years}
          </p>
        </motion.div>

        {/* Floating Balloons (CSS/Framer Motion) */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 w-16 h-20 bg-rose-500/80 rounded-full blur-[2px] pointer-events-none"
            style={{
              left: `${15 + i * 20}%`,
              borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
            }}
            animate={{
              y: ["100vh", "-100vh"],
              x: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              y: { duration: 15 + Math.random() * 10, repeat: Infinity, ease: "linear" },
              x: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", yoyo: Infinity },
            }}
          >
            <div className="absolute -bottom-4 left-1/2 w-0.5 h-16 bg-rose-300/50" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
