import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type SoundContextType = {
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  // Sound starts enabled by default so that when they first interact, they get the full audio experience.
  // The autoplay policy is handled by starting the audio element muted, and unmuting it on first interaction.
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
