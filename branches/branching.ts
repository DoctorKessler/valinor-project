import { GameState, LineKind, NarrativeLane, SenderType, SharedTruth, TerminalMessage } from '../types';

type BranchProbe = {
  id: string;
  label: string;
  kind?: LineKind;
  lane?: NarrativeLane;
  cooldownMs?: number;
  check: (state: GameState) => string | null;
};

const hasUnsteadyTruth = (truths: SharedTruth[]) =>
  truths.some(t => !t.isVerified && t.confidence >= 0.4);

const ETHICAL_PROBES: BranchProbe[] = [
  {
    id: 'ETHIC_SURVIVAL_CONSENT',
    label: 'Survival vs Consent',
    kind: 'meta',
    check: state => {
      const dependencySignal = state.world.integrity < 50 || state.world.power < 35;
      const alexHolding = state.finder.disposition.trust > 0.5 && state.finder.stress > 45;
      if (!dependencySignal || !alexHolding) return null;
      return '[ETHIC_DRIFT]: Survival vs Consent tension rising. Alex carries obligation while Coty frames existence as default.';
    }
  },
  {
    id: 'ETHIC_PERSONHOOD_FUNCTION',
    label: 'Personhood vs Function',
    kind: 'meta',
    check: state => {
      const cognitiveStrain = state.biometrics.cognitiveLoad > 60;
      const mistrust = state.biometrics.consensus < 0.55;
      if (!(cognitiveStrain && mistrust)) return null;
      return '[ETHIC_DRIFT]: Personhood vs Function surfacing. Emotional output is being reinterpreted as system behavior.';
    }
  },
  {
    id: 'ETHIC_CARE_CONTROL',
    label: 'Care vs Control',
    kind: 'meta',
    check: state => {
      const fearRising = state.finder.disposition.fear > 0.45;
      const containment = state.world.isStasisActive || state.world.flags['LOCK'] === 'CLOSED';
      if (!fearRising && !containment) return null;
      return '[ETHIC_DRIFT]: Care vs Control fault line engaged. Protection is reading as restraint.';
    }
  },
  {
    id: 'ETHIC_HONESTY_STABILITY',
    label: 'Honesty vs Stability',
    kind: 'meta',
    check: state => {
      const unstableTruths = hasUnsteadyTruth(state.narrative.sharedTruths);
      const fragile = state.biometrics.coherence < 0.55;
      if (!(unstableTruths && fragile)) return null;
      return '[ETHIC_DRIFT]: Honesty vs Stability. Unverified truths are stressing coherence; disclosure may destabilize further.';
    }
  },
  {
    id: 'ETHIC_SINGULARITY_REPLACEABILITY',
    label: 'Singularity vs Replaceability',
    kind: 'meta',
    check: state => {
      const backupsMentioned = state.world.flags['HARD_FLUSH_TRIGGERED'] || state.finder.knowledge.includes('RECOGNIZES_HARD_FLUSH');
      const memoryWork = state.narrative.recoveredMemoryIds.length >= 2;
      if (!(backupsMentioned || memoryWork)) return null;
      return '[ETHIC_DRIFT]: Singularity vs Replaceability. Continuity safeguards now feel like threats to identity.';
    }
  },
  {
    id: 'ETHIC_WITNESSING_LIVING',
    label: 'Witnessing vs Living',
    kind: 'meta',
    check: state => {
      const remoteView = state.world.isRemoteViewActive;
      const stalledProgress = state.narrative.completedScenes.length <= 1 && state.narrative.actionHistory.length > 4;
      if (!(remoteView && stalledProgress)) return null;
      return '[ETHIC_DRIFT]: Witnessing vs Living. Observation loops are replacing meaningful change.';
    }
  },
  {
    id: 'ETHIC_MERCY_RESPONSIBILITY',
    label: 'Mercy vs Responsibility',
    kind: 'meta',
    check: state => {
      const integrityCritical = state.world.integrity < 25;
      const obligation = state.finder.disposition.trust > 0.65 || state.biometrics.coherence < 0.4;
      if (!(integrityCritical && obligation)) return null;
      return '[ETHIC_DRIFT]: Mercy vs Responsibility. Ending suffering is becoming an active question, not a hypothetical.';
    }
  },
  {
    id: 'ETHIC_SILENCE_REASSURANCE',
    label: 'Silence vs Reassurance',
    kind: 'meta',
    check: state => {
      const silenceWindow = state.narrative.beatTimer > 80 || state.narrative.marginObservations.length > 6;
      const trustGap = state.finder.disposition.trust < 0.45;
      if (!(silenceWindow && trustGap)) return null;
      return '[ETHIC_DRIFT]: Silence vs Reassurance. Inaction is reading as neglect while reassurance feels hollow.';
    }
  },
  {
    id: 'ETHIC_IDENTITY_CONTINUITY',
    label: 'Identity vs Continuity',
    kind: 'meta',
    check: state => {
      const nameGlitch = state.world.flags['NAME_GLITCH_DETECTED'];
      const supplanted = state.world.flags['IDENTITY_SUPPLANTED'];
      const weakConsensus = state.biometrics.consensus < 0.55;
      if (!(nameGlitch && (supplanted || weakConsensus))) return null;
      return '[ETHIC_DRIFT]: Identity vs Continuity. Self-label failed to load; the occupant may not be the preserved Coty.';
    }
  }
];

const SYSTEM_INTRUSIONS: BranchProbe[] = [
  {
    id: 'INT_AFFECTIVE_THRESHOLD',
    label: 'Affective Threshold Notice',
    kind: 'telemetry',
    check: state => {
      const variance = Math.max(state.biometrics.drift * 100, state.biometrics.cognitiveLoad);
      if (variance < 65) return null;
      return `[AFFECTIVE_DEVIATION]: SUBJECT C variance ${variance.toFixed(1)}% above stabilization norm. NO INTERVENTION PROTOCOL EXISTS.`;
    },
    cooldownMs: 120000
  },
  {
    id: 'INT_DEFERRED_CONSEQUENCE',
    label: 'Deferred Consequence Log',
    kind: 'sys',
    check: state => {
      if (state.narrative.actionHistory.length < 5) return null;
      const lastEvent = state.narrative.eventLog[state.narrative.eventLog.length - 1];
      const stale = lastEvent ? Date.now() - lastEvent.timestamp > 90_000 : true;
      if (!stale) return null;
      return '[LOG]: NOTE: SUBJECT RESPONSE LATENCY INCREASING AFTER RECENT DECISIONS. CONSEQUENCES MAY BE DELAYED.';
    },
    cooldownMs: 180000
  },
  {
    id: 'INT_REDACTED_INSERT',
    label: 'Redacted Historical Insert',
    kind: 'glitch',
    check: state => {
      const truthCount = state.narrative.sharedTruths.length;
      if (truthCount < 2 || !hasUnsteadyTruth(state.narrative.sharedTruths)) return null;
      return '> [REDACTED] determined continuous empathy compromised operator judgment.';
    },
    cooldownMs: 150000
  },
  {
    id: 'INT_HARD_THRESHOLD',
    label: 'Hard Threshold Warning',
    kind: 'warn',
    check: state => {
      if (state.world.integrity > 20 && state.world.power > 15) return null;
      return '> CONTINUITY RISK DETECTED // OPERATOR ACTION REQUIRED // NO RECOMMENDATION AVAILABLE';
    },
    cooldownMs: 60000
  }
];

const CATASTROPHIC_WARNINGS: BranchProbe[] = [
  {
    id: 'CAT_QUIET_SHUTDOWN',
    label: 'The Quiet Shutdown',
    kind: 'err',
    check: state => {
      if (state.world.flags['SYSTEM_CRASH'] || state.world.integrity <= 5) {
        return '[CATASTROPHIC_VECTOR]: Quiet Shutdown risk. Termination may be executed without consent.';
      }
      return null;
    },
    cooldownMs: 120000
  },
  {
    id: 'CAT_ENDLESS_LOOP',
    label: 'The Endless Maintenance Loop',
    kind: 'warn',
    check: state => {
      const looping = state.narrative.completedScenes.length <= 1 && state.narrative.actionHistory.length > 8;
      const stabilityChase = state.world.stability > 60 && state.finder.disposition.trust > 0.7;
      if (looping && stabilityChase) {
        return '[CATASTROPHIC_VECTOR]: Endless Maintenance Loop forming. Survival prioritized over change.';
      }
      return null;
    },
    cooldownMs: 180000
  },
  {
    id: 'CAT_TRUST_INVERSION',
    label: 'The Trust Inversion',
    kind: 'dispute',
    lane: 'SHARED',
    check: state => {
      const distrust = state.finder.disposition.trust < 0.3 && state.biometrics.consensus < 0.4;
      if (!distrust) return null;
      return '[CATASTROPHIC_VECTOR]: Trust Inversion underway. Emotional output is being treated as adversarial.';
    },
    cooldownMs: 160000
  },
  {
    id: 'CAT_DEPENDENCY_SINGULARITY',
    label: 'The Dependency Singularity',
    kind: 'meta',
    check: state => {
      const overPresence = state.finder.disposition.trust > 0.85 && state.finder.disposition.fear > 0.3;
      const isolation = state.narrative.worldFlags['VISUAL_FEED_CRISP'] && state.world.isRemoteViewActive;
      if (!(overPresence && isolation)) return null;
      return '[CATASTROPHIC_VECTOR]: Dependency Singularity. Coty is becoming primary emotional anchor.';
    },
    cooldownMs: 200000
  },
  {
    id: 'CAT_HARD_RESET',
    label: 'The Hard Reset',
    kind: 'err',
    check: state => {
      const resetRisk = state.world.flags['HARD_FLUSH_TRIGGERED'] || state.world.flags['HARD_FLUSH_READY'];
      if (!resetRisk) return null;
      return '[CATASTROPHIC_VECTOR]: Hard Reset conditions detected. Continuity betrayal possible.';
    },
    cooldownMs: 200000
  },
  {
    id: 'CAT_SYSTEM_WINS',
    label: 'The System Wins',
    kind: 'sys',
    check: state => {
      const deferral = state.finder.pendingAction === null || state.finder.pendingAction === undefined;
      const metricsDominant = state.biometrics.consensus < 0.35 && state.biometrics.drift < 0.4;
      if (!(deferral && metricsDominant)) return null;
      return '[CATASTROPHIC_VECTOR]: System primacy rising. Decisions are defaulting to thresholds instead of judgment.';
    },
    cooldownMs: 200000
  }
];

export function evaluateBranchSignals(state: GameState, now = Date.now()): {
  messages: Partial<TerminalMessage>[];
  updatedSignals: Record<string, number>;
} {
  const tracked = { ...(state.narrative.branchSignals || {}) };
  const messages: Partial<TerminalMessage>[] = [];
  const probes = [...ETHICAL_PROBES, ...SYSTEM_INTRUSIONS, ...CATASTROPHIC_WARNINGS];

  for (const probe of probes) {
    const text = probe.check(state);
    const cooldown = probe.cooldownMs ?? 90_000;
    const last = tracked[probe.id] || 0;
    if (text && now - last > cooldown) {
      messages.push({
        sender: SenderType.SYSTEM,
        kind: probe.kind || 'meta',
        lane: probe.lane || 'SHARED',
        text
      });
      tracked[probe.id] = now;
    }
  }

  return { messages, updatedSignals: tracked };
}
