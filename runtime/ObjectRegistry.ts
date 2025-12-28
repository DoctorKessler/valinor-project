
import { DEVICES } from '../worldTruth/devices';
import { SYSTEMS } from '../worldTruth/systems';
import { RuntimeObject } from '../types';

/**
 * INITIAL_OBJECTS
 * The mechanical starting state of the world.
 * This registry maps IDs to their mutable runtime state.
 */
export const INITIAL_OBJECTS: Record<string, RuntimeObject> = {
  // --- DEVICES ---
  
  [DEVICES.OPERATOR_CONSOLE.id]: {
    id: DEVICES.OPERATOR_CONSOLE.id,
    name: DEVICES.OPERATOR_CONSOLE.name,
    type: 'DEVICE',
    status: 'ACTIVE',
    locationId: 'CONSOLE_STATION',
    data: { 
      power: 100, 
      connection: 'STABLE', 
      syncRange: 12, 
      distanceFromCore: 0 
    }
  },
  
  [DEVICES.SUBSTRATE_CRADLE.id]: {
    id: DEVICES.SUBSTRATE_CRADLE.id,
    name: DEVICES.SUBSTRATE_CRADLE.name,
    type: 'DEVICE',
    status: 'ACTIVE',
    locationId: 'CRADLE_CHAMBER',
    data: { 
      temp: -196, // Cryogenic
      nitrogenLevel: 90,
      vibration: 0 
    }
  },

  [DEVICES.BINDER.id]: {
    id: DEVICES.BINDER.id,
    name: DEVICES.BINDER.name,
    type: 'ITEM',
    status: 'ACTIVE',
    locationId: 'OBSERVATION_DECK_A',
    data: { 
      pagesRead: [],
      isOpen: false
    }
  },

  [DEVICES.ARCHIVE_DRIVES.id]: {
    id: DEVICES.ARCHIVE_DRIVES.id,
    name: DEVICES.ARCHIVE_DRIVES.name,
    type: 'ITEM',
    status: 'ACTIVE',
    locationId: 'OBSERVATION_DECK_A',
    data: { 
      mounted: false,
      decrypted: false
    }
  },

  [DEVICES.SUBJECT_FEED.id]: {
    id: DEVICES.SUBJECT_FEED.id,
    name: DEVICES.SUBJECT_FEED.name,
    type: 'DEVICE',
    status: 'INACTIVE', // Starts off
    locationId: 'HOME_BASE', // Instantiated inside CRT
    data: { 
      signalStrength: 0 
    }
  },

  [DEVICES.DESK_CHAIR.id]: {
    id: DEVICES.DESK_CHAIR.id,
    name: DEVICES.DESK_CHAIR.name,
    type: 'DEVICE',
    status: 'ACTIVE',
    locationId: 'HOME_BASE',
    data: { 
      integrity: 100,
      physicsAnchored: true
    }
  },

  [DEVICES.PEN_PAD.id]: {
    id: DEVICES.PEN_PAD.id,
    name: DEVICES.PEN_PAD.name,
    type: 'ITEM',
    status: 'HIDDEN', // With Alex initially
    locationId: 'INVENTORY', 
    data: { 
      inkLevel: 100,
      pagesUsed: 0
    }
  },

  [DEVICES.COIN.id]: {
    id: DEVICES.COIN.id,
    name: DEVICES.COIN.name,
    type: 'ITEM',
    status: 'ACTIVE',
    locationId: 'OBSERVATION_DECK_A', // On the floor?
    data: { 
      side: 'HEADS',
      lastFlipTimestamp: 0
    }
  },

  [DEVICES.AUX_BREAKER.id]: {
    id: DEVICES.AUX_BREAKER.id,
    name: DEVICES.AUX_BREAKER.name,
    type: 'DEVICE',
    status: 'ACTIVE',
    locationId: 'OBSERVATION_DECK_A',
    data: { 
      engaged: false, // OFF at start, Alex flips it in intro
      sparking: false
    }
  },

  [DEVICES.LIGHT_SWITCH.id]: {
    id: DEVICES.LIGHT_SWITCH.id,
    name: DEVICES.LIGHT_SWITCH.name,
    type: 'DEVICE',
    status: 'ACTIVE',
    locationId: 'OBSERVATION_DECK_A',
    data: { 
      switchedOn: false
    }
  },

  [DEVICES.FLASHLIGHT.id]: {
    id: DEVICES.FLASHLIGHT.id,
    name: DEVICES.FLASHLIGHT.name,
    type: 'ITEM',
    status: 'ACTIVE',
    locationId: 'INVENTORY',
    data: { 
      on: false 
    }
  },

  [DEVICES.LAB_SAFE.id]: {
    id: DEVICES.LAB_SAFE.id,
    name: DEVICES.LAB_SAFE.name,
    type: 'DEVICE',
    status: 'LOCKED',
    locationId: 'OBSERVATION_DECK_A',
    data: { 
      attemptCount: 0 
    }
  },

  [DEVICES.VALINOR_MANUAL.id]: {
    id: DEVICES.VALINOR_MANUAL.id,
    name: DEVICES.VALINOR_MANUAL.name,
    type: 'ITEM',
    status: 'ACTIVE',
    locationId: 'OBSERVATION_DECK_A',
    data: { 
      read: false 
    }
  },

  [DEVICES.SERVER_LEFT.id]: {
    id: DEVICES.SERVER_LEFT.id,
    name: DEVICES.SERVER_LEFT.name,
    type: 'DEVICE',
    status: 'ACTIVE',
    locationId: 'OBSERVATION_DECK_A',
    data: { 
      status: 'DEGRADED' 
    }
  },
  
  [DEVICES.SERVER_RIGHT.id]: {
    id: DEVICES.SERVER_RIGHT.id,
    name: DEVICES.SERVER_RIGHT.name,
    type: 'DEVICE',
    status: 'ACTIVE',
    locationId: 'OBSERVATION_DECK_A',
    data: { 
      status: 'LOCKED' 
    }
  },

  // --- NEW ITEMS (Maintenance & Cryo) ---

  'MAINT_LOCKER': {
    id: 'MAINT_LOCKER',
    name: 'Maintenance Locker',
    type: 'ITEM',
    status: 'ACTIVE',
    locationId: 'MAINTENANCE_CORRIDOR',
    data: { opened: false }
  },

  'CRYO_DRAWER': {
    id: 'CRYO_DRAWER',
    name: 'Cryo Drawer',
    type: 'ITEM',
    status: 'LOCKED',
    locationId: 'CRYO_STORAGE',
    data: { forced: false, opened: false }
  },

  'BIO_KEY_RING': {
    id: 'BIO_KEY_RING',
    name: 'Biometric Key Ring',
    type: 'ITEM',
    status: 'HIDDEN',
    locationId: 'VOID',
    data: { kind: 'BIOMETRIC' }
  },

  // --- SYSTEMS ---

  [SYSTEMS.HARD_FLUSH.id]: {
    id: SYSTEMS.HARD_FLUSH.id,
    name: SYSTEMS.HARD_FLUSH.name,
    type: 'SYSTEM',
    status: 'ACTIVE', // The protocol is armed
    locationId: 'SYSTEM_CORE',
    data: { 
      armed: true,
      triggerCount: 0
    }
  },

  [SYSTEMS.STASIS_MODE.id]: {
    id: SYSTEMS.STASIS_MODE.id,
    name: SYSTEMS.STASIS_MODE.name,
    type: 'SYSTEM',
    status: 'INACTIVE',
    locationId: 'SYSTEM_CORE',
    data: { 
      lockEngaged: false,
      subjectiveTimeDilated: false
    }
  },

  [SYSTEMS.SYNC_ALIGN.id]: {
    id: SYSTEMS.SYNC_ALIGN.id,
    name: SYSTEMS.SYNC_ALIGN.name,
    type: 'SYSTEM',
    status: 'ACTIVE',
    locationId: 'SYSTEM_CORE',
    data: { 
      neuralRustOffset: 142, // ms
      lastSync: 0
    }
  },
  
  [SYSTEMS.RENDERING_ENGINE.id]: {
    id: SYSTEMS.RENDERING_ENGINE.id,
    name: SYSTEMS.RENDERING_ENGINE.name,
    type: 'SYSTEM',
    status: 'ACTIVE',
    locationId: 'CRT_DISPLAY',
    data: { 
      resolution: 'VOLUMETRIC_1080',
      artifacts: 0
    }
  }
};
