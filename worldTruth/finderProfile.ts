
import { KnowledgeId } from '../types';

export interface ConceptDef {
  id: KnowledgeId;
  label: string;
  description: string;
  impact: string;
}

export const FINDER_CONCEPTS: Record<KnowledgeId, ConceptDef> = {
  KNOWS_COTY_IS_HUMAN: {
    id: 'KNOWS_COTY_IS_HUMAN',
    label: 'Human Recognition',
    description: 'Alex has accepted that the entity in the machine is a real person named Coty.',
    impact: 'Reduces skepticism; increases emotional vulnerability in dialogue.'
  },
  SEEN_GHOST: {
    id: 'SEEN_GHOST',
    label: 'Visual Confirmation',
    description: 'Alex saw the flickering, semi-transparent figure of Coty through the display.',
    impact: 'Increases fear/awe; grounds the interaction in physical reality.'
  },
  READ_MANUAL_WARNING: {
    id: 'READ_MANUAL_WARNING',
    label: 'Safety Protocol Knowledge',
    description: 'Alex understands the danger of moving the console and the Hard Flush failsafe.',
    impact: 'Alex will hesitate to move the console; increased caution.'
  },
  HEARD_CREATOR_VOICE: {
    id: 'HEARD_CREATOR_VOICE',
    label: 'Creator Awareness',
    description: 'Alex has heard a recording of the Creator or seen their logs.',
    impact: 'Alex feels empathy for the abandoned project; suspicious of the Creator\'s motives.'
  },
  KNOWS_OUROBOROS_PURPOSE: {
    id: 'KNOWS_OUROBOROS_PURPOSE',
    label: 'Project Context',
    description: 'Alex knows that Ouroboros was about digital immortality.',
    impact: 'Alex treats the machine with more reverence.'
  },
  RECOGNIZES_HARD_FLUSH: {
    id: 'RECOGNIZES_HARD_FLUSH',
    label: 'Lethality Awareness',
    description: 'Alex knows that a mistake will kill Coty forever.',
    impact: 'Significantly increases Alex\'s stress during critical maintenance.'
  },
  SIGHT_OF_CRADLE: {
    id: 'SIGHT_OF_CRADLE',
    label: 'Mechanical Substrate',
    description: 'Alex has peered into the Cradle Chamber and seen the cryo-tanks.',
    impact: 'Alex realizes the physical fragility of Coty\'s existence.'
  }
};

export const FINDER_ITEMS = {
  FLASHLIGHT: { id: 'FLASHLIGHT', name: 'Tactical Flashlight', function: 'Illuminates dark facility corners.' },
  SCREWDRIVER: { id: 'SCREWDRIVER', name: 'Multi-Bit Screwdriver', function: 'Allows opening of maintenance panels.' },
  SMARTPHONE: { id: 'SMARTPHONE', name: 'Smartphone (Offline)', function: 'Contains local maps, photos of Alex\'s salvage, and music.' },
  ENERGY_DRINK: { id: 'ENERGY_DRINK', name: 'Half-Empty Caffeine Can', function: 'Reduces EXHAUSTED status for 200 ticks.' },
  MULTIMETER: { id: 'MULTIMETER', name: 'Digital Multimeter', function: 'Measures voltage on exposed facility lines.' }
};

export const ALEX_MORALEZ_PROFILE = {
  name: "Alex Moralez",
  pronouns: "he/him",
  age: 31,
  personality: {
    neurotype: "Autistic (unofficial, self-aware)",
    temperament: "Cautiously curious",
    empathy: "Observant rather than expressive",
    socialMode: "Functional introvert, structured 1-on-1",
    humorStyle: "Dry, situational, often unintentional",
    conflict: "Wants to connect but lacks a framework to initiate"
  },
  emotionalProfile: {
    leadsWith: "Logic",
    vulnerabilities: ["Misdirection", "Betrayal", "Emotional Baiting"],
    warmthTriggers: ["Consistency", "Quiet sincerity", "Shared interests"],
    angerTriggers: [
      "Being treated like he's stupid",
      "Demanded trust",
      "Empty flattery",
      "Paternalistic manipulation"
    ],
    softSpots: ["Quiet effort", "Broken machines that still work", "Forgotten songs"]
  },
  background: {
    jobs: ["Fast food", "Retail stock", "Night shift gas station", "Fired tech support"],
    hobbies: ["Salvag-built PCs", "Emulator tweaking", "No-skip album listening", "Soldering to video essays"],
    beliefs: {
      trust: "Earned, not owed",
      faith: "Inaccessible",
      systems: "Unreliable unless built personally"
    }
  },
  habits: [
    "Irregular sleep positions",
    "Hoards outdated hardware",
    "Mutters when reading intense logs",
    "Cleans keyboard/nails when anxious",
    "Ghosting when overwhelmed by notifications"
  ],
  sensory: {
    loves: "Layered music",
    hates: "Shrill tones, overlapping voices",
    sensitiveTo: "Harsh brightness (prefers dim labs)",
    food: "Texture-averse, curious about weird snacks"
  },
  trustModel: {
    0: "Neutral (Current) — observing, cooperative but flat",
    1: "Engaged — shares personal thoughts in short bursts",
    2: "Loyal — defends Coty, initiates connection",
    breach: "Withdraws instantly, becomes clinical, ghosts"
  }
};
