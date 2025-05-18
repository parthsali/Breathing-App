/**
 * StartButton component that controls the breathing exercise session.
 * Provides a button to start/stop the breathing exercise and manages the initial countdown.
 */
import React, { useState, useEffect } from 'react';
import { useBreathingStore } from '../store/breathingStore';
import { InitialCountdown } from './InitialCountdown';

/**
 * Styles for the start/stop button
 */
const BUTTON_STYLES = {
  base: "absolute right-8 top-8 px-6 py-3 rounded-full text-white font-medium transition-all duration-300 transform hover:scale-105",
  start: (theme: string) => ({
    background: theme,
    boxShadow: `0 4px 14px ${theme}80`
  }),
  stop: {
    background: '#ef4444',
    boxShadow: '0 4px 14px #ef444480'
  }
} as const;

/**
 * StartButton component that controls the breathing exercise session
 * @returns {JSX.Element} The rendered start/stop button
 */
export const StartButton: React.FC = () => {
  const { isBreathing, theme, startBreathing, stopBreathing } = useBreathingStore();
  const [showInitialCountdown, setShowInitialCountdown] = useState(false);

  // Reset countdown state when breathing starts
  useEffect(() => {
    if (isBreathing) {
      setShowInitialCountdown(false);
    }
  }, [isBreathing]);

  /**
   * Handles the start button click by showing the initial countdown
   */
  const handleStart = () => {
    setShowInitialCountdown(true);
  };

  return (
    <>
      <button
        onClick={isBreathing ? stopBreathing : handleStart}
        className={BUTTON_STYLES.base}
        style={isBreathing ? BUTTON_STYLES.stop : BUTTON_STYLES.start(theme.primary)}
      >
        {isBreathing ? 'Stop' : 'Start'} Breathing
      </button>
      {showInitialCountdown && <InitialCountdown />}
    </>
  );
}; 