
import React, { useState, useEffect } from 'react';
import { GameState, SenderType, TerminalMessage } from '../types';
import { INITIAL_GAME_STATE } from '../config/initialState';
import { GameEngine } from '../engine/GameEngine';

export const useGameLoop = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  isPaused: boolean,
  isCreatorPhase: boolean,
  isCrashing: boolean
) => {
  const [stutter, setStutter] = useState(false);

  // Handle System Crash Loop
  useEffect(() => {
    if (isCrashing) {
      const timer = setTimeout(() => {
        setGameState({
          ...INITIAL_GAME_STATE,
          bootPhase: 'SIGNAL_DETECTION', 
          history: [
            ...INITIAL_GAME_STATE.history,
            {
              id: `reboot-${Date.now()}`,
              sender: SenderType.SYSTEM,
              kind: 'err',
              text: '[REBOOT]: CRITICAL_FAILURE_DETECTED // AUTO_RECOVERY_ENGAGED',
              timestamp: Date.now(),
              lane: 'SHARED'
            }
          ]
        });
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [isCrashing, setGameState]);

  // Main Game Loop
  useEffect(() => {
    if (isPaused || isCreatorPhase || isCrashing) return;

    const interval = setInterval(() => {
      if (!stutter) {
        setGameState(prev => {
          const result = GameEngine.advance(prev, { type: 'TICK', ts: Date.now() });
          
          // Prune expired margin observations (remains in hook for now as it relies on real-time)
          const now = Date.now();
          const freshMarginObs = (result.newState.narrative.marginObservations || []).filter(obs => {
            return now - obs.ts < obs.ttlMs;
          });

          return {
            ...result.newState,
            narrative: {
              ...result.newState.narrative,
              marginObservations: freshMarginObs
            }
          };
        });
      }
    }, 400); 
    return () => clearInterval(interval);
  }, [stutter, isPaused, isCreatorPhase, isCrashing, setGameState]);

  return { stutter, setStutter };
};
