// All sounds are synthesized on the fly with the Web Audio API — no external audio files needed.

let sharedCtx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!sharedCtx) {
    sharedCtx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }
  // Browsers sometimes start an AudioContext in "suspended" state until a
  // user gesture happens. Since these functions are only ever called from
  // click handlers, this resume() call is safe and necessary.
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume().catch(() => {
      /* ignore */
    });
  }
  return sharedCtx;
}

/**
 * Soft "whoosh / puff" sound for blowing out a candle.
 * Built from filtered white noise with a quick fade-out.
 */
export function playCandleBlowSound(): void {
  try {
    const ctx = getContext();
    const duration = 0.5;

    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.9, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + duration);
  } catch (err) {
    console.warn('playCandleBlowSound failed:', err);
  }
}

/**
 * Big, joyful festive celebration sound for the "Celebrate!" button:
 * a firework BOOM with crackling sparkle tail, a triumphant fanfare riff,
 * and synthesized cheerful "crowd cheer" shouts — like a real party moment.
 */
export function playConfettiPopSound(): void {
  try {
    const ctx = getContext();
    const now = ctx.currentTime;

    // ---- 1. Firework launch + BOOM (noise burst with a deep thump) ----
    const boomDuration = 0.45;
    const boomBufferSize = Math.floor(ctx.sampleRate * boomDuration);
    const boomBuffer = ctx.createBuffer(1, boomBufferSize, ctx.sampleRate);
    const boomData = boomBuffer.getChannelData(0);
    for (let i = 0; i < boomBufferSize; i++) {
      boomData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / boomBufferSize, 2);
    }
    const boomNoise = ctx.createBufferSource();
    boomNoise.buffer = boomBuffer;

    const boomFilter = ctx.createBiquadFilter();
    boomFilter.type = 'lowpass';
    boomFilter.frequency.setValueAtTime(1800, now);
    boomFilter.frequency.exponentialRampToValueAtTime(150, now + boomDuration);

    const boomGain = ctx.createGain();
    boomGain.gain.setValueAtTime(0.8, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + boomDuration);

    boomNoise.connect(boomFilter);
    boomFilter.connect(boomGain);
    boomGain.connect(ctx.destination);
    boomNoise.start(now);
    boomNoise.stop(now + boomDuration);

    // A low sub-thump underneath the boom for extra punch.
    const thump = ctx.createOscillator();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(120, now);
    thump.frequency.exponentialRampToValueAtTime(40, now + 0.2);
    const thumpGain = ctx.createGain();
    thumpGain.gain.setValueAtTime(0.6, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    thump.connect(thumpGain);
    thumpGain.connect(ctx.destination);
    thump.start(now);
    thump.stop(now + 0.25);

    // ---- 2. Crackling sparkle tail (firework crackle after the boom) ----
    const crackleStart = now + 0.08;
    for (let i = 0; i < 14; i++) {
      const delay = crackleStart + i * 0.045 + Math.random() * 0.02;
      const freq = 2200 + Math.random() * 2600;

      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, delay);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, delay);
      gain.gain.linearRampToValueAtTime(0.1, delay + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, delay + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(delay);
      osc.stop(delay + 0.09);
    }

    // ---- 3. Triumphant fanfare riff (rising major arpeggio) ----
    const fanfareStart = now + 0.15;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const noteDuration = 0.16;
    const noteGap = 0.1;

    notes.forEach((freq, i) => {
      const startTime = fanfareStart + i * noteGap;

      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2500, startTime);

      const gain = ctx.createGain();
      const peakVolume = i === notes.length - 1 ? 0.6 : 0.45;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(peakVolume, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + noteDuration);
    });

    // Final held chord for a triumphant landing.
    const chordStart = fanfareStart + (notes.length - 1) * noteGap;
    const chordFreqs = [1046.5, 1318.5, 1568.0]; // C6 major chord
    chordFreqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, chordStart);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, chordStart);
      gain.gain.linearRampToValueAtTime(0.35, chordStart + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, chordStart + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(chordStart);
      osc.stop(chordStart + 0.7);
    });

    // ---- 4. Synthesized cheerful "crowd cheer" shouts ----
    // Each "shout" is a short vowel-like tone that glides upward,
    // mimicking an excited "Ura!" / "Yay!" voice. Several overlapping
    // at slightly different pitches and timings emulate a small cheering crowd.
    const cheerStart = now + 0.25;
    const cheerVoices = [
      { startOffset: 0, baseFreq: 280, riseTo: 460, duration: 0.55 },
      { startOffset: 0.05, baseFreq: 240, riseTo: 380, duration: 0.6 },
      { startOffset: 0.12, baseFreq: 320, riseTo: 520, duration: 0.5 },
      { startOffset: 0.08, baseFreq: 200, riseTo: 340, duration: 0.65 },
    ];

    cheerVoices.forEach((voice) => {
      const startTime = cheerStart + voice.startOffset;

      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(voice.baseFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(voice.riseTo, startTime + voice.duration * 0.4);
      osc.frequency.exponentialRampToValueAtTime(
        voice.riseTo * 0.85,
        startTime + voice.duration
      );

      // Formant-ish filter to make it sound more "voice-like" than a pure buzz.
      const voiceFilter = ctx.createBiquadFilter();
      voiceFilter.type = 'bandpass';
      voiceFilter.frequency.setValueAtTime(900, startTime);
      voiceFilter.Q.setValueAtTime(4, startTime);

      const voiceGain = ctx.createGain();
      voiceGain.gain.setValueAtTime(0.001, startTime);
      voiceGain.gain.linearRampToValueAtTime(0.22, startTime + 0.06);
      voiceGain.gain.setValueAtTime(0.22, startTime + voice.duration * 0.5);
      voiceGain.gain.exponentialRampToValueAtTime(0.001, startTime + voice.duration);

      osc.connect(voiceFilter);
      voiceFilter.connect(voiceGain);
      voiceGain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + voice.duration);
    });

    // ---- 5. Sparkly shimmer flourish on top, like confetti glinting in the light ----
    const shimmerStart = fanfareStart + 0.05;
    for (let i = 0; i < 6; i++) {
      const delay = shimmerStart + i * 0.05 + Math.random() * 0.03;
      const freq = 1800 + Math.random() * 1400;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, delay);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, delay);
      gain.gain.linearRampToValueAtTime(0.16, delay + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, delay + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(delay);
      osc.stop(delay + 0.22);
    }
  } catch (err) {
    console.warn('playConfettiPopSound failed:', err);
  }
}

/**
 * Soft, warm bell/chime — a sine wave with a gentle harmonic overtone and decay.
 */
export function playChimeSound(): void {
  try {
    const ctx = getContext();
    const now = ctx.currentTime;
    const duration = 1.2;

    // Fundamental tone.
    const fundamental = ctx.createOscillator();
    fundamental.type = 'sine';
    fundamental.frequency.setValueAtTime(880, now); // A5

    const fundamentalGain = ctx.createGain();
    fundamentalGain.gain.setValueAtTime(0.001, now);
    fundamentalGain.gain.linearRampToValueAtTime(0.55, now + 0.02);
    fundamentalGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    fundamental.connect(fundamentalGain);
    fundamentalGain.connect(ctx.destination);
    fundamental.start(now);
    fundamental.stop(now + duration);

    // Harmonic overtone, slightly delayed and quieter, for warmth.
    const overtone = ctx.createOscillator();
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(1320, now); // perfect fifth above

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.001, now);
    overtoneGain.gain.linearRampToValueAtTime(0.28, now + 0.03);
    overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.8);

    overtone.connect(overtoneGain);
    overtoneGain.connect(ctx.destination);
    overtone.start(now);
    overtone.stop(now + duration * 0.8);
  } catch (err) {
    console.warn('playChimeSound failed:', err);
  }
}