import React, { useState, useEffect } from 'react';
import { Info, Shield, Bell, User, Moon, Sun, Home, Activity, Settings, HelpCircle } from 'lucide-react';
import EnhancedMetricCard from './EnhancedMetricCard';
import StressLevelView from './StressLevelView';
import QuickSummaryCards from './QuickSummaryCards';
import HealthScore from './HealthScore';
import { sampleData, MetricCardData } from '../types/healthData';
import NervotecLogo from '../assets/Nervotec.png';

const HomeView = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  useEffect(() => {
    setIsVisible(true);
    // Check for system preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const metricCards: MetricCardData[] = [
    {
      title: 'Heart Rate',
      value: sampleData.hr,
      unit: 'BPM',
      subtitle: 'From facial analysis',
      color: 'red',
      status: 'normal',
      showGraph: true,
      info: 'Heart Rate (HR) measures the number of heartbeats per minute. A normal resting heart rate ranges from 60-100 BPM.'
    },
    {
      title: 'Respiration Rate',
      value: sampleData.rr,
      unit: 'BrPM',
      subtitle: 'Breaths per minute',
      color: 'cyan',
      status: 'normal',
      showGraph: true,
      info: 'Respiration Rate (RR) is the number of breaths per minute. A normal rate for adults is around 12-20 breaths per minute.'
    },
    {
      title: 'Heart Rate Variability',
      value: sampleData.sdnn,
      unit: 'ms',
      subtitle: 'HRV (SDNN)',
      color: 'purple',
      category: 'Good',
      showGraph: true,
      info: 'Heart Rate Variability (HRV) measures variations in the time interval between heartbeats, indicating stress and recovery balance.'
    },
    {
      title: 'Blood Pressure',
      value: `${sampleData.sbp}/${sampleData.dbp}`,
      unit: 'mmHg',
      subtitle: 'Estimated from pulse',
      color: sampleData.blood_pressure_level === 'Normal' ? 'green' : 'orange',
      status: 'normal',
      info: 'The pressure in your arteries when your heart beats. Average range for adults: 90-120 mmHg.'
    },
    {
      title: 'Blood Glucose (HbA1c)',
      value: sampleData.hba1c,
      unit: '%',
      subtitle: 'Avg. blood sugar (2-3 months)',
      color: 'orange',
      status: 'normal',
      info: 'Blood Glucose (HbA1c) represents average blood sugar levels over the past 2-3 months, used for diabetes monitoring. A normal HbA1c level is below 5.7%.'
    },
    {
      title: 'Hemoglobin',
      value: sampleData.hemoglobin,
      unit: '%',
      subtitle: 'Oxygen-carrying protein',
      color: 'indigo',
      status: 'normal',
      info: 'Hemoglobin (Hb) is a protein in red blood cells that carries oxygen. Normal levels are 13.8-17.2 g/dL for men and 12.1-15.1 g/dL for women.'
    },
    {
      title: 'SpO2',
      value: sampleData.spo2,
      unit: '%',
      subtitle: 'Oxygen saturation',
      color: 'teal',
      status: 'normal',
      showGraph: true,
      info: 'SpO2 (Oxygen Saturation) measures the amount of oxygen-carrying hemoglobin in the blood relative to the amount of non-oxygen-carrying hemoglobin. Normal levels are 95-100%.'
    }
  ];

  return (
    <div className="fixed inset-0 flex bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300">
      {/* Sidebar - Only visible on desktop */}
      <div className="hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img src={NervotecLogo} alt="Nervotec Logo" className="h-8" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">NervoEdge</span>
          </div>
        </div>
        
        <nav className="flex-1 p-3 space-y-0.5">
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            <Home className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Activity className="h-5 w-5" />
            <span className="font-medium">Activity</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <HelpCircle className="h-5 w-5" />
            <span className="font-medium">Help</span>
          </a>
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">User Name</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">user@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="px-3 py-2 md:px-6 md:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="flex items-center lg:hidden">
                  <img src={NervotecLogo} alt="NervoEdge Health Monitor" className="h-8 md:h-10" />
                </div>
              </div>
              
              <div className="flex items-center space-x-1 md:space-x-2">
                <button 
                  onClick={toggleDarkMode}
                  className="p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg md:rounded-xl transition-colors"
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
                  ) : (
                    <Moon className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                  )}
                </button>
                <button className="p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg md:rounded-xl transition-colors relative">
                  <Bell className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-300" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center text-[8px] md:text-[10px]">2</span>
                </button>
                <button className="p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg md:rounded-xl transition-colors">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-3 py-3 md:px-6 md:py-6 max-w-7xl mx-auto w-full overflow-y-auto">
          <div className="container mx-auto px-4">
            {/* Welcome Section */}
            <div className={`mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">Hello, User! 👋</h2>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-1">{currentDate}</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-xl">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-800 dark:text-blue-200 font-medium text-sm">ACTIVE</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Health Overview</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">Vitals extracted from facial scan analysis. Keep up the healthy lifestyle!</p>
                </div>
              </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" aria-label="Main dashboard grid">
              {/* Left Column - Health Score and Stress Level for desktop */}
              <div className="lg:col-span-4 flex flex-col gap-8" aria-label="Summary cards">
                {/* Health Score - Desktop only */}
                <div className="hidden lg:block">
                  <HealthScore score={sampleData.healthScore} />
                </div>
                {/* Stress Level - Desktop only */}
                <div className="hidden lg:block">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">Stress Level</h2>
                  <StressLevelView stressLevel={sampleData.stress_level} />
                </div>
              </div>

              {/* Right Column - Quick Overview and Detailed Metrics */}
              <div className="lg:col-span-8 flex flex-col gap-8" aria-label="Overview and metrics">
                {/* Quick Overview */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">Quick Overview</h2>
                  <QuickSummaryCards data={sampleData} />
                </div>
                {/* Detailed Metrics */}
                <div>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Detailed Metrics</h2>
                    <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline transition-colors self-start mt-1" aria-label="View all metrics">
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" aria-label="Detailed metrics cards">
                    {metricCards.map((card, index) => (
                      <div
                        key={card.title}
                        className={`transition-all duration-700 transform hover:scale-105 ${
                          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                        style={{ animationDelay: `${0.5 + index * 0.05}s` }}
                      >
                        <EnhancedMetricCard {...card} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Health Score - Mobile view only */}
            <div className="lg:hidden mt-6">
              <HealthScore score={sampleData.healthScore} />
            </div>
            {/* Stress Level - Mobile view only */}
            <div className="lg:hidden mt-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">Stress Level</h2>
              <StressLevelView stressLevel={sampleData.stress_level} />
            </div>

            {/* Footer */}
            <div className={`text-center text-xs text-gray-500 dark:text-gray-400 space-y-2 mt-8 transition-all duration-1000 delay-1000 px-1 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="flex items-center justify-center space-x-1">
                <Info className="h-3 w-3" />
                <span>For informational purposes only. Not a medical device.</span>
              </div>
              <p>NervoEdge v2.0.5 Alpha Build 1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
