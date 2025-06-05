import React from 'react';
import { Heart, Activity, Droplets } from 'lucide-react';
import { AverageScanData } from '../types/healthData';

interface QuickSummaryCardsProps {
  data: AverageScanData;
}

const QuickSummaryCards: React.FC<QuickSummaryCardsProps> = ({ data }) => {
  const cards = [
    {
      title: 'Heart Rate',
      value: data.hr,
      unit: 'BPM',
      icon: Heart,
      color: 'red',
      bgColor: 'bg-red-500',
      bgColorDark: 'dark:bg-red-600'
    },
    {
      title: 'HRV',
      value: data.sdnn,
      unit: 'ms',
      icon: Activity,
      color: 'purple',
      bgColor: 'bg-purple-500',
      bgColorDark: 'dark:bg-purple-600'
    },
    {
      title: 'Oxygen Saturation',
      value: data.spo2,
      unit: '%',
      icon: Droplets,
      color: 'teal',
      bgColor: 'bg-teal-500',
      bgColorDark: 'dark:bg-teal-600'
    }
  ];

  return (
    <div className="mb-2 md:mb-4">
      {/* Mobile: horizontal scroll, Desktop: grid */}
      <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-2 md:gap-4 pb-1 md:pb-0 scrollbar-hide" aria-label="Quick Overview Cards">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-3 md:p-6 hover:shadow-xl hover:scale-[1.03] transition-all duration-300 text-center min-w-[120px] md:min-w-0 md:min-h-[200px] flex-shrink-0"
              style={{
                animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl ${card.bgColor} ${card.bgColorDark} flex items-center justify-center mb-2 md:mb-4 mx-auto shadow-lg`}>
                <Icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
              <div className="space-y-0.5 md:space-y-2">
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">{card.title}</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{card.unit}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickSummaryCards;
