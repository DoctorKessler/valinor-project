
import React, { useEffect, useRef } from 'react';
import { TerminalMessage, SenderType } from '../../types';
import { TypewriterText } from '../TypewriterText';
import { GlitchText } from '../GlitchText';

interface Props {
  messages: TerminalMessage[];
  title: string;
  side: 'left' | 'right';
  variant: 'bio' | 'sys';
}

export const CornerFeed: React.FC<Props> = ({ messages, title, side, variant }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const getLineColor = (msg: TerminalMessage) => {
    if (variant === 'bio') return 'text-cyan-400/80';
    switch (msg.kind) {
      case 'warn': return 'text-amber-500/70';
      case 'err': return 'text-red-500 animate-pulse';
      case 'action': return 'text-emerald-400';
      default: return 'text-emerald-900/60';
    }
  };

  const rotation = side === 'left' ? 'rotateY(10deg) rotateX(5deg)' : 'rotateY(-10deg) rotateX(5deg)';

  return (
    <div 
      className={`w-80 h-64 flex flex-col bg-black/40 border border-emerald-950/20 backdrop-blur-md pointer-events-auto p-4 transition-all duration-1000 animate-in fade-in slide-in-from-bottom-8`}
      style={{ 
        transform: `perspective(1000px) ${rotation}`,
        boxShadow: `0 0 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(16,185,129,0.05)`
      }}
    >
      <header className="flex justify-between items-center border-b border-emerald-950/30 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${variant === 'bio' ? 'bg-cyan-500' : 'bg-emerald-500'}`} />
          <h3 className={`text-[9px] font-bold tracking-[0.3em] uppercase ${variant === 'bio' ? 'text-cyan-800' : 'text-emerald-800'}`}>
            {title}
          </h3>
        </div>
        <div className="text-[7px] text-emerald-950 font-bold">STREAM_ID: {variant.toUpperCase()}</div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
        {messages.slice(-20).map((msg) => (
          <div key={msg.id} className="animate-in fade-in duration-500">
            <div className={`text-[9px] leading-relaxed font-mono uppercase tracking-tight ${getLineColor(msg)}`}>
              <span className="opacity-20 mr-2">[{new Date(msg.timestamp).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}]</span>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="mt-2 pt-2 border-t border-emerald-950/10 flex justify-between">
        <div className="h-1 flex-1 bg-emerald-950/10 overflow-hidden">
          <div className={`h-full animate-[scan_4s_infinite] ${variant === 'bio' ? 'bg-cyan-500/20' : 'bg-emerald-500/20'}`} style={{width: '30%'}} />
        </div>
      </div>
      
      {/* Visual Scanline Overlay for the small monitor */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_2px] opacity-20" />
    </div>
  );
};
