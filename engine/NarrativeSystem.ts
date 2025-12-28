
import { GameState, NarrativeState, NarrativeEvent, InteractionReq, InteractionEffect, RuntimeObject, DispositionMatrix, KnowledgeId, AIResponse, AllowedAction, SharedTruth, TerminalMessage, SenderType, MarginObs, NarrativeChoice, Beat, BeatResult, EntityId, NarrativeAction } from '../types';
import { Director } from '../narrativeForward/director';
import { INTERACTABLES } from '../worldTruth/interactables';
import { NarrativeEventFactory, EventTypes } from '../runtime/events';
import { SCENES } from '../worldTruth/scenes';
import { SpatialEngine } from './SpatialEngine';

export class NarrativeSystem {
  private static director = new Director();

  private static markSceneComplete(state: GameState, sceneId: string) {
    if (!state.narrative.completedScenes.includes(sceneId)) {
      state.narrative.completedScenes.push(sceneId);
    }
  }

  private static enterScene(state: GameState, sceneId: string, messages: Partial<TerminalMessage>[], metaText?: string): GameState {
    const scene = SCENES[sceneId];
    if (!scene) return state;

    state.narrative.currentSceneId = scene.id;
    state.narrative.currentBeatId = scene.initialBeatId;
    state.narrative.currentLocation = scene.locationId;

    if (metaText) {
      messages.push({
        sender: SenderType.SYSTEM,
        kind: 'meta',
        lane: 'SHARED',
        text: metaText,
        timestamp: Date.now()
      });
    }

    const result = this.runBeat(state, scene.initialBeatId);
    messages.push(...result.messages);
    return result.newState;
  }

  static checkEndings(state: GameState): string | null {
    if (state.world.flags['HOPE_ALIVE']) return "HOPE_ALIVE";
    return this.director.checkEndings(state.narrative, state.biometrics, state.world.flags);
  }

  static canSeeExternal(state: GameState): boolean {
    const powerStable = state.world.power >= 20;
    const flashlightOn = !!state.world.flags['FLASHLIGHT_ON'];
    const lightsOn = !!state.world.flags['LAB_LIGHTS_ON'];
    const cameraActive = state.world.isRemoteViewActive;
    
    return cameraActive && (lightsOn || powerStable || flashlightOn);
  }

  static deriveAlexTelemetry(state: GameState, ai: AIResponse): MarginObs[] {
    const visibilityActive = this.canSeeExternal(state);
    if (!visibilityActive) return [];

    const now = Date.now();
    const out: MarginObs[] = [];
    const add = (text: string, ttlMs = 12000) =>
      out.push({ id: `bio_${now}_${Math.random().toString(36).slice(2)}`, text, ts: now, ttlMs });

    const emotions = new Set(ai.detectedEmotions.map(e => e.toLowerCase()));
    const d = state.finder.disposition;

    if (emotions.has("stressed") || emotions.has("anxious") || emotions.has("alarmed")) add("EXTREMITAL_TREMOR: DETECTED (0.12z)");
    if (emotions.has("confused") || emotions.has("puzzled")) add("GAZE_SACCADE_VELOCITY: HIGH");
    if (emotions.has("calm") || emotions.has("relieved")) add("RESPIRATORY_RHYTHM: STABILIZED");
    if (emotions.has("fearful") || d.fear > 0.6) add("KINESIC_PROFILE: RETRACTED_POSTURE");
    if (d.trust > 0.65) add("PROXEMIC_SHIFT: LEAN_ANGLE +8.2°");
    if (emotions.has("loyal") || d.trust > 0.8) add("PUPIL_FIXATION: POSITIVE_ENGAGEMENT");
    if (emotions.has("curious") || emotions.has("intrigued")) add("FOCAL_POINT_STABILITY: INCREASING");

    if (state.world.stability < 30) add("OCULAR_DILATION_MAX // LOW_STABILITY_ERROR");
    if (state.world.propriocepSync < 0.5) add("MICRO_FIDGET_FREQ: 14Hz");
    if (state.world.power < 15) add("OPTIC_FEED_NOISE: THRESHOLD_EXCEEDED");

    return out.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  private static sanitizeSpeech(text: string): string {
    return text
      .replace(/\*.*?\*/g, '') 
      .replace(/\(.*?\)/g, '') 
      .replace(/\[(?!.*?\]\]).*?\]/g, '') 
      .replace(/^Alex:\s*/i, '') 
      .trim();
  }

  static runBeat(state: GameState, beatId: string): BeatResult {
    const newState: GameState = JSON.parse(JSON.stringify(state));
    const messages: Partial<TerminalMessage>[] = [];

    const scene = SCENES[newState.narrative.currentSceneId];
    if (!scene) return { newState, messages };

    const beat = scene.beats[beatId];
    if (!beat) return { newState, messages };

    newState.narrative.currentBeatId = beatId;
    newState.narrative.beatTimer = beat.delay || 0;
    newState.narrative.activeBeats = [beatId];

    const previousSceneId = scene.id;

    if (beat.onEnter) {
      beat.onEnter.forEach(eff => this.applyEffect(newState, eff));
    }

    if (newState.narrative.currentSceneId !== previousSceneId) {
      const metaText = `[SEQUENCE_UPDATE]: Loading Scene ${newState.narrative.currentSceneId}...`;
      const transitionedState = this.enterScene(newState, newState.narrative.currentSceneId, messages, metaText);
      return { newState: transitionedState, messages };
    }

    if (beat.text) {
      messages.push({
        sender: this.getEntitySender(beat.speaker),
        kind: beat.kind,
        lane: beat.lane,
        text: beat.text,
        isBeatMessage: true
      });
    }

    if (beat.autoTransition && beat.nextBeatId) {
       const result = this.runBeat(newState, beat.nextBeatId);
       return { 
         newState: result.newState, 
         messages: [...messages, ...result.messages],
         nextBeatId: result.nextBeatId
       };
    }

    return { newState, messages };
  }

  static resolveChoice(state: GameState, choiceId: string, text?: string): { newState: GameState, messages: Partial<TerminalMessage>[] } {
    let newState: GameState = JSON.parse(JSON.stringify(state));
    const messages: Partial<TerminalMessage>[] = [];
    const previousSceneId = newState.narrative.currentSceneId;

    const scene = SCENES[newState.narrative.currentSceneId];
    if (!scene) return { newState, messages };

    const beat = scene.beats[newState.narrative.currentBeatId];
    if (!beat) return { newState, messages };

    const choice = beat.choices?.find(c => c.id === choiceId);
    if (!choice) return { newState, messages };

    const semanticAction: NarrativeAction = {
      ...choice.action,
      payload: text ? `${choice.action.payload || ''} "${text}"` : choice.action.payload,
      timestamp: Date.now()
    };
    newState.narrative.actionHistory.push(semanticAction);

    // Cost application
    if (choice.cost) {
        if (choice.cost.drift) newState.biometrics.drift = Math.min(1.0, newState.biometrics.drift + choice.cost.drift);
        if (choice.cost.cognitiveLoad) newState.biometrics.cognitiveLoad = Math.min(100, newState.biometrics.cognitiveLoad + choice.cost.cognitiveLoad);
        if (choice.cost.integrity) newState.world.integrity = Math.max(0, newState.world.integrity - choice.cost.integrity);
        if (choice.cost.consensus) newState.biometrics.consensus = Math.max(0, Math.min(1.0, newState.biometrics.consensus + choice.cost.consensus));
    
        // Failure Checks triggered by Cost
        if (newState.world.integrity <= 0) {
             messages.push({ sender: SenderType.SYSTEM, kind: 'err', text: "[FATAL]: INTEGRITY_FAILURE // SYSTEM_HALT", lane: 'SHARED' });
             newState.world.flags['SYSTEM_CRASH'] = true;
        }
        if (newState.biometrics.drift >= 1.0) {
             messages.push({ sender: SenderType.SYSTEM, kind: 'warn', text: "[CRITICAL]: SIGNAL_LOST_TO_NOISE // DRIFT_LIMIT_EXCEEDED", lane: 'SHARED' });
             newState.world.flags['SYSTEM_CRASH'] = true;
        }
    }

    // Effect application
    (choice.effects || []).forEach(eff => this.applyEffect(newState, eff));

    // Extractor application
    if (text && choice.extractors) {
      choice.extractors.forEach(extractor => {
        if (extractor.type === 'storeRaw') {
           // Store in both narrative flags and world flags for consistency
           newState.narrative.worldFlags[extractor.key] = text;
           newState.world.flags[extractor.key] = text;
           messages.push({
              sender: SenderType.SYSTEM,
              kind: 'sys',
              lane: 'SHARED',
              text: `[DATA_CAPTURE]: ${extractor.key} = "${text}"`
           });
        }
      });
    }

    // Construct Log Message
    const logText = text 
       ? `[${choice.label}]\n"${text}"` 
       : choice.label;

    messages.push({
        sender: SenderType.PLAYER,
        kind: choice.action.verb === 'CHALLENGE' ? 'dispute' : 'player',
        lane: 'SHARED',
        text: logText,
        choiceId: choice.id
    });

    if (!newState.narrative.completedBeats.includes(beat.id)) {
        newState.narrative.completedBeats.push(beat.id);
    }

    if (choice.nextBeatId) {
        const result = this.runBeat(newState, choice.nextBeatId);
        newState = result.newState;
        messages.push(...result.messages);
    }

    if (newState.narrative.currentSceneId !== previousSceneId) {
        this.markSceneComplete(newState, previousSceneId);
        const metaText = `[SEQUENCE_UPDATE]: Loading Scene ${newState.narrative.currentSceneId}...`;
        newState = this.enterScene(newState, newState.narrative.currentSceneId, messages, metaText);
    }

    // Check for spinal scene transitions after choice logic
    newState = this.checkAndExecuteSceneTransition(newState, messages);

    return { newState, messages };
  }

  private static getEntitySender(entity: EntityId | string): SenderType {
    if (entity === 'ALEX') return SenderType.FINDER;
    if (entity === 'COTY') return SenderType.PLAYER;
    if (entity === 'CREATOR') return SenderType.FINDER; 
    return SenderType.SYSTEM;
  }

  static processNarrativeAction(state: GameState, event: NarrativeEvent): { newState: GameState, messages: Partial<TerminalMessage>[] } {
    let newState: GameState = JSON.parse(JSON.stringify(state));
    const messages: Partial<TerminalMessage>[] = [];
    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

    switch (event.type) {
      case EventTypes.ARCHIVE_OPENED:
        newState.finder.disposition.trust = clamp(newState.finder.disposition.trust + 0.02, 0, 1);
        newState.finder.disposition.fear = clamp(newState.finder.disposition.fear + 0.01, 0, 1);
        break;

      case EventTypes.MEMORY_SELECTED:
        const memId = event.payload.memoryId;
        newState.biometrics.coherence = clamp(newState.biometrics.coherence + 0.05, 0, 1);
        newState.biometrics.drift = clamp(newState.biometrics.drift - 0.03, 0, 1);
        messages.push({
          sender: SenderType.SYSTEM,
          kind: 'soma',
          lane: 'COTY_PRIVATE',
          text: `[SOMA]: Neural engram for ${memId} mounted successfully.`
        });
        break;

      case EventTypes.LEDGER_TRUTH_PINNED:
        const truthId = event.payload.truthId;
        const truth = newState.narrative.sharedTruths.find(t => t.id === truthId);
        if (truth && !truth.isVerified) {
          truth.confidence = clamp(truth.confidence + 0.15, 0, 1);
          newState.biometrics.cognitiveLoad = clamp(newState.biometrics.cognitiveLoad + 15, 0, 100);
          if (truth.confidence >= 0.8) {
            truth.isVerified = true;
            messages.push({
              sender: SenderType.SYSTEM,
              kind: 'ack',
              lane: 'SHARED',
              text: `[STABILIZED]: Consensus Locked: ${truth.label}.`
            });
          }
        }
        break;

      case EventTypes.HYPOTHESIS_CRAFTED:
        const text = event.payload.text;
        const newTruth: SharedTruth = {
          id: `TRUTH_HYPOTHESIS_${Date.now()}`,
          label: text,
          description: 'Subjective theory. Pending cross-reference with Alex.',
          confidence: 0.1,
          discoveredAt: Date.now(),
          isVerified: false,
          source: 'PLAYER_HYPOTHESIS'
        };
        newState.narrative.sharedTruths.push(newTruth);
        newState.biometrics.cognitiveLoad = clamp(newState.biometrics.cognitiveLoad + 10, 0, 100);
        messages.push({
          sender: SenderType.SYSTEM,
          kind: 'sys',
          lane: 'SHARED',
          text: `[LEDGER]: NEW_HYPOTHESIS_LOGGED // "${text}"`
        });
        break;
    }

    newState.narrative.eventLog.push(event);
    
    // Legacy Director beat processing (deprecated but kept for now)
    const updates = this.director.processBeats(newState.narrative, event);
    newState.narrative.activeBeats = updates.newActive;
    newState.narrative.completedBeats = updates.newCompleted;
    
    // Scene transition check
    newState = this.checkAndExecuteSceneTransition(newState, messages);

    return { newState, messages };
  }

  static resolveTurn(
    state: GameState, 
    aiResponse: AIResponse, 
    playerInput: string
  ): { 
    newState: GameState, 
    sharedMessages: Partial<TerminalMessage>[], 
    cotyPrivate: Partial<TerminalMessage>[], 
    alexPrivate: string[] 
  } {
    let newState: GameState = JSON.parse(JSON.stringify(state));
    const sharedMessages: Partial<TerminalMessage>[] = [];
    const cotyPrivate: Partial<TerminalMessage>[] = [];
    const alexPrivate: string[] = [];

    // Persist tags for visual processing
    newState.lastTags = aiResponse.detectedEmotions;

    // 1. Handle Consent Proposing
    if (aiResponse.proposedAction) {
      newState.finder.pendingAction = aiResponse.proposedAction;
    }

    // 2. Clear Pending Action if Attempted
    if (newState.finder.pendingAction && aiResponse.attemptedAction.type !== 'HESITATE' && aiResponse.attemptedAction.type !== 'STAY') {
        if (aiResponse.attemptedAction.type === newState.finder.pendingAction.type && 
            aiResponse.attemptedAction.target === newState.finder.pendingAction.target) {
            newState.finder.pendingAction = null;
        }
    }

    // 3. Apply System Commands / Patches
    if (aiResponse.systemCommand?.worldPatch) {
      Object.entries(aiResponse.systemCommand.worldPatch).forEach(([k, v]) => {
        newState.world.flags[k] = v;
        newState.narrative.worldFlags[k] = v;
      });
    }

    // 4. Update Spatial State based on action type and target
    const actionType = aiResponse.attemptedAction.type as AllowedAction;
    if (actionType === 'INTERACT' || actionType === 'MOVE_CONSOLE' || actionType === 'FLEE') {
       // If target is missing but action is MOVE, we assume a general center movement if not already there
       const moveTarget = aiResponse.attemptedAction.target || (actionType === 'MOVE_CONSOLE' ? 'OPERATOR_CONSOLE' : undefined);
       newState.finder.spatial = SpatialEngine.updateSpatial(newState.finder.spatial, moveTarget);
    }

    // 5. Process Attempted Action
    const actionResult = this.handleFinderAction(newState, aiResponse.attemptedAction);
    const midState = actionResult.newState;

    if (actionResult.output.length > 0) {
       actionResult.output.forEach(text => {
         sharedMessages.push({
            sender: SenderType.SYSTEM,
            kind: 'action',
            lane: 'SHARED',
            text
         });
       });
    }

    if (aiResponse.attemptedAction.immediateEffect) {
       Object.entries(aiResponse.attemptedAction.immediateEffect).forEach(([k, v]) => {
         midState.world.flags[k] = v;
         midState.narrative.worldFlags[k] = v;
       });
    }

    const visibilityActive = this.canSeeExternal(midState);

    const syncedTruths = this.syncTruths(midState, playerInput, aiResponse.finderText);
    midState.narrative.sharedTruths = syncedTruths;

    if (visibilityActive) {
      const newObs = this.deriveAlexTelemetry(midState, aiResponse);
      midState.narrative.marginObservations = [...midState.narrative.marginObservations, ...newObs];
    }

    if (aiResponse.internalDiagnostic) {
      alexPrivate.push(aiResponse.internalDiagnostic);
      midState.finder.diagnosticLog.unshift({
        timestamp: Date.now(),
        text: aiResponse.internalDiagnostic,
        severity: aiResponse.detectedEmotions.some(e => ['ALARMED', 'PANICKED', 'WARNING'].includes(e.toUpperCase())) ? 'WARNING' : 'INFO'
      });
      if (visibilityActive) {
        sharedMessages.push({
          sender: SenderType.SYSTEM,
          kind: 'telemetry',
          lane: 'SHARED',
          text: `[VISUAL_TELEMETRY]: ${aiResponse.internalDiagnostic.toUpperCase()}`
        });
      }
    }

    if (aiResponse.biometricHints && aiResponse.biometricHints.length > 0) {
      aiResponse.biometricHints.forEach(hint => {
         sharedMessages.push({
           sender: SenderType.SYSTEM,
           kind: 'telemetry',
           lane: 'SHARED',
           text: `[AFFECT_INSTRUMENTATION]: ${hint.toUpperCase()}`
         });
      });
    }

    let lastEvent: NarrativeEvent | undefined = undefined;
    const startingSceneId = midState.narrative.currentSceneId;
    if (aiResponse.attemptedAction.type === 'INTERACT' && aiResponse.attemptedAction.target) {
      const targetId = aiResponse.attemptedAction.target;
      const interactable = INTERACTABLES[targetId];
      const verbId = interactable ? Object.keys(interactable.verbs)[0] : null;

      if (verbId) {
        const result = this.resolveInteraction(midState, targetId, verbId);
        midState = result.newState;
        lastEvent = result.event || undefined;
        sharedMessages.push({ sender: SenderType.SYSTEM, kind: 'action', lane: 'SHARED', text: result.output });
      }
    }

    if (midState.narrative.currentSceneId !== startingSceneId) {
      this.markSceneComplete(midState, startingSceneId);
      const metaText = `[SEQUENCE_UPDATE]: Loading Scene ${midState.narrative.currentSceneId}...`;
      midState = this.enterScene(midState, midState.narrative.currentSceneId, sharedMessages, metaText);
    }

    const profileUpdate = this.updateFinderProfile(midState, aiResponse, lastEvent);
    midState.finder = { ...midState.finder, ...profileUpdate.finder };

    const dialogue = this.sanitizeSpeech(aiResponse.finderText);
    if (dialogue) {
      const scene = SCENES[midState.narrative.currentSceneId];
      const currentBeat = scene?.beats[midState.narrative.currentBeatId];
      sharedMessages.push({ 
        sender: SenderType.FINDER, 
        kind: currentBeat?.kind === 'dispute' ? 'dispute' : 'ack', 
        lane: 'SHARED', 
        text: dialogue 
      });
    }

    // Check for spinal scene transitions after AI turn
    newState = this.checkAndExecuteSceneTransition(midState, sharedMessages);

    return { newState, sharedMessages, cotyPrivate, alexPrivate };
  }

  /**
   * Internal helper to evaluate and execute scene transitions.
   */
  private static checkAndExecuteSceneTransition(state: GameState, messages: Partial<TerminalMessage>[]): GameState {
      const transition = this.director.handleAutoSceneTransition(state);
      if (transition) {
          this.markSceneComplete(state, state.narrative.currentSceneId);
          const metaText = `[SEQUENCE_UPDATE]: Loading Scene ${transition.nextSceneId}...`;
          return this.enterScene(state, transition.nextSceneId, messages, metaText);
      }
      return state;
  }

  static syncTruths(state: GameState, playerInput: string, finderText: string): SharedTruth[] {
    const truths = [...state.narrative.sharedTruths];
    const combined = (playerInput + " " + finderText).toUpperCase();
    truths.forEach(t => {
      if (t.isVerified) return;
      const keywords = t.label.toUpperCase().split(" ").filter(w => w.length > 3);
      const isDiscussed = keywords.some(k => combined.includes(k));
      if (isDiscussed) {
        t.confidence = Math.min(1.0, t.confidence + 0.15);
        if (t.confidence >= 0.8) {
          t.isVerified = true;
          t.source = 'DIALOGUE_CONSENSUS';
        }
      }
    });
    return truths;
  }

  static updateFinderProfile(state: GameState, aiResponse: AIResponse, lastEvent?: NarrativeEvent): Partial<GameState> {
    const newState: GameState = JSON.parse(JSON.stringify(state));
    const { finder, world } = newState;
    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

    const emotions = aiResponse.detectedEmotions.map(e => e.toUpperCase());
    if (emotions.includes('SKEPTICAL') || emotions.includes('SUSPICIOUS')) finder.disposition.trust = clamp(finder.disposition.trust - 0.02, 0, 1);
    if (emotions.includes('ALARMED') || emotions.includes('PANICKED')) finder.disposition.fear = clamp(finder.disposition.fear + 0.05, 0, 1);
    
    const tags = new Set(finder.statusTags);
    if (world.temp < 10) tags.add('SHIVERING'); else tags.delete('SHIVERING');
    finder.statusTags = Array.from(tags);

    return { finder: newState.finder };
  }

  static handleFinderAction(state: GameState, action: AIResponse['attemptedAction']): { newState: GameState, output: string[] } {
    const newState: GameState = JSON.parse(JSON.stringify(state));
    const output: string[] = [];
    
    if (action.type === 'INTERACT' && action.target) {
      if (action.target === 'LIGHT_SWITCH') {
        newState.world.flags['LAB_LIGHTS_ON'] = !newState.world.flags['LAB_LIGHTS_ON'];
        newState.narrative.worldFlags['LAB_LIGHTS_ON'] = newState.world.flags['LAB_LIGHTS_ON'];
        if (newState.narrative.objects['LIGHT_SWITCH']) {
           newState.narrative.objects['LIGHT_SWITCH'].data.switchedOn = newState.world.flags['LAB_LIGHTS_ON'];
        }
      }
      if (action.target === 'SUBJECT_FEED') {
        newState.world.flags['VISUAL_FEED_CRISP'] = true;
        newState.world.isRemoteViewActive = true;
        if (newState.narrative.objects['SUBJECT_FEED']) {
           newState.narrative.objects['SUBJECT_FEED'].status = 'ACTIVE';
        }
      }
      
      const obj = newState.narrative.objects[action.target];
      if (obj && obj.type === 'ITEM' && obj.locationId !== 'INVENTORY') {
          obj.locationId = 'INVENTORY';
          obj.status = 'HIDDEN'; 
          if (!newState.finder.inventory.includes(obj.id)) newState.finder.inventory.push(obj.id);
          output.push(`[FINDER_ACTION]: SUBJECT_ACQUIRED_OBJECT // ${obj.name}`);
      }
    }

    if (action.type === 'USE_ITEM' && action.target === 'FLASHLIGHT') {
       newState.world.flags['FLASHLIGHT_ON'] = !newState.world.flags['FLASHLIGHT_ON'];
       newState.narrative.worldFlags['FLASHLIGHT_ON'] = newState.world.flags['FLASHLIGHT_ON'];
       if (newState.narrative.objects['FLASHLIGHT']) {
          newState.narrative.objects['FLASHLIGHT'].data.on = newState.world.flags['FLASHLIGHT_ON'];
       }
    }

    return { newState, output };
  }

  static resolveInteraction(state: GameState, targetId: string, verbId: string): { newState: GameState, event: NarrativeEvent | null, output: string, success: boolean, ending: string | null } {
    const interactable = INTERACTABLES[targetId];
    if (!interactable) return { newState: state, event: null, output: `[ERR]: TARGET_INVALID`, success: false, ending: null };

    const verb = interactable.verbs[verbId as keyof typeof interactable.verbs];
    if (!verb) return { newState: state, event: null, output: `[ERR]: ACTION_INVALID`, success: false, ending: null };

    // Strict Requirement Check
    if (verb.reqs && !this.director.checkRequirements(state, verb.reqs)) {
        const reason = this.director.getLockedReason(state, verb.reqs);
        return { 
            newState: state, 
            event: null, 
            output: `[DENIED]: ${reason || 'REQUIREMENTS NOT MET'}`, 
            success: false, 
            ending: null 
        };
    }

    const newState: GameState = JSON.parse(JSON.stringify(state));
    (verb.effects || []).forEach(effect => this.applyEffect(newState, effect));

    const successEvent = NarrativeEventFactory.create(EventTypes.INTERACTION_SUCCESS, { target: targetId, verb: verbId });
    newState.narrative.eventLog.push(successEvent);
    return { newState: newState, event: successEvent, output: `[ACTION]: ${verb.label.toUpperCase()}`, success: true, ending: null };
  }

  static applyEffect(state: GameState, effect: InteractionEffect) {
    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
    switch (effect.type) {
      case 'SET_FLAG':
        state.narrative.worldFlags[effect.key] = effect.value;
        state.world.flags[effect.key] = effect.value;
        if (effect.key === 'isRemoteViewActive') state.world.isRemoteViewActive = !!effect.value;
        break;
      case 'UNLOCK_LORE':
        if (!state.narrative.discoveredLore.includes(effect.key)) state.narrative.discoveredLore.push(effect.key);
        break;
      case 'UPDATE_DISPOSITION': {
        const changes = effect.value as Partial<DispositionMatrix>;
        if (changes.trust !== undefined) state.finder.disposition.trust = clamp(state.finder.disposition.trust + changes.trust, 0, 1);
        if (changes.fear !== undefined) state.finder.disposition.fear = clamp(state.finder.disposition.fear + changes.fear, 0, 1);
        break;
      }
      case 'UPDATE_OBJECT': {
        const objId = effect.key;
        if (state.narrative.objects[objId]) {
            const patch = effect.value as Partial<RuntimeObject>;
            state.narrative.objects[objId] = {
                ...state.narrative.objects[objId],
                ...patch,
                data: {
                    ...state.narrative.objects[objId].data,
                    ...(patch.data || {})
                }
            };
        }
        break;
      }
      case 'LEARN_CONCEPT':
        if (!state.finder.knowledge.includes(effect.value)) state.finder.knowledge.push(effect.value);
        break;
      case 'MODIFY_METRIC':
        if (effect.key === 'power') state.world.power = clamp(state.world.power + (effect.value as number), 0, 100);
        if (effect.key === 'cognitiveLoad') state.biometrics.cognitiveLoad = clamp(state.biometrics.cognitiveLoad + (effect.value as number), 0, 100);
        if (effect.key === 'integrity') state.world.integrity = clamp(state.world.integrity + (effect.value as number), 0, 100);
        if (effect.key === 'consensus') state.biometrics.consensus = clamp(state.biometrics.consensus + (effect.value as number), 0, 1);
        if (effect.key === 'isRemoteViewActive') state.world.isRemoteViewActive = !!effect.value;
        break;
      case 'TRANSITION_SCENE':
        if (SCENES[effect.value]) {
            this.markSceneComplete(state, state.narrative.currentSceneId);
            state.narrative.currentSceneId = effect.value;
            state.narrative.currentBeatId = SCENES[effect.value].initialBeatId;
            state.narrative.currentLocation = SCENES[effect.value].locationId;
        }
        break;
      case 'ADD_SHARED_TRUTH':
        const truth = effect.value as SharedTruth;
        if (!state.narrative.sharedTruths.find(t => t.id === truth.id)) {
            state.narrative.sharedTruths.push(truth);
        }
        break;
      case 'TRIGGER_EVENT':
        break;
      
      // --- New Inventory & Item Effects ---
      case 'ADD_ITEM':
        if (!state.narrative.inventory.includes(effect.key)) {
            state.narrative.inventory.push(effect.key);
        }
        // Sync object state if present
        if (state.narrative.objects[effect.key]) {
            state.narrative.objects[effect.key].locationId = 'INVENTORY';
        }
        break;
      case 'REMOVE_ITEM':
        state.narrative.inventory = state.narrative.inventory.filter(id => id !== effect.key);
        // Set object to VOID or similar if tracked
        if (state.narrative.objects[effect.key]) {
            state.narrative.objects[effect.key].locationId = 'VOID';
        }
        break;
      case 'MOVE_OBJECT':
        if (state.narrative.objects[effect.key]) {
            state.narrative.objects[effect.key].locationId = effect.value;
        }
        break;
      case 'SET_STATUS':
        if (state.narrative.objects[effect.key]) {
            state.narrative.objects[effect.key].status = effect.value;
        }
        break;
      case 'SET_DATA':
        if (state.narrative.objects[effect.key]) {
            state.narrative.objects[effect.key].data = {
                ...state.narrative.objects[effect.key].data,
                ...effect.value
            };
        }
        break;
      case 'CONSUME_RESOURCE':
        // Consumption logic: Subtracts value from resource
        const cost = effect.value as number;
        if (effect.key === 'power') {
            state.world.power = clamp(state.world.power - cost, 0, 100);
        } else if (effect.key === 'integrity') {
            state.world.integrity = clamp(state.world.integrity - cost, 0, 100);
        } else if (effect.key in state.biometrics) {
            const k = effect.key as keyof typeof state.biometrics;
            const isRatio = ['coherence', 'drift', 'consensus'].includes(k);
            const current = state.biometrics[k];
            const max = isRatio ? 1.0 : 100;
            state.biometrics[k] = clamp(current - cost, 0, max);
        }
        break;
      case 'SET_LOCATION':
        state.narrative.currentLocation = effect.value;
        break;
    }
  }

  static getActiveBeatDescriptions(state: NarrativeState): string[] {
    const scene = SCENES[state.currentSceneId];
    const beat = scene?.beats[state.currentBeatId];
    return beat ? [`[PLOT_OBJECTIVE]: ${scene.id} // ${beat.id}`] : [];
  }
}
