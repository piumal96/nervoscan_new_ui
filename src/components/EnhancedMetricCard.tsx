import React, { useState } from 'react';
import { MetricCardData } from '../types/healthData';
import { Heart, Activity, Droplets, Gauge, Shield, TestTube, Syringe, Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

const EnhancedMetricCard: React.FC<MetricCardData> = ({
  title,
  value,
  unit,
  subtitle,
  color,
  category,
  showGraph,
  status = 'normal',
  info
}) => {
  const colorClasses = {
    red: { start: '#ef4444', end: '#dc2626', bg: 'bg-red-500', bgDark: 'dark:bg-red-600' },
    purple: { start: '#a855f7', end: '#7c3aed', bg: 'bg-purple-500', bgDark: 'dark:bg-purple-600' },
    green: { start: '#22c55e', end: '#16a34a', bg: 'bg-green-500', bgDark: 'dark:bg-green-600' },
    orange: { start: '#f97316', end: '#ea580c', bg: 'bg-orange-500', bgDark: 'dark:bg-orange-600' },
    indigo: { start: '#6366f1', end: '#4338ca', bg: 'bg-indigo-500', bgDark: 'dark:bg-indigo-600' },
    teal: { start: '#14b8a6', end: '#0d9488', bg: 'bg-teal-500', bgDark: 'dark:bg-teal-600' },
    cyan: { start: '#06b6d4', end: '#0891b2', bg: 'bg-cyan-500', bgDark: 'dark:bg-cyan-600' },
    pink: { start: '#ec4899', end: '#db2777', bg: 'bg-pink-500', bgDark: 'dark:bg-pink-600' },
    blue: { start: '#3b82f6', end: '#2563eb', bg: 'bg-blue-500', bgDark: 'dark:bg-blue-600' }
  };

  const statusColors = {
    normal: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
    critical: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
  };

  const currentColors = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  const generateGraphData = () => {
    const baseValue = parseFloat(value.toString()) || 50;
    const points = [];
    
    for (let i = 0; i < 20; i++) {
      const x = (i / 19) * 100;
      const trend = Math.sin(i * 0.4) * 15;
      const noise = (Math.random() - 0.5) * 8;
      const y = Math.max(10, Math.min(90, 50 + trend + noise));
      points.push({ x, y });
    }
    
    return points;
  };

  const graphData = showGraph ? generateGraphData() : [];
  const gradientId = `gradient-${title.replace(/\s+/g, '-').toLowerCase()}`;

  const [flipped, setFlipped] = useState(false);
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const handleFlip = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (isTouchDevice || e.type === 'click' || e.type === 'keydown') {
      setFlipped(f => !f);
    }
  };

  // Icon selection based on title
  let MetricIcon = Info;
  if (title.toLowerCase().includes('heart rate') && !title.toLowerCase().includes('variability')) MetricIcon = Heart;
  else if (title.toLowerCase().includes('respiration')) MetricIcon = Gauge;
  else if (title.toLowerCase().includes('variability')) MetricIcon = Activity;
  else if (title.toLowerCase().includes('blood pressure')) MetricIcon = Shield;
  else if (title.toLowerCase().includes('glucose')) MetricIcon = Syringe;
  else if (title.toLowerCase().includes('hemoglobin')) MetricIcon = TestTube;
  else if (title.toLowerCase().includes('spo2') || title.toLowerCase().includes('oxygen')) MetricIcon = Droplets;

  return (
    <div
      className="relative perspective h-full min-h-[200px]"
      tabIndex={0}
      aria-label="Detailed Metric Card"
      onClick={isTouchDevice ? handleFlip : undefined}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleFlip(e)}
      onMouseEnter={!isTouchDevice ? () => setFlipped(true) : undefined}
      onMouseLeave={!isTouchDevice ? () => setFlipped(false) : undefined}
      style={{ outline: 'none' }}
    >
      <div 
        className={`transition-transform duration-500 w-full h-full absolute top-0 left-0 backface-hidden ${flipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-3 md:p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center mb-2">
            <div className={`w-8 h-8 rounded-lg ${currentColors.bg} ${currentColors.bgDark} flex items-center justify-center shadow-lg mr-2 flex-shrink-0`}>
              <MetricIcon className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white leading-tight line-clamp-2">{title}</h3>
          </div>

          {/* Value & Unit */}
          <div className="mb-2 flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>
          </div>

          {/* Graph */}
          {showGraph && graphData.length > 0 && (
            <div className="flex-1 min-h-[60px] max-h-[80px] mb-2">
              <svg className="w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={currentColors.start} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={currentColors.end} stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0 ${graphData[0].y} ${graphData.map((point, i) => 
                    i === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
                  ).join(' ')} L 100 60 L 0 60 Z`}
                  fill={`url(#${gradientId})`}
                />
                <path
                  d={`M ${graphData[0].x} ${graphData[0].y} ${graphData.slice(1).map((point, i) => {
                    const prev = graphData[i];
                    const cpx1 = prev.x + (point.x - prev.x) / 3;
                    const cpy1 = prev.y;
                    const cpx2 = point.x - (point.x - prev.x) / 3;
                    const cpy2 = point.y;
                    return `C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${point.x} ${point.y}`;
                  }).join(' ')}`}
                  stroke={currentColors.start}
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
          )}

          {/* Category and Subtitle */}
          <div className="mt-auto space-y-1">
            {category && (
              <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[status]}`}>
                {category}
              </span>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight line-clamp-2">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Back Side (Info) */}
        <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center justify-center h-full backface-hidden rotate-y-180">
          <Info className="h-6 w-6 text-blue-500 mb-2" />
          <div className="flex-1 w-full flex flex-col">
            <div className="text-sm text-gray-700 dark:text-gray-200 text-center max-w-xs mx-auto overflow-y-auto flex-1 mb-4" style={{maxHeight: '120px'}}>
              {info}
            </div>
            <button
              type="button"
              className="mt-auto px-3 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={handleFlip}
              tabIndex={0}
              aria-label="Back to metric"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMetricCard;
