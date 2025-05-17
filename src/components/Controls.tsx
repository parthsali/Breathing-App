import React from 'react';
import { useBreathingStore } from '../store/breathingStore';

const breathingPatterns = [
  {
    name: 'Calm',
    description: 'Relaxing breathing pattern',
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
    description: 'Energizing breathing pattern',
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
    description: 'Equal breathing pattern',
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
    description: 'Deep breathing pattern',
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
    startBreathing,
    stopBreathing,
  } = useBreathingStore();

  const handlePatternSelect = (pattern: typeof breathingPatterns[0]) => {
    setBreathingPattern(pattern.inhale, pattern.hold, pattern.exhale);
    setTheme(pattern.theme);
  };

  return (
    <div 
      className="fixed left-4 top-4 p-6 rounded-2xl w-80 transform transition-all duration-300"
      style={{ 
        background: `${theme.background}99`,
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: theme.primary }}>Breathing Patterns</h2>
          <button
            onClick={isBreathing ? stopBreathing : startBreathing}
            className="px-6 py-2 rounded-full text-white font-medium transition-all duration-300 transform hover:scale-105"
            style={{ 
              background: isBreathing ? '#ef4444' : theme.primary,
              boxShadow: `0 4px 14px ${isBreathing ? '#ef444480' : theme.primary + '80'}`
            }}
          >
            {isBreathing ? 'Stop' : 'Start'} Breathing
          </button>
        </div>

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
                    className="font-semibold"
                    style={{ color: theme.primary === pattern.theme.primary 
                      ? pattern.theme.primary 
                      : '#374151' }}
                  >
                    {pattern.name}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: theme.primary === pattern.theme.primary 
                      ? `${pattern.theme.primary}CC`
                      : '#6B7280' }}
                  >
                    {pattern.description}
                  </p>
                </div>
                <div className="text-right">
                  <div 
                    className="text-xs"
                    style={{ color: theme.primary === pattern.theme.primary 
                      ? `${pattern.theme.primary}99`
                      : '#9CA3AF' }}
                  >
                    {pattern.theme.name}
                  </div>
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
            className="text-center py-2 px-4 rounded-lg"
            style={{ 
              background: `${theme.primary}20`,
              color: theme.primary
            }}
          >
            <span className="font-medium">
              Current Phase: {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}; 