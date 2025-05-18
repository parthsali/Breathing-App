/**
 * BreathingTimer component that displays the current breathing pattern and timer in the bottom left corner.
 */
import React, { useEffect, useState } from 'react';
import { useBreathingStore } from '../store/breathingStore';

// List of patterns to match for the name - using the same patterns as Controls
const BREATHING_PATTERNS = [
  {
    name: 'Calm',
    inhale: 4,
    hold: 4,
    exhale: 6,
  },
  {
    name: 'Focus',
    inhale: 4,
    hold: 7,
    exhale: 8,
  },
  {
    name: 'Balance',
    inhale: 4,
    hold: 4,
    exhale: 4,
  },
  {
    name: 'Deep',
    inhale: 6,
    hold: 2,
    exhale: 7,
  }
];

/**
 * Styles for the breathing timer
 */
const TIMER_STYLES = {
  container: "fixed left-4 bottom-4 p-2 rounded-lg transform transition-all duration-300 min-w-[60px] min-h-[40px] flex flex-col items-center justify-center",
  pattern: "text-xs font-medium mb-0.5 leading-none",
  timer: "text-lg font-bold leading-none"
} as const;

/**
 * BreathingTimer component that displays the current breathing pattern and timer
 * @returns {JSX.Element | null} The rendered timer or null if not breathing
 */
export const BreathingTimer: React.FC = () => {
  const { isBreathing, inhaleTime, holdTime, exhaleTime, theme } = useBreathingStore();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isBreathing) {
      setElapsedTime(0);
      return;
    }
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isBreathing]);

  if (!isBreathing) return null;

  // Find the pattern name by matching inhale/hold/exhale
  const pattern = BREATHING_PATTERNS.find(
    p => p.inhale === inhaleTime && p.hold === holdTime && p.exhale === exhaleTime
  );
  const patternText = pattern ? pattern.name : `${inhaleTime}-${holdTime}-${exhaleTime}`;

  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const timeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div 
      className={TIMER_STYLES.container}
      style={{ 
        background: `${theme.background}99`,
        backdropFilter: 'blur(8px)',
        border: `2px solid ${theme.primary}40`
      }}
    >
      <div className={TIMER_STYLES.timer} style={{ color: theme.primary }}>{timeText}</div>
      <div className={TIMER_STYLES.pattern} style={{ color: theme.primary }}>{patternText}</div>
    </div>
  );
}; 