import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';
import { playCandleBlowSound } from '../lib/soundEffects';
import { cn } from "@/lib/utils";

// NOTE: playCandleBlowSound() is called unconditionally below — it is an
// always-on interactive sound effect and is intentionally NOT gated by
// SoundContext / isSoundEnabled (that toggle only controls the background
// music in MusicPlayer.tsx).

export function BirthdayCake() {
  const { t } = useLanguage();
  const [candlesLit, setCandlesLit] = useState([true, true]); // Two candles: 4 and 8

  const blowCandle = (index: number) => {
    if (!candlesLit[index]) return;

    playCandleBlowSound();

    const newCandles = [...candlesLit];
    newCandles[index] = false;
    setCandlesLit(newCandles);

    // Smoke puff effect using confetti
    confetti({
      particleCount: 15,
      spread: 40,
      origin: { y: 0.4, x: index === 0 ? 0.45 : 0.55 },
      colors: ['#a3a3a3', '#d4d4d4', '#ffffff'],
      startVelocity: 15,
      gravity: -0.5,
      ticks: 100,
    });
  };

  useEffect(() => {
    if (!candlesLit[0] && !candlesLit[1]) {
      // Both candles blown out, big celebration
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#FF2D78', '#FF5C8A', '#ffffff', '#FFD700'],
        });

        // Relight after 5 seconds
        setTimeout(() => setCandlesLit([true, true]), 5000);
      }, 500);
    }
  }, [candlesLit]);

  return (
    <section className={cn('relative', 'flex', 'flex-col', 'justify-center', 'items-center', 'py-24', 'min-h-[80vh]')}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className={cn('relative', 'mx-auto', 'w-64', 'h-80')}>
          {/* Candles */}
          <div className={cn('top-0', 'left-0', 'z-20', 'absolute', 'flex', 'justify-center', 'gap-6', 'w-full', 'h-32')}>
            {/* Candle 4 */}
            <div
              className={cn('group', 'relative', 'bg-rose-100', 'shadow-sm', 'border-2', 'border-rose-400', 'rounded-t-md', 'rounded-b-sm', 'w-8', 'h-24', 'cursor-pointer')}
              onClick={() => blowCandle(0)}
            >
              <div className={cn('absolute', 'inset-0', 'flex', 'justify-center', 'items-center', 'font-bold', 'text-rose-800', 'text-xl')}>4</div>
              {/* Flame */}
              {candlesLit[0] && (
                <motion.div
                  animate={{
                    scale: [1, 1.1, 0.9, 1.05, 1],
                    rotate: [0, -2, 2, -1, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                  className={cn('-top-10', 'left-1/2', 'absolute', 'bg-gradient-to-t', 'from-yellow-500', 'via-orange-400', 'to-red-500', 'shadow-[0_0_20px_#f59e0b]', 'blur-[1px]', 'rounded-full', 'w-6', 'h-10', 'origin-bottom', '-translate-x-1/2')}
                />
              )}
              {/* Wick */}
              <div className={cn('-top-2', 'left-1/2', 'absolute', 'bg-neutral-800', 'w-1', 'h-3', '-translate-x-1/2')} />
            </div>

            {/* Candle 8 */}
            <div
              className={cn('group', 'relative', 'bg-rose-100', 'shadow-sm', 'border-2', 'border-rose-400', 'rounded-t-md', 'rounded-b-sm', 'w-8', 'h-24', 'cursor-pointer')}
              onClick={() => blowCandle(1)}
            >
              <div className={cn('absolute', 'inset-0', 'flex', 'justify-center', 'items-center', 'font-bold', 'text-rose-800', 'text-xl')}>8</div>
              {/* Flame */}
              {candlesLit[1] && (
                <motion.div
                  animate={{
                    scale: [1, 1.15, 0.95, 1.1, 1],
                    rotate: [0, 2, -2, 1, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                  className={cn('-top-10', 'left-1/2', 'absolute', 'bg-gradient-to-t', 'from-yellow-500', 'via-orange-400', 'to-red-500', 'shadow-[0_0_20px_#f59e0b]', 'blur-[1px]', 'rounded-full', 'w-6', 'h-10', 'origin-bottom', '-translate-x-1/2')}
                />
              )}
              {/* Wick */}
              <div className={cn('-top-2', 'left-1/2', 'absolute', 'bg-neutral-800', 'w-1', 'h-3', '-translate-x-1/2')} />
            </div>
          </div>

          {/* Cake Tiers */}
          <div className={cn('bottom-0', 'absolute', 'flex', 'flex-col', 'items-center', 'w-full')}>
            {/* Top Tier */}
            <div className={cn('relative', 'bg-rose-600', 'shadow-inner', 'border-rose-500', 'border-t-4', 'rounded-t-xl', 'w-48', 'h-20')}>
              {/* Icing Drips */}
              <div className={cn('top-0', 'absolute', 'flex', 'justify-around', 'w-full')}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={cn('bg-rose-300', 'rounded-b-full', 'w-6', 'h-8')} style={{ height: `${20 + Math.random() * 20}px` }} />
                ))}
              </div>
            </div>
            {/* Bottom Tier */}
            <div className={cn('relative', 'bg-rose-700', 'shadow-lg', 'border-rose-600', 'border-t-4', 'rounded-t-xl', 'w-64', 'h-24')}>
              {/* Icing Drips */}
              <div className={cn('top-0', 'absolute', 'flex', 'justify-around', 'w-full')}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={cn('bg-rose-400', 'shadow-sm', 'rounded-b-full', 'w-6', 'h-10')} style={{ height: `${25 + Math.random() * 25}px` }} />
                ))}
              </div>
              {/* Decorative base dots */}
              <div className={cn('bottom-2', 'absolute', 'flex', 'justify-evenly', 'px-2', 'w-full')}>
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={cn('bg-rose-300', 'rounded-full', 'w-3', 'h-3')} />
                ))}
              </div>
            </div>
            {/* Plate */}
            <div className={cn('bg-rose-900', 'shadow-xl', 'rounded-full', 'w-72', 'h-4')} />
          </div>
        </div>

        <div className={cn('space-y-2', 'mt-12')}>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={cn('font-semibold', 'text-rose-400', 'text-2xl')}
          >
            {candlesLit[0] || candlesLit[1] ? t.cake.makeAWish : "✨"}
          </motion.p>
          <p className={cn('text-rose-400/80', 'text-sm')}>
            {t.cake.blowCandles}
          </p>
        </div>
      </motion.div>
    </section>
  );
}