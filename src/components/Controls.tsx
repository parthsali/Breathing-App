import React from 'react';
import { useBreathingStore } from '../store/breathingStore';

const themes = [
  {
    name: 'Ocean',
    primary: '#64b5f6',
    secondary: '#80cbc4',
    background: '#e0f7fa',
  },
  {
    name: 'Forest',
    primary: '#81c784',
    secondary: '#a5d6a7',
    background: '#c8e6c9',
  },
  {
    name: 'Lavender',
    primary: '#9575cd',
    secondary: '#b39ddb',
    background: '#e1bee7',
  },
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

  return (
    <div className="fixed top-4 right-4 p-6 bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl w-96 transform transition-all duration-300 hover:shadow-2xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Breathing Controls</h2>
          <button
            onClick={isBreathing ? stopBreathing : startBreathing}
            className={`px-6 py-2 rounded-full text-white font-medium transition-all duration-300 transform hover:scale-105 ${
              isBreathing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isBreathing ? 'Stop' : 'Start'} Breathing
          </button>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Inhale', value: inhaleTime, onChange: (v: number) => setBreathingPattern(v, holdTime, exhaleTime) },
            { label: 'Hold', value: holdTime, onChange: (v: number) => setBreathingPattern(inhaleTime, v, exhaleTime) },
            { label: 'Exhale', value: exhaleTime, onChange: (v: number) => setBreathingPattern(inhaleTime, holdTime, v) },
          ].map(({ label, value, onChange }) => (
            <div key={label} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <span className="text-sm font-medium text-gray-500">{value}s</span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Theme</label>
          <div className="flex gap-3">
            {themes.map((t) => (
              <button
                key={t.name}
                onClick={() => setTheme(t)}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                  theme.primary === t.primary
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {isBreathing && (
          <div className="text-center py-2 px-4 bg-blue-50 rounded-lg">
            <span className="text-blue-700 font-medium">
              Current Phase: {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}; 