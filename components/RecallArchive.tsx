import React, { useState } from 'react';
import { Memory } from '../types';
import { GlitchText } from './GlitchText';
import { TypewriterText } from './TypewriterText';

interface Props {
  memories: Memory[];
  recoveredIds: string[];
  onSelectMemory?: (id: string) => void;
}

const RecallArchive: React.FC<Props> = ({ memories, recoveredIds, onSelectMemory }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const visitedMemories = memories.filter(m => recoveredIds.includes(m.id));
  const selectedMemory = visitedMemories.find(m => m.id === selectedId);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelectMemory?.(id);
  };

  return (
    <div className="flex h-full bg-[#050506]/90 font-mono relative z-10">
      {/* Sidebar */}
      <div className="w-80 border-r border-emerald-950/30 flex flex-col bg-black/40">
        <div className="p-6 border-b border-emerald-950/20">
          <h2 className="text-[10px] font-bold text-emerald-700 tracking-[0.4em] uppercase mb-1">Archive_Recall</h2>
          <div className="text-[8px] text-emerald-900 font-bold uppercase">{visitedMemories.length} / {memories.length} Fragments Recovered</div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {visitedMemories.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-[9px] text-emerald-900 font-bold uppercase italic opacity-40">Archive Empty</div>
            </div>
          ) : (
            visitedMemories.map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelect(m.id)}
                data-sound="memory_select"
                className={`w-full text-left p-4 border-b border-emerald-950/10 transition-all hover:bg-emerald-500/5 group
                  ${selectedId === m.id ? 'bg-emerald-500/10 border-l-2 border-l-emerald-400' : ''}`}
              >
                <div className={`text-[10px] font-bold tracking-tight uppercase transition-colors
                  ${selectedId === m.id ? 'text-emerald-400' : 'text-emerald-800 group-hover:text-emerald-600'}`}>
                  {m.title.split(' / ')[0]}
                </div>
                <div className="text-[8px] text-emerald-900 mt-1 opacity-60">ID: {m.id}</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-12 overflow-y-auto relative bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent_40%)]">
        {selectedMemory ? (
          <div className="max-w-xl animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="mb-10">
              <div className="text-[9px] text-emerald-900 font-bold uppercase tracking-[0.5em] mb-3">Recovered_Data // {selectedMemory.id}</div>
              <h1 className="text-2xl font-bold text-emerald-400 uppercase tracking-widest leading-tight">
                <GlitchText text={selectedMemory.title} />
              </h1>
            </div>
            
            <p className="text-emerald-100 text-sm leading-relaxed uppercase tracking-wider mb-12 whitespace-pre-wrap">
              <TypewriterText text={selectedMemory.content} animate={false} />
            </p>
            
            <div className="grid grid-cols-2 gap-8 border-t border-emerald-950/20 pt-8">
              <div>
                <div className="text-[8px] text-emerald-900 font-bold uppercase tracking-widest mb-2">Sync_Impact</div>
                <div className="text-[10px] text-emerald-600 font-bold">TEMPORAL_JUMP: +{selectedMemory.yearJump}Y</div>
              </div>
              <div>
                <div className="text-[8px] text-emerald-900 font-bold uppercase tracking-widest mb-2">Behavior_Model</div>
                <div className="text-[10px] text-emerald-600 font-bold">TYPE: {selectedMemory.behavior}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <div className="w-12 h-12 border border-emerald-900 rounded-full mb-4 animate-pulse" />
            <div className="text-[9px] text-emerald-900 font-bold tracking-[0.6em] uppercase">Select_Fragment</div>
          </div>
        )}
        
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
      </div>
    </div>
  );
};

export default RecallArchive;
