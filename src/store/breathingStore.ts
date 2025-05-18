import { create } from 'zustand';

interface BreathingState {
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  isBreathing: boolean;
  currentPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
  elapsedTime: number;
  theme: {
    primary: string;
    secondary: string;
    background: string;
  };
  setBreathingPattern: (inhale: number, hold: number, exhale: number) => void;
  setTheme: (theme: { primary: string; secondary: string; background: string }) => void;
  startBreathing: () => void;
  stopBreathing: () => void;
  setCurrentPhase: (phase: 'inhale' | 'hold' | 'exhale' | 'rest') => void;
  setInhaleTime: (time: number) => void;
  setHoldTime: (time: number) => void;
  setExhaleTime: (time: number) => void;
  setElapsedTime: (time: number) => void;
}

const updateScrollbarColors = (primary: string) => {
  const root = document.documentElement;
  const primaryColor = primary.replace('#', '');
  const r = parseInt(primaryColor.slice(0, 2), 16);
  const g = parseInt(primaryColor.slice(2, 4), 16);
  const b = parseInt(primaryColor.slice(4, 6), 16);
  
  root.style.setProperty('--scrollbar-thumb', `rgba(${r}, ${g}, ${b}, 0.5)`);
  root.style.setProperty('--scrollbar-thumb-hover', `rgba(${r}, ${g}, ${b}, 0.7)`);
};

export const useBreathingStore = create<BreathingState>((set, get) => ({
  inhaleTime: 4,
  holdTime: 4,
  exhaleTime: 6,
  isBreathing: false,
  currentPhase: 'rest',
  elapsedTime: 0,
  theme: {
    primary: '#64b5f6', // Blue 300
    secondary: '#80cbc4', // Teal 200
    background: '#e0f7fa', // Sky 100
  },
  setBreathingPattern: (inhale, hold, exhale) =>
    set({ inhaleTime: inhale, holdTime: hold, exhaleTime: exhale, currentPhase: 'inhale' }),
  setTheme: (theme: { primary: string; secondary: string; background: string }) => {
    set({ theme });
    updateScrollbarColors(theme.primary);
  },
  startBreathing: () => set({ isBreathing: true, currentPhase: 'inhale' }),
  stopBreathing: () => set({ isBreathing: false, currentPhase: 'rest' }),
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  setInhaleTime: (time) => set({ inhaleTime: time }),
  setHoldTime: (time) => set({ holdTime: time }),
  setExhaleTime: (time) => set({ exhaleTime: time }),
  setElapsedTime: (time) => set({ elapsedTime: time }),
})); 