
import { useEffect, useRef } from "react";
import { useAudio } from "../audio/AudioProvider";
import { GameState } from "../types";
import { EventTypes } from "../runtime/events";

/**
 * Watches the narrative event log and triggers sound effects
 * based on the latest event types.
 */
export function useNarrativeAudio(gameState: GameState) {
  const audio = useAudio();
  const lastSeenId = useRef<string | null>(null);

  useEffect(() => {
    const log = gameState.narrative?.eventLog ?? [];
    if (log.length === 0) return;

    const last = log[log.length - 1];
    if (!last || last.id === lastSeenId.current) return;

    lastSeenId.current = last.id;

    switch (last.type) {
      case EventTypes.INTERACTION_SUCCESS:
        audio.play("success");
        break;
      case EventTypes.INTERACTION_FAILURE:
        audio.play("fail", { gain: 0.3 });
        break;
      case EventTypes.MEMORY_SELECTED:
        audio.play("memory_select", { gain: 0.4 });
        break;
      case EventTypes.HARD_FLUSH_WARNING:
        audio.play("warning", { gain: 0.5 });
        break;
      case EventTypes.ITEM_ACQUIRED:
        audio.play("success", { gain: 0.2 });
        break;
      case EventTypes.LORE_DISCOVERED:
        audio.play("success", { gain: 0.1 });
        break;
      default:
        // Optional: fallback sound or silence
        break;
    }
  }, [audio, gameState.narrative?.eventLog]);
}
