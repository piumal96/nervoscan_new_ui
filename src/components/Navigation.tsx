import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Camera, Settings } from 'lucide-react';
import NervotecLogo from '../assets/Nervotec.png';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/scan', icon: Camera, label: 'Scan' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="grid grid-cols-3 h-14">
            {navItems.map(({ path, icon: Icon, label }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center justify-center space-y-0.5 transition-all duration-200 ${
                  isActive(path)
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform ${isActive(path) ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-medium">{label}</span>
                {isActive(path) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-sm z-40">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-10">
            <img src={NervotecLogo} alt="Nervotec Logo" className="h-8" />
          </div>

          <nav className="space-y-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm md:text-base ${
                  isActive(path)
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Pro Tip</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Regular facial scans help track your health trends</p>
          </div>
        </div>
      </div>

      {/* Content Spacer for Desktop */}
      <div className="hidden md:block w-64 flex-shrink-0" />
    </>
  );
};

export default Navigation;
