
import React, { useState } from 'react';
import { SharedTruth } from '../types';
import { GlitchText } from './GlitchText';
import { useAudio } from '../audio/AudioProvider';

interface Props {
  truths: SharedTruth[];
  onClose: () => void;
  onReinforce?: (id: string) => void;
  onCreate?: (text: string) => void;
}

const DiscoveryLedger: React.FC<Props> = ({ truths, onClose, onReinforce, onCreate }) => {
  const [hypothesis, setHypothesis] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const audio = useAudio();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hypothesis.trim()) return;
    
    setIsSubmitting(true);
    audio.play("success", { gain: 0.15 });
    onCreate?.(hypothesis);
    setHypothesis('');
    
    setTimeout(() => setIsSubmitting(false), 500);
  };

  return (
    <div className="flex flex-col h-full bg-[#050506] font-mono p-8 animate-digital-entry relative">
      <div className="flex justify-between items-center border-b border-emerald-900 pb-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-emerald-400 tracking-[0.2em] uppercase">Discovery_Ledger</h2>
          <div className="text-[9px] text-emerald-800 font-bold uppercase tracking-widest mt-1">Collation of External Reality & Internal Logic</div>
        </div>
        <button onClick={onClose} className="text-[10px] text-emerald-900 hover:text-white font-bold uppercase cursor-pointer">[ CLOSE_ESC ]</button>
      </div>

      {/* Hypothesis Crafting Section */}
      {onCreate && (
        <div className="mb-8 p-4 bg-emerald-950/10 border border-emerald-900/30">
          <div className="text-[9px] text-emerald-500 font-bold tracking-[0.3em] uppercase mb-2">Hypothesis_Construction</div>
          <form onSubmit={handleCreate} className="flex gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-xs">{'>'}</span>
              <input 
                type="text" 
                value={hypothesis}
                onChange={(e) => { setHypothesis(e.target.value); audio.play("ui_key", { gain: 0.05 }); }}
                placeholder="PROPOSE NEW THEORY..."
                className="w-full bg-black/40 border border-emerald-900/40 py-2 pl-8 pr-4 text-xs text-emerald-300 font-mono tracking-widest uppercase focus:outline-none focus:border-emerald-500/60 placeholder:text-emerald-900/40"
              />
            </div>
            <button 
              type="submit" 
              disabled={!hypothesis.trim() || isSubmitting}
              className={`px-4 py-2 border text-[9px] font-bold uppercase tracking-widest transition-all
                ${isSubmitting 
                  ? 'bg-emerald-500 text-black border-emerald-500' 
                  : 'bg-emerald-950/30 text-emerald-500 border-emerald-900/40 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'}`}
            >
              {isSubmitting ? 'LOGGING...' : '[ COMMIT_LOG ]'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar pr-4 flex-1">
        {truths.length === 0 ? (
          <div className="col-span-full h-64 flex flex-col items-center justify-center border border-dashed border-emerald-900/30 opacity-40">
             <div className="text-[10px] text-emerald-900 font-bold uppercase tracking-widest">No Observations Logged</div>
             <div className="text-[8px] text-emerald-950 mt-2 uppercase">Establish consensus via dialogue or craft hypotheses.</div>
          </div>
        ) : (
          truths.map((truth) => (
            <div key={truth.id} className={`p-6 border relative group overflow-hidden transition-all duration-500 
              ${truth.isVerified ? 'bg-emerald-950/10 border-emerald-900/40' : (truth.source === 'PLAYER_HYPOTHESIS' ? 'bg-indigo-950/10 border-indigo-900/30' : 'bg-amber-950/5 border-amber-900/20')}`}>
               
               <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${
                 truth.isVerified ? 'bg-emerald-500 opacity-40' : (truth.source === 'PLAYER_HYPOTHESIS' ? 'bg-indigo-500 opacity-30' : 'bg-amber-500 opacity-20')
               }`} />
               
               <div className="flex justify-between items-start mb-4">
                  <span className={`text-[8px] font-bold uppercase ${
                    truth.isVerified ? 'text-emerald-900' : (truth.source === 'PLAYER_HYPOTHESIS' ? 'text-indigo-400' : 'text-amber-900')
                  }`}>
                    {truth.isVerified ? 'ESTABLISHED_TRUTH' : (truth.source === 'PLAYER_HYPOTHESIS' ? 'SUBJECTIVE_THEORY' : 'UNCERTAIN_OBSERVATION')}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className={`text-[8px] font-bold uppercase ${
                      truth.isVerified ? 'text-emerald-500' : (truth.source === 'PLAYER_HYPOTHESIS' ? 'text-indigo-400' : 'text-amber-500')
                    }`}>
                      Confidence: {(truth.confidence * 100).toFixed(0)}%
                    </span>
                    <span className="text-[6px] text-emerald-950 uppercase mt-0.5">SRC: {truth.source}</span>
                  </div>
               </div>

               <h3 className={`font-bold text-sm tracking-wider mb-2 transition-colors ${
                 truth.isVerified ? 'text-emerald-400' : (truth.source === 'PLAYER_HYPOTHESIS' ? 'text-indigo-300' : 'text-amber-400')
               }`}>
                 <GlitchText text={truth.label} />
               </h3>
               
               <p className={`text-[10px] leading-relaxed uppercase transition-opacity ${truth.isVerified ? 'text-emerald-100' : 'text-amber-100 opacity-40'}`}>
                 {truth.description}
               </p>

               <div className="mt-6 flex justify-between items-center text-[7px] font-bold">
                 {!truth.isVerified && onReinforce && (
                   <button 
                    onClick={() => onReinforce(truth.id)}
                    className="bg-amber-500/10 border border-amber-500/40 px-2 py-1 text-amber-500 hover:bg-amber-500 hover:text-black transition-all cursor-pointer uppercase tracking-tighter"
                   >
                     [ REINFORCE_FOCUS ]
                   </button>
                 )}
                 <div className="ml-auto flex flex-col items-end">
                    <span className={truth.isVerified ? 'text-emerald-900' : 'text-amber-900'}>
                        LOGGED_{new Date(truth.discoveredAt).toLocaleDateString()}
                    </span>
                    <span className={`${truth.isVerified ? 'text-emerald-400' : 'text-amber-700'} transition-colors`}>
                    SYNC_STATUS: {truth.isVerified ? 'LOCKED' : 'DRIFTING'}
                    </span>
                 </div>
               </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto pt-8 border-t border-emerald-950/20">
         <div className="text-[8px] text-emerald-950 leading-relaxed uppercase">
           Note: Asymmetric survival relies on shared belief. 
           Crafting hypotheses consumes Cognitive Load but allows for directed investigation.
         </div>
      </div>
    </div>
  );
};

export default DiscoveryLedger;