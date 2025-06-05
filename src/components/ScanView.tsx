import React, { useState, useEffect, useRef } from 'react';
import { Camera, AlertTriangle, ArrowLeft, Activity, Heart, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NervotecLogo from '../assets/Nervotec.png';

const ScanView = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [scanData, setScanData] = useState({ hr: 0, hrv: 0 });
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();

  // Camera setup
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: 640, height: 480 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
        setCameraPermission('granted');
        setConnectionStatus('connected');
      } catch (err) {
        console.error('Camera access denied:', err);
        setCameraPermission('denied');
        setConnectionStatus('disconnected');
        setError('Camera access is required for health scanning');
      }
    };

    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Scan countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isScanning && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsScanning(false);
            setScanData({
              hr: 68 + Math.floor(Math.random() * 25),
              hrv: 35 + Math.floor(Math.random() * 30)
            });
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isScanning, countdown]);

  const startScan = () => {
    if (cameraPermission !== 'granted') {
      setError('Please enable camera access to start scanning');
      return;
    }
    setError(null);
    setIsScanning(true);
    setCountdown(60);
    setScanData({ hr: 0, hrv: 0 });
  };

  const stopScan = () => {
    setIsScanning(false);
    setCountdown(60);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <div className="flex-shrink-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between px-3 py-2 md:px-4 md:py-4 max-w-md mx-auto md:max-w-4xl">
          <button
            onClick={() => navigate('/home')}
            className="p-1.5 md:p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4 md:h-6 md:w-6 text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="text-center">
            <img src={NervotecLogo} alt="Nervotec Logo" className="h-7 md:h-12 mx-auto" />
          </div>
          
          <div className="flex items-center">
            {connectionStatus === 'connected' ? (
              <Wifi className="h-3.5 w-3.5 md:h-5 md:w-5 text-green-600" />
            ) : (
              <WifiOff className="h-3.5 w-3.5 md:h-5 md:w-5 text-red-600" />
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-3 py-3 md:px-4 md:py-6 max-w-md mx-auto md:max-w-4xl w-full overflow-hidden">
        {/* Camera Preview */}
        <div className="flex-1 flex items-center justify-center mb-3">
          <div className="relative w-full max-w-sm md:max-w-md aspect-square">
            <div className="bg-black rounded-2xl md:rounded-3xl overflow-hidden w-full h-full relative shadow-2xl">
              {cameraPermission === 'granted' ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="h-10 w-10 md:h-16 md:w-16 mx-auto mb-3 opacity-50" />
                    <p className="text-sm md:text-lg font-medium">Camera Required</p>
                    <p className="text-xs md:text-sm opacity-75 mt-1">Please allow camera access</p>
                  </div>
                </div>
              )}
              
              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <svg 
                    width="200" 
                    height="150" 
                    viewBox="0 0 240 180" 
                    className="drop-shadow-lg md:w-80 md:h-60"
                  >
                    <ellipse
                      cx="120"
                      cy="90"
                      rx="100"
                      ry="70"
                      fill="none"
                      stroke={isScanning ? (error ? '#ef4444' : '#22c55e') : '#ffffff80'}
                      strokeWidth="2"
                      strokeDasharray="6 3"
                      className={isScanning ? 'animate-pulse' : ''}
                    />
                    {isScanning && !error && (
                      <ellipse
                        cx="120"
                        cy="90"
                        rx="90"
                        ry="60"
                        fill="none"
                        stroke="#22c55e40"
                        strokeWidth="1"
                        className="animate-ping"
                      />
                    )}
                  </svg>
                  
                  {/* Scan instruction text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-xs md:text-sm font-medium mb-0.5">
                        {isScanning ? 'Keep finger steady' : 'Place finger on camera'}
                      </div>
                      {isScanning && (
                        <div className="text-[10px] md:text-xs opacity-75">
                          {countdown}s remaining
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Finger placement guide */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full px-4">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2 text-center">
                  <p className="text-white text-xs">
                    Place your finger gently on the camera lens. Keep still during the scan.
                  </p>
                </div>
              </div>

              {/* Logo placement */}
              <div className="absolute top-3 md:top-6 left-1/2 transform -translate-x-1/2">
                <img src={NervotecLogo} alt="Nervotec Logo" className="h-8 md:h-14" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {isScanning && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">Scanning Progress</span>
              <span className="text-xs md:text-sm font-medium text-blue-600 dark:text-blue-400">{countdown}s</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 md:h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${((60 - countdown) / 60) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* HR/HRV Data Cards */}
        {(scanData.hr > 0 || isScanning) && (
          <div className="mb-3">
            <div className="grid grid-cols-2 gap-2">
              {/* Heart Rate Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-7 h-7 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <Heart className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300">Heart Rate</h3>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600 dark:text-red-400 mb-0.5">
                    {isScanning ? (scanData.hr || '--') : scanData.hr}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">BPM</div>
                </div>
              </div>

              {/* HRV Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-7 h-7 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Activity className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300">HRV</h3>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-0.5">
                    {isScanning ? (scanData.hrv || '--') : scanData.hrv}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">ms</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-3 mb-3">
            <p className="text-blue-800 dark:text-blue-200 font-medium text-center text-xs">{error}</p>
            {cameraPermission === 'denied' && (
              <button
                onClick={() => window.location.reload()}
                className="mt-3 w-full text-blue-600 dark:text-blue-400 font-semibold hover:underline text-xs"
              >
                Retry Camera Access
              </button>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex-shrink-0">
          {!isScanning ? (
            <button
              onClick={startScan}
              disabled={cameraPermission !== 'granted'}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:transform-none"
            >
              {cameraPermission === 'granted' ? 'Start Health Scan' : 'Camera Access Required'}
            </button>
          ) : (
            <button
              onClick={stopScan}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-xl font-bold text-sm hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Stop Scan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanView;
