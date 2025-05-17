import React, { useEffect, useState } from 'react';
import { useBreathingStore } from '../store/breathingStore';

export const CountdownTimer: React.FC = () => {
  const { isBreathing, currentPhase, inhaleTime, holdTime, exhaleTime, theme } = useBreathingStore();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!isBreathing) {
      setTimeLeft(0);
      return;
    }

    let interval: number;
    const startTime = Date.now();
    const totalTime = currentPhase === 'inhale' 
      ? inhaleTime * 1000 
      : currentPhase === 'hold' 
        ? holdTime * 1000 
        : exhaleTime * 1000;

    interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.ceil((totalTime - elapsed) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isBreathing, currentPhase, inhaleTime, holdTime, exhaleTime]);

  if (!isBreathing) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div 
        className="text-center transform transition-all duration-300"
        style={{ 
          textShadow: `0 0 20px ${theme.primary}40`,
          filter: 'blur(0.5px)'
        }}
      >
        <div 
          className="text-8xl font-bold mb-4"
          style={{ color: theme.primary }}
        >
          {timeLeft}
        </div>
        <div 
          className="text-3xl font-medium"
          style={{ color: theme.primary }}
        >
          {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
        </div>
      </div>
    </div>
  );
}; 