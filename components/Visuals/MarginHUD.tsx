
import React, { memo } from 'react';
import { MarginObs } from '../../types';
import { GlitchText } from '../GlitchText';

interface Props {
  observations: MarginObs[];
}

const MarginHUD: React.FC<Props> = ({ observations }) => {
  if (observations.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden select-none">
      <div className="absolute left-8 top-1/4 bottom-1/4 w-48 flex flex-col justify-center gap-6">
        {observations.map((obs, idx) => (
          <div 
            key={obs.id} 
            className="animate-in slide-in-from-left duration-700 fade-in flex items-center gap-4 group"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="h-[1px] w-4 bg-emerald-500/40 group-hover:w-8 transition-all" />
            <div className="flex flex-col">
              <span className="text-[8px] text-emerald-900 font-bold tracking-[0.3em] uppercase mb-1">
                BIO_SCAN_{obs.id.split('_').pop()?.slice(0, 4)}
              </span>
              <div className="text-[10px] text-emerald-400 font-bold tracking-widest whitespace-nowrap bg-emerald-950/20 px-2 py-1 border-l-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <GlitchText text={obs.text} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute right-8 top-1/4 bottom-1/4 w-48 flex flex-col justify-center gap-8 items-end">
        {observations.slice().reverse().map((obs, idx) => (
          <div 
            key={`${obs.id}-mirror`} 
            className="animate-in slide-in-from-right duration-700 fade-in flex flex-col items-end opacity-40 hover:opacity-100 transition-opacity"
            style={{ animationDelay: `${idx * 0.15}s` }}
          >
            <div className="text-[7px] text-emerald-950 font-bold tracking-[0.5em] mb-1">TELEMETRY_STREAM</div>
            <div className="text-[9px] text-emerald-500/60 font-mono tracking-tighter border-r border-emerald-500/30 pr-3 text-right">
              {obs.text.split(' ')[0]} // {((Date.now() - obs.ts) / 1000).toFixed(1)}S_AGO
            </div>
          </div>
        ))}
      </div>
      
      {/* Decorative HUD corners */}
      <div className="absolute top-12 left-12 w-32 h-32 border-t border-l border-emerald-900/20 pointer-events-none" />
      <div className="absolute top-12 right-12 w-32 h-32 border-t border-r border-emerald-900/20 pointer-events-none" />
      <div className="absolute bottom-12 left-12 w-32 h-32 border-b border-l border-emerald-900/20 pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-32 h-32 border-b border-r border-emerald-900/20 pointer-events-none" />
    </div>
  );
};

export default memo(MarginHUD);
