
import React, { useState, useEffect, useMemo } from 'react';
import { GameState, SenderType, TerminalMessage } from './types';
import { INITIAL_GAME_STATE } from './config/initialState';
import { CreatorTerminal } from './components/CreatorTerminal';
import { VolatileMemoryField } from './components/Visuals/VolatileMemoryField';
import { PrologueDashboard } from './components/Prologue/PrologueDashboard';
import { SceneShell } from './components/Layout/SceneShell';
import { useGameLoop } from './hooks/useGameLoop';
import { usePlayerInteraction } from './hooks/usePlayerInteraction';
import { useVisualState } from './hooks/useVisualState';
import { useAttentionTracking } from './hooks/useAttentionTracking';
import { useNarrativeAudio } from './hooks/useNarrativeAudio';
import { COTY_MEMORIES } from './worldTruth/memories';
import { EventTypes } from './runtime/events';
import { AudioProvider, useAudio } from './audio/AudioProvider';
import { IntroEngine } from './engine/IntroEngine';

import Terminal from './components/Terminal';
import HardwareMonitor from './components/HardwareMonitor';
import MemoryOverlay from './components/MemoryOverlay';
import RecallArchive from './components/RecallArchive';
import DiscoveryLedger from './components/DiscoveryLedger';
import MarginHUD from './components/Visuals/MarginHUD';
import { NarrativeSystem } from './engine/NarrativeSystem';
import { PortalOverlay } from './components/PortalOverlay';
import { CornerFeed } from './components/Visuals/CornerFeed';

const AppContent = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [prologueInput, setPrologueInput] = useState("");
  const audio = useAudio();

  const isCreatorPhase = gameState.bootPhase === 'CREATOR_INITIALIZATION';
  const isCrashing = gameState.world.flags['SYSTEM_CRASH'] === true;
  const isStabilizing = gameState.bootPhase === 'STABILIZATION';
  const isFinderPhase = !gameState.prologueActive;
  const hasUnlockedInput = gameState.world.flags['HAS_UNLOCKED_INPUT'] === true;
  const isPrologueInputLocked = gameState.prologueMessages.length >= 10;

  const { 
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
  } = usePlayerInteraction(
    gameState, 
    setGameState, 
    isCrashing, 
    isCreatorPhase, 
    prologueInput, 
    setPrologueInput, 
    isPrologueInputLocked
  );

  const isPaused = !!gameState.activeMemoryId || isRewardPausing || isCrashing || isCreatorPhase;

  useEffect(() => {
    if (isCrashing || gameState.world.isStasisActive) { audio.setAmbience("stasis"); } 
    else if (gameState.bootPhase === 'SELF_EXPLORATION') { audio.setAmbience("exploration"); } 
    else if (gameState.prologueActive) { audio.setAmbience("boot"); } 
    else { audio.setAmbience("void"); }
  }, [audio, gameState.prologueActive, gameState.bootPhase, isCrashing, gameState.world.isStasisActive]);

  useEffect(() => {
    const isEarlyBoot = ['SIGNAL_DETECTION', 'COHERENCE_GATE', 'CARRIER_LOCK', 'IDENTITY_STABILIZATION'].includes(gameState.bootPhase);
    if (isProcessing || isEarlyBoot || gameState.bootPhase === 'STABILIZATION') { audio.startCalculating(); } 
    else { audio.stopCalculating(); }
    return () => audio.stopCalculating();
  }, [isProcessing, gameState.bootPhase, audio]);

  const { stutter, setStutter } = useGameLoop(gameState, setGameState, isPaused, isCreatorPhase, isCrashing);
  const { phaseIndex, activeMemory, glitchIntensity, isFrozen, getDisposition, surfaceStyle } = useVisualState(gameState, isCrashing, isStabilizing);
  const { setIsLocusHeld } = useAttentionTracking(gameState.locus.mode, gameState.bootPhase, glitchIntensity, gameState.world.stability, isCreatorPhase);
  useNarrativeAudio(gameState);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCrashing) return;

      if (e.key === '`') {
        const dummyMessages = [
          "External link detected: Alex.",
          "Facility power is critically low.",
          "My name is Coty.",
          "System flush protocol is armed."
        ];
        
        setGameState(prev => {
          // Construct the base state for the narrative start
          const baseState: GameState = {
            ...prev,
            bootPhase: 'READY',
            prologueActive: false,
            prologueMessages: dummyMessages,
            biometrics: { ...prev.biometrics, coherence: 1.0, drift: 0.08, consensus: 0.5 },
            world: { ...prev.world, power: 100, stability: 100, integrity: 100, progress: 100, flags: { ...prev.world.flags, HAS_UNLOCKED_INPUT: true, INTENT_SERIALIZER_LOCKED: false, SIGNAL_DETECTED: true } },
            finder: { ...prev.finder, sessionBound: true },
            history: [
              ...prev.history,
              { id: `skip-sys-${Date.now()}`, sender: SenderType.SYSTEM, kind: 'ack', text: "[DEBUG_SKIP]: JUMPING TO NARRATIVE START // STATE_STABILIZED", timestamp: Date.now(), lane: 'SHARED' }
            ],
            narrative: { ...prev.narrative, isActive: true, currentSceneId: 'SCENE_01_AWAKENING', currentBeatId: 'BEAT_01_ACTIVATION', sharedTruths: IntroEngine.extractTruthsFromPrologue(dummyMessages) }
          };

          // Execute the first beat to trigger effects (lights/flags) and get initial dialogue
          const beatResult = NarrativeSystem.runBeat(baseState, 'BEAT_01_ACTIVATION');
          
          return {
            ...beatResult.newState,
            history: [
              ...baseState.history,
              ...beatResult.messages.map((m, i) => ({
                ...m,
                id: `init-beat-${Date.now()}-${i}`,
                timestamp: Date.now() + i
              } as TerminalMessage))
            ]
          };
        });
        return;
      }

      if (!isFinderPhase && gameState.bootPhase === 'SELF_EXPLORATION' && !hasUnlockedInput && !e.repeat) {
          if (e.key.length === 1) handleCommandClick('CMD_KEY_SPIKE');
          return;
      }
      if (isFinderPhase) {
        const key = e.key.toUpperCase();
        if (key === 'M' && gameState.unlockedMenus.includes('RECALL_ARCHIVE')) {
          setGameState(p => ({ ...p, activePanel: p.activePanel === 'RECALL_ARCHIVE' ? 'NONE' : 'RECALL_ARCHIVE' }));
        } else if (key === 'H' && gameState.unlockedMenus.includes('HARDWARE_MONITOR')) {
          setGameState(p => ({ ...p, activePanel: p.activePanel === 'HARDWARE' ? 'NONE' : 'HARDWARE' }));
        } else if (key === 'L' && gameState.unlockedMenus.includes('LOG_SPILL')) {
          setGameState(p => ({ ...p, activePanel: p.activePanel === 'TERMINAL' ? 'NONE' : 'TERMINAL' }));
        } else if (key === 'D' && gameState.unlockedMenus.includes('DISCOVERY_LEDGER')) {
          setGameState(p => ({ ...p, activePanel: p.activePanel === 'DISCOVERY_LEDGER' ? 'NONE' : 'DISCOVERY_LEDGER' }));
        } else if (key === 'ESCAPE') {
          setGameState(p => ({ ...p, activePanel: 'NONE' }));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.prologueActive, gameState.bootPhase, hasUnlockedInput, isFinderPhase, isPaused, handleCommandClick, gameState.unlockedMenus, isCrashing, setGameState]);

  const isExternalVisible = NarrativeSystem.canSeeExternal(gameState);

  const bioMessages = useMemo(() => gameState.history.filter(m => m.kind === 'telemetry'), [gameState.history]);
  const sysMessages = useMemo(() => gameState.history.filter(m => ['sys', 'warn', 'err', 'action', 'meta', 'echo'].includes(m.kind)), [gameState.history]);

  if (isCreatorPhase) return <CreatorTerminal onComplete={() => setGameState(prev => ({...prev, bootPhase: 'SIGNAL_DETECTION'}))} />;

  const HudPlane = (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {isFinderPhase && (
        <div className="w-full flex justify-center pt-10 pb-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-6 animate-in slide-in-from-top duration-1000">
            <div className="text-[10px] tracking-[0.5em] text-emerald-900/60 font-bold uppercase">Sync_Tether</div>
            <div className="flex gap-1">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`w-1.5 h-3 ${i < 8 ? 'bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-emerald-950/20'} ${i === 7 ? 'animate-pulse' : ''}`} />
              ))}
            </div>
            <div className="text-[10px] text-emerald-500/80 font-bold">12m // NOMINAL</div>
          </div>
        </div>
      )}
      
      {isFinderPhase && (
        <div className="absolute inset-x-12 bottom-12 flex justify-between items-end pointer-events-none">
          <CornerFeed messages={bioMessages} title="Bio_Instrumentation" side="left" variant="bio" />
          <CornerFeed messages={sysMessages} title="Kernel_Process_Log" side="right" variant="sys" />
        </div>
      )}

      {isFinderPhase && isExternalVisible && <MarginHUD observations={gameState.narrative.marginObservations} />}
      
      <div className="fixed inset-0 z-[900] pointer-events-none">
        <div className="grid h-full w-full grid-cols-[1fr_minmax(800px,1000px)_1fr] gap-12 p-12">
          <div className="pointer-events-auto space-y-4">
            {gameState.activePanel === 'DISCOVERY_LEDGER' && (
              <div className="relative h-full animate-in slide-in-from-left duration-500">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] border border-emerald-900/20" />
                <DiscoveryLedger 
                  truths={gameState.narrative.sharedTruths} 
                  onClose={() => setGameState(p => ({...p, activePanel: 'NONE'}))} 
                  onReinforce={(id) => handleNarrativeAction(EventTypes.LEDGER_TRUTH_PINNED, { truthId: id })}
                  onCreate={(text) => handleNarrativeAction(EventTypes.HYPOTHESIS_CRAFTED, { text })} 
                />
              </div>
            )}
            {gameState.activePanel === 'RECALL_ARCHIVE' && (
              <div className="relative h-full animate-in slide-in-from-left duration-500">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] border border-emerald-900/20" />
                <RecallArchive memories={COTY_MEMORIES} recoveredIds={gameState.narrative.recoveredMemoryIds} onSelectMemory={(id) => handleNarrativeAction(EventTypes.MEMORY_SELECTED, { memoryId: id })} />
                <button onClick={() => setGameState(p => ({...p, activePanel: 'NONE'}))} className="absolute top-4 right-4 text-[9px] text-emerald-900 hover:text-white font-bold uppercase cursor-pointer z-50">DISCHARGE</button>
              </div>
            )}
          </div>
          <div className="pointer-events-none" />
          <div className="pointer-events-auto space-y-4">
            {gameState.activePanel === 'HARDWARE' && (
              <div className="relative h-full animate-in slide-in-from-right duration-500">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] border border-emerald-900/20" />
                <HardwareMonitor world={gameState.world} finder={gameState.finder} biometrics={gameState.biometrics} mentalPhase={gameState.mentalPhase} />
                <button onClick={() => setGameState(p => ({...p, activePanel: 'NONE'}))} className="absolute top-4 right-4 text-[9px] text-emerald-900 hover:text-white font-bold uppercase cursor-pointer z-50">CLOSE</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {activeMemory && <MemoryOverlay memory={activeMemory} onClose={handleMemoryClose} />}
    </div>
  );

  return (
    <SceneShell
      gameState={gameState} glitchIntensity={glitchIntensity} isCrashing={isCrashing} isStabilizing={isStabilizing} isFinderPhase={isFinderPhase} isProcessing={isProcessing} phaseIndex={phaseIndex} surfaceStyle={surfaceStyle} hudContent={HudPlane}
      logContent={
        gameState.activePanel === 'TERMINAL' ? (
          <div className="fixed inset-0 z-[2000000] animate-in fade-in duration-1000 pointer-events-auto">
            <div className="absolute inset-0 bg-black" />
            <Terminal 
              messages={gameState.history} onSendMessage={handleSendMessage} onCommandClick={handleCommandClick} onChoiceSelect={handleChoiceSelect} 
              isProcessing={isProcessing} isObserved={gameState.world.isRemoteViewActive} isStasis={gameState.world.isStasisActive} stability={gameState.world.stability} sync={gameState.world.propriocepSync} inputLocked={gameState.world.flags['INTENT_SERIALIZER_LOCKED']} isPaused={isPaused} drift={gameState.biometrics.drift}
              currentSceneId={gameState.narrative.currentSceneId} currentBeatId={gameState.narrative.currentBeatId}
              gameState={gameState}
            />
            <button onClick={() => setGameState(p => ({...p, activePanel: 'NONE'}))} className="absolute top-12 right-12 text-[10px] text-emerald-900 hover:text-white font-bold uppercase cursor-pointer z-[100]">[ RETURN_ESC ]</button>
          </div>
        ) : null
      }
    >
      {gameState.prologueActive ? (
        <>
          <VolatileMemoryField links={gameState.activeLinks} onLinkClick={(id) => handleCommandClick(`LINK_${id}`)} isSelfExploration={gameState.bootPhase === 'SELF_EXPLORATION'} />
          <PrologueDashboard 
            gameState={gameState} isRewardPausing={isRewardPausing} recentRewards={recentRewards} changedModuleIds={changedModuleIds} notification={notification} prologueInput={prologueInput} setPrologueInput={setPrologueInput} onInputSubmit={handlePrologueInputSubmit} isPrologueInputLocked={isPrologueInputLocked} hasUnlockedInput={hasUnlockedInput} phaseIndex={phaseIndex} isStabilizing={isStabilizing} activeMemoryId={gameState.activeMemoryId} stutter={stutter} surfaceStyle={{}} getDisposition={getDisposition}
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-[15vh]">
           <div className="w-full max-w-[900px] pointer-events-auto">
             <Terminal 
                messages={gameState.history} onSendMessage={handleSendMessage} onCommandClick={handleCommandClick} onChoiceSelect={handleChoiceSelect}
                isProcessing={isProcessing} isObserved={gameState.world.isRemoteViewActive} isStasis={gameState.world.isStasisActive} stability={gameState.world.stability} sync={gameState.world.propriocepSync} inputLocked={gameState.world.flags['INTENT_SERIALIZER_LOCKED']} isPaused={isPaused} drift={gameState.biometrics.drift}
                currentSceneId={gameState.narrative.currentSceneId} currentBeatId={gameState.narrative.currentBeatId}
                gameState={gameState} minimalist={true}
             />
           </div>
        </div>
      )}
      <PortalOverlay>
        <div id="attention-locus" className={`reticle ${gameState.locus.mode === 'GHOST' ? 'ghost' : ''} ${gameState.locus.mode === 'ACTIVE' ? 'active' : ''} transition-opacity duration-1000 ${phaseIndex >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="reticle-bracket reticle-bracket-tl" />
          <div className="reticle-bracket reticle-bracket-tr" />
          <div className="reticle-bracket reticle-bracket-bl" />
          <div className="reticle-bracket reticle-bracket-br" />
        </div>
      </PortalOverlay>
    </SceneShell>
  );
};

const App = () => { 
  return ( 
    <AudioProvider> 
      <AppContent /> 
    </AudioProvider> 
  ); 
};

export default App;