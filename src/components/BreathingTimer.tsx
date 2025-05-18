/**
 * BreathingTimer component that displays the current breathing pattern and timer in the bottom left corner.
 */
import React from 'react';
import { useBreathingStore } from '../store/breathingStore';

/**
 * Styles for the breathing timer
 */
const TIMER_STYLES = {
  container: "fixed left-4 bottom-4 p-4 rounded-xl transform transition-all duration-300",
  content: "text-center",
  pattern: "text-sm font-medium mb-1",
  timer: "text-2xl font-bold"
} as const;

/**
 * BreathingTimer component that displays the current breathing pattern and timer
 * @returns {JSX.Element | null} The rendered timer or null if not breathing
 */
export const BreathingTimer: React.FC = () => {
  const { isBreathing, currentPhase, inhaleTime, holdTime, exhaleTime, theme } = useBreathingStore();

  if (!isBreathing) return null;

  const patternText = `${inhaleTime}-${holdTime}-${exhaleTime}`;

  return (
    <div 
      className={TIMER_STYLES.container}
      style={{ 
        background: `${theme.background}99`,
        backdropFilter: 'blur(8px)',
        border: `2px solid ${theme.primary}40`
      }}
    >
      <div className={TIMER_STYLES.content}>
        <div 
          className={TIMER_STYLES.pattern}
          style={{ color: theme.primary }}
        >
          {patternText}
        </div>
        <div 
          className={TIMER_STYLES.timer}
          style={{ color: theme.primary }}
        >
          {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
        </div>
      </div>
    </div>
  );
}; 