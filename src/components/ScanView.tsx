import React, { useState, useRef, useEffect } from 'react';
import { CameraIcon, StopIcon } from '@heroicons/react/24/outline';
import * as vision from "@mediapipe/tasks-vision";
import { DrawingUtils } from "@mediapipe/drawing_utils/drawing_utils.js";
import NervotecLogo from '../assets/Nervotec.png';

const { FaceLandmarker, FilesetResolver } = vision;

// ROI landmark definitions
const FACEMESH_BIG_FOREHEAD = [
  [67, 109], [109, 10], [10, 338], [338, 297],
  [66, 107], [107, 9], [9, 336], [336, 296],
  [67, 69], [69, 66],
  [297, 299], [299, 296]
];

const FACEMESH_SMALL_FOREHEAD = [
  [109, 10], [10, 338],
  [338, 337],
  [337, 151], [151, 108],
  [108, 109]
];

const FACEMESH_LEFT_CHEEK = [
  [345, 352], [352, 376], [376, 433], [433, 416],
  [416, 436], [436, 426], [426, 423],
  [423, 266], [266, 330], [330, 347], [347, 346], [346, 345]
];

const FACEMESH_RIGHT_CHEEK = [
  [116, 123], [123, 147], [147, 213], [213, 192],
  [192, 216], [216, 206], [206, 203],
  [203, 36], [36, 101], [101, 118], [118, 117], [117, 116]
];

const FACEMESH_CHEEKS_AND_NOSE = [
  [118, 50], [50, 216],
  [216, 2], [2, 436],
  [436, 280], [280, 347],
  [347, 6], [6, 118]
];

const FACEMESH_CROP_FACE = [
  [103, 67], [67, 109], [109, 10], [10, 338], [338, 297], [297, 332],
  [332, 298], [298, 300], [300, 383], [383, 372], [372, 345], [345, 352],
  [352, 411], [411, 427], [427, 436], [436, 322],
  [322, 2], [2, 92],
  [92, 216], [216, 207], [207, 187], [187, 123],
  [123, 116], [116, 143], [143, 156], [156, 70], [70, 68], [68, 103]
];

// Face alignment error states
const FaceAlignmentError = {
  TOO_FAR: 'Face is too far from camera',
  TOO_CLOSE: 'Face is too close to camera',
  LOOKING_LEFT: 'Face is looking too far left',
  LOOKING_RIGHT: 'Face is too far right',
  ALIGNED: 'Face is properly aligned'
};

const ScanView: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const [resolution, setResolution] = useState('--');
  const [alignmentStatus, setAlignmentStatus] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceLandmarkerRef = useRef<any>(null);
  const webcamRunningRef = useRef(false);
  const frameCountRef = useRef(0);
  const lastFpsUpdateTimeRef = useRef(0);
  const lastVideoTimeRef = useRef(-1);
  const resultsRef = useRef<any>(undefined);

  // Initialize face landmarker
  useEffect(() => {
    const initFaceLandmarker = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
          },
          outputFaceBlendshapes: false,
          runningMode: "VIDEO",
          numFaces: 1
        });
        console.log('Face landmarker initialized successfully');
      } catch (err) {
        console.error('Error initializing face landmarker:', err);
        setError('Failed to initialize face detection');
      }
    };

    initFaceLandmarker();
  }, []);

  // Auto-start camera and face mesh preview on mount, never stop
  useEffect(() => {
    startWebcam();
    // Do not stop webcam on unmount to keep preview always on
    // If you want to stop on unmount, uncomment the next line:
    // return () => stopWebcam();
    // eslint-disable-next-line
  }, []);

  // Helper functions
  const getLandmarksFromPairs = (pairs: number[][]) => {
    const landmarks = new Set<number>();
    for (const pair of pairs) {
      landmarks.add(pair[0]);
      landmarks.add(pair[1]);
    }
    return Array.from(landmarks);
  };

  const sortCounterClockwise = (points: number[][]) => {
    const centroid = points.reduce(
      (acc, point) => [acc[0] + point[0], acc[1] + point[1]],
      [0, 0]
    );
    centroid[0] /= points.length;
    centroid[1] /= points.length;
    
    return points.slice().sort((a, b) => {
      const angleA = Math.atan2(a[1] - centroid[1], a[0] - centroid[0]);
      const angleB = Math.atan2(b[1] - centroid[1], b[0] - centroid[0]);
      return angleA - angleB;
    });
  };

  const getLandmarkCoordinates = (landmarks: any[], landmarkIndices: number[], imageWidth: number, imageHeight: number) => {
    const coords: number[][] = [];
    
    for (const index of landmarkIndices) {
      if (landmarks[0] && index < landmarks[0].length) {
        const landmark = landmarks[0][index];
        coords.push([
          Math.round(landmark.x * imageWidth),
          Math.round(landmark.y * imageHeight)
        ]);
      }
    }
    
    if (coords.length > 0) {
      return sortCounterClockwise(coords);
    }
    
    return [];
  };

  const calculateArea = (coordinates: number[][]) => {
    if (!coordinates || coordinates.length < 3) return 0;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current?.videoWidth || 640;
    canvas.height = videoRef.current?.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return 0;
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(coordinates[0][0], coordinates[0][1]);
    for (let i = 1; i < coordinates.length; i++) {
      ctx.lineTo(coordinates[i][0], coordinates[i][1]);
    }
    ctx.closePath();
    ctx.fill();
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let nonZeroCount = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 0) {
        nonZeroCount++;
      }
    }
    
    return nonZeroCount;
  };

  const checkFaceAlignment = (faceArea: number, leftCheekArea: number, rightCheekArea: number) => {
    if (faceArea < 19000) {
      return FaceAlignmentError.TOO_FAR;
    } else if (faceArea > 50000) {
      return FaceAlignmentError.TOO_CLOSE;
    }

    if (leftCheekArea < 800) {
      return FaceAlignmentError.LOOKING_RIGHT;
    } else if (rightCheekArea < 800) {
      return FaceAlignmentError.LOOKING_LEFT;
    }

    return FaceAlignmentError.ALIGNED;
  };

  const updateFPS = () => {
    const now = performance.now();
    frameCountRef.current++;
    
    if (now - lastFpsUpdateTimeRef.current > 1000) {
      setFps(Math.round((frameCountRef.current * 1000) / (now - lastFpsUpdateTimeRef.current)));
      frameCountRef.current = 0;
      lastFpsUpdateTimeRef.current = now;
    }
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 720 },
          height: { ideal: 720 },
          aspectRatio: 1,
          facingMode: 'user',
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', () => {
          setResolution(`${videoRef.current?.videoWidth || 0}×${videoRef.current?.videoHeight || 0}`);
          setCameraActive(true);
          webcamRunningRef.current = true;
          frameCountRef.current = 0;
          lastFpsUpdateTimeRef.current = performance.now();
          predictWebcam();
        });
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Failed to access camera');
    }
  };

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    webcamRunningRef.current = false;
    setFps(0);
    setResolution('--');
    setAlignmentStatus(null);
  };

  const predictWebcam = async () => {
    if (!webcamRunningRef.current || !videoRef.current || !canvasRef.current || !faceLandmarkerRef.current) {
      return;
    }

    updateFPS();

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Always use the displayed size for both video and canvas (square)
    const displaySize = video.parentElement?.offsetWidth || 400;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.style.width = `${displaySize}px`;
    canvas.style.height = `${displaySize}px`;
    video.style.width = `${displaySize}px`;
    video.style.height = `${displaySize}px`;

    let startTimeMs = performance.now();
    if (lastVideoTimeRef.current !== video.currentTime) {
      lastVideoTimeRef.current = video.currentTime;
      try {
        resultsRef.current = faceLandmarkerRef.current.detectForVideo(video, startTimeMs);
      } catch (error) {
        console.error('Error during face detection:', error);
        return;
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (resultsRef.current?.faceLandmarks) {
      const drawingUtils = new vision.DrawingUtils(ctx);
      
      // Draw face mesh
      for (const landmarks of resultsRef.current.faceLandmarks) {
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_TESSELATION,
          { color: "#C0C0C070", lineWidth: 1 }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
          { color: "#E0E0E0" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
          { color: "#FF3030" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
          { color: "#30FF30" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LIPS,
          { color: "#E0E0E0" }
        );
      }

      // Get coordinates for face alignment check
      const faceCoords = getLandmarkCoordinates(
        resultsRef.current.faceLandmarks,
        getLandmarksFromPairs(FACEMESH_CROP_FACE),
        video.videoWidth,
        video.videoHeight
      );

      const leftCheekCoords = getLandmarkCoordinates(
        resultsRef.current.faceLandmarks,
        getLandmarksFromPairs(FACEMESH_LEFT_CHEEK),
        video.videoWidth,
        video.videoHeight
      );

      const rightCheekCoords = getLandmarkCoordinates(
        resultsRef.current.faceLandmarks,
        getLandmarksFromPairs(FACEMESH_RIGHT_CHEEK),
        video.videoWidth,
        video.videoHeight
      );

      // Check face alignment
      const faceArea = calculateArea(faceCoords);
      const leftCheekArea = calculateArea(leftCheekCoords);
      const rightCheekArea = calculateArea(rightCheekCoords);
      
      const alignment = checkFaceAlignment(faceArea, leftCheekArea, rightCheekArea);
      setAlignmentStatus(alignment);
    }

    if (webcamRunningRef.current) {
      requestAnimationFrame(predictWebcam);
    }
  };

  const handleStartScan = () => {
    setScanning(true);
    setProgress(0);
    setError(null);

    const duration = 60; // 60 seconds
    const interval = 100; // Update every 100ms
    const steps = duration * (1000 / interval);
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = (currentStep / steps) * 100;
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setScanning(false);
        // Do NOT stopWebcam();
      }
    }, interval);
  };

  const handleStopScan = () => {
    setScanning(false);
    // Do NOT stopWebcam();
  };

  // Dummy values for Heart Rate and HRV (replace with real values if available)
  const heartRate = 85;
  const hrv = 111;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white dark:bg-gray-900">
      {/* Logo at the top */}
      <div className="w-full flex justify-center py-8">
        <img src={NervotecLogo} alt="nervoedge" className="h-8 md:h-10" />
      </div>
      {/* Camera/Scan area centered and responsive */}
      <div className="flex flex-col items-center w-full px-4">
        <div className="
          relative flex items-center justify-center
          w-[70vw] h-[90vw] max-w-[400px] max-h-[440px]
          sm:w-[220px] sm:h-[340px]
          md:w-[320px] md:h-[500px]
          bg-gray-100 dark:bg-gray-800
          rounded-full overflow-hidden shadow-lg border-4 border-green-500
          mx-auto
        ">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover object-bottom"
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%', background: 'black' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ width: '100%', height: '100%' }}
          />
          {/* Green animated border (optional, for scan progress) */}
          {scanning && (
            <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-pulse pointer-events-none" />
          )}
        </div>
        {/* Scan button below camera */}
        <div className="mt-6">
          {!scanning ? (
            <button
              onClick={handleStartScan}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Start Scan
            </button>
          ) : (
            <button
              onClick={handleStopScan}
              className="flex items-center px-6 py-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition-colors text-lg font-semibold"
            >
              <StopIcon className="h-6 w-6 mr-2" />
              Stop Scan
            </button>
          )}
        </div>
        {/* Progress bar and time remaining */}
        {scanning && (
          <div className="w-full max-w-xs md:max-w-md mt-6">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-center text-gray-500 text-sm mt-1 font-semibold">
              {60 - Math.floor((progress / 100) * 60)}s Remaining
            </div>
          </div>
        )}
        {/* Heart Rate and HRV cards or error message below scan area */}
        {alignmentStatus && alignmentStatus !== 'Face is properly aligned' ? (
          <div className="flex flex-col items-center mt-8 w-full max-w-xs md:max-w-md">
            <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl shadow p-4 w-full text-center font-semibold">
              {alignmentStatus === 'Face is too far from camera' || alignmentStatus === 'Face is too close to camera' || alignmentStatus === 'Face is looking too far left' || alignmentStatus === 'Face is too far right'
                ? 'Face not detected correctly. Please center your face in the circle.'
                : alignmentStatus}
            </div>
          </div>
        ) : (
          <div className="flex flex-row gap-4 mt-8 w-full max-w-xs md:max-w-md justify-center">
            <div className="flex-1 min-w-[140px] bg-white border border-gray-200 rounded-xl shadow p-4 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-500 text-xl">❤</span>
                <span className="font-semibold text-gray-700 text-base">Heart Rate</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{heartRate} <span className="text-base font-medium">bpm</span></div>
              <div className="text-xs text-gray-500 mt-1">Beats per minute</div>
            </div>
            <div className="flex-1 min-w-[140px] bg-white border border-gray-200 rounded-xl shadow p-4 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-pink-500 text-xl">📈</span>
                <span className="font-semibold text-gray-700 text-base">HRV</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{hrv}<span className="text-base font-medium">ms</span></div>
              <div className="text-xs text-gray-500 mt-1">HRV (milliseconds)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanView;
