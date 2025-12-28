
import { InteractableDef } from '../types';

export const INTERACTABLES: Record<string, InteractableDef> = {
  'BINDER': {
    id: 'BINDER',
    verbs: {
      'READ': {
        label: 'Read System Binder',
        reqs: [],
        effects: [
          { type: 'UNLOCK_LORE', key: 'PROTOCOL_MANUAL', value: true },
          { type: 'LEARN_CONCEPT', key: 'READ_MANUAL_WARNING', value: 'READ_MANUAL_WARNING' },
          { type: 'ADD_SHARED_TRUTH', key: 'TRUTH_CREATOR_LEFT', value: { id: 'TRUTH_CREATOR_LEFT', label: 'Revelation of Abandonment', description: 'The Creator abandoned the facility shortly after the "Incident". The logs show he checked the system health one last time and left.' } },
          { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.1, fear: 0.05 } }
        ]
      }
    }
  },
  'LAB_SAFE': {
    id: 'LAB_SAFE',
    verbs: {
      'PICKUP': {
        label: 'Inspect Safe Markings',
        reqs: [],
        effects: [
          { type: 'ADD_SHARED_TRUTH', key: 'TRUTH_ICARUS_SAFE', value: { id: 'TRUTH_ICARUS_SAFE', label: 'Security Archive', description: 'Sticker dated 2025. "INCIDENT LOGS - PRESERVATION TRIGGER EVENTS".' } },
          { type: 'UPDATE_DISPOSITION', key: 'fear', value: { fear: 0.1 } }
        ]
      },
      'VERIFY': {
        label: 'Input Code (1983)',
        reqs: [],
        effects: [
           { type: 'MODIFY_METRIC', key: 'cognitiveLoad', value: 5 },
           { type: 'UPDATE_DISPOSITION', key: 'compliance', value: { compliance: 0.1 } },
           { type: 'UPDATE_OBJECT', key: 'LAB_SAFE', value: { status: 'UNLOCKED' } },
           { type: 'UPDATE_OBJECT', key: 'VALINOR_MANUAL', value: { status: 'ACTIVE', locationId: 'OBSERVATION_DECK_A' } },
           { type: 'TRIGGER_EVENT', key: 'SAFE_UNLOCKED', value: null }
        ]
      }
    }
  },
  'AUX_BREAKER': {
    id: 'AUX_BREAKER',
    verbs: {
      'TOGGLE': {
        label: 'Engage Auxiliary Bypass',
        reqs: [],
        effects: [
          { type: 'SET_FLAG', key: 'LAB_LIGHTS_ON', value: true },
          { type: 'MODIFY_METRIC', key: 'power', value: 85 },
          { type: 'UPDATE_OBJECT', key: 'AUX_BREAKER', value: { data: { engaged: true } } },
          { type: 'TRIGGER_EVENT', key: 'POWER_RESTORED', value: null },
          { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.2 } }
        ]
      }
    }
  },
  'VALINOR_MANUAL': {
    id: 'VALINOR_MANUAL',
    verbs: {
      'READ': {
        label: 'Read Operational Manual',
        reqs: [],
        effects: [
          { type: 'UNLOCK_LORE', key: 'ETHICAL_ADDENDUM', value: true },
          { type: 'ADD_SHARED_TRUTH', key: 'TRUTH_SUBJECT_ORIGIN', value: { id: 'TRUTH_SUBJECT_ORIGIN', label: 'Death Confirmation', description: 'Coty was a lab assistant who died during the capture event. Preservation was chosen over "homicide".' } },
          { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.2, fear: 0.1 } }
        ]
      }
    }
  },
  'SUBJECT_FEED': {
    id: 'SUBJECT_FEED',
    verbs: {
      'TOGGLE': {
        label: 'Engage Video Uplink',
        reqs: [],
        effects: [
          { type: 'SET_FLAG', key: 'isRemoteViewActive', value: true },
          { type: 'SET_FLAG', key: 'VISUAL_FEED_CRISP', value: true },
          { type: 'UPDATE_OBJECT', key: 'SUBJECT_FEED', value: { status: 'ACTIVE' } },
          { type: 'TRIGGER_EVENT', key: 'CAMERA_ADJUSTED', value: null }
        ]
      }
    }
  },
  'LIGHT_SWITCH': {
    id: 'LIGHT_SWITCH',
    verbs: {
      'TOGGLE': {
        label: 'Toggle Room Lighting',
        reqs: [
          { type: 'METRIC_MIN', key: 'power', value: 10 }
        ],
        effects: [
          { type: 'SET_FLAG', key: 'LAB_LIGHTS_ON', value: true },
          { type: 'UPDATE_OBJECT', key: 'LIGHT_SWITCH', value: { data: { switchedOn: true } } },
          { type: 'TRIGGER_EVENT', key: 'LIGHTS_ON', value: null },
          { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.05 } }
        ]
      }
    }
  },
  'FLASHLIGHT': {
    id: 'FLASHLIGHT',
    verbs: {
      'TOGGLE': {
        label: 'Direct Flashlight Beam',
        reqs: [],
        effects: [
          { type: 'SET_FLAG', key: 'FLASHLIGHT_ON', value: true },
          { type: 'UPDATE_OBJECT', key: 'FLASHLIGHT', value: { data: { on: true } } },
          { type: 'UPDATE_DISPOSITION', key: 'fear', value: { fear: -0.05 } }
        ]
      }
    }
  },
  'SERVER_LEFT': {
    id: 'SERVER_LEFT',
    verbs: {
      'OBSERVE': {
        label: 'Check Integrity (Left Rack)',
        reqs: [],
        effects: [
          { type: 'ADD_SHARED_TRUTH', key: 'TRUTH_SERVER_DECAY', value: { id: 'TRUTH_SERVER_DECAY', label: 'Bit-Rot', description: 'The drive arrays are degraded. 15 years of unpowered stagnation has corrupted 40% of the sectors.' } },
          { type: 'MODIFY_METRIC', key: 'cognitiveLoad', value: 8 }
        ]
      }
    }
  },
  'SERVER_RIGHT': {
    id: 'SERVER_RIGHT',
    verbs: {
      'OBSERVE': {
        label: 'Check Integrity (Right Rack)',
        reqs: [],
        effects: [
          { type: 'ADD_SHARED_TRUTH', key: 'TRUTH_ARCHIVE_LOCK', value: { id: 'TRUTH_ARCHIVE_LOCK', label: 'Encrypted User Data', description: 'A partition labeled "INCIDENT_FOOTAGE" is locked. It requires a biometric key.' } },
          { type: 'MODIFY_METRIC', key: 'cognitiveLoad', value: 8 }
        ]
      },
      'UNLOCK_ARCHIVE': {
        label: 'Unlock Incident Archive (Biokey)',
        reqs: [
          { type: 'LOCATION', key: 'current', value: 'OBSERVATION_DECK_A' },
          { type: 'ITEM_HELD', key: 'BIO_KEY_RING', value: true }
        ],
        effects: [
          { type: 'UPDATE_OBJECT', key: 'SERVER_RIGHT', value: { data: { status: 'UNLOCKED' } } },
          { type: 'TRIGGER_EVENT', key: 'ARCHIVE_OPENED', value: null },
          { type: 'ADD_SHARED_TRUTH', key: 'TRUTH_INCIDENT_ARCHIVE', value: {
            id: 'TRUTH_INCIDENT_ARCHIVE',
            label: 'Incident Archive: “Icarus Preservation Trigger”',
            description: 'The footage is real. The “preservation” protocol was not meant to be reversible — but someone altered it.'
          } }
        ]
      }
    }
  },
  'MAINT_LOCKER': {
    id: 'MAINT_LOCKER',
    verbs: {
      'OPEN': {
        label: 'Open Maintenance Locker',
        reqs: [
          { type: 'LOCATION', key: 'current', value: 'MAINTENANCE_CORRIDOR' }
        ],
        effects: [
          { type: 'UPDATE_OBJECT', key: 'MAINT_LOCKER', value: { data: { opened: true } } },
          { type: 'ADD_ITEM', key: 'inventory', value: 'SCREWDRIVER' },
          { type: 'ADD_SHARED_TRUTH', key: 'TRUTH_MAINT_NOTE', value: {
            id: 'TRUTH_MAINT_NOTE',
            label: 'A maintenance note about “biokey material”',
            description: 'A scribbled tag: “BIOKEY kept in CRYO to prevent degradation. Drawer 03 sticks unless you torque the latch.”'
          } },
          { type: 'MODIFY_METRIC', key: 'cognitiveLoad', value: 2 }
        ]
      }
    }
  },
  'CRYO_DRAWER': {
    id: 'CRYO_DRAWER',
    verbs: {
      'OPEN': {
        label: 'Open Cryo Drawer (Tool)',
        reqs: [
          { type: 'LOCATION', key: 'current', value: 'CRYO_STORAGE' },
          { type: 'ITEM_HELD', key: 'SCREWDRIVER', value: true }
        ],
        effects: [
          { type: 'UPDATE_OBJECT', key: 'CRYO_DRAWER', value: { status: 'ACTIVE', data: { opened: true } } },
          { type: 'UPDATE_OBJECT', key: 'BIO_KEY_RING', value: { status: 'ACTIVE', locationId: 'INVENTORY' } },
          { type: 'ADD_ITEM', key: 'inventory', value: 'BIO_KEY_RING' },
          { type: 'TRIGGER_EVENT', key: 'BIOKEY_ACQUIRED', value: null },
          { type: 'MODIFY_METRIC', key: 'coherence', value: 2 }
        ]
      },
      'FORCE': {
        label: 'Force Cryo Drawer (Risk)',
        reqs: [
          { type: 'LOCATION', key: 'current', value: 'CRYO_STORAGE' }
        ],
        effects: [
          { type: 'UPDATE_OBJECT', key: 'CRYO_DRAWER', value: { status: 'BROKEN', data: { forced: true, opened: true } } },
          { type: 'UPDATE_OBJECT', key: 'BIO_KEY_RING', value: { status: 'ACTIVE', locationId: 'INVENTORY' } },
          { type: 'ADD_ITEM', key: 'inventory', value: 'BIO_KEY_RING' },
          { type: 'MODIFY_METRIC', key: 'drift', value: 6 },
          { type: 'UPDATE_DISPOSITION', key: 'fear', value: { fear: 0.08 } }
        ]
      }
    }
  }
};
