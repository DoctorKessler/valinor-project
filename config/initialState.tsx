
import { GameState, SenderType, RehydrationModule } from '../types';
import { INITIAL_OBJECTS } from '../runtime/ObjectRegistry';

export const INITIAL_PIPELINE: RehydrationModule[] = [
  { id: 'MEAT', label: 'SOMATIC_RESIDUE', progress: 0, integrity: 0.6, drift: 0.4, status: 'PENDING' },
  { id: 'PERS', label: 'EGO_CONSTRUCT', progress: 0, integrity: 0.5, drift: 0.5, status: 'PENDING' },
  { id: 'SKILL', label: 'PRAXIS_ENGINE', progress: 0, integrity: 0.4, drift: 0.6, status: 'PENDING' },
  { id: 'INTEL', label: 'COGNITIVE_ARRAY', progress: 0, integrity: 0.7, drift: 0.3, status: 'PENDING' },
  { id: 'MEM', label: 'HISTORIC_LEDGER', progress: 0, integrity: 0.2, drift: 0.8, status: 'PENDING' },
  { id: 'CONSIST', label: 'PATTERN_STABILITY', progress: 0, integrity: 0.5, drift: 0.5, status: 'PENDING' },
  { id: 'SYNC', label: 'SOMA_SYNC_LOCK', progress: 0, integrity: 0.2, drift: 0.8, status: 'PENDING' },
];

export const INITIAL_GAME_STATE: GameState = {
  finder: {
    belief: 'ECHO',
    stress: 10,
    currentAction: 'Monitoring the screen.',
    memorySummary: [],
    isGone: false,
    lastActionType: 'STAY',
    sessionBound: false,
    diagnosticLog: [],
    disposition: {
      trust: 0.1,      
      fear: 0.2,       
      compliance: 0.8  
    },
    knowledge: [],
    inventory: ['FLASHLIGHT', 'SCREWDRIVER', 'SMARTPHONE', 'ENERGY_DRINK'],
    statusTags: ['CALM'],
    spatial: {
      x: 0,
      z: 0.1, // Near the console
      y: 0.5,
      angle: 0,
      posture: 'STANDING'
    }
  },
  biometrics: {
    grief: 30,
    embodiment: 0,
    calm: 50,
    cognitiveLoad: 80,
    coherence: 0.2,
    drift: 0.45, 
    consensus: 0.5 
  },
  world: {
    power: 100,
    temp: 18,
    integrity: 100,
    stability: 0,
    progress: 0, 
    propriocepSync: 0,
    yearsElapsed: 0,
    isRemoteViewActive: true, 
    isStasisActive: false,
    alarmActive: false,
    shakeIntensity: 0,
    activeVisualEffect: { type: 'DEFAULT', remaining: 0 },
    flags: {
      'PERSISTENCE_CLAMP_SET': true,
      'CURSOR_ROUTING_LOCKED': true,
      'INTENT_SERIALIZER_LOCKED': true,
      'BOOT_TICKS': 0,
      'THRASH_COUNT': 0,
      'RECOVERY_BOOST': 0,
      'LINK_COOLDOWN': 0,
      'SPOOL_INDEX': 0,
      'SIM_SPEED': 1.0,
      'KEYBOARD_ATTEMPTS': 0,
      'LAB_LIGHTS_ON': false, 
      'VISUAL_FEED_CRISP': false,
      'KNOWS_ALEX_NAME': false
    }
  },
  history: [
    {
      id: 'boot-1',
      sender: SenderType.SYSTEM,
      kind: 'sys',
      text: '[ COHERENCE_GATE: CLOSED ]\nCarrier lock initiated. Searching for external parity...',
      timestamp: Date.now(),
      lane: 'SHARED'
    }
  ],
  pipeline: INITIAL_PIPELINE,
  activeLinks: [],
  lastTags: [],
  prologueActive: true,
  bootPhase: 'CREATOR_INITIALIZATION',
  activePanel: 'BOOT_LAYER',
  unlockedMenus: [],
  mentalPhase: 'BOOT_SEQUENCE',
  activeMemoryId: null,
  archiveUnlocked: false,
  prologueMessages: [],
  locus: {
    x: 0.5,
    y: 0.5,
    label: 'FOCUS TRACKING: OFFLINE',
    mode: 'OFFLINE'
  },
  narrative: {
    isActive: false,
    currentLocation: 'OBSERVATION_DECK_A', 
    currentSceneId: 'SCENE_01_AWAKENING',
    currentBeatId: 'BEAT_01_ACTIVATION', 
    inventory: [],
    discoveredLore: [],
    worldFlags: {
        'LOCK': 'OPEN',
        'IS_STASIS_ACTIVE': false,
        'LAB_LIGHTS_ON': false,
        'VISUAL_FEED_CRISP': false,
        'FLASHLIGHT_ON': false
    },
    objects: INITIAL_OBJECTS, 
    eventLog: [],
    actionHistory: [],
    activeBeats: ['BEAT_01_ACTIVATION'],
    completedBeats: [],
    completedScenes: [],
    sharedTruths: [],
    recoveredMemoryIds: [],
    marginObservations: [],
    beatTimer: 0,
    branchSignals: {}
  }
};