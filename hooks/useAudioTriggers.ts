import { useEffect, useRef } from 'react';
import { GameState } from '../types';
import { audioSystem } from '../audio/AudioSystem';
import { EventTypes } from '../runtime/events';

export function useAudioTriggers(gameState: GameState) {
  const lastEventIdRef = useRef<string | null>(null);

  // SFX based on event log
  useEffect(() => {
    const lastEvent = gameState.narrative.eventLog[gameState.narrative.eventLog.length - 1];
    if (!lastEvent || lastEvent.id === lastEventIdRef.current) return;
    
    lastEventIdRef.current = lastEvent.id;

    switch (lastEvent.type) {
      case EventTypes.INTERACTION_SUCCESS:
        audioSystem.play("success");
        break;
      case EventTypes.INTERACTION_FAILURE:
        audioSystem.play("fail");
        break;
      case EventTypes.MEMORY_SELECTED:
        audioSystem.play("memory_select");
        break;
      case EventTypes.HARD_FLUSH_WARNING:
        audioSystem.play("warning");
        break;
      case EventTypes.ITEM_ACQUIRED:
        audioSystem.play("success", { gain: 0.2 });
        break;
    }
  }, [gameState.narrative.eventLog]);
}