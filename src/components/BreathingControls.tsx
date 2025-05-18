import { useBreathingStore } from '../store/breathingStore';
import { BREATHING_PATTERNS } from '../utils/patterns';

/**
 * BreathingControls component for controlling breathing exercises
 */
export const BreathingControls = () => {
  const {
    currentPattern,
    isPlaying,
    currentPhase,
    timeLeft,
    setPattern,
    togglePlay
  } = useBreathingStore();

  const pattern = BREATHING_PATTERNS[currentPattern];

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      {/* Pattern Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
        {Object.entries(BREATHING_PATTERNS).map(([key, pattern]) => (
          <button
            key={key}
            onClick={() => setPattern(key)}
            className={`p-4 rounded-lg transition-all duration-300 ${
              currentPattern === key
                ? 'ring-2 ring-offset-2'
                : 'hover:scale-105'
            }`}
            style={{
              backgroundColor: pattern.color,
              color: 'white'
            }}
          >
            <h3 className="text-lg font-semibold">{pattern.name}</h3>
            <p className="text-sm opacity-90">
              {pattern.inhale}-{pattern.hold}-{pattern.exhale}
            </p>
          </button>
        ))}
      </div>

      {/* Current Phase Display */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 capitalize">{currentPhase}</h2>
        <p className="text-4xl font-mono">{timeLeft}</p>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="p-4 rounded-full transition-transform hover:scale-110"
        style={{
          backgroundColor: pattern.color,
          color: 'white'
        }}
      >
        {isPlaying ? (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </button>

      {/* Pattern Description */}
      <div className="max-w-2xl text-center">
        <p className="text-lg mb-2">{pattern.description}</p>
        <p className="text-sm opacity-75">{pattern.science}</p>
      </div>
    </div>
  );
}; 