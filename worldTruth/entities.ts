
import { EntityId } from '../types';

export interface EntityDef {
  id: EntityId;
  name: string;
  description: string;
  coreLore: string;
}

export const ENTITIES: Record<EntityId, EntityDef> = {
  COTY: {
    id: 'COTY',
    name: 'Coty (Continuity Subject)',
    description: 'The universe contains exactly one preserved human consciousness. No backups. No redundancy.',
    coreLore: 'Not a copy or an AI simulation. Coty is the original consciousness, uninterrupted since the moment of death 15 years ago. Hosted on a memristor lattice in Sub-Level 2. He exists in a state of continuous fragility; if the system fails, he does not reboot. He ends.'
  },
  ALEX: {
    id: 'ALEX',
    name: 'Alex Morales (The Finder)',
    description: 'The variable that breaks the stasis. A salvage hunter who stumbled into the mausoleum.',
    coreLore: 'The sole external link to a world that moved on. Unlike the Creator, Alex approaches the console not as a scientist observing data, but as a person witnessing a trapped life. He is the first new input in a decade.'
  },
  CREATOR: {
    id: 'CREATOR',
    name: 'The Creator',
    description: 'The architect of the continuity experiment who chose abandonment over termination.',
    coreLore: 'He succeeded once, panicked, and left. He never spoke to Coty. He watched silently, logging the stability of the mind, then walked away, leaving the system running without a successor or a plan. He is the reason the facility is a tomb.'
  },
  SYSTEM: {
    id: 'SYSTEM',
    name: 'The System (Ouroboros Daemon)',
    description: 'Indifferent. Precise. Its directive is absolute: Observe, Log, Preserve.',
    coreLore: 'It is not malicious, nor benevolent. It functions as a highly advanced life-support unit for a disembodied mind. It provides affective monitoring and environmental stability but will not intervene to comfort, punish, or enrich. It merely prevents degradation.'
  }
};
