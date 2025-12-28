
import { LocationId } from '../types';

export interface LocationDef {
  id: LocationId;
  name: string;
  description: string;
  details: string;
  adjacency: LocationId[];
}

export const LOCATIONS: Record<LocationId, LocationDef> = {
  OUROBOROS: {
    id: 'OUROBOROS',
    name: 'Ouroboros Facility',
    description: 'A sealed, derelict complex functioning like a mausoleum.',
    details: 'Running on long-term emergency power. No staff, no maintenance, no oversight. The air is stagnant, smelling of ozone and 15 years of dust.',
    adjacency: []
  },
  OBSERVATION_DECK_A: {
    id: 'OBSERVATION_DECK_A',
    name: 'Observation Deck A',
    description: 'The interface point. A glass-walled room overlooking the silence.',
    details: 'Contains the unclaimed Operator Console and the massive CRT Display. It is the only place in the world where the internal simulation and physical reality touch.',
    adjacency: ['SERVER_ANNEX', 'CORRIDOR_WEST', 'MAINTENANCE_CORRIDOR']
  },
  SERVER_ANNEX: {
    id: 'SERVER_ANNEX',
    name: 'Server Annex',
    description: 'A caged area adjoining the deck, humming with dying fans.',
    details: 'Rows of black monoliths. Most lights are dead. The few that blink are amber, not green.',
    adjacency: ['OBSERVATION_DECK_A']
  },
  CORRIDOR_WEST: {
    id: 'CORRIDOR_WEST',
    name: 'West Corridor',
    description: 'A long, concrete throat connecting the labs.',
    details: 'Emergency lighting only. Graffiti from 2025 says "GOD LEFT FIRST".',
    adjacency: ['OBSERVATION_DECK_A', 'BREAKROOM', 'CRADLE_CHAMBER']
  },
  BREAKROOM: {
    id: 'BREAKROOM',
    name: 'Staff Breakroom',
    description: 'Abandoned mid-coffee. Cups still on tables, now thick with mold.',
    details: 'A time capsule of the last shift. A whiteboard has a bracket for a tournament that never finished.',
    adjacency: ['CORRIDOR_WEST']
  },
  CRADLE_CHAMBER: {
    id: 'CRADLE_CHAMBER',
    name: 'Sub-Level 2: Cradle Chamber',
    description: 'The physical heart of the continuity experiment.',
    details: 'Buried deep beneath the facility. It houses the Neural Substrate Cradle—the hardware actually running Coty\'s mind. Physical breach of this room triggers immediate Hard Flush.',
    adjacency: ['CORRIDOR_WEST']
  },
  CRT_DISPLAY: {
    id: 'CRT_DISPLAY',
    name: 'CRT Display',
    description: 'A wall-mounted volumetric terminal. Coty\'s sky and his prison.',
    details: 'From the outside, it is a dirty screen in a dark room. From the inside, it is the boundary of existence.',
    adjacency: []
  },
  HOME_BASE: {
    id: 'HOME_BASE',
    name: '"Home Base" Simulation',
    description: 'The internal projection of Coty\'s reality.',
    details: 'Initial State: A featureless black void. No floor, no walls, no gravity anchors.',
    adjacency: []
  },
  CONSOLE_STATION: {
    id: 'CONSOLE_STATION',
    name: 'Console Station',
    description: 'The tether point.',
    details: 'The Operator Console must remain within 12 meters of this station.',
    adjacency: []
  },
  MAINTENANCE_CORRIDOR: {
    id: 'MAINTENANCE_CORRIDOR',
    name: 'Maintenance Corridor',
    description: 'A narrow service artery behind the lab walls.',
    details: 'Cable trunks, coolant pipes, and access hatches. Everything hums on emergency power. There are lockers, a floor drain that smells metallic, and a sealed cryo door with a dead keypad.',
    adjacency: ['OBSERVATION_DECK_A', 'CRYO_STORAGE']
  },
  CRYO_STORAGE: {
    id: 'CRYO_STORAGE',
    name: 'Cryo Storage',
    description: 'A cold room that keeps mistakes from rotting.',
    details: 'Frost on steel drawers. Condensation beads on a cracked inspection window. A warning label: “BIOKEY MATERIAL — DO NOT REMOVE WITHOUT AUTHORIZATION.”',
    adjacency: ['MAINTENANCE_CORRIDOR']
  }
};
