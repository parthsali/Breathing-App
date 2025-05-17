import { create } from 'zustand';

interface BreathingState {
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  isBreathing: boolean;
  currentPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
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
}

export const useBreathingStore = create<BreathingState>((set) => ({
  inhaleTime: 4,
  holdTime: 4,
  exhaleTime: 4,
  isBreathing: false,
  currentPhase: 'rest',
  theme: {
    primary: '#64b5f6', // Blue 300
    secondary: '#80cbc4', // Teal 200
    background: '#e0f7fa', // Sky 100
  },
  setBreathingPattern: (inhale, hold, exhale) =>
    set({ inhaleTime: inhale, holdTime: hold, exhaleTime: exhale }),
  setTheme: (theme) => set({ theme }),
  startBreathing: () => set({ isBreathing: true }),
  stopBreathing: () => set({ isBreathing: false, currentPhase: 'rest' }),
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
})); 