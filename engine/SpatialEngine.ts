
import { AlexSpatialState, AlexPosture } from '../types';

export interface SpatialAnchor {
  x: number;
  z: number;
  y: number;
  angle: number; // degrees
  posture: AlexPosture;
}

export type FacingCategory = 'FRONT' | 'SIDE_LEFT' | 'SIDE_RIGHT' | 'BACK_LEFT' | 'BACK_RIGHT' | 'BACK';

/**
 * LAB_ANCHORS
 * Precise coordinate mapping for Alex's position in the 3D-simulated space.
 * X: -1.0 (Far Left) to 1.0 (Far Right)
 * Z: 0.0 (At Monitor/Glass) to 1.0 (Back Wall)
 */
const LAB_ANCHORS: Record<string, SpatialAnchor> = {
  // Device Anchors
  'OPERATOR_CONSOLE': { x: 0, z: 0.15, y: 0.5, angle: 0, posture: 'STANDING' }, // Adjusted Z to prevent clipping with glass
  'SUBJECT_FEED': { x: 0, z: 0.02, y: 0.6, angle: 0, posture: 'REACHING' }, // Leaning into camera
  'LAB_SAFE': { x: 0.8, z: 0.85, y: 0.2, angle: -45, posture: 'CROUCHED' }, // Corner vault
  'AUX_BREAKER': { x: -0.85, z: 0.3, y: 0.7, angle: 90, posture: 'REACHING' }, // Wall panel
  'VALINOR_MANUAL': { x: 0.3, z: 0.4, y: 0.4, angle: 10, posture: 'SITTING' }, // At desk
  'LIGHT_SWITCH': { x: -0.9, z: 0.1, y: 0.5, angle: 90, posture: 'REACHING' }, // Near door
  'SERVER_LEFT': { x: -0.6, z: 0.7, y: 0.3, angle: 45, posture: 'INSPECTING' },
  'SERVER_RIGHT': { x: 0.6, z: 0.7, y: 0.3, angle: -45, posture: 'INSPECTING' },
  'DOOR': { x: 0, z: 0.9, y: 0.5, angle: 180, posture: 'STANDING' }, // Looking away
  
  // Movement Primitives (for general navigation)
  'FAR_CENTER': { x: 0, z: 0.8, y: 0.5, angle: 0, posture: 'STANDING' },
  'CLOSE_CENTER': { x: 0, z: 0.1, y: 0.5, angle: 0, posture: 'STANDING' },
  'FAR_LEFT': { x: -0.8, z: 0.8, y: 0.5, angle: 30, posture: 'STANDING' },
  'FAR_RIGHT': { x: 0.8, z: 0.8, y: 0.5, angle: -30, posture: 'STANDING' },
  'NEAR_LEFT': { x: -0.6, z: 0.2, y: 0.5, angle: 45, posture: 'STANDING' },
  'NEAR_RIGHT': { x: 0.6, z: 0.2, y: 0.5, angle: -45, posture: 'STANDING' },
  'CENTER': { x: 0, z: 0.5, y: 0.5, angle: 0, posture: 'STANDING' },
  'DEFAULT': { x: 0, z: 0.4, y: 0.5, angle: 0, posture: 'STANDING' }
};

export class SpatialEngine {
  static getTargetAnchor(targetId?: string): SpatialAnchor {
    if (!targetId) return LAB_ANCHORS['DEFAULT'];
    
    // Direct match check
    const tid = targetId.toUpperCase();
    if (LAB_ANCHORS[tid]) return LAB_ANCHORS[tid];

    // Fuzzy matching for general movement intents
    if (tid.includes('SERVER')) return tid.includes('LEFT') ? LAB_ANCHORS['SERVER_LEFT'] : LAB_ANCHORS['SERVER_RIGHT'];
    if (tid.includes('CONSOLE')) return LAB_ANCHORS['OPERATOR_CONSOLE'];
    if (tid.includes('SAFE')) return LAB_ANCHORS['LAB_SAFE'];
    if (tid.includes('LIGHT')) return LAB_ANCHORS['LIGHT_SWITCH'];
    if (tid.includes('BREAKER')) return LAB_ANCHORS['AUX_BREAKER'];
    if (tid.includes('DESK') || tid.includes('FOLDER') || tid.includes('MANUAL')) return LAB_ANCHORS['VALINOR_MANUAL'];
    if (tid.includes('DOOR') || tid.includes('EXIT')) return LAB_ANCHORS['DOOR'];
    if (tid.includes('GLASS') || tid.includes('FEED') || tid.includes('LENS')) return LAB_ANCHORS['SUBJECT_FEED'];
    
    // Geometric primitives fuzzy matching
    if (tid.includes('FAR')) {
      if (tid.includes('LEFT')) return LAB_ANCHORS['FAR_LEFT'];
      if (tid.includes('RIGHT')) return LAB_ANCHORS['FAR_RIGHT'];
      return LAB_ANCHORS['FAR_CENTER'];
    }
    if (tid.includes('NEAR') || tid.includes('CLOSE')) {
      if (tid.includes('LEFT')) return LAB_ANCHORS['NEAR_LEFT'];
      if (tid.includes('RIGHT')) return LAB_ANCHORS['NEAR_RIGHT'];
      return LAB_ANCHORS['CLOSE_CENTER'];
    }
    if (tid.includes('LEFT')) return LAB_ANCHORS['NEAR_LEFT'];
    if (tid.includes('RIGHT')) return LAB_ANCHORS['NEAR_RIGHT'];

    return LAB_ANCHORS['DEFAULT'];
  }

  static getDynamicPosture(targetId: string, basePosture: AlexPosture): AlexPosture {
    const t = targetId.toUpperCase();
    // Context-sensitive posture overrides
    if (t.includes('LAB_SAFE') || t.includes('FLOOR')) return 'CROUCHED';
    if (t.includes('SERVER') || t.includes('BREAKER') || t.includes('SWITCH') || t.includes('CONSOLE')) return 'LEANING';
    if (t.includes('SUBJECT_FEED') || t.includes('LENS') || t.includes('CAMERA')) return 'REACHING';
    if (t.includes('FOLDER') || t.includes('DESK') || t.includes('CHAIR') || t.includes('MANUAL')) return 'SITTING';
    if (t.includes('CEILING') || t.includes('LIGHT')) return 'LOOKING_UP';
    
    return basePosture;
  }

  static updateSpatial(current: AlexSpatialState, targetId?: string): AlexSpatialState {
    const target = this.getTargetAnchor(targetId);
    
    // Apply dynamic posture logic if a specific target ID is provided
    const posture = targetId ? this.getDynamicPosture(targetId, target.posture) : target.posture;
    
    return {
      x: target.x,
      z: target.z,
      y: target.y,
      angle: target.angle,
      posture: posture
    };
  }

  static getFacingCategory(angle: number): FacingCategory {
    // Normalize angle to -180 to 180
    let a = angle % 360;
    if (a > 180) a -= 360;
    if (a < -180) a += 360;

    if (Math.abs(a) < 45) return 'FRONT';
    if (Math.abs(a) > 135) return 'BACK';
    if (a >= 45 && a <= 135) return 'SIDE_RIGHT';
    if (a <= -45 && a >= -135) return 'SIDE_LEFT';
    
    return 'FRONT'; // Fallback
  }

  static describeSpatial(state: AlexSpatialState): string {
    const depth = state.z < 0.1 ? "pressed against the glass" : state.z < 0.35 ? "inches away" : state.z < 0.65 ? "a few feet back" : "at the far edge of the room";
    const horizontal = state.x < -0.7 ? "on the far left" : state.x < -0.2 ? "to your left" : state.x > 0.7 ? "on the far right" : state.x > 0.2 ? "to your right" : "directly centered";
    const facing = Math.abs(state.angle) < 30 ? "looking straight at you" : Math.abs(state.angle) > 150 ? "facing the door" : "looking toward the equipment";

    return `Alex is ${state.posture.toLowerCase()} ${horizontal}, ${depth}, ${facing}.`;
  }
}
