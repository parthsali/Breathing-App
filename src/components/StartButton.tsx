import React, { useState } from 'react';
import { useBreathingStore } from '../store/breathingStore';
import { InitialCountdown } from './InitialCountdown';

export const StartButton: React.FC = () => {
  const { isBreathing, theme, startBreathing, stopBreathing } = useBreathingStore();
  const [showInitialCountdown, setShowInitialCountdown] = useState(false);

  const handleStart = () => {
    setShowInitialCountdown(true);
  };

  return (
    <>
      <button
        onClick={isBreathing ? stopBreathing : handleStart}
        className="absolute right-8 top-8 px-6 py-3 rounded-full text-white font-medium transition-all duration-300 transform hover:scale-105"
        style={{ 
          background: isBreathing ? '#ef4444' : theme.primary,
          boxShadow: `0 4px 14px ${isBreathing ? '#ef444480' : theme.primary + '80'}`
        }}
      >
        {isBreathing ? 'Stop' : 'Start'} Breathing
      </button>
      {showInitialCountdown && <InitialCountdown />}
    </>
  );
}; 