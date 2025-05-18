import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
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
  container: "h-screen relative overflow-hidden",
  content: "relative z-10 max-w-7xl mx-auto px-6 py-8",
  header: "mb-8 text-center relative",
  title: "text-3xl font-bold mb-2",
  subtitle: "text-base opacity-80",
  backButton: "fixed top-6 left-6 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-lg cursor-pointer",
  clearButton: "fixed top-6 right-6 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-lg cursor-pointer",
  mainGrid: "grid grid-cols-5 gap-6",
  leftSection: "col-span-3",
  rightSection: "col-span-2",
  statsGrid: "grid grid-cols-2 gap-4 mb-6",
  statCard: "text-center p-4 rounded-xl backdrop-blur-lg transition-all duration-300 transform hover:scale-102",
  statValue: "text-2xl font-bold mb-1",
  statLabel: "text-sm opacity-80",
  sessionList: "space-y-3",
  sessionItem: "px-4 py-2 rounded-xl backdrop-blur-lg transition-all duration-300 transform hover:scale-102",
  patternName: "text-base font-medium",
  patternDetails: "text-xs opacity-60",
  details: "text-xs opacity-60",
  duration: "text-lg font-bold",
  emptyState: "text-center py-8 text-sm opacity-60",
  pagination: "flex justify-center items-center gap-3 py-3 mt-4 rounded-xl backdrop-blur-lg",
  pageButton: "px-3 py-1.5 rounded-full backdrop-blur-lg transition-all duration-300 text-xs transform hover:scale-102",
  pageInfo: "text-xs opacity-80",
  chartCard: "p-4 rounded-xl backdrop-blur-lg transition-all duration-300 mb-4",
  chartTitle: "text-sm font-medium mb-3",
  chartContainer: "h-40"
} as const;

export const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useBreathingStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 4;

  useEffect(() => {
    const storedSessions = localStorage.getItem('breathing-sessions');
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
  }, []);

  const handleClearStats = () => {
    if (window.confirm('Are you sure you want to clear all your breathing session data? This action cannot be undone.')) {
      localStorage.removeItem('breathing-sessions');
      setSessions([]);
      setCurrentPage(1);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    };
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
  
  // Pagination calculations
  const totalPages = Math.ceil(sessions.length / sessionsPerPage);
  const startIndex = (currentPage - 1) * sessionsPerPage;
  const endIndex = startIndex + sessionsPerPage;
  const currentSessions = sessions.slice(startIndex, endIndex);

  // Prepare chart data
  const sessionDurations = sessions.map(session => session.duration / 60);
  const patternUsage = sessions.reduce((acc, session) => {
    const pattern = getPatternInfo(session.inhaleTime, session.holdTime, session.exhaleTime).name;
    acc[pattern] = (acc[pattern] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const durationChartData = {
    labels: sessions.map(session => {
      const { date, time } = formatDate(session.date);
      return `${date} ${time}`;
    }),
    datasets: [{
      label: 'Duration (minutes)',
      data: sessionDurations,
      borderColor: theme.primary,
      backgroundColor: `${theme.primary}20`,
      tension: 0.4,
      fill: true
    }]
  };

  const patternChartData = {
    labels: Object.keys(patternUsage),
    datasets: [{
      data: Object.values(patternUsage),
      backgroundColor: [
        `${theme.primary}80`,
        `${theme.primary}60`,
        `${theme.primary}40`,
        `${theme.primary}20`
      ],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        },
        ticks: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          display: false
        }
      }
    }
  };

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
          border: `1px solid ${theme.primary}40`,
          boxShadow: `0 4px 14px ${theme.primary}40`,
          position: "fixed",
          zIndex: 1000,
          color: theme.primary
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
          <button
            onClick={handleClearStats}
            className={STATS_STYLES.clearButton}
            style={{ 
              background: `${theme.primary}20`,
              border: `1px solid ${theme.primary}40`,
              boxShadow: `0 4px 14px ${theme.primary}40`,
              position: "fixed",
              zIndex: 1000,
              color: theme.primary
            }}
          >
            Clear Data
          </button>
        </div>

        <div className={STATS_STYLES.mainGrid}>
          <div className={STATS_STYLES.leftSection}>
            <div className={STATS_STYLES.statsGrid}>
              <div 
                className={STATS_STYLES.statCard}
                style={{ 
                  background: `${theme.primary}20`,
                  border: `2px solid ${theme.primary}40`,
                  boxShadow: `0 4px 14px ${theme.primary}40`
                }}
              >
                <div className={STATS_STYLES.statValue} style={{ color: theme.primary }}>
                  {totalSessions}
                </div>
                <div className={STATS_STYLES.statLabel} style={{ color: theme.primary }}>
                  Sessions
                </div>
              </div>

              <div 
                className={STATS_STYLES.statCard}
                style={{ 
                  background: `${theme.primary}20`,
                  border: `2px solid ${theme.primary}40`,
                  boxShadow: `0 4px 14px ${theme.primary}40`
                }}
              >
                <div className={STATS_STYLES.statValue} style={{ color: theme.primary }}>
                  {formatDuration(totalDuration)}
                </div>
                <div className={STATS_STYLES.statLabel} style={{ color: theme.primary }}>
                  Total Time
                </div>
              </div>
            </div>

            <div className={STATS_STYLES.sessionList}>
              {currentSessions.length > 0 ? (
                <>
                  {currentSessions.map((session) => {
                    const patternInfo = getPatternInfo(session.inhaleTime, session.holdTime, session.exhaleTime);
                    const { date, time } = formatDate(session.date);
                    return (
                      <div 
                        key={session.id} 
                        className={STATS_STYLES.sessionItem}
                        style={{ 
                          background: `${theme.primary}20`,
                          border: `2px solid ${theme.primary}40`,
                          boxShadow: `0 4px 14px ${theme.primary}40`
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className={STATS_STYLES.patternName} style={{ color: theme.primary }}>
                                {patternInfo.name}
                              </div>
                              <div className={STATS_STYLES.patternDetails} style={{ color: theme.primary }}>
                                ({session.inhaleTime}-{session.holdTime}-{session.exhaleTime})
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={STATS_STYLES.duration} style={{ color: theme.primary }}>
                              {formatDuration(session.duration)}
                            </div>
                            <div className={STATS_STYLES.details} style={{ color: theme.primary }}>
                              {date} {time}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {totalPages > 1 && (
                    <div 
                      className={STATS_STYLES.pagination}
                      style={{ 
                        background: `${theme.primary}20`,
                        border: `2px solid ${theme.primary}40`,
                        boxShadow: `0 4px 14px ${theme.primary}40`
                      }}
                    >
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={STATS_STYLES.pageButton}
                        style={{ 
                          background: `${theme.primary}20`,
                          border: `2px solid ${theme.primary}40`,
                          color: theme.primary,
                          opacity: currentPage === 1 ? 0.5 : 1,
                          boxShadow: `0 4px 14px ${theme.primary}40`
                        }}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <span className={STATS_STYLES.pageInfo} style={{ color: theme.primary }}>
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={STATS_STYLES.pageButton}
                        style={{ 
                          background: `${theme.primary}20`,
                          border: `2px solid ${theme.primary}40`,
                          color: theme.primary,
                          opacity: currentPage === totalPages ? 0.5 : 1,
                          boxShadow: `0 4px 14px ${theme.primary}40`
                        }}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className={STATS_STYLES.emptyState} style={{ color: theme.primary }}>
                  <p>No sessions recorded yet.</p>
                  <p className="mt-1">Start your breathing journey to see your progress here.</p>
                </div>
              )}
            </div>
          </div>

          <div className={STATS_STYLES.rightSection}>
            <div 
              className={STATS_STYLES.chartCard}
              style={{ 
                background: `${theme.primary}20`,
                border: `2px solid ${theme.primary}40`,
                boxShadow: `0 4px 14px ${theme.primary}40`
              }}
            >
              <div className={STATS_STYLES.chartTitle} style={{ color: theme.primary }}>
                Session Duration Trend
              </div>
              <div className={STATS_STYLES.chartContainer}>
                <Line data={durationChartData} options={chartOptions} />
              </div>
            </div>

            <div 
              className={STATS_STYLES.chartCard}
              style={{ 
                background: `${theme.primary}20`,
                border: `2px solid ${theme.primary}40`,
                boxShadow: `0 4px 14px ${theme.primary}40`
              }}
            >
              <div className={STATS_STYLES.chartTitle} style={{ color: theme.primary }}>
                Pattern Usage
              </div>
              <div className={STATS_STYLES.chartContainer}>
                <Doughnut data={patternChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 