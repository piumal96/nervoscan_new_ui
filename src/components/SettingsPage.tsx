import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState('default');
  // Placeholder for scans remaining
  const scansRemaining = 5;

  // Placeholder camera options
  const cameraOptions = [
    { value: 'default', label: 'Default Camera' },
    { value: 'front', label: 'Front Camera' },
    { value: 'back', label: 'Back Camera' },
  ];

  return (
    <div className="max-w-xl mx-auto p-6 mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 space-y-8">
      {/* About Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">About</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This app is developed by <span className="font-semibold">Nervotec</span> for facial scan-based health monitoring.
        </p>
      </section>

      {/* Scans Remaining Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Scans Remaining</h2>
        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{scansRemaining}</div>
      </section>

      {/* Camera Settings Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Camera Settings</h2>
        <div className="flex items-center mb-4">
          <label className="mr-3 text-sm text-gray-700 dark:text-gray-300">Enable Camera</label>
          <input
            type="checkbox"
            checked={cameraEnabled}
            onChange={() => setCameraEnabled(v => !v)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Select Camera</label>
          <select
            value={selectedCamera}
            onChange={e => setSelectedCamera(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2"
            disabled={!cameraEnabled}
          >
            {cameraOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Support/Contact Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Support</h2>
        <div className="mb-2">
          <div className="text-sm text-gray-700 dark:text-gray-200 font-medium">Email:</div>
          <a href="mailto:info@nervotec.com" className="text-sm text-blue-600 dark:text-blue-400 underline">info@nervotec.com</a>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage; 