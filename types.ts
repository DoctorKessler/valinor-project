
export enum SenderType {
  SYSTEM = 'SYSTEM',
  PLAYER = 'PLAYER',
  FINDER = 'FINDER'
}

export type LineKind = "sys" | "warn" | "err" | "ack" | "player" | "glitch" | "meta" | "action" | "banner" | "echo" | "soma" | "thought" | "telemetry" | "dispute";

export type NarrativeLane = 'SHARED' | 'COTY_PRIVATE' | 'ALEX_PRIVATE';

export interface TerminalMessage {
  id: string;
  sender: SenderType;
  kind: LineKind;
  text: string;
  timestamp: number;
  lane: NarrativeLane;
  actionId?: string; 
  choiceId?: string; 
  isBeatMessage?: boolean; 
}

export interface RehydrationModule {
  id: string;
  label: string;
  progress: number;
  integrity: number;
  drift: number;
  status: 'PENDING' | 'VALIDATING' | 'LOCKED';
}

export type LinkBehavior = 'STABLE' | 'FLEE' | 'SUDDEN' | 'GHOST' | 'INTERMITTENT' | 'AGGRESSIVE' | 'WANDER' | 'TELEPORT';
export type VisualImpact = 'DEFAULT' | 'MONOCHROME' | 'OVEREXPOSED' | 'CHROMATIC' | 'BLUR' | 'CRISP' | 'GLITCH' | 'INVERT' | 'SEPIA' | 'HIGH_CONTRAST';

export type CotyVerb = 'ASK' | 'TEST' | 'MOVE' | 'HIDE' | 'COMMIT' | 'CARE' | 'SIGNAL' | 'IGNORE' | 'CHALLENGE' | 'VERIFY' | 'ACCEPT' | 'OBSERVE' | 'USE_ITEM' | 'OPEN' | 'FORCE' | 'UNLOCK_ARCHIVE';

export interface NarrativeAction {
  verb: CotyVerb | string;
  target?: string;
  payload?: any;
  timestamp: number;
}

export type NodeType = 'beat' | 'breather';

export interface TextCapture {
  mode: 'optional' | 'required';
  placeholder?: string;
  maxChars?: number;
}

export type WorldTruthKey = string;

export type Extractor =
  | { type: 'storeRaw'; key: WorldTruthKey };

export interface NarrativeChoice {
  id: string;
  label: string;
  action: {
    verb: CotyVerb;
    target?: string;
    payload?: any;
  };
  description?: string;
  reqs?: InteractionReq[];
  effects?: InteractionEffect[];
  nextBeatId?: string;
  cost?: {
    drift?: number;
    integrity?: number;
    cognitiveLoad?: number;
    consensus?: number;
  };
  capture?: TextCapture;
  extractors?: Extractor[];
}

export interface Beat {
  id: string;
  type: NodeType;
  speaker: EntityId;
  text: string;
  kind: LineKind;
  lane: NarrativeLane;
  choices?: NarrativeChoice[];
  nextBeatId?: string;
  autoTransition?: boolean;
  onEnter?: InteractionEffect[];
  requirements?: InteractionReq[];
  delay?: number; 
}

export interface Scene {
  id: string;
  locationId: LocationId;
  initialBeatId: string;
  beats: Record<string, Beat>;
  exitConditions?: InteractionReq[];
  requirements?: InteractionReq[];
}

export interface BeatResult {
  newState: GameState;
  messages: Partial<TerminalMessage>[];
  nextBeatId?: string;
}

export interface Memory {
  id: string;
  title: string;
  content: string;
  yearJump: number;
  visited: boolean;
  behavior: LinkBehavior;
  rewards: {
    driftMod: number;
    integrityMod: number;
    coherenceMod: number;
    timeSpeedMod?: number; 
    visualImpact?: VisualImpact;
    visualDuration?: number; 
    pipelineBoosts?: Record<string, number>; 
  };
  onRecover?: {
    beatId?: string;
    sceneId?: string;
    effects?: InteractionEffect[];
  };
}

export interface VolatileLink {
  id: string;
  memoryId: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; 
  decayRate: number;
  behavior: LinkBehavior;
}

export type BeliefState = 'ECHO' | 'PRANK' | 'TRAPPED_PERSON' | 'THREAT' | 'RESOURCE';

export interface Biometrics {
  grief: number;
  embodiment: number;
  calm: number;
  cognitiveLoad: number;
  coherence: number; 
  drift: number;     
  consensus: number; // 0 (Hostile/Misaligned) to 1 (Symbiotic/Unified)
}

export type AllowedAction = 'STAY' | 'COMMUNICATE' | 'INTERACT' | 'MOVE_CONSOLE' | 'FLEE' | 'HESITATE' | 'USE_ITEM' | 'SYSTEM_PATCH';

export interface DiagnosticEntry {
  timestamp: number;
  text: string;
  severity: 'INFO' | 'WARNING' | 'ERROR';
}

export interface SharedTruth {
  id: string;
  label: string;
  description: string;
  confidence: number;
  discoveredAt: number;
  isVerified: boolean;
  source: 'PROLOGUE_ECHO' | 'DIRECT_OBSERVATION' | 'DIALOGUE_CONSENSUS' | 'PLAYER_HYPOTHESIS';
}

export interface DispositionMatrix {
  trust: number;      
  fear: number;       
  compliance: number;  
}

export type KnowledgeId = 
  | 'KNOWS_COTY_IS_HUMAN' 
  | 'SEEN_GHOST' 
  | 'READ_MANUAL_WARNING' 
  | 'HEARD_CREATOR_VOICE'
  | 'KNOWS_OUROBOROS_PURPOSE'
  | 'RECOGNIZES_HARD_FLUSH'
  | 'SIGHT_OF_CRADLE';

export type FinderStatusTag = 'SHIVERING' | 'EXHAUSTED' | 'INJURED' | 'FOCUSED' | 'SENSORY_OVERLOAD' | 'CALM';
export type AlexPosture = 'STANDING' | 'SITTING' | 'CROUCHED' | 'LEANING' | 'REACHING' | 'LOOKING_UP' | 'KNEELING' | 'INSPECTING';

export interface AlexSpatialState {
  x: number; // -1 (far left) to 1 (far right)
  z: number; // 0 (at glass) to 1 (back wall)
  y: number; // 0 (floor) to 1 (ceiling)
  angle: number; // -180 to 180 degrees (facing direction)
  posture: AlexPosture;
}

export interface FinderState {
  belief: BeliefState;
  stress: number; 
  currentAction: string;
  memorySummary: string[];
  isGone: boolean;
  lastActionType: AllowedAction;
  sessionBound: boolean;
  diagnosticLog: DiagnosticEntry[];
  
  disposition: DispositionMatrix;
  knowledge: KnowledgeId[];
  
  inventory: string[]; 
  statusTags: FinderStatusTag[];
  spatial: AlexSpatialState;

  pendingAction?: {
    type: AllowedAction;
    target?: string;
    rationale: string;
  } | null;
}

export interface WorldState {
  power: number; 
  temp: number;  
  integrity: number; 
  stability: number; 
  progress: number; 
  propriocepSync: number; 
  yearsElapsed: number;
  isRemoteViewActive: boolean; 
  isStasisActive: boolean;
  alarmActive?: boolean;
  shakeIntensity?: number;
  activeVisualEffect: {
    type: VisualImpact;
    remaining: number;
  };
  flags: Record<string, any>; 
}

export type BootPhase = 
  | 'CREATOR_INITIALIZATION'
  | 'SIGNAL_DETECTION' 
  | 'COHERENCE_GATE' 
  | 'CARRIER_LOCK' 
  | 'IDENTITY_STABILIZATION' 
  | 'READY'
  | 'SELF_EXPLORATION'
  | 'STABILIZATION';

export type EntityId = 'COTY' | 'ALEX' | 'CREATOR' | 'SYSTEM';
export type LocationId = 
  | 'OUROBOROS' 
  | 'OBSERVATION_DECK_A' 
  | 'CRADLE_CHAMBER' 
  | 'CRT_DISPLAY' 
  | 'HOME_BASE' 
  | 'CONSOLE_STATION'
  | 'SERVER_ANNEX'
  | 'CORRIDOR_WEST'
  | 'BREAKROOM'
  | 'MAINTENANCE_CORRIDOR'
  | 'CRYO_STORAGE';

export type DeviceId = 'OPERATOR_CONSOLE' | 'SUBSTRATE_CRADLE' | 'BINDER' | 'ARCHIVE_DRIVES' | 'SUBJECT_FEED' | 'DESK_CHAIR' | 'PEN_PAD' | 'COIN' | 'AUX_BREAKER' | 'FLASHLIGHT' | 'LAB_SAFE' | 'VALINOR_MANUAL' | 'LIGHT_SWITCH';
export type SystemId =
  | 'HARD_FLUSH'
  | 'STASIS_MODE'
  | 'SYNC_ALIGN'
  | 'AFFECTIVE_MONITORING'
  | 'RENDERING_ENGINE'
  | 'LIAR_DISPLAY'
  | 'ASSET_INJECTION'
  | 'AUDIO_INTERFACE';

export type VerbId = 'READ' | 'INJECT' | 'RUN_STASIS' | 'MOUNT_ARCHIVE' | 'MOVE' | 'OBSERVE' | 'TOGGLE_POWER' | 'TOGGLE' | 'PICKUP' | 'DROP' | 'ASK_ABOUT' | 'VERIFY' | 'FLUSH_ATTEMPT' | 'UNLOCK_ARCHIVE' | 'OPEN' | 'FORCE';

export interface InteractionReq {
  type: 'STATE_FLAG' | 'LOCATION' | 'ITEM_HELD' | 'SYSTEM_STATUS' | 'METRIC_MIN' | 'METRIC_MAX' | 'DISPOSITION_MIN' | 'HAS_TRUTH' | 'OBJECT_DATA_EQ' | 'OBJECT_DATA_MIN' | 'OBJECT_DATA_MAX';
  key: string;
  value: any;
  negate?: boolean;
}

export interface InteractionEffect {
  type: 'SET_FLAG' | 'TRIGGER_EVENT' | 'UNLOCK_LORE' | 'MODIFY_METRIC' | 'TRANSITION_SCENE' | 'UPDATE_OBJECT' | 'UPDATE_DISPOSITION' | 'LEARN_CONCEPT' | 'ADD_SHARED_TRUTH' | 'ADD_ITEM' | 'REMOVE_ITEM' | 'MOVE_OBJECT' | 'SET_STATUS' | 'SET_DATA' | 'CONSUME_RESOURCE' | 'SET_LOCATION';
  key: string;
  value: any;
}

export interface InteractableDef {
  id: string;
  verbs: Partial<Record<VerbId, {
    label: string;
    reqs: InteractionReq[];
    effects: InteractionEffect[];
    loreHooks?: string[]; 
  }>>;
}

export type ObjectStatus = 'ACTIVE' | 'INACTIVE' | 'BROKEN' | 'LOCKED' | 'HIDDEN' | 'UNKNOWN';
export type ObjectLocation = LocationId | 'INVENTORY' | 'VOID' | 'SYSTEM_CORE';

export interface RuntimeObject {
  id: string;
  name: string;
  type: 'DEVICE' | 'SYSTEM' | 'ITEM';
  status: ObjectStatus;
  locationId: ObjectLocation;
  data: Record<string, any>; 
}

export interface MarginObs {
  id: string;
  text: string;
  ts: number;
  ttlMs: number;
}

export interface NarrativeEvent {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
}

export interface IntroHandoff {
  type: 'INTRO_COMPLETE';
  transcript: string[];
  seedFlags: Record<string, any>;
  seedBeatId: string;
}

export interface NarrativeState {
  isActive: boolean;
  introHandoff?: IntroHandoff;
  currentLocation: LocationId;
  currentSceneId: string;
  currentBeatId: string;
  inventory: string[];
  discoveredLore: string[];
  worldFlags: Record<string, any>;
  objects: Record<string, RuntimeObject>;
  eventLog: NarrativeEvent[];
  actionHistory: NarrativeAction[];
  activeBeats: string[];
  completedBeats: string[];
  completedScenes: string[]; // NEW: Tracks finished scenes for spinal flow
  sharedTruths: SharedTruth[];
  recoveredMemoryIds: string[];
  marginObservations: MarginObs[];
  beatTimer: number;
  branchSignals?: Record<string, number>;
}

export interface GameState {
  finder: FinderState;
  world: WorldState;
  biometrics: Biometrics;
  history: TerminalMessage[];
  lastTags: string[]; 
  prologueActive: boolean;
  bootPhase: BootPhase;
  activePanel: 'TERMINAL' | 'COGNITIVE_MIRROR' | 'RECALL_ARCHIVE' | 'HARDWARE' | 'DISCOVERY_LEDGER' | 'BOOT_LAYER' | 'NONE';
  unlockedMenus: string[];
  mentalPhase: 'BOOT_SEQUENCE' | 'MAINTENANCE' | 'DRIFT' | 'COMPRESSION' | 'FINDER_ARRIVAL';
  activeMemoryId: string | null;
  archiveUnlocked: boolean;
  pipeline: RehydrationModule[];
  activeLinks: VolatileLink[];
  prologueMessages: string[]; 
  locus: {
    x: number;
    y: number;
    label: string;
    mode: 'OFFLINE' | 'GHOST' | 'INTERMITTENT' | 'ACTIVE';
  };
  narrative: NarrativeState;
}

export interface AIResponse {
  finderText: string;
  internalDiagnostic: string; 
  biometricHints: string[];
  attemptedAction: {
    type: AllowedAction;
    target?: string;
    rationale: string;
    immediateEffect?: Partial<WorldState['flags']>;
  };
  proposedAction?: {
    type: AllowedAction;
    target?: string;
    rationale: string;
  } | null;
  detectedEmotions: string[];
  systemCommand?: {
    unlockMenu?: string;
    label?: string;
    key?: string;
    worldPatch?: Partial<WorldState['flags']>;
    addSharedTruth?: { id: string, label: string, description: string };
  };
}

export type EngineAction = 
  | { type: 'TICK', ts: number }
  | { type: 'PLAYER_INPUT', text: string }
  | { type: 'FINDER_REACTION', response: AIResponse, input: string }
  | { type: 'COMMAND', id: string }
  | { type: 'APPLY_MEMORY', memoryId: string }
  | { type: 'RESOLVE_CHOICE', choiceId: string, text?: string };

export type NarrativeMutation = 
  | { type: 'UPDATE_WORLD', patch: Partial<WorldState> }
  | { type: 'UPDATE_FINDER', patch: Partial<FinderState> }
  | { type: 'UPDATE_BIOMETRICS', patch: Partial<Biometrics> }
  | { type: 'UPDATE_NARRATIVE', patch: Partial<NarrativeState> }
  | { type: 'UPDATE_PIPELINE', pipeline: RehydrationModule[] }
  | { type: 'ADD_MESSAGE', message: Partial<TerminalMessage> }
  | { type: 'SET_BOOT_PHASE', phase: BootPhase }
  | { type: 'SET_FLAG', key: string, value: any }
  | { type: 'BATCH', mutations: NarrativeMutation[] };

export interface EngineResult {
  newState: GameState;
  newEntries: TerminalMessage[];
  events: NarrativeEvent[];
}
