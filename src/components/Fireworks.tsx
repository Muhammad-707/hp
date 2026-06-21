import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { playChimeSound } from '../lib/soundEffects';

export function Fireworks() {
  const { ref, isVisible } = useScrollReveal(0.5, true);
  const triggered = useRef(false);

  useEffect(() => {
    if (isVisible && !triggered.current) {
      triggered.current = true;
      playChimeSound();
      
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#FF2D78', '#FF5C8A', '#E0115F', '#ffffff']
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#FF2D78', '#FF5C8A', '#E0115F', '#ffffff']
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return <div ref={ref} className="w-full h-10" aria-hidden="true" />;
}
