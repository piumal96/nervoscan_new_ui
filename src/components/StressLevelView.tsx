import React, { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';

interface StressLevelViewProps {
  stressLevel: string;
}

const StressLevelView: React.FC<StressLevelViewProps> = ({ stressLevel }) => {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { setAnimate(true); }, []);

  const getStressData = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return { 
          value: 25, 
          color: 'green', 
          tip: 'Try 5 minutes of deep breathing to reduce stress',
          bgColor: 'bg-green-500',
          textColor: 'text-green-800 dark:text-green-200'
        };
      case 'moderate':
        return { 
          value: 60, 
          color: 'yellow', 
          tip: 'Try 5 minutes of deep breathing or a short walk to help reduce stress.',
          bgColor: 'bg-yellow-500',
          textColor: 'text-yellow-800 dark:text-yellow-200'
        };
      case 'high':
        return { 
          value: 85, 
          color: 'red', 
          tip: 'Consider meditation, yoga, or speaking with a healthcare provider.',
          bgColor: 'bg-red-500',
          textColor: 'text-red-800 dark:text-red-200'
        };
      default:
        return { 
          value: 0, 
          color: 'gray', 
          tip: 'No data available.',
          bgColor: 'bg-gray-500',
          textColor: 'text-gray-800 dark:text-gray-200'
        };
    }
  };

  const stressData = getStressData(stressLevel);
  const circumference = 2 * Math.PI * 30;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (stressData.value / 100) * circumference;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:scale-[1.03] transition-all duration-300 min-h-[200px]` + (animate ? ' animate-fade-in-up' : ' opacity-0 translate-y-4')} aria-label="Stress Level Card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
          <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stress Level</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          stressData.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
          stressData.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
        }`}>
          {stressLevel}
        </span>
      </div>

      <div className="flex items-center space-x-6">
        {/* Circular Progress with Gradient */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="30"
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="none"
              className="dark:stroke-gray-600"
            />
            <circle
              cx="40"
              cy="40"
              r="30"
              stroke="url(#stressGradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="stressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900 dark:text-white">{stressData.value}%</span>
          </div>
        </div>

        {/* Progress Bar and Labels */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
          </div>
          
          <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full" />
            <div 
              className="absolute top-0 w-3 h-3 bg-white dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-500 rounded-full shadow-sm transition-all duration-1000 ease-out"
              style={{ left: `calc(${stressData.value}% - 6px)` }}
            />
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300">{stressData.tip}</p>
        </div>
      </div>
    </div>
  );
};

export default StressLevelView;
