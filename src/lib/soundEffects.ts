/**
 * Sound effects synthesized dynamically using the Web Audio API.
 * This file runs outside React contexts, so it checks user preferences
 * directly from localStorage to ensure instant synchronization.
 */

const isSoundEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const item = window.localStorage.getItem('sound-enabled');
    // Default to true if not set
    return item ? JSON.parse(item) : true;
  } catch (error) {
    console.warn('Error reading sound-enabled from localStorage:', error);
    return true;
  }
};

/**
 * Synthesizes a soft whoosh/puff sound for blowing out a candle.
 * Uses a short bandpass/lowpass filtered white noise burst with exponential decay.
 */
export function playCandleBlowSound(): void {
  if (!isSoundEnabled()) return;

  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;

  let ctx: AudioContext;
  try {
    ctx = new AudioContextClass();
  } catch (e) {
    console.warn('Failed to initialize AudioContext:', e);
    return;
  }

  const duration = 0.35; // 350ms whoosh
  const sampleRate = ctx.sampleRate;
  const bufferSize = sampleRate * duration;
  
  // Create noise buffer
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    // Generate white noise
    data[i] = Math.random() * 2 - 1;
  }

  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;

  // Filter out high frequencies to make it sound like wind/breath
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(600, ctx.currentTime);
  // Sweep frequency down to simulate fading breath
  filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + duration);

  // Soft envelope for volume fade-out
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.12, ctx.currentTime); // keep it soft and tasteful
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  // Connect graph
  noiseNode.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Play and clean up
  noiseNode.start();
  
  // Clean up AudioContext once finished to prevent leaking contexts
  setTimeout(() => {
    ctx.close().catch(() => {});
  }, duration * 1000 + 100);
}

/**
 * Synthesizes a cheerful short "pop & sparkle" sound for party confetti.
 * Uses a quick pitch-rising oscillator blip combined with a higher triangle chime.
 */
export function playConfettiPopSound(): void {
  if (!isSoundEnabled()) return;

  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;

  let ctx: AudioContext;
  try {
    ctx = new AudioContextClass();
  } catch (e) {
    console.warn('Failed to initialize AudioContext:', e);
    return;
  }

  const now = ctx.currentTime;
  const duration = 0.25;

  // 1. The main "pop" - pitch rising quickly
  const popOsc = ctx.createOscillator();
  const popGain = ctx.createGain();
  popOsc.type = 'sine';
  popOsc.frequency.setValueAtTime(140, now);
  popOsc.frequency.exponentialRampToValueAtTime(550, now + duration);

  popGain.gain.setValueAtTime(0.15, now);
  popGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  popOsc.connect(popGain);
  popGain.connect(ctx.destination);

  // 2. High-pitched "sparkle" - a small chime blip
  const sparkleOsc = ctx.createOscillator();
  const sparkleGain = ctx.createGain();
  sparkleOsc.type = 'triangle';
  sparkleOsc.frequency.setValueAtTime(1100, now);
  sparkleOsc.frequency.exponentialRampToValueAtTime(1800, now + 0.1);

  sparkleGain.gain.setValueAtTime(0.04, now);
  sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  sparkleOsc.connect(sparkleGain);
  sparkleGain.connect(ctx.destination);

  // Start sound
  popOsc.start(now);
  popOsc.stop(now + duration);
  sparkleOsc.start(now);
  sparkleOsc.stop(now + 0.1);

  // Clean up
  setTimeout(() => {
    ctx.close().catch(() => {});
  }, duration * 1000 + 100);
}

/**
 * Synthesizes a soft, warm bell/chime sound for scroll reveal events (e.g. Fireworks).
 * Uses a fundamental frequency at 880Hz (A5) with harmonic overtones and soft attack.
 */
export function playChimeSound(): void {
  if (!isSoundEnabled()) return;

  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;

  let ctx: AudioContext;
  try {
    ctx = new AudioContextClass();
  } catch (e) {
    console.warn('Failed to initialize AudioContext:', e);
    return;
  }

  const now = ctx.currentTime;
  const duration = 1.2;

  // Harmonic overtones for a rich bell sound:
  // Fundamental 880Hz (A5)
  // Partial 1: 1.5x (perfect fifth) - 1320Hz
  // Partial 2: 2.0x (octave) - 1760Hz
  // Partial 3: 2.5x (major third above octave) - 2200Hz
  const fundFreq = 880;
  const partials = [
    { freq: fundFreq, gain: 0.12, decay: duration },
    { freq: fundFreq * 1.5, gain: 0.06, decay: duration * 0.7 },
    { freq: fundFreq * 2.0, gain: 0.04, decay: duration * 0.5 },
    { freq: fundFreq * 2.5, gain: 0.02, decay: duration * 0.3 }
  ];

  partials.forEach((p) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(p.freq, now);

    // Soft attack (50ms) to avoid clicks and keep it romantic and dreamy
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(p.gain, now + 0.05);
    
    // Natural exponential decay
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + p.decay);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + p.decay);
  });

  // Clean up
  setTimeout(() => {
    ctx.close().catch(() => {});
  }, duration * 1000 + 100);
}
