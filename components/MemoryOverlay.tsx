import React, { useState, useEffect } from 'react';
import { Memory } from '../types';
import { TypewriterText } from './TypewriterText';
import { GlitchText } from './GlitchText';

interface Props {
  memory: Memory;
  onClose: () => void;
}

const MemoryOverlay: React.FC<Props> = ({ memory, onClose }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 40;
    const y = (clientY / window.innerHeight - 0.5) * 40;
    setOffset({ x, y });
  };

  const blurPx = Math.max(0, 15 - (memory.yearJump * 6)); 
  const opacityVal = Math.min(0.7, 0.2 + (memory.yearJump * 0.3));

  return (
    <div 
      className="fixed inset-0 z-[5000000] flex items-center justify-center bg-black/95 animate-in fade-in zoom-in duration-1000 cursor-none"
      onMouseMove={handleMouseMove}
      onClick={onClose}
    >
      {/* Background Neural Noise */}
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)] animate-pulse" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
        
        {/* Floating blurred shards */}
        <div 
          className="absolute inset-0 transition-transform duration-700 ease-out flex items-center justify-center"
          style={{ transform: `translate(${offset.x * -0.3}px, ${offset.y * -0.3}px)` }}
        >
          <div className="w-[80vw] h-[80vh] border border-emerald-500/10 rounded-full blur-3xl bg-emerald-500/5 animate-pulse" />
        </div>
      </div>

      <div 
        className="max-w-5xl w-full p-24 relative flex flex-col items-center text-center transition-transform duration-300 pointer-events-auto"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-16">
          <div className="text-[10px] tracking-[1em] text-emerald-900 uppercase font-bold mb-6 opacity-40">SOMA_RESIDUE // {memory.id}</div>
          <h1 className="text-5xl tracking-[0.5em] text-white font-bold uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            <GlitchText text={memory.title} />
          </h1>
        </header>

        <div className="text-emerald-100/80 font-mono text-xl leading-[2] mb-20 tracking-[0.15em] uppercase max-h-[40vh] overflow-y-auto custom-scrollbar px-12 italic">
          <TypewriterText text={memory.content} speed={20} />
        </div>

        <footer className="flex flex-col items-center gap-12">
          <div className="text-[12px] text-emerald-900 uppercase tracking-[0.8em] font-bold opacity-30">
            TIME_SHIFT: +{memory.yearJump}Y / SYNC_ANCHOR: {memory.behavior}
          </div>
          <button 
            onClick={onClose}
            data-sound="memory_close"
            className="px-16 py-5 border border-emerald-500/10 bg-black/50 text-emerald-500 text-[11px] uppercase font-bold tracking-[0.8em] hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer shadow-[0_0_50px_rgba(16,185,129,0.1)] group pointer-events-auto"
          >
            [ <span className="group-hover:tracking-[1.2em] transition-all">DISCHARGE</span> ]
          </button>
        </footer>
      </div>

      {/* Screen edge artifacts */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent blur-sm" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent blur-sm" />
    </div>
  );
};

export default MemoryOverlay;
