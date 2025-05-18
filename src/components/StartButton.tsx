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
 * Interface for a breathing session
 */
interface Session {
  id: string;
  pattern: string;
  duration: number;
  date: string;
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
}

/**
 * StartButton component that controls the breathing exercise session
 * @returns {JSX.Element} The rendered start/stop button
 */
export const StartButton: React.FC = () => {
  const { isBreathing, theme, startBreathing, stopBreathing, inhaleTime, holdTime, exhaleTime, elapsedTime } = useBreathingStore();
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

  /**
   * Handles the stop button click by saving the session and stopping breathing
   */
  const handleStop = () => {
    // Create new session
    const newSession: Session = {
      id: crypto.randomUUID(),
      pattern: `${inhaleTime}-${holdTime}-${exhaleTime}`,
      duration: elapsedTime,
      date: new Date().toISOString(),
      inhaleTime,
      holdTime,
      exhaleTime
    };

    // Get existing sessions from localStorage
    const existingSessions = localStorage.getItem('breathing-sessions');
    const sessions: Session[] = existingSessions ? JSON.parse(existingSessions) : [];

    // Add new session and save to localStorage
    sessions.push(newSession);
    localStorage.setItem('breathing-sessions', JSON.stringify(sessions));

    // Stop breathing
    stopBreathing();
  };

  return (
    <>
      <button
        onClick={isBreathing ? handleStop : handleStart}
        className={BUTTON_STYLES.base}
        style={isBreathing ? BUTTON_STYLES.stop : BUTTON_STYLES.start(theme.primary)}
      >
        {isBreathing ? 'Stop' : 'Start'} Breathing
      </button>
      {showInitialCountdown && <InitialCountdown />}
    </>
  );
}; 