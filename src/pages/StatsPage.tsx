import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useBreathingStore } from '../store/breathingStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Session {
  id: string;
  pattern: string;
  duration: number;
  date: string;
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
}

// List of patterns with their specific colors and descriptions
const BREATHING_PATTERNS = [
  {
    name: 'Calm',
    inhale: 4,
    hold: 4,
    exhale: 6,
    description: 'Perfect for relaxation and stress relief'
  },
  {
    name: 'Focus',
    inhale: 4,
    hold: 7,
    exhale: 8,
    description: 'Enhances concentration and mental clarity'
  },
  {
    name: 'Balance',
    inhale: 4,
    hold: 4,
    exhale: 4,
    description: 'Promotes emotional balance and stability'
  },
  {
    name: 'Deep',
    inhale: 6,
    hold: 2,
    exhale: 7,
    description: 'Deep breathing for energy and vitality'
  }
];

const STATS_STYLES = {
  container: "min-h-screen relative overflow-hidden",
  content: "relative z-10 max-w-5xl mx-auto px-8 py-12",
  header: "mb-16 text-center",
  title: "text-5xl font-bold mb-4",
  subtitle: "text-xl opacity-80",
  backButton: "fixed top-8 left-8 px-6 py-3 rounded-full text-white font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-lg",
  statsGrid: "grid grid-cols-2 gap-8 mb-16",
  statCard: "text-center p-8 rounded-2xl backdrop-blur-lg transition-all duration-300",
  statValue: "text-4xl font-bold mb-2",
  statLabel: "text-lg opacity-80",
  sessionList: "space-y-6",
  sessionItem: "p-6 rounded-2xl backdrop-blur-lg transition-all duration-300",
  patternName: "text-2xl font-medium mb-2",
  patternDescription: "text-lg opacity-80 mb-4",
  details: "text-sm opacity-60",
  duration: "text-3xl font-bold mt-4",
  emptyState: "text-center py-16 text-xl opacity-60"
} as const;

export const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useBreathingStore();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const storedSessions = localStorage.getItem('breathing-sessions');
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
  }, []);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPatternInfo = (inhale: number, hold: number, exhale: number) => {
    const pattern = BREATHING_PATTERNS.find(
      p => p.inhale === inhale && p.hold === hold && p.exhale === exhale
    );
    return pattern || {
      name: `${inhale}-${hold}-${exhale}`,
      description: 'Custom breathing pattern'
    };
  };

  // Calculate statistics
  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((acc, session) => acc + session.duration, 0);
  const averageDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions / 60) : 0;

  return (
    <div 
      className={STATS_STYLES.container}
      style={{ background: theme.background }}
    >
      <button
        onClick={() => navigate('/')}
        className={STATS_STYLES.backButton}
        style={{ 
          background: `${theme.primary}40`,
          border: `1px solid ${theme.primary}40`
        }}
      >
        ← Back
      </button>

      <div className={STATS_STYLES.content}>
        <div className={STATS_STYLES.header}>
          <h1 className={STATS_STYLES.title} style={{ color: theme.primary }}>
            Your Breathing Journey
          </h1>
          <p className={STATS_STYLES.subtitle} style={{ color: theme.primary }}>
            Track your progress and find your rhythm
          </p>
        </div>

        <div className={STATS_STYLES.statsGrid}>
          <div 
            className={STATS_STYLES.statCard}
            style={{ 
              background: `${theme.primary}20`,
              border: `1px solid ${theme.primary}40`
            }}
          >
            <div className={STATS_STYLES.statValue} style={{ color: theme.primary }}>
              {totalSessions}
            </div>
            <div className={STATS_STYLES.statLabel} style={{ color: theme.primary }}>
              Sessions Completed
            </div>
          </div>

          <div 
            className={STATS_STYLES.statCard}
            style={{ 
              background: `${theme.primary}20`,
              border: `1px solid ${theme.primary}40`
            }}
          >
            <div className={STATS_STYLES.statValue} style={{ color: theme.primary }}>
              {formatDuration(totalDuration)}
            </div>
            <div className={STATS_STYLES.statLabel} style={{ color: theme.primary }}>
              Total Breathing Time
            </div>
          </div>
        </div>

        <div className={STATS_STYLES.sessionList}>
          {sessions.length > 0 ? (
            sessions.slice(0, 5).map((session) => {
              const patternInfo = getPatternInfo(session.inhaleTime, session.holdTime, session.exhaleTime);
              return (
                <div 
                  key={session.id} 
                  className={STATS_STYLES.sessionItem}
                  style={{ 
                    background: `${theme.primary}20`,
                    border: `1px solid ${theme.primary}40`
                  }}
                >
                  <div className={STATS_STYLES.patternName} style={{ color: theme.primary }}>
                    {patternInfo.name}
                  </div>
                  <div className={STATS_STYLES.patternDescription} style={{ color: theme.primary }}>
                    {patternInfo.description}
                  </div>
                  <div className={STATS_STYLES.details} style={{ color: theme.primary }}>
                    {formatDate(session.date)}
                  </div>
                  <div className={STATS_STYLES.duration} style={{ color: theme.primary }}>
                    {formatDuration(session.duration)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={STATS_STYLES.emptyState} style={{ color: theme.primary }}>
              <p>No sessions recorded yet.</p>
              <p className="mt-2">Start your breathing journey to see your progress here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 