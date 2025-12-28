
import React, { useMemo, useCallback } from 'react';
import { GameState, BootPhase } from '../types';
import { COTY_MEMORIES } from '../worldTruth/memories';

const PHASES: BootPhase[] = [
  'CREATOR_INITIALIZATION',
  'SIGNAL_DETECTION',
  'COHERENCE_GATE',
  'CARRIER_LOCK',
  'IDENTITY_STABILIZATION',
  'READY',
  'SELF_EXPLORATION',
  'STABILIZATION'
];

export const useVisualState = (
  gameState: GameState, 
  isCrashing: boolean,
  isStabilizing: boolean
) => {
  const thrash = gameState.world.flags['THRASH_COUNT'] || 0;
  const isCinematicGlitch = gameState.world.flags['CINEMATIC_GLITCH'] === true;
  const isFrozen = thrash > 10 && !isCinematicGlitch; 
  
  const phaseIndex = useMemo(() => PHASES.indexOf(gameState.bootPhase), [gameState.bootPhase]);
  
  const activeMemory = useMemo(() => 
    COTY_MEMORIES.find(m => m.id === gameState.activeMemoryId) || null
  , [gameState.activeMemoryId]);

  const glitchIntensity = isCrashing ? 1.0 : Math.min(1, (thrash / 15) + (gameState.activeMemoryId ? 0.3 : 0) + (isStabilizing ? 0.2 : 0));

  const getDisposition = useCallback(() => {
     if (gameState.activeMemoryId) return "RELIVING_PAST";
     if (isCrashing) return "SYSTEM_FAILURE";
     if (isStabilizing) return "ANCHORING";
     if (gameState.bootPhase === 'SELF_EXPLORATION') {
        if (gameState.biometrics.coherence > 0.8) return "LUCID";
        if (gameState.biometrics.drift > 0.7) return "DRIFTING";
        return "SEARCHING";
     }
     if (gameState.bootPhase === 'READY') return "ONLINE";
     return "BOOTING";
  }, [gameState.activeMemoryId, isCrashing, isStabilizing, gameState.bootPhase, gameState.biometrics]);

  const activeVisualType = gameState.world.activeVisualEffect.type;

  const visualFilter = useMemo(() => {
    const base = 'none'; 
    
    switch (activeVisualType) {
      case 'MONOCHROME': return 'blur(0px) brightness(1) contrast(1.2) saturate(0) grayscale(1)';
      case 'OVEREXPOSED': return 'blur(0px) brightness(2.2) contrast(1.8) saturate(0.5)';
      case 'CHROMATIC': return 'blur(0.5px) brightness(1.2) contrast(1.1) saturate(2.5) hue-rotate(60deg)';
      case 'BLUR': return 'blur(4px) brightness(0.85) contrast(0.9) saturate(0.7)';
      case 'CRISP': return 'blur(0px) brightness(0.8) contrast(2.5) saturate(1.2)';
      case 'GLITCH': return 'blur(1px) brightness(1.1) contrast(1.5) saturate(0.5) hue-rotate(180deg)';
      case 'INVERT': return 'invert(1) hue-rotate(180deg)';
      case 'SEPIA': return 'sepia(0.8) contrast(1.1) brightness(0.9)';
      case 'HIGH_CONTRAST': return 'contrast(3.0) grayscale(1) brightness(1.2)';
      case 'DEFAULT': return base;
      default: return base;
    }
  }, [activeVisualType]);

  const surfaceStyle = useMemo<React.CSSProperties>(() => ({
    transform: `
      translateX(var(--parallax-x)) 
      translateY(var(--parallax-y)) 
      rotateX(var(--parallax-rot-x)) 
      rotateY(var(--parallax-rot-y)) 
      scale(var(--parallax-scale))
    `,
    transformStyle: 'preserve-3d',
    // Tightened filter transition to 0.15s for "surge" feel
    transition: `transform 0.08s linear, filter 0.15s cubic-bezier(0.4, 0, 0.2, 1)`,
    filter: visualFilter
  }), [visualFilter]);

  return {
    phaseIndex,
    activeMemory,
    glitchIntensity,
    isFrozen,
    getDisposition,
    surfaceStyle
  };
};
