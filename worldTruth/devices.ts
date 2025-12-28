
import { DeviceId } from '../types';

export interface DeviceDef {
  id: DeviceId | string;
  name: string;
  type: string;
  function: string;
  description?: string;
}

export const DEVICES: Record<string, DeviceDef> = {
  SUBSTRATE_CRADLE: {
    id: 'SUBSTRATE_CRADLE',
    name: 'Neural Substrate Cradle',
    type: 'Core Hardware',
    function: 'A memristor-based neural lattice in Sub-Level 2. It does not run code; it preserves a specific, continuous electrical pattern (Coty). Physical breach equals annihilation.'
  },
  OPERATOR_CONSOLE: {
    id: 'OPERATOR_CONSOLE',
    name: 'Operator Console',
    type: 'Interface Terminal',
    function: 'The primary control interface. Currently powered down and unclaimed. Covered in a thick layer of undisturbed dust.',
    description: 'An industrial terminal on a movable arm. It serves as the bridge between the System logic and the human observer.'
  },
  BINDER: {
    id: 'BINDER',
    name: 'System Log',
    type: 'Documentation',
    function: 'A logbook left on the desk. Contains the Creator\'s initial observation notes.',
    description: 'Handwritten entries ending in 2025. "Preservation Successful".'
  },
  ARCHIVE_DRIVES: {
    id: 'ARCHIVE_DRIVES',
    name: 'M.2 Archive Drives',
    type: 'Storage Cartridges',
    function: 'Physical media cartridges containing logs from 15 years ago. They hold the truth of the facility\'s abandonment.'
  },
  SUBJECT_FEED: {
    id: 'SUBJECT_FEED',
    name: 'Subject Feed Camera',
    type: 'Observation Tool',
    function: 'Allows the Operator to see the internal simulation. Currently obscured by grime on the CRT glass.'
  },
  DESK_CHAIR: {
    id: 'DESK_CHAIR',
    name: 'Volumetric Desk & Chair',
    type: 'Persistent Assets',
    function: 'Not present initially. Must be injected to provide the subject with gravity anchors.',
    description: 'The first furniture injected into Coty\'s Home Base. They possess full physics simulation and stability.'
  },
  PEN_PAD: {
    id: 'PEN_PAD',
    name: 'Ballpoint Pen & Legal Pad',
    type: 'Injected Tools',
    function: 'Simple analog items that allow Coty a form of creative and mnemonic expression. The simulation renders their physics with high fidelity.'
  },
  COIN: {
    id: 'COIN',
    name: 'The Coin',
    type: 'Real-World Marker',
    function: 'A coin Alex placed on the lab floor during the Stasis Mode test. It was a visible, external totem that proved to Coty that time had passed in the real world while his subjective time was frozen.'
  },
  AUX_BREAKER: {
    id: 'AUX_BREAKER',
    name: 'Auxiliary Power Breaker',
    type: 'Facility Hardware',
    function: 'Heavy duty switch. The only thing keeping the facility from total blackout. It hums with the strain of a 15-year duty cycle.'
  },
  LIGHT_SWITCH: {
    id: 'LIGHT_SWITCH',
    name: 'Laboratory Light Switch',
    type: 'Facility Hardware',
    function: 'Controls the overhead fluorescent arrays. Flickering and unreliable due to power grid instability.'
  },
  FLASHLIGHT: {
    id: 'FLASHLIGHT',
    name: 'Tactical Flashlight',
    type: 'Personal Item',
    function: 'Alex\'s light source. The beam cuts through the mausoleum gloom.'
  },
  LAB_SAFE: {
    id: 'LAB_SAFE',
    name: 'Floor-Mounted Secure Vault',
    type: 'Facility Hardware',
    function: 'Locked. Contains the facility security logs from 2025. It represents the answers to "how" Coty got here.',
    description: 'Cold steel. A sticker reads: "SECURITY ARCHIVE - INCIDENT REPORTS 2025".'
  },
  VALINOR_MANUAL: {
    id: 'VALINOR_MANUAL',
    name: 'Operational Manual',
    type: 'Documentation',
    function: 'The primary reference for the Valinor System. Defines the "Continuity Subject" and safety protocols.',
    description: 'A thick binder. "VALINOR SYSTEM - CONTINUITY PRESERVATION PLATFORM". It contains the ethical addendum regarding the subject\'s death.'
  },
  SERVER_LEFT: {
    id: 'SERVER_LEFT',
    name: 'Server Array (Primary)',
    type: 'Facility Infrastructure',
    function: 'Hosts the Rendering Engine and Affective Monitoring. Isolated from the Cradle to prevent graphics crashes from killing the subject.',
    description: 'Amber LEDs blinking in the dark. The fans are whining.'
  },
  SERVER_RIGHT: {
    id: 'SERVER_RIGHT',
    name: 'Server Array (Archive)',
    type: 'Facility Infrastructure',
    function: 'Cold storage. Mostly failed drives. A graveyard of data.'
  }
};
