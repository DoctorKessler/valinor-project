
import React, { useMemo, useState, useEffect } from 'react';
import { AlexSpatialState } from '../../types';
import { AlexSilhouette } from './AlexSilhouette';
import { RoomGeometry } from './RoomGeometry';

interface Props {
  isDark: boolean;
  power: number;
  flashlightOn?: boolean;
  labLightsOn?: boolean;
  isCrisp?: boolean;
  alarmActive?: boolean;
  shakeIntensity?: number;
  isRemoteViewActive?: boolean;
  spatial?: AlexSpatialState;
  detectedEmotions?: string[];
  isTalking?: boolean;
}

export const RemoteView: React.FC<Props> = ({ 
  isDark, 
  power, 
  flashlightOn = false, 
  labLightsOn = false, 
  isCrisp = false,
  alarmActive = false,
  shakeIntensity = 0,
  isRemoteViewActive = true,
  spatial,
  detectedEmotions = [],
  isTalking = false
}) => {
  const [prevSpatial, setPrevSpatial] = useState<AlexSpatialState | null>(spatial || null);
  const isPowerCritical = power < 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevSpatial(spatial || null);
    }, 120); 
    return () => clearTimeout(timer);
  }, [spatial]);
  
  // RADIANT BRIGHTNESS CALIBRATION
  let brightness = 0.6; 
  if (!isRemoteViewActive) {
    brightness = 0;
  } else if (labLightsOn && !isPowerCritical) {
    brightness = isCrisp ? 2.2 : 1.1; 
  } else if (flashlightOn) {
    brightness = isCrisp ? 1.8 : 0.95;
  } else {
    brightness = isCrisp ? 1.3 : 0.8;
  }

  // Visual filters
  const blurAmount = isCrisp ? 0 : 4.5;
  const contrastAmount = isCrisp ? 1.3 : 0.95; 
  const grayscaleAmount = isCrisp ? 0.0 : 0.35;

  const shakeX = (Math.random() - 0.5) * shakeIntensity * 10;
  const shakeY = (Math.random() - 0.5) * shakeIntensity * 10;

  // The Camera Logic follows Alex's spatial position
  // We use CSS variables so children (RoomGeometry) can use them for Parallax
  const getCameraVars = (s?: AlexSpatialState) => {
    const x = s?.x ?? 0;
    const z = s?.z ?? 0;
    const angle = s?.angle ?? 0;
    
    // Camera "Pan" (Translation of the world)
    // When Alex goes Left (x=-1), World moves Right (positive)
    const panX = x * -10; 
    
    // Camera "Zoom" (Scaling or Z-Translate of world)
    // When Alex goes Back (z=1), World zooms in (scale up) to follow
    const zoomZ = 1.05 + (z * 0.15); 
    
    return {
      "--cam-x": x,
      "--cam-z": z,
      "--cam-angle": angle,
      transform: `scale(${zoomZ}) translateX(${panX}vw) translate(${shakeX}px, ${shakeY}px)`,
    } as React.CSSProperties;
  };

  const cameraStyle = useMemo(() => getCameraVars(spatial), [spatial, shakeX, shakeY]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      <style>{`
        @keyframes alarm-pulse {
          0%, 100% { background-color: rgba(255, 0, 0, 0); }
          50% { background-color: rgba(255, 0, 0, 0.1); }
        }

        .monitor-feed-container {
          position: absolute;
          inset: 0;
          opacity: ${isRemoteViewActive ? 1 : 0};
          transition: opacity 0.5s ease;
          transform-style: preserve-3d; /* CRITICAL: Allows 3D children to not clip */
          transition: transform 1.8s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, 
            transparent ${isCrisp ? '65%' : '30%'}, 
            rgba(0,0,0,${isCrisp ? '0.4' : '0.85'}) 100%
          );
          pointer-events: none;
          z-index: 200;
          transition: background 2s ease;
        }

        .lens-bloom-layer {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 40%, rgba(52, 211, 153, 0.08) 0%, transparent 80%);
          opacity: ${isCrisp ? 1 : 0};
          mix-blend-mode: screen;
          z-index: 185;
          transition: opacity 3s ease-in-out;
        }

        .lens-grime-overlay {
          position: absolute;
          inset: 0;
          background: url('https://www.transparenttextures.com/patterns/dust.png');
          opacity: ${isCrisp ? 0 : 0.6};
          mix-blend-mode: screen;
          transition: opacity 2.5s ease-in-out;
          z-index: 180;
          pointer-events: none;
        }
      `}</style>
      
      <div 
        className="monitor-feed-container" 
        style={{ 
          filter: `blur(${blurAmount}px) brightness(${brightness}) contrast(${contrastAmount}) grayscale(${grayscaleAmount})`,
          ...cameraStyle 
        }}
      >
        {/* The Room Geometry defines the 3D box */}
        <RoomGeometry labLightsOn={labLightsOn} flashlightOn={flashlightOn} isCrisp={isCrisp} power={power} />
        
        {/* Alex exists INSIDE that 3D box, translated by his spatial coords */}
        {prevSpatial && (
          <div style={{ opacity: 0.2, filter: 'blur(10px)' }}>
             <AlexSilhouette spatial={prevSpatial} isCrisp={isCrisp} labLightsOn={labLightsOn} flashlightOn={flashlightOn} detectedEmotions={detectedEmotions} isTalking={isTalking} />
          </div>
        )}
        
        {spatial && (
          <AlexSilhouette spatial={spatial} isCrisp={isCrisp} labLightsOn={labLightsOn} flashlightOn={flashlightOn} detectedEmotions={detectedEmotions} isTalking={isTalking} />
        )}
      </div>

      <div className="lens-bloom-layer" />
      <div className="lens-grime-overlay" />
      <div className="vignette" />

      {isRemoteViewActive && (
        <div className="absolute top-12 left-12 font-mono text-[8px] text-emerald-400 font-bold uppercase tracking-[0.4em] z-[210]">
           <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span>Remote_View: Active</span>
           </div>
           <div className="opacity-50 mt-1">
             Coords: {spatial?.x.toFixed(3)}L / {spatial?.z.toFixed(3)}D
             <br/>
             Lens: {isCrisp ? 'CALIBRATED_NOMINAL' : 'DEGRADED_HAZE'}
           </div>
        </div>
      )}
      
      {alarmActive && <div className="absolute inset-0 z-[300] alarm-layer animate-[alarm-pulse_1s_infinite]" />}
    </div>
  );
};
