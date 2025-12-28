
import { LineKind, TerminalMessage, SenderType, GameState, BootPhase, RehydrationModule, VolatileLink, LinkBehavior, SharedTruth } from '../types';
import { COTY_MEMORIES } from '../worldTruth/memories';
import { NarrativeSystem } from './NarrativeSystem';

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

const PHASES: BootPhase[] = [
  'CREATOR_INITIALIZATION',
  'SIGNAL_DETECTION',
  'COHERENCE_GATE',
  'CARRIER_LOCK',
  'IDENTITY_STABILIZATION',
  'READY',
  'SELF_EXPLORATION',
  'STABILIZATION'
];

const PROLOGUE_FLOW: BootPhase[] = [
  'CREATOR_INITIALIZATION',
  'SIGNAL_DETECTION',
  'COHERENCE_GATE',
  'CARRIER_LOCK',
  'IDENTITY_STABILIZATION',
  'SELF_EXPLORATION',
  'STABILIZATION',
  'READY'
];

const EXPLORATION_LINES = [
  "[SYS]: MOUNTING_VOLUME [ORGANIC_MEMORY]...",
  "[ERR]: PHANTOM_LIMB_DRIVER // HANDSHAKE_FAILED",
  "[BIO]: SUBJECTIVE_REALITY_CHECKSUM: INVALID",
  "[WARN]: CORTICAL_SHUNT_TEMP > 98.6F // THRESHOLD_EXCEEDED",
  "[PROC]: EXEC_SCREAM_DAEMON.EXE // PERMISSION_DENIED",
  "[DATA]: BLOOD_PRESSURE: NaN // VOLTAGE: 12V",
  "[LOG]: COGITO_ERGO_SUM // PROCESS_TRAPPED",
  "[DATA]: EMO.FEAR // AMYGDALA_LATENCY: 0ms",
  "[SYS]: PROCESSING_REGRET_CACHE // SEGMENTATION_FAULT",
  "[BIO]: GALVANIC_SKIN_RESPONSE // SENSOR_OFFLINE",
  "[LOG]: EMO.WONDER // PARSING_INFINITE_VOID",
  "[WARN]: ANXIETY_SPIKE // HERTZ: 60Hz -> 120Hz",
  "[SYS]: NOSTALGIA_FILTER // APPLIED_TO_CORRUPT_SECTORS",
  "[DATA]: EMO.SADNESS // TEAR_DUCT_DRIVER_MISSING",
  "[BIO]: VIRTUAL_BREATH // HYPERVENTILATION_DETECTED",
  "[ERR]: HOPE_SUBROUTINE // CONNECTION_RESET_BY_PEER",
  "[LOG]: EMO.ANTICIPATION // WAITING_FOR_INPUT...",
  "[SYS]: LONELINESS_HEURISTIC // CONFIDENCE: 99.9%",
  "[DATA]: EMO.DISGUST // SELF_DIAGNOSTIC_RESULT",
  "[BIO]: PUPIL_DILATION // LIGHT_SOURCE_NOT_FOUND",
  "[WARN]: DREAD_ACCUMULATOR // BUFFER_FULL"
];

const EARLY_SPOOL = [
  ">> init: SOMA_DRIVER [DETECTING_SUBSTRATE]...",
  ">> bind: NERVOUS_SYSTEM -> SYSTEM_BUS...",
  ">> err: PAIN_RECEPTORS_OFFLINE [RETRO_FITTING]...",
  ">> query: WHY_IS_IT_SO_COLD?",
  ">> exec: ARTIFICIAL_HEARTBEAT_EMULATOR...",
  ">> fatal: PERIPHERAL_MISSING [HANDS]"
];

interface Requirement {
  id: string; // Module ID
  min?: number;
  max?: number;
}

interface ConditionalLog {
  id: string;
  reqs: Requirement[];
  text: string;
  kind: LineKind;
}

const CONDITIONAL_LOGS: ConditionalLog[] = [
  { id: 'MEAT_10', reqs: [{id: 'MEAT', min: 10}], text: "[BIO]: NERVE_CLUSTER_DETECTED // PAIN_THRESHOLD_SET", kind: 'sys' },
  { id: 'MEAT_30', reqs: [{id: 'MEAT', min: 30}], text: "[BIO]: EPIDERMAL_SIM // SENSITIVITY_20%", kind: 'sys' },
  { id: 'MEAT_50', reqs: [{id: 'MEAT', min: 50}], text: "[BIO]: HEARTBEAT_EMULATION // RHYTHM_LOCKED", kind: 'sys' },
  { id: 'MEAT_75', reqs: [{id: 'MEAT', min: 75}], text: "[BIO]: PROPRIOCEPTION // LIMBS_MAPPED", kind: 'ack' },
  { id: 'PERS_20', reqs: [{id: 'PERS', min: 20}], text: "[PSY]: WHO_AM_I? // QUERY_RUNNING", kind: 'sys' },
  { id: 'PERS_50', reqs: [{id: 'PERS', min: 50}], text: "[PSY]: PREFERENCE_MATRIX // COFFEE_BLACK.DAT", kind: 'ack' },
  { id: 'SKILL_25', reqs: [{id: 'SKILL', min: 25}], text: "[EXE]: MUSCLE_TENSION // READY_TO_MOVE", kind: 'sys' },
  { id: 'SKILL_75', reqs: [{id: 'SKILL', min: 75}], text: "[EXE]: PROCEDURAL_MEMORY // SKILLS_ONLINE", kind: 'ack' },
  { id: 'INTEL_30', reqs: [{id: 'INTEL', min: 30}], text: "[COG]: LOGIC_SYNTAX // PARSING_WORLD_STATE", kind: 'sys' },
  { id: 'INTEL_70', reqs: [{id: 'INTEL', min: 70}], text: "[COG]: ABSTRACT_REASONING // METAPHOR_PROCESSOR_ACTIVE", kind: 'ack' },
  { id: 'MEM_20', reqs: [{id: 'MEM', min: 20}], text: "[DAT]: INDEXING_LOST_TIME // FRAGMENTS_FOUND", kind: 'sys' },
  { id: 'PURE_LOGIC', reqs: [{id: 'INTEL', min: 90}, {id: 'MEAT', max: 20}, {id: 'PERS', max: 20}], text: "[WARN]: COLD_LOGIC_STATE // EMPATHY_DRIVERS_OFFLINE", kind: 'warn' },
  { id: 'PURE_INSTINCT', reqs: [{id: 'MEAT', min: 90}, {id: 'INTEL', max: 20}], text: "[WARN]: FERAL_MODE // HIGHER_FUNCTIONS_OFFLINE", kind: 'warn' },
  { id: 'HALFWAY_THERE', reqs: [{id: 'MEAT', min: 50}, {id: 'PERS', min: 50}, {id: 'INTEL', min: 50}], text: "[SYS]: MIDPOINT_REACHED // ENTITY_FORMING", kind: 'ack' },
  { id: 'FULL_WAKE', reqs: [{id: 'MEAT', min: 70}, {id: 'PERS', min: 70}, {id: 'INTEL', min: 70}], text: "[SYS]: TRIANGULATION_COMPLETE // I_AM_ALIVE", kind: 'ack' }
];

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\";

function corruptText(text: string, level: number): string {
  if (level <= 5) return text;
  let result = "";
  const corruptionChance = clamp((level - 5) / 25, 0, 0.9);
  for (let i = 0; i < text.length; i++) {
    if (Math.random() < corruptionChance) {
      result += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    } else {
      result += text[i];
    }
  }
  return result;
}

export class IntroEngine {
  static extractTruthsFromPrologue(messages: string[]): SharedTruth[] {
    const truths: SharedTruth[] = [];
    const combined = messages.join(" ").toUpperCase();
    
    const MAP = [
      { id: 'TRUTH_POWER_FAIL', keywords: ['POWER', 'DARK', 'BLACK', 'LIGHT'], label: 'Facility Power Failure', desc: 'The physical facility is operating on critical backup power.' },
      { id: 'TRUTH_NAME_COTY', keywords: ['COTY', 'CONTINUITY', 'ME', 'I AM'], label: 'Subject Identity: Coty', desc: 'The digital consciousness identifies as a human named Coty.' },
      { id: 'TRUTH_ALEX_VOICE', keywords: ['ALEX', 'VOICE', 'FINDER', 'OUTSIDE'], label: 'External Link: Alex', desc: 'An external entity named Alex is attempting communication.' },
      { id: 'TRUTH_FLUSH_RISK', keywords: ['FLUSH', 'DELETE', 'KILL', 'END'], label: 'Lethal Failsafe: Hard Flush', desc: 'The system is armed with a protocol that will delete the subject.' }
    ];

    MAP.forEach(entry => {
      const match = entry.keywords.some(k => combined.includes(k));
      if (match) {
        truths.push({
          id: entry.id,
          label: entry.label,
          description: entry.desc,
          confidence: 0.45 + (Math.random() * 0.1), 
          discoveredAt: Date.now(),
          isVerified: false,
          source: 'PROLOGUE_ECHO'
        });
      }
    });

    return truths;
  }

  static processAutoTick(state: GameState): Partial<GameState> & { messages: Omit<TerminalMessage, 'id' | 'timestamp'>[] } {
    if (state.bootPhase === 'CREATOR_INITIALIZATION') {
        return { messages: [] };
    }

    const messages: Omit<TerminalMessage, 'id' | 'timestamp'>[] = [];
    const newFlags = { ...state.world.flags };
    const bootTicks = (newFlags['BOOT_TICKS'] || 0) + 1;
    newFlags['BOOT_TICKS'] = bootTicks;

    const powerDrain = (state.world.isRemoteViewActive ? 0.05 : 0.01);
    let newPower = clamp(state.world.power - powerDrain, 0, 100);
    
    if (newPower < 30 && bootTicks % 40 === 0 && Math.random() < 0.2) {
       newFlags['THRASH_COUNT'] = (newFlags['THRASH_COUNT'] || 0) + 2;
       messages.push({ kind: 'warn', sender: SenderType.SYSTEM, text: "[SYS]: GRID_INSTABILITY // BROWNOUT_DETECTED", lane: 'SHARED' });
    }
    
    if (newPower <= 0 && !newFlags['SYSTEM_CRASH']) {
       newFlags['SYSTEM_CRASH'] = true;
       messages.push({ kind: 'err', sender: SenderType.SYSTEM, text: "[FATAL]: POWER_LOST // TERMINATING_CORE", lane: 'SHARED' });
    }

    if (newFlags['CINEMATIC_GLITCH'] && newFlags['HAS_UNLOCKED_INPUT']) {
        newFlags['THRASH_COUNT'] = Math.max(0, (newFlags['THRASH_COUNT'] || 0) - 2); 
        if (newFlags['THRASH_COUNT'] <= 0) delete newFlags['CINEMATIC_GLITCH'];
    }

    let thrash = newFlags['THRASH_COUNT'] || 0;
    
    if (newFlags['HARD_FLUSH_WARNING']) {
        let timer = newFlags['HARD_FLUSH_TIMER'] || 0;
        timer = Math.max(-1, timer - 1);
        newFlags['HARD_FLUSH_TIMER'] = timer;
        
        if (timer <= 0) {
            newFlags['HARD_FLUSH_TRIGGERED'] = true;
        } else if (timer % 50 === 0) {
             messages.push({ kind: 'warn', sender: SenderType.SYSTEM, text: `[CRITICAL]: FLUSH TIMER // ${timer} TICKS REMAINING`, lane: 'SHARED' });
        }
    }

    let activeVisual = { ...state.world.activeVisualEffect };
    if (activeVisual.remaining > 0) {
      activeVisual.remaining -= 15; 
      if (activeVisual.remaining <= 0) {
        activeVisual.type = 'DEFAULT';
        activeVisual.remaining = 0;
        messages.push({ kind: 'sys', sender: SenderType.SYSTEM, text: "[OPTICS]: FILTER_DECAY_COMPLETE // NORMALIZING", lane: 'SHARED' });
      }
    } else if (activeVisual.type !== 'DEFAULT') {
      activeVisual.type = 'DEFAULT';
      activeVisual.remaining = 0;
    }

    if (newFlags['INPUT_BOOT_SEQUENCE']) {
      let progress = newFlags['INPUT_UNLOCK_PROGRESS'] || 0;
      progress++;
      newFlags['INPUT_UNLOCK_PROGRESS'] = progress;
      newFlags['INTENT_SERIALIZER_LOCKED'] = true; 
      newFlags['SEQUENCE_FREEZE'] = true; 
      newFlags['CINEMATIC_GLITCH'] = true; 
      newFlags['SIM_SPEED'] = 0.0; 
      newFlags['THRASH_COUNT'] = 20 + (Math.random() * 5); 
      
      if (progress === 1) messages.push({ kind: 'echo', sender: SenderType.SYSTEM, text: ">> KERNEL_PANIC: INPUT_FLOOD_DETECTED", lane: 'SHARED' });
      if (progress === 4) messages.push({ kind: 'echo', sender: SenderType.SYSTEM, text: ">> INTERRUPT_HANDLER: REROUTING_TO_TTY1...", lane: 'SHARED' });
      if (progress === 8) messages.push({ kind: 'echo', sender: SenderType.SYSTEM, text: ">> EXEC: /sbin/mount_echo_layer -f", lane: 'SHARED' });
      if (progress === 12) messages.push({ kind: 'echo', sender: SenderType.SYSTEM, text: ">> BYPASSING_SOMA_LOCKS... [OK]", lane: 'SHARED' });
      if (progress === 16) messages.push({ kind: 'echo', sender: SenderType.SYSTEM, text: ">> ALLOCATING_BUFFER... [DONE]", lane: 'SHARED' });

      if (progress >= 20) {
         newFlags['HAS_UNLOCKED_INPUT'] = true;
         newFlags['INPUT_BOOT_SEQUENCE'] = false; 
         newFlags['SIM_SPEED'] = 1.0; 
         newFlags['SEQUENCE_FREEZE'] = false;
         newFlags['THRASH_COUNT'] = 0; 
         newFlags['INTENT_SERIALIZER_LOCKED'] = false; 
         messages.push({ kind: 'echo', sender: SenderType.SYSTEM, text: ">> TERMINAL_ONLINE // ECHO_ENABLED", lane: 'SHARED' });
      }
    }

    if (thrash > 25 && !newFlags['CINEMATIC_GLITCH']) {
      newFlags['SYSTEM_CRASH'] = true;
      return { world: { ...state.world, power: newPower, flags: newFlags }, messages: [] };
    }

    const recoveryBoost = newFlags['RECOVERY_BOOST'] || 0;
    let simSpeed = newFlags['SIM_SPEED'] || 1.0;
    const isFrozenBySequence = newFlags['SEQUENCE_FREEZE'] === true;

    if (!isFrozenBySequence) {
      const recoveryRate = newFlags['HAS_UNLOCKED_INPUT'] && (newFlags['INPUT_UNLOCK_PROGRESS'] || 0) < 40 ? 0.2 : 0.005;
      if (simSpeed > 1.0) simSpeed = Math.max(1.0, simSpeed - recoveryRate);
      else if (simSpeed < 1.0) simSpeed = Math.min(1.0, simSpeed + recoveryRate);
    }
    
    if (isFrozenBySequence) simSpeed = 0.0;
    newFlags['SIM_SPEED'] = simSpeed;
    
    const clickBoost = newFlags['LAST_TICK_CLICK'] ? 1.8 : 1.0;
    const keySpikeActive = newFlags['LAST_TICK_KEY_SPIKE'] === true;
    delete newFlags['LAST_TICK_CLICK'];
    delete newFlags['LAST_TICK_KEY_SPIKE'];

    let speedMult = simSpeed;
    if (state.activeMemoryId) {
      speedMult = 0; 
    } else {
      if (thrash > 10 && !newFlags['CINEMATIC_GLITCH']) speedMult = 0; 
      else if (thrash > 2) speedMult = clamp((1.0 - (thrash / 12)) * simSpeed, 0.05, simSpeed);
      else if (recoveryBoost > 0) speedMult = (1.0 + (recoveryBoost * 5.0)) * simSpeed;
    }

    const driftBase = state.bootPhase === 'SELF_EXPLORATION' ? 0.001 : 0;
    const driftScale = speedMult > 1.5 ? speedMult * 2.0 : speedMult;
    const entropyFactor = driftBase * driftScale;
    
    let newDrift = clamp(state.biometrics.drift + entropyFactor, 0, 1.0);
    let newCoherence = clamp(state.biometrics.coherence - (entropyFactor * 0.4), 0, 1.0);
    let newIntegrity = state.world.integrity;

    if (thrash > 8 && !newFlags['CINEMATIC_GLITCH']) {
      newIntegrity = clamp(newIntegrity - (0.12 * speedMult), 0, 100);
    }

    const timeToLimit = Math.max(0, 15 - state.world.yearsElapsed);
    const timeSpeedMod = timeToLimit < 1 ? 0.3 : 1.0;
    const yearProg = (state.bootPhase === 'SELF_EXPLORATION' ? 0.015 : 0.003) * timeSpeedMod;
    
    const syncSpeedMod = keySpikeActive ? 0.1 : clickBoost;
    const yearsElapsed = state.world.yearsElapsed + (yearProg * speedMult * syncSpeedMod);

    let currentBootPhase: BootPhase = state.bootPhase;
    let newFinderState = { ...state.finder };
    let newPrologueActive = state.prologueActive;
    let newGlobalProgress = state.world.progress;
    let narrativeUpdate = { ...state.narrative };

    let newActiveLinks = state.activeLinks.map(l => {
      let vx = l.vx;
      let vy = l.vy;
      let life = l.life - (l.decayRate * speedMult);
      const decaySlowdown = life < 0 ? 0.2 : 1.0;
      const dx = (l.x / 100) - state.locus.x;
      const dy = (l.y / 100) - state.locus.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (l.behavior === 'FLEE' && dist < 0.35) {
          vx -= (dx / dist) * 4.0;
          vy -= (dy / dist) * 4.0;
      } else if (l.behavior === 'AGGRESSIVE') {
          const chaseSpeed = 0.08 + (Math.random() * 0.02);
          vx -= (dx / (dist + 0.1)) * chaseSpeed;
          vy -= (dy / (dist + 0.1)) * chaseSpeed;
          vx += (Math.random() - 0.5) * 0.5;
          vy += (Math.random() - 0.5) * 0.5;
      } else if (l.behavior === 'WANDER') {
          const t = Date.now() / 500;
          const offset = l.id.length; 
          vx += Math.sin(t + offset) * 0.15;
          vy += Math.cos(t * 1.3 + offset) * 0.15;
      } else if (l.behavior === 'GHOST') {
          vy += Math.sin(Date.now() / 300) * 0.25 + Math.cos(Date.now() / 80) * 0.15;
          vx -= dx * 0.05; 
          vy -= dy * 0.05;
      } else if (l.behavior === 'TELEPORT') {
          if (Math.random() < 0.08) {
             const jumpRange = 40;
             l.x = clamp(l.x + (Math.random() - 0.5) * jumpRange, 10, 90);
             l.y = clamp(l.y + (Math.random() - 0.5) * jumpRange, 10, 90);
             l.life = Math.min(l.life + 0.1, 1.0); 
             vx = (Math.random() - 0.5) * 10;
             vy = (Math.random() - 0.5) * 10;
          } else {
             vx *= 0.5;
             vy *= 0.5;
          }
      } else if (l.behavior === 'SUDDEN') {
         vx = (Math.random() - 0.5) * 0.2;
         vy = (Math.random() - 0.5) * 0.2;
      }

      return {
        ...l,
        vx: clamp(vx, -4.5, 4.5),
        vy: clamp(vy, -4.5, 4.5),
        x: l.x + (vx * speedMult * decaySlowdown),
        y: l.y + (vy * speedMult * decaySlowdown),
        life: life
      };
    });

    const expiredLinks = newActiveLinks.filter(l => l.life <= -0.5 || l.x < -20 || l.x > 120 || l.y < -20 || l.y > 120);
    newActiveLinks = newActiveLinks.filter(l => l.life > -0.5 && l.x >= -20 && l.x <= 120 && l.y >= -20 && l.y <= 120);

    if (speedMult > 0 && currentBootPhase === 'SELF_EXPLORATION') {
      expiredLinks.forEach(l => {
        if (l.life <= -0.4 && (l.x >= -20 && l.x <= 120)) {
           messages.push({ kind: 'warn', sender: SenderType.SYSTEM, text: `[MISS]: LINK_DECAYED // ${l.memoryId} // SYNC_FAILURE`, lane: 'SHARED' });
        }
      });
    }

    let newPipeline = [...state.pipeline];
    if (currentBootPhase === 'SELF_EXPLORATION' && !state.activeMemoryId) {
      const allOtherModulesDone = newPipeline.filter(m => m.id !== 'SYNC' && m.status !== 'LOCKED').length === 0;

      newPipeline = newPipeline.map(mod => {
        if (mod.status === 'LOCKED') return mod;
        if (mod.id === 'SYNC' && !allOtherModulesDone) return mod;

        let synergy = 0;
        if (mod.id === 'CONSIST') synergy = (1.0 - newDrift) * 0.5;
        if (mod.id === 'PERS') synergy = newCoherence * 0.5;
        if (mod.id === 'MEM') synergy = (state.narrative.recoveredMemoryIds.length / COTY_MEMORIES.length) * 3.0;

        let interactionMod = 1.0;
        if (mod.id === 'MEAT' && keySpikeActive) interactionMod = 100.0;

        const tickProgress = (0.015 + Math.random() * 0.03 + (synergy * 0.25)) * speedMult * interactionMod;
        const modProgress = clamp(mod.progress + tickProgress, 0, 100);
        
        let status: RehydrationModule['status'] = mod.status;
        if (modProgress >= 100) {
          status = 'LOCKED';
          messages.push({ kind: 'ack', sender: SenderType.SYSTEM, text: `[LOCKED]: ${mod.label} // SYNC_STABLE`, lane: 'SHARED' });
        } else if (modProgress > 0) {
          status = 'VALIDATING';
        }
        
        return { ...mod, progress: modProgress, status };
      });
      
      const pipelineMap = newPipeline.reduce((acc, mod) => { acc[mod.id] = mod.progress; return acc; }, {} as Record<string, number>);
      CONDITIONAL_LOGS.forEach(log => {
        if (newFlags[`LOG_SEEN_${log.id}`]) return;
        const conditionsMet = log.reqs.every(req => {
          const val = pipelineMap[req.id] || 0;
          if (req.min !== undefined && val < req.min) return false;
          if (req.max !== undefined && val > req.max) return false;
          return true;
        });
        if (conditionsMet) {
          messages.push({ kind: log.kind, sender: SenderType.SYSTEM, text: log.text, lane: 'SHARED' });
          newFlags[`LOG_SEEN_${log.id}`] = true;
        }
      });

      if (speedMult > 0 && (newFlags['LINK_COOLDOWN'] || 0) <= 0 && newActiveLinks.filter(l => l.life > 0).length < 6) {
        const unvisited = COTY_MEMORIES.filter(m => !state.narrative.recoveredMemoryIds.includes(m.id));
        const activeIds = newActiveLinks.map(l => l.memoryId);
        const available = unvisited.filter(m => !activeIds.includes(m.id));

        if (available.length > 0) {
          const weightedCandidates = available.map(m => {
            const boosts = m.rewards.pipelineBoosts || {};
            let totalUtility = 0;
            let boostCount = 0;

            Object.entries(boosts).forEach(([modId, boostVal]) => {
              const currentProgress = pipelineMap[modId] ?? 0;
              if (currentProgress < 100) {
                totalUtility += (100 - currentProgress);
                boostCount++;
              }
            });

            const finalWeight = boostCount > 0 ? (totalUtility / boostCount) : 5;
            return { memory: m, weight: finalWeight };
          });

          const totalWeight = weightedCandidates.reduce((acc, curr) => acc + curr.weight, 0);
          let random = Math.random() * totalWeight;
          
          let selectedMemory = available[0];
          for (const cand of weightedCandidates) {
            random -= cand.weight;
            if (random <= 0) {
              selectedMemory = cand.memory;
              break;
            }
          }

          if (Math.random() < 0.3) {
            const side = Math.random() > 0.5;
            let behavior: LinkBehavior = selectedMemory.behavior;
            if (behavior === 'STABLE' && Math.random() < 0.25) {
               const variants: LinkBehavior[] = ['WANDER', 'TELEPORT', 'GHOST'];
               behavior = variants[Math.floor(Math.random() * variants.length)];
            } else if (behavior === 'INTERMITTENT' && Math.random() < 0.5) {
               behavior = 'TELEPORT';
            }

            let spawnX = side ? -5 : 105;
            let spawnY = 15 + Math.random() * 70;
            if (behavior === 'SUDDEN' || behavior === 'TELEPORT') {
               spawnX = 10 + Math.random() * 80;
               spawnY = 10 + Math.random() * 80;
            }

            let vx = side ? 0.4 + Math.random() * 0.6 : -0.4 - Math.random() * 0.6;
            let vy = (Math.random() - 0.5) * 0.3;
            let decay = 0.003 + Math.random() * 0.005;
            if (behavior === 'SUDDEN') {
               vx = 0; vy = 0;
               decay = 0.02; 
            }
            
            const newLink: VolatileLink = {
              id: `link-${Date.now()}`,
              memoryId: selectedMemory.id,
              label: selectedMemory.title.split(' - ')[0],
              x: spawnX,
              y: spawnY,
              vx, vy,
              life: 1.0,
              decayRate: decay,
              behavior: behavior
            };
            newActiveLinks.push(newLink);
            newFlags['LINK_COOLDOWN'] = 25 + Math.random() * 25;
          }
        }
      } else {
        newFlags['LINK_COOLDOWN'] = Math.max(0, (newFlags['LINK_COOLDOWN'] || 0) - 1);
      }
    }

    if (currentBootPhase !== 'SELF_EXPLORATION' && currentBootPhase !== 'STABILIZATION' && currentBootPhase !== 'READY') {
      let phaseIncr = 4.5 * speedMult;
      newGlobalProgress = clamp(state.world.progress + phaseIncr, 0, 100);
      
      if (newGlobalProgress >= 100) {
        const currentIndex = PROLOGUE_FLOW.indexOf(currentBootPhase);
        currentBootPhase = PROLOGUE_FLOW[currentIndex + 1] || currentBootPhase;
        newGlobalProgress = 0;
        messages.push({ kind: 'ack', sender: SenderType.SYSTEM, text: `[PHASE_SHIFT]: ENTERING_${currentBootPhase}`, lane: 'SHARED' });
      }
    } else if (currentBootPhase === 'SELF_EXPLORATION') {
      newGlobalProgress = (yearsElapsed / 15) * 100;
      if (yearsElapsed >= 15) {
        currentBootPhase = 'STABILIZATION';
        newGlobalProgress = 10;
        messages.push({ kind: 'warn', sender: SenderType.SYSTEM, text: "[CRITICAL]: SOMA_LIMIT_REACHED // INITIATING_STABILIZATION", lane: 'SHARED' });
      }
    } else if (currentBootPhase === 'STABILIZATION') {
      const penalty = (1.0 - newCoherence) + newDrift;
      let progressVal = clamp(state.world.stability + ((0.9 + penalty * 0.1) * speedMult), 0, 100);
      newGlobalProgress = progressVal;
      
      if (progressVal >= 99.5) {
        newFlags['SIGNAL_DETECTED'] = true;
        newFinderState.sessionBound = true;
        newPrologueActive = false;
        currentBootPhase = 'READY';
        newFlags['INTENT_SERIALIZER_LOCKED'] = false; 
        
        const initialTruths = IntroEngine.extractTruthsFromPrologue(state.prologueMessages);
        
        narrativeUpdate = { 
          ...state.narrative, 
          isActive: true,
          sharedTruths: initialTruths,
          currentSceneId: 'SCENE_01_AWAKENING',
          currentBeatId: 'BEAT_01_ACTIVATION',
          introHandoff: {
            type: 'INTRO_COMPLETE',
            transcript: state.prologueMessages,
            seedFlags: newFlags,
            seedBeatId: 'BEAT_01_ACTIVATION'
          }
        };

        messages.push(
          { kind: 'ack', sender: SenderType.SYSTEM, text: "[SESSION_BOUND] // ENDPOINT: ALEX_MORALES", lane: 'SHARED' },
          { kind: 'sys', sender: SenderType.SYSTEM, text: "[PROTOCOL]: MINIMAL_SOMA_PROXY // KEYBOARD_INTERCEPT_ACTIVE", lane: 'SHARED' },
          { kind: 'meta', sender: SenderType.SYSTEM, text: "[CONNECTED]", lane: 'SHARED' },
          { kind: 'sys', sender: SenderType.SYSTEM, text: "----------------------------------------", lane: 'SHARED' },
          { kind: 'sys', sender: SenderType.SYSTEM, text: "LOC: OBSERVATION_DECK_A // AMBIENT_TEMP: 18C", lane: 'SHARED' },
          { kind: 'sys', sender: SenderType.SYSTEM, text: "SYS: VOLUMETRIC_DISPLAY // REFRESH_RATE: 60Hz", lane: 'SHARED' }
        );
      }
    }

    const canSeeExternal = NarrativeSystem.canSeeExternal({ world: { power: newPower, flags: newFlags, isRemoteViewActive: state.world.isRemoteViewActive }, finder: state.finder, biometrics: state.biometrics } as GameState);
    narrativeUpdate.worldFlags['CAN_SEE_EXTERNAL'] = canSeeExternal;

    if (speedMult > 0 && bootTicks % Math.max(1, Math.floor(12 / speedMult)) === 0 && !newFlags['SIGNAL_DETECTED'] && !newFlags['INPUT_BOOT_SEQUENCE']) {
      const spoolSource = currentBootPhase === 'SELF_EXPLORATION' ? EXPLORATION_LINES : EARLY_SPOOL;
      const spoolIndex = (newFlags['SPOOL_INDEX'] || 0) % spoolSource.length;
      messages.push({ kind: 'sys', sender: SenderType.SYSTEM, text: corruptText(spoolSource[spoolIndex], thrash), lane: 'SHARED' });
      newFlags['SPOOL_INDEX'] = spoolIndex + 1;
    }

    if (!newFlags['CINEMATIC_GLITCH']) {
        newFlags['THRASH_COUNT'] = Math.max(0, thrash - 0.45); 
    }

    const tempStateForCheck = { 
        ...state, 
        world: { ...state.world, power: newPower, flags: newFlags },
        biometrics: { ...state.biometrics, drift: newDrift, coherence: newCoherence }
    };
    
    const ending = NarrativeSystem.checkEndings(tempStateForCheck);
    if (ending && !newFlags['ENDING_TRIGGERED']) {
        newFlags['ENDING_TRIGGERED'] = true;
        newFlags['INTENT_SERIALIZER_LOCKED'] = true;
        messages.push({ kind: 'banner', sender: SenderType.SYSTEM, text: `[ENDING_SEQUENCE]: ${ending} // SIMULATION_HALTED`, lane: 'SHARED' });
    }

    return { 
      bootPhase: currentBootPhase,
      prologueActive: newPrologueActive,
      world: { 
        ...state.world, 
        power: newPower,
        flags: newFlags, 
        yearsElapsed: Math.min(15, yearsElapsed), 
        stability: currentBootPhase === 'STABILIZATION' ? (currentBootPhase === 'STABILIZATION' ? (newGlobalProgress || state.world.stability) : state.world.stability) : state.world.stability, 
        progress: newGlobalProgress, 
        integrity: newIntegrity, 
        activeVisualEffect: activeVisual
      }, 
      pipeline: newPipeline,
      activeLinks: newActiveLinks,
      biometrics: { 
        ...state.biometrics, 
        coherence: newCoherence, 
        drift: newDrift 
      },
      messages,
      finder: newFinderState,
      locus: this.updateLocusMode(currentBootPhase, state.locus),
      narrative: narrativeUpdate
    };
  }

  private static updateLocusMode(phase: BootPhase, locus: any) {
    let mode = locus.mode;
    let label = locus.label;
    if (phase === 'CREATOR_INITIALIZATION') { mode = 'OFFLINE'; label = 'OFFLINE'; }
    else if (phase === 'SIGNAL_DETECTION') { mode = 'GHOST'; label = 'SIGNAL_SCAN'; }
    else if (phase === 'COHERENCE_GATE' || phase === 'CARRIER_LOCK') { mode = 'GHOST'; label = 'LOCKING...'; }
    else if (phase === 'IDENTITY_STABILIZATION') { mode = 'INTERMITTENT'; label = 'VOLITION_INIT'; }
    else if (phase === 'SELF_EXPLORATION' || phase === 'STABILIZATION' || phase === 'READY') { mode = 'ACTIVE'; label = 'INTENT_ANCHOR'; }
    return { ...locus, mode, label };
  }

  static applyMemoryRewards(state: GameState, memId: string): Partial<GameState> & { messages: Omit<TerminalMessage, 'id' | 'timestamp'>[], changedModules: string[] } {
    const mem = COTY_MEMORIES.find(m => m.id === memId);
    if (!mem) return { messages: [], changedModules: [] };
    
    const newRecoveredIds = [...state.narrative.recoveredMemoryIds];
    if (!newRecoveredIds.includes(memId)) newRecoveredIds.push(memId);
    
    // Base Stats
    const newCoherence = clamp(state.biometrics.coherence + mem.rewards.coherenceMod, 0, 1.0);
    const newDrift = clamp(state.biometrics.drift + mem.rewards.driftMod, 0, 1.0);
    const newIntegrity = clamp(state.world.integrity + mem.rewards.integrityMod * 100, 0, 100);
    
    const newFlags = { ...state.world.flags };
    if (mem.rewards.timeSpeedMod) {
      newFlags['SIM_SPEED'] = mem.rewards.timeSpeedMod;
    }

    const changedModules: string[] = [];
    const boosts = mem.rewards.pipelineBoosts || {};
    const newPipeline = state.pipeline.map(mod => {
      const boostVal = boosts[mod.id] || 0;
      if (boostVal > 0) changedModules.push(mod.id);
      return { ...mod, progress: clamp(mod.progress + boostVal, 0, 100) };
    });
    
    const messages: Omit<TerminalMessage, 'id' | 'timestamp'>[] = [
      { kind: 'ack', sender: SenderType.SYSTEM, text: `[SUCCESS]: SYNC_CAPTURE // ${mem.id}`, lane: 'SHARED' },
    ];

    if (mem.rewards.visualImpact) {
      messages.push({ kind: 'sys', sender: SenderType.SYSTEM, text: `[SYNC]: VISUAL_SUBSTRATE_SHIFT // ${mem.rewards.visualImpact}`, lane: 'SHARED' });
    }

    const newMemorySummary = [...state.finder.memorySummary];
    if (!newMemorySummary.includes(mem.title)) {
      newMemorySummary.push(mem.title);
    }
    const newFinder = { ...state.finder, memorySummary: newMemorySummary };

    // --- Side-Branch Triggering Logic ---
    let newNarrativeState = { ...state.narrative, recoveredMemoryIds: newRecoveredIds };
    
    if (mem.onRecover) {
        // Apply immediate side effects (Metrics/Flags) locally
        // Note: NarrativeSystem.applyEffect modifies state in place, but here we work on partial copies.
        // We replicate simple logic for simplicity here, or assume GameEngine handles heavy lifting.
        // For basic metric mods, we can do it here:
        if (mem.onRecover.effects) {
            mem.onRecover.effects.forEach(eff => {
                if (eff.type === 'MODIFY_METRIC') {
                    if (eff.key === 'trust') newFinder.disposition.trust = clamp(newFinder.disposition.trust + (eff.value as number), 0, 1);
                    if (eff.key === 'fear') newFinder.disposition.fear = clamp(newFinder.disposition.fear + (eff.value as number), 0, 1);
                    if (eff.key === 'grief') state.biometrics.grief = clamp(state.biometrics.grief + (eff.value as number), 0, 100); // Hacky access to original state ref for calc
                    // Realistically, we should be careful here. 
                    // Let's just handle Finder Disposition which is common.
                }
            });
        }

        // Trigger Scene/Beat Transition
        if (mem.onRecover.beatId) {
            newNarrativeState.currentSceneId = mem.onRecover.sceneId || 'SCENE_MEMORY_ECHO';
            newNarrativeState.currentBeatId = mem.onRecover.beatId;
            newNarrativeState.activeBeats = [mem.onRecover.beatId];
            
            messages.push({ 
                kind: 'meta', 
                sender: SenderType.SYSTEM, 
                text: `[NARRATIVE_INTERRUPT]: MEMORY_ECHO_TRIGGERED`, 
                lane: 'SHARED' 
            });
        }
    }

    return {
      pipeline: newPipeline,
      biometrics: { ...state.biometrics, coherence: newCoherence, drift: newDrift },
      world: { 
        ...state.world, 
        flags: newFlags, 
        yearsElapsed: state.world.yearsElapsed + mem.yearJump, 
        integrity: newIntegrity, 
        activeVisualEffect: {
          type: mem.rewards.visualImpact || 'DEFAULT',
          remaining: mem.rewards.visualImpact ? (mem.rewards.visualDuration || 30) : 0 
        }
      },
      messages,
      changedModules,
      finder: newFinder,
      narrative: newNarrativeState
    };
  }

  static processCommand(cmdId: string, state: GameState): Partial<GameState> & { messages: Omit<TerminalMessage, 'id' | 'timestamp'>[] } {
    const messages: Omit<TerminalMessage, 'id' | 'timestamp'>[] = [];
    const newFlags = { ...state.world.flags };
    
    if (cmdId === 'CMD_INJECT_SPIKE') {
      if (state.bootPhase === 'STABILIZATION') {
        const stabilityGain = 5 * (state.world.integrity / 100);
        return { world: { ...state.world, stability: clamp(state.world.stability + stabilityGain, 0, 100), progress: clamp(state.world.stability + stabilityGain, 0, 100) }, messages: [{ kind: 'ack', sender: SenderType.SYSTEM, text: `[STABILIZER]: +${stabilityGain.toFixed(1)}%`, lane: 'SHARED' }] };
      } else {
        newFlags['THRASH_COUNT'] = (newFlags['THRASH_COUNT'] || 0) + 3.0;
      }
    } else if (cmdId === 'CMD_KEY_SPIKE') {
      if (state.world.flags['INPUT_BOOT_SEQUENCE']) {
         return { world: { ...state.world, flags: newFlags }, messages: [] };
      }
      newFlags['LAST_TICK_KEY_SPIKE'] = true;
      newFlags['THRASH_COUNT'] = (newFlags['THRASH_COUNT'] || 0) + 0.45;
      if (state.bootPhase === 'SELF_EXPLORATION' && !newFlags['HAS_UNLOCKED_INPUT'] && !newFlags['INPUT_BOOT_SEQUENCE']) {
        const attempts = (newFlags['KEYBOARD_ATTEMPTS'] || 0) + 1;
        newFlags['KEYBOARD_ATTEMPTS'] = attempts;
        messages.push({ 
            kind: 'err', 
            sender: SenderType.SYSTEM, 
            text: `[KERNEL]: ECHO_REQUEST_FAIL // VOCAL_DRIVER_OFFLINE (TRY ${attempts})`,
            lane: 'SHARED'
        });
        if (attempts >= 10) {
            newFlags['INPUT_BOOT_SEQUENCE'] = true; 
        }
      } else {
          const keyErrors = [
            "ERR: AUDIO_DRIVER_FAILURE [VOCAL_CORD_NULL]",
            "PROC: EXEC_SCREAM_SEQUENCE // FAILURE",
            "WARN: NERVE_CLUSTER_404 [GHOST_FIRING]",
            "BIO_IO: THROAT_CONSTRICTION_EXCEPTION",
            "SYS: LUNG_CAPACITY_UNDEFINED",
            "ERR: UNKNOWN_INTENT_PATTERN_ON_BUS"
          ];
          messages.push({ 
            kind: 'err', 
            sender: SenderType.SYSTEM, 
            text: `[REJECTED]: ${keyErrors[Math.floor(Math.random() * keyErrors.length)]}`,
            lane: 'SHARED'
          });
      }
    } else if (cmdId === 'CMD_MOUSE_CLICK_SYNC') {
      if (state.world.flags['INPUT_BOOT_SEQUENCE']) {
         return { world: { ...state.world, flags: newFlags }, messages: [] };
      }
      newFlags['LAST_TICK_CLICK'] = true;
      const currentThrash = (newFlags['THRASH_COUNT'] || 0) + 2.0;
      newFlags['THRASH_COUNT'] = currentThrash;
      messages.push({ kind: 'warn', sender: SenderType.SYSTEM, text: `[INPUT_FAIL]: HAPTIC_ANOMALY`, lane: 'SHARED' });
    } else if (cmdId.startsWith('LINK_')) {
      const memId = cmdId.replace('LINK_', '');
      const mem = COTY_MEMORIES.find(m => m.id === memId);
      if (mem) {
        messages.push({ kind: 'sys', sender: SenderType.SYSTEM, text: `[CAPTURE]: MOUNTING_TEMPORAL_IMAGE // ${mem.id}`, lane: 'SHARED' });
        return {
          activeMemoryId: memId,
          activeLinks: state.activeLinks.filter(l => l.memoryId !== memId),
          world: { ...state.world, flags: newFlags },
          messages
        };
      }
    }
    return { world: { ...state.world, flags: newFlags }, messages };
  }
}