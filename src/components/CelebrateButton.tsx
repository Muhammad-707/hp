import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/Button';
import { playConfettiPopSound } from '../lib/soundEffects';
import { cn } from "@/lib/utils";

// NOTE: playConfettiPopSound() is called unconditionally below — it is an
// always-on interactive sound effect and is intentionally NOT gated by
// SoundContext / isSoundEnabled (that toggle only controls the background
// music in MusicPlayer.tsx).

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
    <section className={cn('relative', 'flex', 'justify-center', 'items-center', 'py-32', 'overflow-hidden')}>
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
              className={cn('z-0', 'absolute', 'inset-0', 'bg-rose-500', 'blur-xl', 'rounded-full')}
            />
          )}
        </AnimatePresence>

        <Button
          onClick={handleCelebrate}
          size="lg"
          className={cn('group', 'z-10', 'relative', 'bg-gradient-to-r', 'from-rose-500', 'hover:from-rose-600', 'via-rose-600', 'hover:via-rose-700', 'to-red-500', 'hover:to-red-600', 'shadow-[0_10px_40px_rgba(255,45,120,0.5)]', 'hover:shadow-[0_10px_60px_rgba(255,45,120,0.8)]', 'px-12', 'border-4', 'border-rose-900', 'rounded-full', 'h-24', 'overflow-hidden', 'font-black', 'text-white', 'text-2xl', 'md:text-3xl', 'transition-all')}
        >
          {/* Shimmer effect */}
          <div className={cn('absolute', 'inset-0', 'bg-gradient-to-r', 'from-transparent', 'via-white/30', 'to-transparent', 'skew-x-12', '-translate-x-full', 'group-hover:animate-[shimmer_1.5s_infinite]')} />

          <span className={cn('flex', 'items-center', 'gap-4', 'drop-shadow-md')}>
            <PartyPopper className={cn('w-8', 'md:w-10', 'h-8', 'md:h-10')} />
            {t.celebrate.buttonText}
            <PartyPopper className={cn('w-8', 'md:w-10', 'h-8', 'md:h-10')} />
          </span>
        </Button>
      </motion.div>
    </section>
  );
}