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

const STATS_STYLES = {
  container: "min-h-screen bg-gray-50 p-8",
  header: "max-w-7xl mx-auto mb-8",
  title: "text-3xl font-bold text-gray-900",
  backButton: "mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700",
  grid: "max-w-7xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2",
  card: "bg-white rounded-lg shadow-lg p-6",
  cardTitle: "text-xl font-semibold text-gray-900 mb-4",
  sessionList: "space-y-4",
  sessionItem: "bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow",
  patternName: "text-lg font-medium text-gray-900",
  details: "text-sm text-gray-500 mt-2",
  duration: "text-2xl font-bold text-indigo-600 mt-2",
  emptyState: "text-center py-12 text-gray-500"
} as const;

export const StatsPage: React.FC = () => {
  const navigate = useNavigate();
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const chartData = {
    labels: sessions.map(session => formatDate(session.date)),
    datasets: [
      {
        label: 'Session Duration (minutes)',
        data: sessions.map(session => session.duration / 60),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Session Duration Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Duration (minutes)'
        }
      }
    }
  };

  const patternStats = sessions.reduce((acc, session) => {
    acc[session.pattern] = (acc[session.pattern] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const patternChartData = {
    labels: Object.keys(patternStats),
    datasets: [
      {
        data: Object.values(patternStats),
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ]
      }
    ]
  };

  return (
    <div className={STATS_STYLES.container}>
      <div className={STATS_STYLES.header}>
        <h1 className={STATS_STYLES.title}>Breathing Session Statistics</h1>
        <button
          onClick={() => navigate('/')}
          className={STATS_STYLES.backButton}
        >
          Back to Breathing Exercise
        </button>
      </div>

      <div className={STATS_STYLES.grid}>
        <div className={STATS_STYLES.card}>
          <h2 className={STATS_STYLES.cardTitle}>Session Duration Trend</h2>
          {sessions.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className={STATS_STYLES.emptyState}>
              No session data available yet
            </div>
          )}
        </div>

        <div className={STATS_STYLES.card}>
          <h2 className={STATS_STYLES.cardTitle}>Pattern Usage</h2>
          {sessions.length > 0 ? (
            <div className="h-64">
              <Line data={patternChartData} options={chartOptions} />
            </div>
          ) : (
            <div className={STATS_STYLES.emptyState}>
              No pattern data available yet
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className={STATS_STYLES.card}>
            <h2 className={STATS_STYLES.cardTitle}>Session History</h2>
            {sessions.length > 0 ? (
              <div className={STATS_STYLES.sessionList}>
                {sessions.map((session) => (
                  <div key={session.id} className={STATS_STYLES.sessionItem}>
                    <div className={STATS_STYLES.patternName}>
                      {session.pattern}
                    </div>
                    <div className={STATS_STYLES.details}>
                      <p>Pattern: {session.inhaleTime}-{session.holdTime}-{session.exhaleTime}</p>
                      <p>Date: {formatDate(session.date)}</p>
                    </div>
                    <div className={STATS_STYLES.duration}>
                      {formatDuration(session.duration)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={STATS_STYLES.emptyState}>
                <p>No sessions recorded yet.</p>
                <p className="text-sm mt-2">Complete a breathing session to see your stats here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 