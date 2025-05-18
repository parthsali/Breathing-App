import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useSessions } from '../hooks/useSessions';
import { CHART } from '../utils/constants';
import type { ChartOptions } from '../types';

/**
 * SessionStats component for displaying breathing session statistics
 */
export const SessionStats = () => {
  const { totalSessions, totalDuration, averageDuration, getChartData } = useSessions();
  const [duration, setDuration] = useState<'days' | 'weeks' | 'months'>('days');

  const chartOptions: ChartOptions = {
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
          display: true
        },
        ticks: {
          display: true
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          display: true
        }
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Sessions</h3>
          <p className="text-3xl font-bold">{totalSessions}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Duration</h3>
          <p className="text-3xl font-bold">{Math.round(totalDuration / 60)}h</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Average Duration</h3>
          <p className="text-3xl font-bold">{averageDuration}m</p>
        </div>
      </div>

      {/* Duration Selector */}
      <div className="flex justify-center space-x-4">
        {(['days', 'weeks', 'months'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setDuration(period)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              duration === period
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64">
        <Line data={getChartData(duration)} options={chartOptions} />
      </div>
    </div>
  );
}; 