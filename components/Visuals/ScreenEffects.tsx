
import React from 'react';
import { GlitchNoiseCanvas } from '../GlitchNoiseCanvas';
import { GameState } from '../../types';

interface Props {
  glitchIntensity: number;
  isCrashing: boolean;
  isStabilizing: boolean;
  isFinderPhase: boolean;
  locusMode: GameState['locus']['mode'];
  phaseIndex: number;
  surfaceStyle: React.CSSProperties;
  drift?: number;
  integrity?: number;
}

export const ScreenEffects: React.FC<Props> = ({ 
  glitchIntensity, 
  isCrashing, 
  isStabilizing, 
  isFinderPhase,
  locusMode,
  phaseIndex,
  surfaceStyle,
  drift = 0,
  integrity = 100
}) => {
  // Somatic Pulse logic: Higher drift/stress means faster, more erratic pulse
  const pulseSpeed = drift > 0.6 ? '0.4s' : '4s';
  const pulseOpacity = Math.max(0.1, drift * 0.4);

  return (
    <>
      <style>{`
        @keyframes somatic-pulse {
          0%, 100% { opacity: ${pulseOpacity}; }
          50% { opacity: ${pulseOpacity * 1.8}; }
        }
        .somatic-layer {
          animation: somatic-pulse ${pulseSpeed} infinite ease-in-out;
          pointer-events: none;
        }
      `}</style>

      <div 
        className="fixed inset-[-50%] z-[-1] bg-black pointer-events-none transition-transform duration-100"
        style={{ 
          transform: 'translate(var(--parallax-bg-x), var(--parallax-bg-y))',
          background: isCrashing ? 'radial-gradient(circle at center, #300 0%, #000 70%)' : 'radial-gradient(circle at center, #020203 0%, #000 70%)'
        }}
      />

      {/* Somatic feedback overlay */}
      <div className="fixed inset-0 somatic-layer z-[999999] bg-gradient-to-t from-emerald-500/5 to-transparent mix-blend-screen" />
      
      {integrity < 30 && (
        <div className="fixed inset-0 z-[1000001] pointer-events-none border-[4px] border-red-500/20 animate-pulse" />
      )}

      <GlitchNoiseCanvas intensity={glitchIntensity} />

      {isCrashing && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-invert">
          <div className="text-red-500 font-bold text-4xl tracking-[1em] uppercase animate-ping">
            CRITICAL_HALT
          </div>
        </div>
      )}
    </>
  );
};
