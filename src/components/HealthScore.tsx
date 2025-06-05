import React, { useEffect, useState } from 'react';

interface HealthScoreProps {
  score: number;
}

const HealthScore: React.FC<HealthScoreProps> = ({ score }) => {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { setAnimate(true); }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  const color = getScoreColor(score);
  const colorClasses = {
    green: 'from-green-400 to-green-600',
    yellow: 'from-yellow-400 to-yellow-600',
    red: 'from-red-400 to-red-600'
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-xl hover:scale-[1.03] transition-all duration-300 min-h-[200px]` + (animate ? ' animate-fade-in-up' : ' opacity-0 translate-y-4')} aria-label="Health Score Card">
      <div className="flex items-center justify-between mb-3 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Health Score</h3>
        <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
          color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
          color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
        }`}>
          {color === 'green' ? 'Excellent' : color === 'yellow' ? 'Good' : 'Needs Attention'}
        </span>
      </div>
      
      <div className="space-y-2 md:space-y-4">
        <div className="text-center flex items-baseline justify-center gap-1">
          <span className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">{score.toFixed(1)}</span>
          <span className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">%</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 md:h-4 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full transition-all duration-1000 ease-out shadow-lg`}
            style={{ width: `${score}%` }}
          />
        </div>
        
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 text-center font-medium">Based on facial scan analysis</p>
      </div>
    </div>
  );
};

export default HealthScore;
