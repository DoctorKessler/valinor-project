
import React, { useState } from 'react';
import { GameState, TerminalMessage, SenderType } from '../../types';
import { GlitchText } from '../GlitchText';
import { TypewriterText } from '../TypewriterText';
import { useAudio } from '../../audio/AudioProvider';

interface Props {
  gameState: GameState;
  isRewardPausing: boolean;
  recentRewards: {stat: string, val: string}[] | null;
  changedModuleIds: string[];
  notification: {label: string, key: string} | null;
  prologueInput: string;
  setPrologueInput: (s: string) => void;
  onInputSubmit: (e: React.FormEvent) => void;
  isPrologueInputLocked: boolean;
  hasUnlockedInput: boolean;
  phaseIndex: number;
  isStabilizing: boolean;
  activeMemoryId: string | null;
  stutter: boolean;
  surfaceStyle: React.CSSProperties;
  getDisposition: () => string;
}

export const PrologueDashboard: React.FC<Props> = ({
  gameState,
  isRewardPausing,
  recentRewards,
  changedModuleIds,
  notification,
  prologueInput,
  setPrologueInput,
  onInputSubmit,
  isPrologueInputLocked,
  hasUnlockedInput,
  phaseIndex,
  isStabilizing,
  activeMemoryId,
  stutter,
  surfaceStyle,
  getDisposition
}) => {
  const isSelfExploration = gameState.bootPhase === 'SELF_EXPLORATION';
  const [isInputHovered, setIsInputHovered] = useState(false);
  const audio = useAudio();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrologueInput(e.target.value);
    audio.play("ui_key", { gain: 0.15 });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prologueInput.trim()) {
      audio.play("ui_click", { gain: 0.25 });
      onInputSubmit(e);
    }
  };

  return (
    <>
      {notification && (
        <div className="fixed top-20 right-10 z-[200] w-64 bg-black border border-emerald-500 p-6 animate-digital-entry shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.4em] mb-4">Module Unlocked</div>
          <div className="text-xl text-white font-bold uppercase tracking-widest mb-2">{notification.label}</div>
          <div className="text-[9px] text-emerald-700 font-bold uppercase border-t border-emerald-950/40 pt-4">
            Press <span className="text-white">[{notification.key}]</span> to toggle
          </div>
        </div>
      )}

      {isRewardPausing && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-2 bg-emerald-500/10 border border-emerald-400 text-emerald-400 font-mono text-[9px] tracking-[0.6em] uppercase animate-pulse">
          SYNCHRONICITY_LOCK: ACTIVE
        </div>
      )}

      <div 
        className="fixed inset-0 z-[50] bg-black flex p-12 overflow-hidden gap-12 pointer-events-none"
        style={surfaceStyle}
      >
        {/* ... Left Side ... */}
        <div className={`flex-1 flex flex-col justify-center space-y-4 transition-all duration-1000 pointer-events-auto 
          ${phaseIndex >= 5 || gameState.bootPhase === 'SELF_EXPLORATION' || gameState.bootPhase === 'STABILIZATION' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12 pointer-events-none'} 
          ${activeMemoryId ? 'blur-xl' : ''}`}>
           
           <div className="flex justify-between items-end mb-2 max-w-lg relative">
             <h3 className="text-[10px] tracking-[0.4em] text-emerald-900 font-bold uppercase">[ SUBJECT_REHYDRATION ]</h3>
             <span className={`text-[8px] tracking-widest font-mono transition-colors duration-300 ${isRewardPausing ? 'text-emerald-400 font-bold animate-pulse' : 'text-emerald-950'}`}>
              DISPOSITION: {getDisposition()}
             </span>
             
             {recentRewards && (
               <div className="absolute -top-16 right-0 flex flex-col items-end gap-2 animate-in slide-in-from-bottom-4 fade-in duration-500 z-[110]">
                  <div className="bg-emerald-400 text-black text-[7px] font-bold px-2 py-0.5 tracking-tighter mb-1">REWARD_STREAK</div>
                  {recentRewards.map((r, i) => (
                    <div key={i} className={`text-[11px] font-bold ${r.val.startsWith('+') ? 'text-emerald-400' : 'text-amber-600'} tracking-[0.2em] bg-black px-2 border-r-4 ${r.val.startsWith('+') ? 'border-emerald-400' : 'border-amber-600'} shadow-[0_0_15px_rgba(52,211,153,0.3)]`}>
                      {r.stat} {r.val}
                    </div>
                  ))}
               </div>
             )}
           </div>
           
           <div className="space-y-4 max-w-xl">
              {gameState.pipeline.map((mod, idx) => {
                const isVisible = phaseIndex >= 5 || gameState.bootPhase === 'SELF_EXPLORATION' || gameState.bootPhase === 'STABILIZATION';
                const isHighlighted = isRewardPausing && changedModuleIds.includes(mod.id);
                const segmentsCount = 20;
                const activeSegments = Math.floor((mod.progress / 100) * segmentsCount);
                
                return (
                  <div key={mod.id} className={`group relative ${isVisible ? 'animate-digital-entry' : 'opacity-0'}`} style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="flex justify-between items-end mb-1">
                      <div className="flex flex-col">
                        <span className={`text-[9px] tracking-widest transition-all duration-500 font-bold uppercase ${isHighlighted ? 'text-emerald-200 translate-x-1' : 'text-emerald-700 group-hover:text-emerald-500'}`}>
                          {mod.label}
                        </span>
                        <div className="flex gap-4 text-[7px] text-emerald-900/50 font-bold tracking-tighter uppercase mt-0.5">
                          <span>INTG: {(mod.integrity * 100).toFixed(0)}%</span>
                          <span>DRFT: {(mod.drift * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[8px] font-mono font-bold tracking-widest block transition-colors ${mod.status === 'LOCKED' ? 'text-emerald-400' : 'text-emerald-900'}`}>
                          {mod.status}
                        </span>
                        <span className={`text-[10px] font-bold ${isHighlighted ? 'text-white' : 'text-emerald-600'} transition-colors`}>
                          {mod.progress.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className={`flex gap-[2px] h-3 relative transition-all duration-500 ${isHighlighted ? 'scale-y-125 shadow-[0_0_20px_rgba(52,211,153,0.2)]' : ''}`}>
                      {[...Array(segmentsCount)].map((_, i) => {
                        const isActive = i < activeSegments;
                        return (
                          <div 
                            key={i} 
                            className={`flex-1 transition-all duration-700 relative overflow-hidden
                              ${isActive ? (mod.status === 'LOCKED' ? 'bg-emerald-400' : 'bg-emerald-600/80') : 'bg-emerald-950/20'} 
                              ${isHighlighted && isActive ? 'bg-white shadow-[0_0_15px_white]' : ''}`}
                          >
                            {isActive && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[scan_3s_infinite]" 
                                   style={{ animationDelay: `${i * 0.05}s` }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* --- ECHO TERMINAL (UNLOCKED INPUT) --- */}
              {hasUnlockedInput && (
                <div className="mt-8 pt-4 border-t border-emerald-950/30 animate-digital-entry">
                  <div className="text-[10px] tracking-[0.4em] text-emerald-500 font-bold uppercase mb-2 animate-pulse">
                    [ ECHO_TERMINAL_MOUNTED (BUFFER: {gameState.prologueMessages.length}/10) ]
                  </div>
                  {isPrologueInputLocked ? (
                    <div className="bg-emerald-950/10 p-4 border border-emerald-500/20 text-[9px] text-emerald-600 font-mono">
                      <div className="text-emerald-400 font-bold mb-1">BUFFER_STATE: LOCKED</div>
                      <div className="opacity-50">Content has been serialized for next session loop.</div>
                    </div>
                  ) : (
                    <form 
                      onSubmit={handleFormSubmit} 
                      className="relative group"
                      onMouseEnter={() => setIsInputHovered(true)}
                      onMouseLeave={() => setIsInputHovered(false)}
                    >
                      <textarea
                        value={prologueInput}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                           if(e.key === 'Enter' && !e.shiftKey) {
                             e.preventDefault();
                             handleFormSubmit(e);
                           }
                           e.stopPropagation();
                        }}
                        className={`w-full border p-3 text-[10px] text-emerald-300 font-mono tracking-widest uppercase focus:outline-none focus:border-emerald-500 focus:bg-emerald-950/20 transition-all resize-none h-20 placeholder:text-emerald-900/40 
                          ${isInputHovered ? 'bg-emerald-950/15 border-emerald-700/60 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-black/60 border-emerald-900/40'}`}
                        placeholder="WRITE_TO_LOG..."
                        autoFocus
                      />
                      <div className={`absolute bottom-2 right-2 flex items-center gap-2 pointer-events-none transition-opacity duration-300 ${isInputHovered ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-100'}`}>
                        <span className="text-[8px] text-emerald-600">PRESS_ENTER_TO_LOCK</span>
                        <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
                      </div>
                    </form>
                  )}
                </div>
              )}
           </div>
        </div>

        {/* Right Side Info */}
        <div className={`w-[450px] font-mono flex flex-col justify-between items-end transition-all duration-300 pointer-events-auto ${activeMemoryId ? 'blur-2xl opacity-20' : ''}`}>
          
          <div className="text-right space-y-6 w-full flex flex-col items-end">
            <div className={`transition-all duration-700 ${stutter ? 'opacity-30 scale-95' : 'opacity-100'} animate-digital-entry`}>
               <div className="text-[10px] tracking-[1.2em] uppercase mb-2 text-emerald-900 font-bold whitespace-nowrap">
                 {isStabilizing ? '[ NEURAL_INSTABILITY ]' : 'Soma_Persistence'}
               </div>
               <div className="text-3xl tracking-[0.2em] uppercase font-bold text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)] whitespace-nowrap">
                [ <GlitchText text={gameState.bootPhase.replace('_', ' ')} /> ]
               </div>
            </div>

            <div className={`h-[45vh] overflow-hidden relative w-full flex flex-col justify-end gap-1 transition-all duration-1000 
              ${phaseIndex >= 3 || gameState.bootPhase === 'SELF_EXPLORATION' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <div className={`space-y-1 transition-all duration-100 ${stutter ? 'translate-x-2' : ''}`}>
                {gameState.history.slice(-12).map((msg) => (
                  <div key={msg.id} 
                    className={`text-[9px] uppercase tracking-[0.15em] font-bold transition-all
                      ${msg.kind === 'sys' ? 'text-emerald-800' : 
                        msg.kind === 'warn' ? 'text-amber-700 animate-pulse bg-amber-950/10 px-1' : 
                        msg.kind === 'ack' ? 'text-emerald-400 bg-emerald-950/10 px-1 border-l-2 border-emerald-400' : 
                        msg.kind === 'meta' ? 'text-cyan-400 bg-cyan-950/10 px-1' :
                        msg.kind === 'err' ? 'text-red-500 font-bold' :
                        msg.kind === 'action' ? 'text-white bg-emerald-950/40 px-2 py-0.5 border-l border-emerald-500' :
                        msg.kind === 'banner' ? 'text-red-500 font-bold animate-pulse' :
                        msg.kind === 'echo' ? 'text-orange-500 font-bold tracking-widest drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]' :
                        'text-emerald-900 opacity-40'}`}
                  >
                    <TypewriterText 
                      text={msg.text.split('\n')[0]} 
                      speed={15} 
                      soundId={msg.sender === SenderType.SYSTEM ? "log_key" : "ui_key"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`w-full flex flex-col items-end gap-4 border-t border-emerald-950/30 pt-6 transition-all duration-1000 
            ${phaseIndex >= 2 || gameState.bootPhase === 'SELF_EXPLORATION' ? 'opacity-100 translate-y-0 animate-digital-entry' : 'opacity-0 translate-y-12'}`}>
             <div className="flex flex-col items-end gap-1">
                <div className="text-[10px] tracking-widest text-emerald-900 font-bold uppercase">Chron_Offset</div>
                <div className="text-2xl font-bold text-emerald-600 tracking-tighter">
                  {gameState.world.yearsElapsed.toFixed(2)}Y / 15.00Y
                </div>
             </div>
             
             <div className="flex flex-col items-end gap-1">
                <div className="text-[10px] tracking-widest text-emerald-900 font-bold uppercase">Alignment_Sync</div>
                <div className="text-2xl font-bold text-emerald-600 tracking-tighter">
                  {gameState.world.progress.toFixed(0)}%
                </div>
             </div>

             {!isSelfExploration && (
               <div className="flex items-center gap-4 text-[9px] font-bold text-emerald-900 tracking-widest uppercase">
                 <span className={isStabilizing ? 'text-emerald-400 animate-pulse' : 'text-emerald-600'}>
                   {isStabilizing ? 'FINALIZING' : 'BUFFERING'}
                 </span>
                 <div className="w-32 h-1 bg-emerald-950/20 overflow-hidden relative">
                   <div 
                     className={`h-full transition-all duration-300 ${isStabilizing ? 'bg-emerald-400' : 'bg-emerald-500'}`} 
                     style={{ width: `${gameState.world.progress}%` }}
                   />
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </>
  );
};
