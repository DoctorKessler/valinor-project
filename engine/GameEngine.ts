
import { 
  GameState, 
  EngineAction, 
  NarrativeMutation, 
  EngineResult, 
  TerminalMessage, 
  SenderType,
  WorldState,
  FinderState,
  Biometrics,
  NarrativeState,
  LocationId
} from '../types';
import { IntroEngine } from './IntroEngine';
import { NarrativeSystem } from './NarrativeSystem';
import { SCENES } from '../worldTruth/scenes';
import { LOCATIONS } from '../worldTruth/locations';

export class GameEngine {
  static applyMutation(state: GameState, mutation: NarrativeMutation): GameState {
    const next = { ...state };
    switch (mutation.type) {
      case 'UPDATE_WORLD': next.world = { ...next.world, ...mutation.patch }; break;
      case 'UPDATE_FINDER': next.finder = { ...next.finder, ...mutation.patch }; break;
      case 'UPDATE_BIOMETRICS': next.biometrics = { ...next.biometrics, ...mutation.patch }; break;
      case 'UPDATE_NARRATIVE': next.narrative = { ...next.narrative, ...mutation.patch }; break;
      case 'UPDATE_PIPELINE': next.pipeline = [...mutation.pipeline]; break;
      case 'SET_BOOT_PHASE': next.bootPhase = mutation.phase; break;
      case 'SET_FLAG':
        next.world.flags = { ...next.world.flags, [mutation.key]: mutation.value };
        next.narrative.worldFlags = { ...next.narrative.worldFlags, [mutation.key]: mutation.value };
        break;
      case 'ADD_MESSAGE':
        const msg = {
          id: `msg-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          lane: 'SHARED' as const,
          sender: SenderType.SYSTEM,
          kind: 'sys' as const,
          text: '',
          ...mutation.message
        } as TerminalMessage;
        next.history = [...next.history, msg];
        break;
      case 'BATCH': return mutation.mutations.reduce((s, m) => this.applyMutation(s, m), next);
    }
    return next;
  }

  static advance(state: GameState, action: EngineAction): EngineResult {
    let currentState = JSON.parse(JSON.stringify(state)) as GameState;
    const initialHistoryCount = currentState.history.length;
    const wasPrologue = currentState.prologueActive;

    switch (action.type) {
      case 'TICK': {
        const update = IntroEngine.processAutoTick(currentState);
        currentState = {
          ...currentState,
          ...update,
          world: { ...currentState.world, ...update.world },
          biometrics: { ...currentState.biometrics, ...update.biometrics },
          history: [...currentState.history, ...(update.messages || []).map((m, i) => ({
            ...m, id: `auto-${action.ts}-${i}`, timestamp: action.ts + i
          } as TerminalMessage))],
          pipeline: update.pipeline || currentState.pipeline,
          activeLinks: update.activeLinks || currentState.activeLinks,
          locus: update.locus || currentState.locus,
          bootPhase: update.bootPhase || currentState.bootPhase,
          finder: { ...currentState.finder, ...(update.finder || {}) },
          prologueActive: update.prologueActive ?? currentState.prologueActive,
          narrative: { ...currentState.narrative, ...(update.narrative || {}) }
        };

        // Handle narrative initialization if prologue just ended
        if (wasPrologue && !currentState.prologueActive && currentState.narrative.isActive) {
            const startBeatId = currentState.narrative.currentBeatId;
            const result = NarrativeSystem.runBeat(currentState, startBeatId);
            currentState = result.newState;
            currentState.history.push(...result.messages.map((m, i) => ({
                ...m, id: `init-beat-${Date.now()}-${i}`, timestamp: Date.now() + i
            } as TerminalMessage)));
        }

        // 2. Process Narrative Beat Timers & Ambient World Tick
        if (!currentState.prologueActive) {
            
            // --- TIMER LOGIC ---
            if (currentState.narrative.beatTimer > 0) {
                currentState.narrative.beatTimer--;
                if (currentState.narrative.beatTimer <= 0) {
                    const scene = SCENES[currentState.narrative.currentSceneId];
                    const beat = scene?.beats[currentState.narrative.currentBeatId];
                    
                    if (beat?.autoTransition && beat.nextBeatId) {
                        // Auto-advance
                        const result = NarrativeSystem.runBeat(currentState, beat.nextBeatId);
                        currentState = result.newState;
                        currentState.history.push(...result.messages.map((m, i) => ({
                            ...m, id: `auto-beat-${Date.now()}-${i}`, timestamp: Date.now() + i
                        } as TerminalMessage)));
                    } else {
                        // Timer expired without auto-transition (Pressure Event)
                        // This implies the player took too long on a choice
                        currentState.history.push({
                            id: `timeout-${Date.now()}`,
                            sender: SenderType.SYSTEM,
                            kind: 'warn',
                            text: "[TIMEOUT_WARNING]: DECISION_WINDOW_CLOSING // SYSTEM_IDLE",
                            timestamp: Date.now(),
                            lane: 'SHARED'
                        });
                        // Reset timer slightly to prevent spamming every tick
                        currentState.narrative.beatTimer = 50; 
                    }
                }
            }

            // --- AMBIENT HAZARDS & EVENTS ---
            const rand = Math.random();
            const now = Date.now();

            // Shake Decay
            if (currentState.world.shakeIntensity && currentState.world.shakeIntensity > 0) {
                currentState.world.shakeIntensity = Math.max(0, currentState.world.shakeIntensity - 0.05);
            }

            // Power Dip (Low Power Context)
            if (currentState.world.power < 30 && rand < 0.005) { 
                currentState.history.push({
                    id: `haz-pwr-${now}`,
                    sender: SenderType.SYSTEM,
                    kind: 'warn',
                    text: "[WARNING]: VOLTAGE_SAG // AUX_CAPACITOR_DRAIN",
                    timestamp: now,
                    lane: 'SHARED'
                });
                currentState.world.shakeIntensity = 0.3;
            }

            // Signal Noise (High Drift Context)
            if (currentState.biometrics.drift > 0.6 && rand < 0.008) {
                currentState.history.push({
                    id: `haz-drift-${now}`,
                    sender: SenderType.SYSTEM,
                    kind: 'glitch',
                    text: `>> SYNC_ERROR: PACKET_LOSS_${Math.floor(Math.random()*10000).toString(16)}... [RE-SYNCING]`,
                    timestamp: now,
                    lane: 'SHARED'
                });
                currentState.world.activeVisualEffect = { type: 'GLITCH', remaining: 5 };
            }

            // Alex Idle Animation (Flavor)
            const currentScene = SCENES[currentState.narrative.currentSceneId];
            const currentBeat = currentScene?.beats[currentState.narrative.currentBeatId];
            // Only play idle messages if waiting on player input (beat has choices)
            if (currentBeat?.choices && currentBeat.choices.length > 0 && rand < 0.002) {
                 const idleTexts = [
                     "Alex shifts his weight, glancing at the door.",
                     "Alex taps the console frame nervously.",
                     "You hear Alex exhale a shaky breath.",
                     "Alex checks his watch, then the screen.",
                     "Alex leans closer to inspect a smudge on the glass."
                 ];
                 currentState.history.push({
                    id: `amb-alex-${now}`,
                    sender: SenderType.SYSTEM,
                    kind: 'action',
                    text: `[OBSERVATION]: ${idleTexts[Math.floor(Math.random() * idleTexts.length)]}`,
                    timestamp: now,
                    lane: 'SHARED'
                 });
            }
        }
        break;
      }

      case 'PLAYER_INPUT': {
        currentState.history.push({ 
          id: `p-${Date.now()}`, sender: SenderType.PLAYER, kind: 'player', text: action.text, timestamp: Date.now(), lane: 'SHARED' 
        });
        break;
      }

      case 'FINDER_REACTION': {
        const turnResult = NarrativeSystem.resolveTurn(currentState, action.response, action.input);
        currentState = turnResult.newState;
        const turnMessages: TerminalMessage[] = [
          ...turnResult.sharedMessages.map((m, i) => ({ ...m, id: `sm-${Date.now()}-${i}`, timestamp: Date.now() + i } as TerminalMessage)),
          ...turnResult.cotyPrivate.map((m, i) => ({ ...m, id: `cp-${Date.now()}-${i}`, timestamp: Date.now() + i + 100 } as TerminalMessage))
        ];
        currentState.history.push(...turnMessages);
        break;
      }

      case 'RESOLVE_CHOICE': {
        // Pass text if provided in action
        const result = NarrativeSystem.resolveChoice(currentState, action.choiceId, action.text);
        currentState = result.newState;
        const choiceMsgs: TerminalMessage[] = result.messages.map((m, i) => ({
            ...m, id: `choice-${Date.now()}-${i}`, timestamp: Date.now() + i
        } as TerminalMessage));
        currentState.history.push(...choiceMsgs);
        break;
      }

      case 'COMMAND': {
        // Check for NAV commands
        if (action.id.startsWith('NAV_')) {
          const locId = action.id.replace('NAV_', '') as LocationId;
          const locDef = LOCATIONS[locId];
          if (locDef) {
            currentState.narrative.currentLocation = locId;
            currentState.finder.spatial = { ...currentState.finder.spatial, x: 0, z: 0.9, angle: 180, posture: 'STANDING' }; // Reset to "entered room"
            
            currentState.history.push({
              id: `nav-${Date.now()}`,
              sender: SenderType.SYSTEM,
              kind: 'action',
              text: `[RELOCATING] >> ${locDef.name.toUpperCase()}`,
              timestamp: Date.now(),
              lane: 'SHARED'
            });
            
            // Optionally clear room flags or set new context
          }
        } else {
          const update = IntroEngine.processCommand(action.id, currentState);
          currentState = {
            ...currentState,
            ...update,
            world: { ...currentState.world, ...update.world },
            biometrics: { ...currentState.biometrics, ...update.biometrics },
            history: [...currentState.history, ...(update.messages || []).map((m, i) => ({
              ...m, id: `cmd-${Date.now()}-${i}`, timestamp: Date.now() + i
            } as TerminalMessage))],
            pipeline: update.pipeline || currentState.pipeline,
            activeLinks: update.activeLinks || currentState.activeLinks,
            locus: update.locus || currentState.locus,
            finder: { ...currentState.finder, ...(update.finder || {}) }
          };
        }
        break;
      }

      case 'APPLY_MEMORY': {
        const update = IntroEngine.applyMemoryRewards(currentState, action.memoryId);
        
        // Detect if narrative state changed (Memory Triggered Beat)
        let newNarrative = { ...currentState.narrative, ...(update.narrative || {}) };
        let additionalHistory: TerminalMessage[] = [];

        // If the beat ID changed as part of the memory update, we must RUN the beat to get its text
        if (newNarrative.currentBeatId !== currentState.narrative.currentBeatId) {
            const beatResult = NarrativeSystem.runBeat({
                ...currentState,
                narrative: newNarrative,
                finder: { ...currentState.finder, ...(update.finder || {}) }
            } as GameState, newNarrative.currentBeatId);
            
            // Merge the result of the triggered beat
            newNarrative = beatResult.newState.narrative;
            additionalHistory = beatResult.messages.map((m, i) => ({
                ...m, id: `mem-beat-${Date.now()}-${i}`, timestamp: Date.now() + i
            } as TerminalMessage));
        }

        currentState = {
          ...currentState,
          ...update,
          world: { ...currentState.world, ...update.world },
          biometrics: { ...currentState.biometrics, ...update.biometrics },
          history: [...currentState.history, ...(update.messages || []).map((m, i) => ({
            ...m, id: `mem-${Date.now()}-${i}`, timestamp: Date.now() + i
          } as TerminalMessage)), ...additionalHistory],
          pipeline: update.pipeline || currentState.pipeline,
          finder: { ...currentState.finder, ...(update.finder || {}) },
          narrative: newNarrative
        };
        break;
      }
    }

    const newEntries = currentState.history.slice(initialHistoryCount);
    return {
      newState: currentState,
      newEntries,
      events: currentState.narrative.eventLog.slice(-1)
    };
  }
}
