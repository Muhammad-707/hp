import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/Button';
import { playConfettiPopSound } from '../lib/soundEffects';

export function CelebrateButton() {
  const { t } = useLanguage();
  const [isExploding, setIsExploding] = useState(false);

  const handleCelebrate = () => {
    if (isExploding) return;
    
    playConfettiPopSound();
    
    setIsExploding(true);

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF2D78', '#FF5C8A', '#E0115F']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF2D78', '#FF5C8A', '#E0115F']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(() => setIsExploding(false), 1000);
      }
    };

    frame();
  };

  return (
    <section className="py-32 flex justify-center items-center relative overflow-hidden">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <AnimatePresence>
          {isExploding && (
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-rose-500 rounded-full blur-xl z-0"
            />
          )}
        </AnimatePresence>
        
        <Button
          onClick={handleCelebrate}
          size="lg"
          className="relative z-10 h-24 px-12 text-2xl md:text-3xl font-black rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-red-500 hover:from-rose-600 hover:via-rose-700 hover:to-red-600 text-white shadow-[0_10px_40px_rgba(255,45,120,0.5)] hover:shadow-[0_10px_60px_rgba(255,45,120,0.8)] border-4 border-rose-900 transition-all overflow-hidden group"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
          
          <span className="flex items-center gap-4 drop-shadow-md">
            <PartyPopper className="w-8 h-8 md:w-10 md:h-10" />
            {t.celebrate.buttonText}
            <PartyPopper className="w-8 h-8 md:w-10 md:h-10" />
          </span>
        </Button>
      </motion.div>
    </section>
  );
}
