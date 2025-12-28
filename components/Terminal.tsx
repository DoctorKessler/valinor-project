
import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { TerminalMessage, SenderType, LineKind, NarrativeChoice, GameState, LocationId } from '../types';
import { GlitchText } from './GlitchText';
import { TypewriterText } from './TypewriterText';
import { useAudio } from '../audio/AudioProvider';
import { SCENES } from '../worldTruth/scenes';
import { LOCATIONS } from '../worldTruth/locations';
import { Director } from '../narrativeForward/director';

interface Props {
  messages: TerminalMessage[];
  onSendMessage: (text: string) => void;
  onCommandClick: (cmdId: string) => void;
  onChoiceSelect?: (choiceId: string, text?: string) => void; 
  isProcessing: boolean;
  isObserved: boolean;
  isStasis: boolean;
  stability: number;
  sync: number;
  inputLocked: boolean;
  isPaused?: boolean;
  minimalist?: boolean;
  drift?: number;
  currentSceneId?: string;
  currentBeatId?: string;
  gameState: GameState; 
}

const deterministicScramble = (text: string, amount: number) => {
  if (amount <= 0.05) return text;
  const chars = "!@#$%^&*()_+";
  const probability = Math.min(0.03, amount * 0.1); 
  
  return text.split('').map((char, i) => {
    if (char === ' ' || char === '\n') return char;
    const hash = (i * 31 + text.length) % 100;
    return (hash < probability * 100) ? chars[hash % chars.length] : char;
  }).join('');
};

const NavBlock: React.FC<{ currentLocation: LocationId, onNavigate: (loc: LocationId) => void, isLocked: boolean }> = ({ currentLocation, onNavigate, isLocked }) => {
  const location = LOCATIONS[currentLocation];
  if (!location || !location.adjacency || location.adjacency.length === 0) return null;

  return (
    <div className="mb-6 pl-20 animate-in fade-in slide-in-from-left duration-700">
      <div className="text-[9px] text-emerald-900 font-bold tracking-[0.4em] uppercase mb-2">NAV_NET // {location.name}</div>
      <div className="flex flex-wrap gap-4">
        {location.adjacency.map(adjId => {
          const adj = LOCATIONS[adjId];
          if (!adj) return null;
          return (
            <button
              key={adjId}
              onClick={() => !isLocked && onNavigate(adjId)}
              disabled={isLocked}
              className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 border transition-all
                ${isLocked 
                  ? 'border-emerald-900/20 text-emerald-900 opacity-50 cursor-not-allowed' 
                  : 'border-emerald-500/30 text-emerald-600 hover:text-white hover:bg-emerald-900/30 hover:border-emerald-400'}`}
            >
              [ GO: {adj.name.split(' ')[0]} ]
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Terminal: React.FC<Props> = ({ 
  messages, onSendMessage, onCommandClick, onChoiceSelect, isProcessing, 
  isObserved, isStasis, stability, sync, inputLocked, isPaused = false, minimalist = false,
  drift = 0, currentSceneId, currentBeatId, gameState
}) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [capturingChoiceId, setCapturingChoiceId] = useState<string | null>(null);
  const [captureInput, setCaptureInput] = useState('');
  const captureInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const audio = useAudio();
  const director = useMemo(() => new Director(), []);

  // FILTER LOGIC: Terminal only shows human conversation
  const filteredMessages = useMemo(() => {
    return messages.filter(m => 
      m.lane === 'SHARED' && 
      ['player', 'ack', 'dispute', 'banner', 'action'].includes(m.kind)
    );
  }, [messages]);

  const initialIdsRef = useRef<Set<string> | null>(null);
  if (initialIdsRef.current === null) {
    initialIdsRef.current = new Set(filteredMessages.map(m => m.id));
    setVisibleCount(filteredMessages.length);
  }

  useEffect(() => {
    // Scroll within the local container to prevent parent page jumps
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [visibleCount, isProcessing, filteredMessages.length, capturingChoiceId]);

  useEffect(() => {
    if (visibleCount < filteredMessages.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [filteredMessages.length, visibleCount, isPaused]);

  useEffect(() => {
    let interval: number;
    if (isProcessing && !isPaused) {
      setProcessingProgress(0);
      interval = window.setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 95) return prev + (100 - prev) * 0.01;
          return prev + Math.random() * 8;
        });
      }, 150);
    } else {
      setProcessingProgress(0);
    }
    return () => clearInterval(interval);
  }, [isProcessing, isPaused]);

  useEffect(() => {
    if (capturingChoiceId && captureInputRef.current) {
      captureInputRef.current.focus();
    }
  }, [capturingChoiceId]);

  const handleCaptureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only block if mode is required and input empty
    const choice = allChoices.find(c => c.id === capturingChoiceId);
    if (!captureInput.trim() && capturingChoiceId) {
       if (choice?.capture?.mode === 'required') return;
    }
    
    if (capturingChoiceId) {
      audio.play("ui_click", { gain: 0.25 });
      onChoiceSelect?.(capturingChoiceId, captureInput);
      setCapturingChoiceId(null);
      setCaptureInput('');
    }
  };

  const handleChoiceClick = (choice: NarrativeChoice) => {
    if (isProcessing || isStasis || inputLocked || isPaused) return;

    if (choice.capture) {
      setCapturingChoiceId(choice.id);
      setCaptureInput('');
    } else {
      audio.play("ui_click", { gain: 0.25 });
      onChoiceSelect?.(choice.id);
    }
  };

  const handleNavClick = (loc: LocationId) => {
    audio.play("ui_click", { gain: 0.2 });
    onCommandClick(`NAV_${loc}`);
  };

  const getLineColor = (kind: LineKind) => {
    switch (kind) {
      case 'ack': return 'text-emerald-300 font-bold drop-shadow-[0_0_12px_rgba(52,211,153,0.3)]';
      case 'player': return 'text-white font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]';
      case 'banner': return 'text-red-600 font-bold uppercase tracking-[0.6em]';
      case 'dispute': return 'text-amber-400 font-bold border-l-4 border-amber-600 pl-6 py-2 bg-amber-900/5 italic';
      case 'action': return 'text-emerald-500/60 italic';
      default: return 'text-emerald-500/60';
    }
  };

  const getSenderLabel = (sender: SenderType) => {
    switch(sender) {
      case SenderType.SYSTEM: return 'SYS';
      case SenderType.FINDER: 
        return gameState.world.flags['KNOWS_ALEX_NAME'] ? 'ALEX' : 'STRANGER';
      case SenderType.PLAYER: return 'YOU';
      default: return 'LOG';
    }
  };

  const driftScramble = drift > 0.85 ? (drift - 0.85) * 0.5 : 0;
  const currentScene = currentSceneId ? SCENES[currentSceneId] : null;
  const currentBeat = currentScene && currentBeatId ? currentScene.beats[currentBeatId] : null;
  
  const allChoices = useMemo(() => {
    if (!currentBeat?.choices) return [];
    return currentBeat.choices;
  }, [currentBeat]);

  const showChoices = !isProcessing && allChoices.length > 0 && !inputLocked;
  const showNav = !isProcessing && !inputLocked && !capturingChoiceId && !isStasis;

  // Shared Choice Rendering Logic
  const renderChoices = () => (
    <div className={`pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pointer-events-auto min-h-[120px] ${minimalist ? 'border-t border-emerald-950/20 mt-4' : 'border-t border-emerald-950/10'}`}>
        
        {showNav && minimalist && (
          <NavBlock currentLocation={gameState.narrative.currentLocation} onNavigate={handleNavClick} isLocked={isProcessing || isStasis} />
        )}

        {capturingChoiceId ? (
          <form onSubmit={handleCaptureSubmit} className={minimalist ? "pl-20 relative" : "pl-40 relative"}>
              <div className="text-[10px] text-emerald-900 font-bold tracking-[1em] uppercase mb-4 opacity-40">Data_Entry_Required</div>
              <div className="flex flex-col gap-4">
                <div className="text-xl font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-6 opacity-60">
                    <span>→</span>
                    <span className="border-b border-transparent">{allChoices.find(c => c.id === capturingChoiceId)?.label}</span>
                </div>
                <div className="flex items-center gap-4 bg-emerald-500/5 px-4 py-2 rounded-sm border-l-2 border-emerald-500">
                  <span className="text-emerald-400 font-bold animate-pulse">_</span>
                  <input
                    ref={captureInputRef}
                    type="text"
                    value={captureInput}
                    onChange={(e) => {
                      setCaptureInput(e.target.value);
                      audio.play("ui_key", { gain: 0.15 });
                    }}
                    placeholder={allChoices.find(c => c.id === capturingChoiceId)?.capture?.placeholder || "TYPE_RESPONSE..."}
                    className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-emerald-900/30 uppercase tracking-[0.2em] text-[12px] font-bold terminal-input-field"
                    autoFocus
                  />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest hover:text-white">[ CONFIRM ]</button>
                  <button 
                    type="button" 
                    onClick={() => { setCapturingChoiceId(null); setCaptureInput(''); }}
                    className="text-[10px] text-red-800 font-bold uppercase tracking-widest hover:text-red-500"
                  >
                    [ CANCEL ]
                  </button>
                </div>
              </div>
          </form>
        ) : (
          <div className={minimalist ? "pl-20 space-y-4" : "pl-40 space-y-6"}>
              <div className="text-[10px] text-emerald-900 font-bold tracking-[1em] uppercase mb-4 opacity-40">Awaiting_Branch_Selection...</div>
              {allChoices.map(choice => {
                const lockedReason = choice.reqs ? director.getLockedReason(gameState, choice.reqs) : null;
                const isLocked = !!lockedReason;

                return (
                  <button 
                    key={choice.id} 
                    onClick={() => !isLocked && handleChoiceClick(choice)} 
                    disabled={isLocked}
                    className={`block text-left group w-full mb-4 focus:outline-none relative ${isLocked ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                  >
                    {/* Stable hover overlay area to ensure no flickering */}
                    <div className="absolute inset-0 bg-transparent z-0" />
                    
                    <div className="relative z-10 flex flex-col gap-2">
                      <div className="text-xl font-bold uppercase tracking-widest flex items-center gap-6">
                          <span className={`transition-opacity duration-300 ${!isLocked ? 'opacity-0 group-hover:opacity-100 text-emerald-400' : 'opacity-0'}`}>→</span>
                          
                          <span className={`transition-colors duration-300 border-b border-transparent ${
                            isLocked ? 'text-emerald-900' : 'text-emerald-500 group-hover:text-white group-hover:border-emerald-500/30'
                          } pb-1`}>
                            {choice.label}
                          </span>
                          
                          {choice.capture && !isLocked && <span className="text-[9px] bg-emerald-950 text-emerald-600 px-1 rounded ml-2 opacity-50">[INPUT]</span>}
                          
                          {isLocked && (
                            <span className="text-[8px] bg-red-950/20 text-red-800 border border-red-900/30 px-2 py-0.5 tracking-[0.2em] font-bold">
                              [LOCKED: {lockedReason}]
                            </span>
                          )}
                      </div>
                      
                      {choice.description && !isLocked && (
                        <div className="pl-12 text-[10px] text-emerald-800 group-hover:text-emerald-400 uppercase tracking-wider font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {choice.description}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        )}
    </div>
  );

  // Minimalist View (In-World HUD)
  if (minimalist) {
    return (
      <div className="flex flex-col w-full pointer-events-none h-full justify-end">
        <div 
          ref={scrollContainerRef}
          className="relative overflow-y-auto custom-scrollbar pr-6 pt-12 pointer-events-auto max-h-[60vh] flex flex-col"
        >
          {/* Messages */}
          <div className="flex flex-col justify-end space-y-8 flex-1">
            {filteredMessages.slice(-15).map((msg) => (
               <div key={msg.id} className="animate-in fade-in duration-1000 flex items-start gap-12 group">
                 {msg.kind === 'banner' ? (
                   <div className="w-full text-red-500 font-bold tracking-[0.8em] uppercase text-center py-6 border-y border-red-950/10">
                     <GlitchText text={deterministicScramble(msg.text, driftScramble)} />
                   </div>
                 ) : (
                   <>
                    <span className={`text-[9px] tracking-[0.4em] shrink-0 font-bold uppercase w-16 opacity-10 group-hover:opacity-40 transition-opacity mt-2`}>
                      {getSenderLabel(msg.sender)}
                    </span>
                    <span className={`${getLineColor(msg.kind)} whitespace-pre-wrap leading-[2] flex-1 tracking-tight text-[14px] transition-colors ${driftScramble > 0.1 ? 'glitch-text' : ''}`} data-text={driftScramble > 0.1 ? msg.text : ''}>
                      <TypewriterText 
                        text={deterministicScramble(msg.text, driftScramble)} 
                        speed={driftScramble > 0.3 ? 5 : 10} 
                        animate={!initialIdsRef.current?.has(msg.id)} 
                        soundId={msg.sender === SenderType.SYSTEM ? "log_key" : "ui_key"}
                      />
                    </span>
                   </>
                 )}
              </div>
            ))}
            <div ref={messagesEndRef} className="h-2" />
          </div>

          {/* Choices in Minimalist Mode */}
          {showChoices && renderChoices()}
        </div>
      </div>
    );
  }

  // Main Terminal View (Fullscreen Panel)
  return (
    <div className="flex flex-col h-full p-24 font-mono relative max-w-[1400px] mx-auto">
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-12 mb-16 pr-12 custom-scrollbar"
      >
        {filteredMessages.slice(0, visibleCount).map((msg) => (
          <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex items-start gap-16 group">
            <span className={`text-[11px] tracking-[0.5em] shrink-0 font-bold uppercase w-24 opacity-10 group-hover:opacity-40 transition-opacity mt-2`}>
               {getSenderLabel(msg.sender)}
            </span>
            <div className="flex-1">
               {msg.kind === 'banner' ? (
                 <div className="w-full text-red-600 font-bold tracking-[0.8em] uppercase text-center py-10 border-y border-red-950/20">
                   <GlitchText text={deterministicScramble(msg.text, driftScramble)} />
                   {msg.kind === 'banner' && msg.text.includes('ENDING') && (
                       <div className="text-[10px] text-red-500 mt-4 tracking-widest opacity-60">REFRESH_BROWSER_TO_REBOOT</div>
                   )}
                 </div>
               ) : (
                 <div className={`${getLineColor(msg.kind)} whitespace-pre-wrap leading-relaxed tracking-normal text-[15px] ${driftScramble > 0.1 ? 'glitch-text' : ''}`} data-text={driftScramble > 0.1 ? msg.text : ''}>
                    <TypewriterText 
                      text={deterministicScramble(msg.text, driftScramble)} 
                      speed={driftScramble > 0.3 ? 5 : 10} 
                      animate={!initialIdsRef.current?.has(msg.id)} 
                      soundId={msg.sender === SenderType.SYSTEM ? "log_key" : "ui_key"}
                    />
                 </div>
               )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {showChoices && renderChoices()}

      {isProcessing && (
          <div className="absolute bottom-12 left-24 right-24">
             <div className="h-[1px] bg-emerald-500/40" 
                  style={{ width: `${processingProgress}%`, transition: 'width 0.4s ease-out' }} />
          </div>
      )}
    </div>
  );
};

export default memo(Terminal);
