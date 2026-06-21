import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { cn } from "@/lib/utils";

// ============================================================================
// MusicPlayer
// ----------------------------------------------------------------------------
// This component controls ONLY the background ambient music file located at
// /public/audio/background-music.mp3. It is intentionally the ONLY thing
// connected to SoundContext / isSoundEnabled. Interactive sound effects
// (candles, celebrate button, fireworks chime) live in soundEffects.ts and are
// ALWAYS ON — they never read isSoundEnabled and are not affected by this
// toggle in any way.
// ============================================================================

const tooltips = {
  ru: {
    play: 'Включить музыку',
    mute: 'Выключить музыку',
  },
  tj: {
    play: 'Мусиқиро фарояндан',
    mute: 'Мусиқиро хомӯш кардан',
  },
  en: {
    play: 'Play music',
    mute: 'Mute music',
  },
};

const TARGET_VOLUME = 0.85;

// Exposed so soundEffects.ts can briefly "duck" (lower) the background music
// volume while an interactive sound effect plays, so effects are always
// clearly audible even when the music is loud. See lib/soundEffects.ts.
export let backgroundMusicElement: HTMLAudioElement | null = null;
export const BACKGROUND_MUSIC_TARGET_VOLUME = TARGET_VOLUME;

// One-time migration: earlier test versions of this site could leave
// "sound-enabled" = false in localStorage from manual testing. Music should
// always start ON by default for every fresh visitor, so we clear any stale
// "false" value once. This does NOT prevent the user from muting again
// during their current visit — it only fixes the bad stored default.
if (typeof window !== 'undefined') {
  try {
    const migrationKey = 'sound-enabled-migrated-v2';
    if (!localStorage.getItem(migrationKey)) {
      localStorage.setItem('sound-enabled', 'true');
      localStorage.setItem(migrationKey, '1');
    }
  } catch {
    // localStorage unavailable (e.g. privacy mode) — safe to ignore.
  }
}

export function MusicPlayer() {
  const { language } = useLanguage();
  const { isSoundEnabled, setIsSoundEnabled } = useSound();
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeFrameRef = useRef<number | null>(null);

  const [showTooltip, setShowTooltip] = useState(false);

  const t = tooltips[language as keyof typeof tooltips] || tooltips.en;

  const stopFade = () => {
    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  };

  const fadeTo = (target: number, durationMs: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    stopFade();

    const start = audio.volume;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      audio.volume = start + (target - start) * progress;

      if (progress < 1) {
        fadeFrameRef.current = requestAnimationFrame(step);
      } else {
        fadeFrameRef.current = null;
        onDone?.();
      }
    };

    fadeFrameRef.current = requestAnimationFrame(step);
  };

  // Attempt 1: try to autoplay WITH sound immediately on mount.
  // Browsers usually block this on a cold visit, but it's free to try.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isSoundEnabled) return;

    audio.volume = 0;
    audio.muted = false;

    audio
      .play()
      .then(() => {
        fadeTo(TARGET_VOLUME, 1500);
      })
      .catch(() => {
        // Blocked by browser autoplay policy — expected. The fallback
        // listener below will catch the very next user interaction.
      });

    return () => stopFade();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Attempt 2 (fallback): start playback on the very first interaction of
  // ANY kind (click, touch, key, scroll, mouse move) so it kicks in as
  // early as possible if attempt 1 was blocked.
  useEffect(() => {
    let triggered = false;

    const removeListeners = () => {
      window.removeEventListener('click', startPlayback);
      window.removeEventListener('touchstart', startPlayback);
      window.removeEventListener('keydown', startPlayback);
      window.removeEventListener('scroll', startPlayback);
      window.removeEventListener('mousemove', startPlayback);
    };

    function startPlayback() {
      if (triggered) return;
      const audio = audioRef.current;
      if (!audio || !isSoundEnabled) return;

      if (!audio.paused) {
        // Attempt 1 already succeeded — nothing more to do.
        triggered = true;
        removeListeners();
        return;
      }

      triggered = true;
      removeListeners();

      audio.muted = false;
      audio
        .play()
        .then(() => fadeTo(TARGET_VOLUME, 1200))
        .catch((err) => {
          console.warn('Could not start background music:', err);
        });
    }

    window.addEventListener('click', startPlayback);
    window.addEventListener('touchstart', startPlayback);
    window.addEventListener('keydown', startPlayback);
    window.addEventListener('scroll', startPlayback, { passive: true });
    window.addEventListener('mousemove', startPlayback);

    return removeListeners;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the <audio> element in sync with the toggle button / SoundContext.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isSoundEnabled) {
      audio.muted = false;
      if (audio.paused) {
        audio
          .play()
          .then(() => fadeTo(TARGET_VOLUME, 800))
          .catch((err) => console.warn('Play on toggle failed:', err));
      } else {
        fadeTo(TARGET_VOLUME, 800);
      }
    } else {
      fadeTo(0, 500, () => {
        audio.pause();
        audio.muted = true;
      });
    }
  }, [isSoundEnabled]);

  // Keep the module-level reference in sync so soundEffects.ts can duck this
  // element's volume while a sound effect plays.
  useEffect(() => {
    backgroundMusicElement = audioRef.current;
    return () => {
      backgroundMusicElement = null;
    };
  }, []);

  const handleToggle = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  return (
    <div className={cn('right-6', 'bottom-6', 'z-50', 'fixed', 'flex', 'items-center')}>
      <audio
        ref={audioRef}
        src="/audio/background-music.mp3"
        loop
        preload="auto"
        onError={(e) => {
          console.error(
            'Background music failed to load. Check that the file exists at public/audio/background-music.mp3 and that the filename matches exactly.',
            e
          );
        }}
      />

      <div className="relative">
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn('right-0', 'bottom-full', 'absolute', 'bg-neutral-900/90', 'shadow-xl', 'backdrop-blur-sm', 'mb-3', 'px-3', 'py-1.5', 'border', 'border-rose-500/20', 'rounded-lg', 'font-semibold', 'text-rose-100', 'text-xs', 'whitespace-nowrap')}
            >
              {isSoundEnabled ? t.mute : t.play}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleToggle}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label={isSoundEnabled ? t.mute : t.play}
          className={cn('flex', 'justify-center', 'items-center', 'bg-gradient-to-r', 'from-rose-500', 'hover:from-rose-600', 'via-rose-600', 'to-red-500', 'hover:to-red-600', 'shadow-[0_4px_20px_rgba(255,45,120,0.4)]', 'hover:shadow-[0_4px_30px_rgba(255,45,120,0.7)]', 'border', 'border-rose-400/30', 'rounded-full', 'focus:outline-none', 'focus:ring-2', 'focus:ring-rose-500', 'focus:ring-offset-2', 'focus:ring-offset-background', 'w-12', 'md:w-14', 'h-12', 'md:h-14', 'text-white', 'transition-shadow', 'cursor-pointer', 'music-player-btn')}
          animate={
            isSoundEnabled
              ? {
                  boxShadow: [
                    '0 4px 20px rgba(255,45,120,0.4)',
                    '0 4px 30px rgba(255,45,120,0.8)',
                    '0 4px 20px rgba(255,45,120,0.4)',
                  ],
                }
              : {}
          }
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <div className={cn('flex', 'items-center', 'gap-1')}>
            {isSoundEnabled ? (
              <motion.div
                className={cn('flex', 'items-center')}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <Volume2 className={cn('w-6', 'md:w-7', 'h-6', 'md:h-7')} />
              </motion.div>
            ) : (
              <VolumeX className={cn('w-6', 'md:w-7', 'h-6', 'md:h-7', 'text-rose-200')} />
            )}

            {isSoundEnabled && (
              <div className={cn('flex', 'items-end', 'gap-[2px]', 'ml-0.5', 'h-3')} aria-hidden="true">
                <motion.span
                  animate={{ height: [4, 12, 4] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                  className={cn('bg-white', 'rounded-full', 'w-[1.5px]')}
                />
                <motion.span
                  animate={{ height: [2, 10, 2] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.15, ease: 'easeInOut' }}
                  className={cn('bg-white', 'rounded-full', 'w-[1.5px]')}
                />
                <motion.span
                  animate={{ height: [5, 12, 5] }}
                  transition={{ repeat: Infinity, duration: 0.7, delay: 0.3, ease: 'easeInOut' }}
                  className={cn('bg-white', 'rounded-full', 'w-[1.5px]')}
                />
              </div>
            )}
          </div>
        </motion.button>
      </div>
    </div>
  );
}