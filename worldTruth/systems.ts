
import { SystemId } from '../types';

export interface SystemDef {
  id: SystemId;
  name: string;
  description: string;
  statusParams: string;
}

export const SYSTEMS: Record<SystemId, SystemDef> = {
  HARD_FLUSH: {
    id: 'HARD_FLUSH',
    name: 'Hard Flush Protocol',
    description: 'A catastrophic purge. "Interference equals annihilation."',
    statusParams: 'Non-recoverable kill-switch triggered by prolonged console desynchronization (tether >12m), Cradle Chamber breach, or severe security violations. Ends the neural substrate completely.'
  },
  STASIS_MODE: {
    id: 'STASIS_MODE',
    name: 'Stasis Mode',
    description: 'Archival suspension of subjective time.',
    statusParams: 'Instantaneous to Coty: no dreams, no drift, no gap. Used to perform maintenance or inject assets without forcing him to watch reality rearrange itself.'
  },
  SYNC_ALIGN: {
    id: 'SYNC_ALIGN',
    name: 'Sync Alignment',
    description: 'Defense against "Neural Rust".',
    statusParams: 'Over long operation, timing drift creates proprioceptive lag (ghost limbs). Hard Sync realigns simulation and neural lattice timing back to baseline.'
  },
  AFFECTIVE_MONITORING: {
    id: 'AFFECTIVE_MONITORING',
    name: 'Affective Monitoring',
    description: 'The System\'s primary observation loop.',
    statusParams: 'Constantly measures CALM, GRIEF, and COGNITIVE_LOAD. Purely observational; it never modulates emotion or intervenes unless operators act on the logs.'
  },
  RENDERING_ENGINE: {
    id: 'RENDERING_ENGINE',
    name: 'Rendering Engine',
    description: 'The simulation layer and environment scaffolding.',
    statusParams: 'Boots into a null environment (black void, ground plane, invisible bounds) until operators inject assets. Isolated from the Neural Lattice: a crash blinds Coty but does not kill him.'
  },
  LIAR_DISPLAY: {
    id: 'LIAR_DISPLAY',
    name: 'L.I.A.R. Dual-Perspective Imaging',
    description: 'The two-way window between the simulation and the lab.',
    statusParams: 'External observers see a miniature projection of Coty and injected assets; internally, Coty sees the observation room at life scale. Both perspectives are aligned and accurate.'
  },
  ASSET_INJECTION: {
    id: 'ASSET_INJECTION',
    name: 'Asset Injection Console',
    description: 'Operator-controlled environment construction.',
    statusParams: 'Structures, furnishings, tools, and scenery are injected via the console, logged for stability, and should be added gradually. Coty cannot create assets on his own.'
  },
  AUDIO_INTERFACE: {
    id: 'AUDIO_INTERFACE',
    name: 'Audio Interface',
    description: 'Bidirectional audio path with latency compensation.',
    statusParams: 'Supports mute, one-way, or full duplex modes. Silence during observation is operator choice, not malfunction; speech may distort slightly at low power.'
  }
};
