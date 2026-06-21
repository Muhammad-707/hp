import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

export function BirthdayCake() {
  const { t } = useLanguage();
  const [candlesLit, setCandlesLit] = useState([true, true]); // Two candles: 4 and 8

  const blowCandle = (index: number) => {
    if (!candlesLit[index]) return;
    
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
    <section className="py-24 relative flex flex-col items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="relative w-64 h-80 mx-auto">
          {/* Candles */}
          <div className="absolute top-0 left-0 w-full h-32 flex justify-center gap-6 z-20">
            {/* Candle 4 */}
            <div 
              className="relative w-8 h-24 bg-rose-100 rounded-t-md rounded-b-sm border-2 border-rose-400 cursor-pointer group shadow-sm"
              onClick={() => blowCandle(0)}
            >
              <div className="absolute inset-0 flex items-center justify-center text-rose-800 font-bold text-xl">4</div>
              {/* Flame */}
              {candlesLit[0] && (
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 0.9, 1.05, 1],
                    rotate: [0, -2, 2, -1, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 w-6 h-10 bg-gradient-to-t from-yellow-500 via-orange-400 to-red-500 rounded-full blur-[1px] origin-bottom shadow-[0_0_20px_#f59e0b]"
                />
              )}
              {/* Wick */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-neutral-800" />
            </div>

            {/* Candle 8 */}
            <div 
              className="relative w-8 h-24 bg-rose-100 rounded-t-md rounded-b-sm border-2 border-rose-400 cursor-pointer group shadow-sm"
              onClick={() => blowCandle(1)}
            >
              <div className="absolute inset-0 flex items-center justify-center text-rose-800 font-bold text-xl">8</div>
              {/* Flame */}
              {candlesLit[1] && (
                <motion.div 
                  animate={{ 
                    scale: [1, 1.15, 0.95, 1.1, 1],
                    rotate: [0, 2, -2, 1, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 w-6 h-10 bg-gradient-to-t from-yellow-500 via-orange-400 to-red-500 rounded-full blur-[1px] origin-bottom shadow-[0_0_20px_#f59e0b]"
                />
              )}
              {/* Wick */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-neutral-800" />
            </div>
          </div>

          {/* Cake Tiers */}
          <div className="absolute bottom-0 w-full flex flex-col items-center">
            {/* Top Tier */}
            <div className="w-48 h-20 bg-rose-600 rounded-t-xl relative shadow-inner border-t-4 border-rose-500">
              {/* Icing Drips */}
              <div className="absolute top-0 w-full flex justify-around">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-6 h-8 bg-rose-300 rounded-b-full" style={{ height: `${20 + Math.random() * 20}px` }} />
                ))}
              </div>
            </div>
            {/* Bottom Tier */}
            <div className="w-64 h-24 bg-rose-700 rounded-t-xl relative shadow-lg border-t-4 border-rose-600">
              {/* Icing Drips */}
              <div className="absolute top-0 w-full flex justify-around">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-6 h-10 bg-rose-400 rounded-b-full shadow-sm" style={{ height: `${25 + Math.random() * 25}px` }} />
                ))}
              </div>
              {/* Decorative base dots */}
              <div className="absolute bottom-2 w-full flex justify-evenly px-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-rose-300" />
                ))}
              </div>
            </div>
            {/* Plate */}
            <div className="w-72 h-4 bg-rose-900 rounded-full shadow-xl" />
          </div>
        </div>

        <div className="mt-12 space-y-2">
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-2xl font-semibold text-rose-400"
          >
            {candlesLit[0] || candlesLit[1] ? t.cake.makeAWish : "✨"}
          </motion.p>
          <p className="text-rose-400/80 text-sm">
            {t.cake.blowCandles}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
