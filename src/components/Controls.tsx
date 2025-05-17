import React, { useState } from 'react';
import { useBreathingStore } from '../store/breathingStore';
import { InitialCountdown } from './InitialCountdown';

const breathingPatterns = [
  {
    name: 'Calm',
    description: 'Used for stress relief and relaxation',
    inhale: 4,
    hold: 4,
    exhale: 6,
    theme: {
      name: 'Ocean',
      primary: '#64b5f6',
      secondary: '#80cbc4',
      background: '#e0f7fa',
    }
  },
  {
    name: 'Focus',
    description: 'Used for concentration and mental clarity',
    inhale: 4,
    hold: 7,
    exhale: 8,
    theme: {
      name: 'Forest',
      primary: '#81c784',
      secondary: '#a5d6a7',
      background: '#c8e6c9',
    }
  },
  {
    name: 'Balance',
    description: 'Used for emotional stability and grounding',
    inhale: 4,
    hold: 4,
    exhale: 4,
    theme: {
      name: 'Lavender',
      primary: '#9575cd',
      secondary: '#b39ddb',
      background: '#e1bee7',
    }
  },
  {
    name: 'Deep',
    description: 'Used for anxiety relief and deep relaxation',
    inhale: 6,
    hold: 2,
    exhale: 7,
    theme: {
      name: 'Sunset',
      primary: '#ff7043',
      secondary: '#ffab91',
      background: '#ffecb3',
    }
  }
];

export const Controls: React.FC = () => {
  const {
    inhaleTime,
    holdTime,
    exhaleTime,
    isBreathing,
    currentPhase,
    theme,
    setBreathingPattern,
    setTheme,
  } = useBreathingStore();

  const [showInitialCountdown, setShowInitialCountdown] = useState(false);

  const handlePatternSelect = (pattern: typeof breathingPatterns[0]) => {
    setBreathingPattern(pattern.inhale, pattern.hold, pattern.exhale);
    setTheme(pattern.theme);
  };

  return (
    <div 
      className="fixed left-4 top-4 p-6 w-80 transform transition-all duration-300"
      style={{ 
        background: `${theme.background}99`,
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          {breathingPatterns.map((pattern) => (
            <button
              key={pattern.name}
              onClick={() => handlePatternSelect(pattern)}
              className="w-full p-4 rounded-xl transition-all duration-300 transform hover:scale-102"
              style={{
                background: theme.primary === pattern.theme.primary 
                  ? `${pattern.theme.primary}20`
                  : 'rgba(255, 255, 255, 0.1)',
                border: `2px solid ${theme.primary === pattern.theme.primary 
                  ? pattern.theme.primary 
                  : 'rgba(255, 255, 255, 0.2)'}`,
                boxShadow: theme.primary === pattern.theme.primary 
                  ? `0 4px 14px ${pattern.theme.primary}40`
                  : 'none'
              }}
            >
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <h3 
                    className="font-semibold mb-1"
                    style={{ color: theme.primary === pattern.theme.primary 
                      ? pattern.theme.primary 
                      : '#374151' }}
                  >
                    {pattern.name}
                  </h3>
                  <p 
                    className="text-xs opacity-70"
                    style={{ color: theme.primary === pattern.theme.primary 
                      ? `${pattern.theme.primary}CC`
                      : '#6B7280' }}
                  >
                    {pattern.description}
                  </p>
                </div>
                <div className="text-right">
                  <div 
                    className="text-sm font-medium"
                    style={{ color: theme.primary === pattern.theme.primary 
                      ? pattern.theme.primary 
                      : '#4B5563' }}
                  >
                    {pattern.inhale}-{pattern.hold}-{pattern.exhale}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {isBreathing && (
          <div 
            className="text-center py-3 px-4 rounded-lg"
            style={{ 
              background: `${theme.primary}20`,
              color: theme.primary
            }}
          >
            <div className="font-medium mb-1">
              {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
            </div>
            <div className="text-sm opacity-80">
              {currentPhase === 'inhale' && `${inhaleTime}s to inhale`}
              {currentPhase === 'hold' && `${holdTime}s to hold`}
              {currentPhase === 'exhale' && `${exhaleTime}s to exhale`}
            </div>
          </div>
        )}
      </div>
      {showInitialCountdown && <InitialCountdown />}
    </div>
  );
}; 