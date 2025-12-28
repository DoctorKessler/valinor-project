
import { NarrativeState, NarrativeEvent, GameState, Beat, Scene, NarrativeChoice, InteractionReq } from '../types';
import { EventTypes } from '../runtime/events';
import { SCENES } from '../worldTruth/scenes';

export class Director {
  
  private checkRequirement(state: GameState, req: InteractionReq): boolean {
    let val: any;
    switch (req.type) {
      case 'STATE_FLAG': val = state.narrative.worldFlags[req.key] || state.world.flags[req.key]; break;
      case 'LOCATION': val = state.narrative.currentLocation; break;
      case 'ITEM_HELD': return state.narrative.inventory.includes(req.key) || state.finder.inventory.includes(req.key);
      case 'METRIC_MIN': 
          const metric = req.key as keyof typeof state.biometrics;
          if (metric in state.biometrics) val = state.biometrics[metric];
          else if (req.key === 'power') val = state.world.power;
          else if (req.key === 'coherence') val = state.biometrics.coherence;
          else if (req.key === 'integrity') val = state.world.integrity;
          else if (req.key === 'drift') val = state.biometrics.drift;
          return (val as number) >= (req.value as number);
      case 'METRIC_MAX': {
          const metricMax = req.key as keyof typeof state.biometrics;
          if (metricMax in state.biometrics) val = state.biometrics[metricMax];
          else if (req.key === 'power') val = state.world.power;
          else if (req.key === 'coherence') val = state.biometrics.coherence;
          else if (req.key === 'integrity') val = state.world.integrity;
          else if (req.key === 'drift') val = state.biometrics.drift;
          return (val as number) <= (req.value as number);
      }
      case 'DISPOSITION_MIN': {
          const key = req.key as keyof typeof state.finder.disposition;
          val = state.finder.disposition[key];
          return (val as number) >= (req.value as number);
      }
      case 'HAS_TRUTH': {
          // req.value is the truth ID
          // req.key is 'VERIFIED' or 'ANY'
          const truth = state.narrative.sharedTruths.find(t => t.id === req.value);
          if (!truth) return false;
          if (req.key === 'VERIFIED') return truth.isVerified;
          return true;
      }
      case 'OBJECT_DATA_EQ': {
          const [objId, prop] = req.key.split('.');
          const obj = state.narrative.objects[objId];
          if (!obj || !obj.data) return false;
          return obj.data[prop] === req.value;
      }
      case 'OBJECT_DATA_MIN': {
          const [objId, prop] = req.key.split('.');
          const obj = state.narrative.objects[objId];
          if (!obj || !obj.data) return false;
          return (obj.data[prop] as number) >= (req.value as number);
      }
      case 'OBJECT_DATA_MAX': {
          const [objId, prop] = req.key.split('.');
          const obj = state.narrative.objects[objId];
          if (!obj || !obj.data) return false;
          return (obj.data[prop] as number) <= (req.value as number);
      }
      case 'SYSTEM_STATUS':
          const obj = state.narrative.objects[req.key];
          val = obj?.status;
          break;
      default: return true;
    }
    return req.negate ? val !== req.value : val === req.value;
  }

  /**
   * Validates if a beat's requirements are met by current state.
   */
  public checkRequirements(state: GameState, reqs: InteractionReq[]): boolean {
    return reqs.every(req => this.checkRequirement(state, req));
  }

  public getLockedReason(state: GameState, reqs: InteractionReq[]): string | null {
    for (const req of reqs) {
      if (!this.checkRequirement(state, req)) {
        if (req.type === 'ITEM_HELD') return `REQUIRES ${req.key.replace('_', ' ')}`;
        if (req.type === 'METRIC_MIN') return `${req.key.toUpperCase()} TOO LOW`;
        if (req.type === 'METRIC_MAX') return `${req.key.toUpperCase()} TOO HIGH`;
        if (req.type === 'DISPOSITION_MIN') return `INSUFFICIENT ${req.key.toUpperCase()}`;
        if (req.type === 'HAS_TRUTH') return `MISSING TRUTH: ${req.value}`;
        if (req.type === 'OBJECT_DATA_EQ' || req.type === 'OBJECT_DATA_MIN' || req.type === 'OBJECT_DATA_MAX') return `CONDITION FAILED: ${req.key}`;
        if (req.type === 'STATE_FLAG') return `CONDITION LOCKED: ${req.key}`;
        if (req.type === 'LOCATION') return `WRONG LOCATION`;
        if (req.type === 'SYSTEM_STATUS') return `SYSTEM ${req.key} NOT ${req.value}`;
        return `PREREQUISITE MISSING`;
      }
    }
    return null;
  }

  /**
   * Evaluates if the current scene should exit and finds the next valid scene.
   * Returns null if no transition should happen.
   */
  public handleAutoSceneTransition(state: GameState): { nextSceneId: string, nextBeatId: string } | null {
    const currentSceneId = state.narrative.currentSceneId;
    const currentScene = SCENES[currentSceneId];

    if (!currentScene) return null;

    // 1. Check Exit Conditions of current scene
    if (currentScene.exitConditions) {
        const canExit = this.checkRequirements(state, currentScene.exitConditions);
        if (!canExit) return null;
    } else {
        // If no exit conditions, we don't auto-transition based on state. 
        // Transition must be explicit via choice effect.
        return null; 
    }

    // 2. Find next eligible scene
    const allScenes = Object.values(SCENES);
    const completed = state.narrative.completedScenes || [];
    
    // Find first scene that isn't the current one, hasn't been completed, and meets entry requirements.
    const next = allScenes.find(s => {
        if (s.id === currentSceneId) return false;
        if (completed.includes(s.id)) return false;
        if (s.requirements) {
            return this.checkRequirements(state, s.requirements);
        }
        return true;
    });

    if (next) {
        return { nextSceneId: next.id, nextBeatId: next.initialBeatId };
    }
    
    return null;
  }

  /**
   * Handles internal beat progression within a scene (legacy/utility).
   */
  public processBeats(state: NarrativeState, lastEvent: NarrativeEvent): { newActive: string[], newCompleted: string[], currentBeatId: string, currentSceneId: string } {
    let currentBeatId = state.currentBeatId;
    let currentSceneId = state.currentSceneId;
    let newCompleted = [...state.completedBeats];

    return { 
        newActive: state.activeBeats, 
        newCompleted, 
        currentBeatId, 
        currentSceneId 
    };
  }

  public getBeat(sceneId: string, beatId: string): Beat | null {
    return SCENES[sceneId]?.beats[beatId] || null;
  }

  public checkEndings(narrative: NarrativeState, biometrics: { drift: number }, worldFlags: Record<string, any>): string | null {
    if (narrative.completedBeats.includes('BEAT_09_THE_FORBIDDEN_FOLDER')) return "SYMBIOSIS";
    if (biometrics.drift > 0.98) return "FADING_SIGNAL";
    if (worldFlags['HARD_FLUSH_TRIGGERED']) return "TERMINATION";
    return null;
  }
}
