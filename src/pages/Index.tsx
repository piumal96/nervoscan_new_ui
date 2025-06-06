import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeView from '../components/HomeView';
import ScanView from '../components/ScanView';
import Navigation from '../components/Navigation';
import SettingsPage from '../components/SettingsPage';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex">
        <Navigation />
        <div className="flex-1 pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomeView />} />
            <Route path="/scan" element={<ScanView />} />
            <Route path="/activity" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold text-gray-900">Activity Coming Soon</h1></div>} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Index;
