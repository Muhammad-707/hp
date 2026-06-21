import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ============================================================================
// SoundContext
// ----------------------------------------------------------------------------
// This context controls ONLY the background ambient music toggle (the
// floating speaker button rendered by MusicPlayer.tsx). It is NOT read by
// any interactive sound effect (candles, celebrate button, fireworks chime)
// — those live in soundEffects.ts and are always-on by design.
// ============================================================================

type SoundContextType = {
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  // Sound starts enabled by default so that on first interaction, the user
  // gets the full audio experience right away.
  const [isSoundEnabled, setIsSoundEnabled] = useLocalStorage<boolean>('sound-enabled', true);

  return (
    <SoundContext.Provider value={{ isSoundEnabled, setIsSoundEnabled }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}