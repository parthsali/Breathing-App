import React, { useEffect, useState } from 'react';
import { useBreathingStore } from '../store/breathingStore';

export const InitialCountdown: React.FC = () => {
  const { theme, startBreathing } = useBreathingStore();
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      startBreathing();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, startBreathing]);

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
          className="text-9xl font-bold mb-4 animate-pulse"
          style={{ color: theme.primary }}
        >
          {count === 0 ? 'Go!' : count}
        </div>
      </div>
    </div>
  );
}; 