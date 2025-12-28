
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
    description: 'A catastrophic mercy kill. "Interference equals annihilation."',
    statusParams: 'Triggered automatically if the Console sync tether breaks (>12m) or if the Cradle Chamber is breached. Designed to prevent the subject from experiencing eternal data corruption.'
  },
  STASIS_MODE: {
    id: 'STASIS_MODE',
    name: 'Stasis Mode',
    description: 'Archival Suspension.',
    statusParams: 'Pauses subjective time for the consciousness. The only way to safely perform deep maintenance or asset injection without traumatizing the subject.'
  },
  SYNC_ALIGN: {
    id: 'SYNC_ALIGN',
    name: 'Sync Alignment',
    description: 'Defense against "Neural Rust".',
    statusParams: 'Over 15 years, the digital mind drifts from the simulated body. This manifests as proprioceptive lag (ghost limbs). Hard Sync resets this drift to 0.'
  },
  AFFECTIVE_MONITORING: {
    id: 'AFFECTIVE_MONITORING',
    name: 'Affective Monitoring',
    description: 'The System\'s primary observation loop.',
    statusParams: 'Constantly measures CALM, GRIEF, and COGNITIVE_LOAD. It logs these values to the Console but takes no action to alleviate suffering.'
  },
  RENDERING_ENGINE: {
    id: 'RENDERING_ENGINE',
    name: 'Rendering Engine',
    description: 'The simulation layer.',
    statusParams: 'Strictly isolated from the Neural Lattice. A crash here means Coty goes blind in the dark; it does not mean he dies. Currently rendering a minimal void state.'
  }
};
