
import React, { useCallback, useState } from 'react';
import { GameState, SenderType, TerminalMessage, NarrativeEvent, SharedTruth } from '../types';
import { GameEngine } from '../engine/GameEngine';
import { NarrativeSystem } from '../engine/NarrativeSystem';
import { NarrativeEventFactory, EventTypes } from '../runtime/events';
import { getFinderReaction } from '../geminiService';
import { COTY_MEMORIES } from '../worldTruth/memories';
import { audioSystem } from '../audio/AudioSystem';
import { SCENES } from '../worldTruth/scenes';

export const usePlayerInteraction = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  isCrashing: boolean,
  isCreatorPhase: boolean,
  prologueInput: string,
  setPrologueInput: (s: string) => void,
  isPrologueInputLocked: boolean
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentRewards, setRecentRewards] = useState<{stat: string, val: string}[] | null>(null);
  const [isRewardPausing, setIsRewardPausing] = useState(false);
  const [changedModuleIds, setChangedModuleIds] = useState<string[]>([]);
  const [notification, setNotification] = useState<{label: string, key: string} | null>(null);

  // Derive pause state locally from dependencies provided by parent
  const isPaused = !!gameState.activeMemoryId || isRewardPausing || isCrashing || isCreatorPhase;

  const handleNarrativeAction = useCallback((type: string, payload: any = {}) => {
    const event = NarrativeEventFactory.create(type, payload);
    setGameState(prev => {
      const result = NarrativeSystem.processNarrativeAction(prev, event);
      const terminalMessages: TerminalMessage[] = result.messages.map((m, i) => ({
        ...m,
        id: `meta-act-${Date.now()}-${i}`,
        timestamp: Date.now() + i
      } as TerminalMessage));
      return { ...result.newState, history: [...result.newState.history, ...terminalMessages] };
    });
  }, [setGameState]);

  const handleCommandClick = useCallback((cmdId: string) => {
    if (isCrashing || isCreatorPhase) return;
    if (cmdId.startsWith('LINK_')) {
      const memId = cmdId.replace('LINK_', '');
      handleNarrativeAction(EventTypes.MEMORY_SELECTED, { memoryId: memId });
    }
    setGameState(prev => {
      const result = GameEngine.advance(prev, { type: 'COMMAND', id: cmdId });
      return result.newState;
    });
  }, [isCrashing, isCreatorPhase, setGameState, handleNarrativeAction]);

  const handlePrologueInputSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (isPrologueInputLocked || !prologueInput.trim()) return;
    const newMsg = prologueInput.trim();
    const currentCount = gameState.prologueMessages.length + 1;
    const maxCount = 10;
    setGameState(prev => {
        const sysLog: TerminalMessage = {
            id: `echo-${Date.now()}`, sender: SenderType.SYSTEM, kind: 'ack', text: `[LOG_${currentCount.toString().padStart(2, '0')}/${maxCount}]: ${newMsg}`, timestamp: Date.now(), lane: 'SHARED'
        };
        const newHistory = [...prev.history, sysLog];
        const newMessages = [...prev.prologueMessages, newMsg];
        return { ...prev, prologueMessages: newMessages, history: newHistory };
    });
    setPrologueInput("");
  }, [prologueInput, isPrologueInputLocked, gameState.prologueMessages.length, setGameState, setPrologueInput]);

  const handleMemoryClose = useCallback(() => {
    if (!gameState.activeMemoryId) return;
    const memId = gameState.activeMemoryId;
    const mem = COTY_MEMORIES.find(m => m.id === memId);
    audioSystem.play("memory_close");
    setGameState(prev => {
      const result = GameEngine.advance(prev, { type: 'APPLY_MEMORY', memoryId: memId });
      const newState = result.newState;
      if (mem) {
        setIsRewardPausing(true);
        const boosts = mem.rewards.pipelineBoosts || {};
        setChangedModuleIds(Object.keys(boosts));
        const rewardsToShow = [];
        if (mem.rewards.coherenceMod !== 0) rewardsToShow.push({ stat: 'COHERENCE', val: `${mem.rewards.coherenceMod > 0 ? '+' : ''}${(mem.rewards.coherenceMod * 100).toFixed(0)}%` });
        setRecentRewards(rewardsToShow.length > 0 ? rewardsToShow : null);
        setTimeout(() => { setRecentRewards(null); setIsRewardPausing(false); setChangedModuleIds([]); }, 4000);
      }
      return { ...newState, activeMemoryId: null };
    });
  }, [gameState.activeMemoryId, setGameState]);

  const handleChoiceSelect = useCallback(async (choiceId: string, text?: string) => {
    if (isCrashing || isPaused) return;
    setIsProcessing(true);

    // 1. Resolve Choice in Engine SYNCHRONOUSLY using current gameState
    // This ensures we have the new state object immediately for AI generation
    const advanceResult = GameEngine.advance(gameState, { type: 'RESOLVE_CHOICE', choiceId, text });
    const newStateAfterChoice = advanceResult.newState;

    // Find choice metadata from the PREVIOUS state to determine intent
    const scene = SCENES[gameState.narrative.currentSceneId];
    const beat = scene.beats[gameState.narrative.currentBeatId];
    const choiceObject = beat.choices?.find(c => c.id === choiceId);

    // Apply the update to React state
    setGameState(newStateAfterChoice);

    audioSystem.play("ui_click");

    // 2. Determine if we should trigger AI Response
    // We invoke Finder if the NEXT beat (in the NEW state) does NOT have hardcoded text.
    const nextBeatId = choiceObject?.nextBeatId;
    const nextBeatHasText = nextBeatId ? SCENES[newStateAfterChoice.narrative.currentSceneId]?.beats[nextBeatId]?.text : false;

    if (!nextBeatHasText) {
        try {
            // Construct AI Prompt using choice intent + optional text
            const verb = choiceObject?.action?.verb || 'SIGNAL';
            const label = choiceObject?.label || 'UNKNOWN';
            const promptText = text ? `"${text}"` : `[${label}]`;
            const aiPrompt = `[ACTION: ${verb}] ${promptText}`;

            const response = await getFinderReaction(newStateAfterChoice, aiPrompt);
            
            setGameState(prev => {
                const result = GameEngine.advance(prev, { type: 'FINDER_REACTION', response, input: aiPrompt });
                return result.newState;
            });
        } catch (e) {
            console.error(e);
            setGameState(prev => ({ 
                ...prev, 
                history: [...prev.history, { id: `err-${Date.now()}`, sender: SenderType.SYSTEM, kind: 'err', text: "[ERROR]: LINK_DEGRADED // AI_RESPONSE_FAIL", timestamp: Date.now(), lane: 'SHARED' }] 
            }));
        }
    }
    
    setIsProcessing(false);
  }, [isCrashing, isPaused, gameState, setGameState]);

  const handleSendMessage = useCallback((text: string) => {
      console.warn("Direct text input is deprecated. Use handleChoiceSelect.");
  }, []);

  return {
    handleCommandClick,
    handleChoiceSelect,
    handleNarrativeAction,
    handlePrologueInputSubmit,
    handleMemoryClose,
    handleSendMessage,
    isProcessing,
    isRewardPausing,
    recentRewards,
    changedModuleIds,
    notification,
    setNotification
  };
};
