
import React, { useEffect, useRef, useState, memo } from 'react';
import { WorldState, FinderState, GameState, Biometrics } from '../types';
import { GlitchText } from './GlitchText';
import { NarrativeSystem } from '../engine/NarrativeSystem';

interface Props {
  world: WorldState;
  finder: FinderState;
  biometrics: Biometrics;
  mentalPhase: GameState['mentalPhase'];
}

const Metric: React.FC<{ label: string; value: string | number; color: string; flash: boolean; glitch?: boolean }> = ({ label, value, color, flash, glitch }) => {
  return (
    <div className={`flex justify-between items-baseline py-1 transition-all duration-700 ${flash ? 'bg-emerald-500/10 scale-[1.01] px-1' : ''}`}>
      <span className={`text-[9px] font-bold transition-colors duration-300 ${flash ? 'text-emerald-400' : 'text-emerald-950'}`}>{label}</span>
      <span className={`${color} text-[10px] transition-all duration-300 ${flash ? 'scale-110' : ''}`}>
        {glitch ? <GlitchText text={String(value)} /> : value}
      </span>
    </div>
  );
};

const PsychometricBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  const segments = 12;
  const active = Math.floor(value * segments);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-[8px] font-bold text-emerald-900 uppercase tracking-[0.3em]">
        <span>{label}</span>
        <span className="opacity-50">{(value * 100).toFixed(0)}</span>
      </div>
      <div className="flex gap-[1.5px] h-1 w-full bg-emerald-950/10">
        {[...Array(segments)].map((_, i) => (
          <div key={i} className={`flex-1 ${i < active ? color : 'bg-transparent'}`} />
        ))}
      </div>
    </div>
  );
};

const HardwareMonitor: React.FC<Props> = ({ world, finder, biometrics, mentalPhase }) => {
  const [flashes, setFlashes] = useState<Record<string, boolean>>({});
  const prevMetrics = useRef({
    coh: biometrics.coherence,
    drift: biometrics.drift,
    integrity: world.integrity,
    consensus: biometrics.consensus
  });

  useEffect(() => {
    const newFlashes: Record<string, boolean> = {};
    if (biometrics.coherence !== prevMetrics.current.coh) newFlashes.coh = true;
    if (biometrics.drift !== prevMetrics.current.drift) newFlashes.drift = true;
    if (world.integrity !== prevMetrics.current.integrity) newFlashes.integrity = true;
    if (biometrics.consensus !== prevMetrics.current.consensus) newFlashes.consensus = true;

    if (Object.keys(newFlashes).length > 0) {
      setFlashes(newFlashes);
      const timer = setTimeout(() => setFlashes({}), 1000);
      prevMetrics.current = { 
        coh: biometrics.coherence, 
        drift: biometrics.drift, 
        integrity: world.integrity,
        consensus: biometrics.consensus
      };
      return () => clearTimeout(timer);
    }
  }, [biometrics.coherence, biometrics.drift, world.integrity, biometrics.consensus]);

  const getMetricColor = (val: number, inverse = false) => {
    if (inverse) {
      if (val < 0.3) return "text-emerald-800";
      if (val < 0.7) return "text-amber-800";
      return "text-red-700 animate-pulse font-bold";
    }
    if (val > 0.8 || val > 80) return "text-emerald-700";
    if (val > 0.4 || val > 40) return "text-amber-800";
    return "text-red-700 animate-pulse font-bold";
  };

  const isVisible = NarrativeSystem.canSeeExternal({ world, finder, biometrics } as GameState);

  return (
    <div className="flex flex-col gap-10 p-10 h-full overflow-y-auto font-mono custom-scrollbar bg-black/40">
      <section className="space-y-6">
        <h2 className="text-[10px] font-bold text-emerald-800 tracking-[0.4em] uppercase border-b border-emerald-950/20 pb-3">Neural_State</h2>
        <div className="space-y-3">
          <Metric 
            label="COHERENCE" 
            value={`${(biometrics.coherence * 100).toFixed(0)}%`} 
            color={getMetricColor(biometrics.coherence)} 
            flash={!!flashes.coh}
            glitch={biometrics.coherence < 0.3}
          />
          <Metric 
            label="DRIFT" 
            value={`${(biometrics.drift * 100).toFixed(0)}%`} 
            color={getMetricColor(biometrics.drift, true)} 
            flash={!!flashes.drift}
            glitch={biometrics.drift > 0.7}
          />
          <Metric 
            label="CONSENSUS" 
            value={`${(biometrics.consensus * 100).toFixed(0)}%`} 
            color={getMetricColor(biometrics.consensus)} 
            flash={!!flashes.consensus}
            glitch={biometrics.consensus < 0.2}
          />
          <Metric 
            label="INTEGRITY" 
            value={`${world.integrity.toFixed(0)}%`} 
            color="text-emerald-700 font-bold" 
            flash={!!flashes.integrity}
            glitch={world.integrity < 30}
          />
        </div>
      </section>

      {finder.pendingAction && (
        <section className="p-4 border border-amber-500/40 bg-amber-500/5 animate-pulse">
          <h2 className="text-[9px] font-bold text-amber-500 tracking-[0.3em] uppercase mb-2">AWAITING_CONSENT</h2>
          <div className="text-[10px] text-amber-100 font-mono">
             ACTION: {finder.pendingAction.type}<br/>
             TARGET: {finder.pendingAction.target || 'N/A'}<br/>
             RATIONALE: {finder.pendingAction.rationale}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <h2 className="text-[10px] font-bold text-cyan-800 tracking-[0.4em] uppercase border-b border-cyan-950/20 pb-3">Observability_Specs</h2>
        <div className="space-y-3">
           <div className="flex justify-between items-center text-[9px] font-bold">
              <span className="text-emerald-950">OPTICS_LINK</span>
              <span className={world.isRemoteViewActive ? 'text-emerald-400' : 'text-red-900'}>{world.isRemoteViewActive ? '[ ACTIVE ]' : '[ OFFLINE ]'}</span>
           </div>
           <div className="flex justify-between items-center text-[9px] font-bold">
              <span className="text-emerald-950">LUMINANCE</span>
              <span className={world.power > 20 || world.flags['LAB_LIGHTS_ON'] || world.flags['FLASHLIGHT_ON'] ? 'text-emerald-400' : 'text-red-900'}>
                {world.flags['LAB_LIGHTS_ON'] ? 'NOMINAL' : (world.flags['FLASHLIGHT_ON'] ? 'POINT_SOURCE' : 'CRITICAL_LOW')}
              </span>
           </div>
           <div className={`mt-4 p-2 text-[8px] border text-center font-bold tracking-[0.2em] transition-colors duration-500
             ${isVisible ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5' : 'border-red-900/40 text-red-900 bg-red-950/5'}`}>
             {isVisible ? 'VISUAL_TELEMETRY_STREAMING' : 'VISUAL_BUFFER_BLIND'}
           </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-[10px] font-bold text-cyan-800 tracking-[0.4em] uppercase border-b border-cyan-950/20 pb-3">Finder_Affect</h2>
        <div className="space-y-5">
          <PsychometricBar label="ALEX_TRUST" value={finder.disposition.trust} color="bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.2)]" />
          <PsychometricBar label="ALEX_FEAR" value={finder.disposition.fear} color="bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.2)]" />
          <PsychometricBar label="ALEX_COOP" value={finder.disposition.compliance} color="bg-cyan-500/80 shadow-[0_0_10px_rgba(34,211,238,0.2)]" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-[10px] font-bold text-emerald-900 tracking-[0.4em] uppercase border-b border-emerald-950/10 pb-2">Status_Tags</h2>
        <div className="flex flex-wrap gap-2">
          {finder.statusTags.map(tag => (
            <span key={tag} className={`px-2 py-0.5 text-[8px] font-bold border ${
              tag === 'SHIVERING' ? 'text-blue-400 border-blue-900/40 bg-blue-950/10 animate-pulse' :
              tag === 'EXHAUSTED' ? 'text-amber-600 border-amber-900/40 bg-amber-950/10' :
              tag === 'INJURED' ? 'text-red-500 border-red-900/40 bg-red-950/10' :
              'text-emerald-600 border-emerald-900/40'
            }`}>
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-4 flex-1">
        <h2 className="text-[10px] font-bold text-emerald-950 tracking-[0.4em] uppercase border-b border-emerald-950/10 pb-2">Audit_Log</h2>
        <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar opacity-60">
          {finder.diagnosticLog.map((log, i) => (
            <div key={i} className="border-l border-emerald-950/30 pl-3 py-0.5">
              <div className="text-emerald-100 text-[10px] uppercase leading-relaxed tracking-tight">
                {log.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="pt-8 border-t border-emerald-950/10 text-[8px] text-emerald-950/50 uppercase tracking-widest leading-loose font-bold">
        CORE_LOAD: {biometrics.cognitiveLoad.toFixed(1)}%
        <br/>
        SYNC_LAG: {(1 - world.propriocepSync).toFixed(3)}ms
        <br/>
        ORO_DAEMON: v0.7.2-STABLE
      </footer>
    </div>
  );
};

export default memo(HardwareMonitor);
