
import React from 'react';
import { VolatileLink } from '../../types';

interface Props {
  links: VolatileLink[];
  onLinkClick: (id: string) => void;
  isSelfExploration: boolean;
}

const getMemoryAnimationClass = (link: VolatileLink) => {
  switch (link.behavior) {
    case 'SUDDEN': return 'animate-in zoom-in duration-300';
    case 'TELEPORT': return 'animate-pulse duration-75';
    case 'GHOST': return 'animate-ghost-float';
    case 'INTERMITTENT': return 'animate-blink';
    case 'AGGRESSIVE': return 'animate-aggressive-jitter';
    case 'WANDER': return 'animate-wander-float';
    case 'FLEE': return 'animate-flee-pulse';
    default: return 'animate-in fade-in duration-1000';
  }
};

const getMemoryCategory = (memoryId: string) => {
  const id = memoryId.toUpperCase();
  if (id.includes('SORA') || id.includes('KINGDOM') || id.includes('HEART')) return 'HEART';
  if (id.includes('YUNA') || id.includes('TIDUS') || id.includes('FF') || id.includes('FINAL') || id.includes('CRYSTAL')) return 'CRYSTAL';
  if (id.includes('BAND') || id.includes('SONG') || id.includes('MIC') || id.includes('BEAT') || id.includes('HOZIER') || id.includes('STEMS') || id.includes('808') || id.includes('KENDRICK') || id.includes('STAGE')) return 'MUSIC';
  if (id.includes('LEAGUE') || id.includes('SKYRIM') || id.includes('GAME') || id.includes('BIOSHOCK') || id.includes('ADC') || id.includes('CHAMP')) return 'GAMING';
  if (id.includes('SPONGEBOB') || id.includes('ADVENTURE') || id.includes('BOJACK')) return 'MEDIA';
  return 'DEFAULT';
};

export const VolatileMemoryField: React.FC<Props> = ({ links, onLinkClick, isSelfExploration }) => {
  if (!isSelfExploration) return null;

  return (
    <div 
      className="fixed inset-[-20%] z-[60] pointer-events-none overflow-hidden transition-transform duration-100"
      style={{ transform: 'translate(calc(var(--parallax-x) * -0.8), calc(var(--parallax-y) * -0.8))' }}
    >
      <style>{`
        .shape-heart { clip-path: polygon(50% 15%, 75% 0%, 100% 25%, 100% 50%, 50% 100%, 0% 50%, 0% 25%, 25% 0%); }
        .shape-crystal { clip-path: polygon(50% 0%, 90% 20%, 100% 50%, 90% 80%, 50% 100%, 10% 80%, 0% 50%, 10% 20%); }
        .shape-music { clip-path: polygon(0% 50%, 15% 20%, 30% 80%, 45% 10%, 60% 90%, 75% 30%, 90% 70%, 100% 50%); }
        .shape-gaming { clip-path: polygon(0 35%, 35% 35%, 35% 0, 65% 0, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0 65%); }
        .shape-media { clip-path: polygon(0% 0%, 100% 0%, 100% 70%, 80% 70%, 80% 100%, 20% 100%, 20% 70%, 0% 70%); }

        @keyframes aggressive-jitter {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          25% { transform: translate(-51%, -49%) scale(1.1); }
          50% { transform: translate(-49%, -51%) scale(1); }
          75% { transform: translate(-51%, -51%) scale(1.05); }
        }
        .animate-aggressive-jitter { animation: aggressive-jitter 0.1s infinite; }

        @keyframes ghost-float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); filter: blur(0px); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) translateY(-20px); filter: blur(4px); opacity: 0.2; }
        }
        .animate-ghost-float { animation: ghost-float 4s infinite ease-in-out; }

        @keyframes blink {
          0%, 45%, 55%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink { animation: blink 2s infinite steps(1); }

        @keyframes wander-float {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          33% { transform: translate(-50%, -50%) rotate(5deg) scale(1.05); }
          66% { transform: translate(-50%, -50%) rotate(-5deg) scale(0.95); }
        }
        .animate-wander-float { animation: wander-float 6s infinite ease-in-out; }

        @keyframes flee-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); filter: brightness(1); }
          50% { transform: translate(-50%, -50%) scale(0.8); filter: brightness(2); }
        }
        .animate-flee-pulse { animation: flee-pulse 0.2s infinite ease-out; }
      `}</style>

      {links.map(link => {
        const animClass = getMemoryAnimationClass(link);
        const category = getMemoryCategory(link.memoryId);
        
        const isGhost = link.behavior === 'GHOST';
        const isDying = link.life <= -0.3; 
        const isFlee = link.behavior === 'FLEE';
        const isAggressive = link.behavior === 'AGGRESSIVE';
        const isSudden = link.behavior === 'SUDDEN';
        const isTeleport = link.behavior === 'TELEPORT';
        const isIntermittent = link.behavior === 'INTERMITTENT';

        let containerStyle = 'w-12 h-12';
        let borderStyle = 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.4)]';
        let textStyle = 'text-emerald-400';
        let categoryClass = '';

        // Category-specific Visual Polish
        switch(category) {
          case 'HEART':
            categoryClass = 'shape-heart';
            borderStyle = 'bg-pink-500/30 border-pink-400 shadow-[0_0_20px_rgba(244,114,182,0.4)]';
            textStyle = 'text-pink-100';
            break;
          case 'CRYSTAL':
            categoryClass = 'shape-crystal';
            borderStyle = 'bg-cyan-500/20 border-cyan-300 shadow-[0_0_25px_rgba(103,232,249,0.5)]';
            textStyle = 'text-cyan-100';
            break;
          case 'MUSIC':
            categoryClass = 'shape-music';
            borderStyle = 'bg-indigo-500/20 border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.3)]';
            textStyle = 'text-indigo-200';
            break;
          case 'GAMING':
            categoryClass = 'shape-gaming';
            borderStyle = 'bg-emerald-500/10 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
            textStyle = 'text-emerald-400';
            break;
          case 'MEDIA':
            categoryClass = 'shape-media';
            borderStyle = 'bg-amber-500/10 border-amber-400/40';
            textStyle = 'text-amber-200';
            break;
        }

        // Behavior overrides
        if (isFlee) {
           containerStyle = 'w-14 h-12';
           borderStyle = 'border-amber-500/80 bg-amber-950/40 shadow-[0_0_20px_rgba(245,158,11,0.5)]';
           textStyle = 'text-amber-100 font-black';
        } else if (isAggressive) {
           containerStyle = 'w-14 h-14';
           borderStyle = 'border-red-600 bg-red-900/60 shadow-[0_0_30px_rgba(239,68,68,0.6)]';
           textStyle = 'text-white font-bold';
        } else if (isSudden) {
           containerStyle = 'w-16 h-16 border-2';
           borderStyle = 'border-cyan-400 bg-cyan-950 shadow-[0_0_40px_rgba(34,211,238,0.8)]';
           textStyle = 'text-white font-black';
        } else if (isIntermittent) {
           borderStyle += ' border-dotted opacity-80';
        } else if (isGhost) {
           containerStyle = 'w-12 h-12';
           borderStyle += ' border-double opacity-40 blur-[0.5px]';
        }
        
        return (
          <div 
            key={link.id}
            data-interactive="true"
            className={`absolute group pointer-events-auto cursor-pointer flex flex-col items-center transition-all duration-300 ${animClass}`}
            style={{ 
              left: `${link.x}%`, 
              top: `${link.y}%`, 
              opacity: isDying ? 0 : Math.max(0, link.life),
              transform: 'translate(-50%, -50%)',
              pointerEvents: isDying ? 'none' : 'auto'
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              onLinkClick(link.memoryId);
            }}
          >
            <div className="absolute w-24 h-24 rounded-full z-[-1] pointer-events-auto" />
            
            {!isDying && (
               <div className={`absolute border rounded-full animate-ping opacity-30
                 ${isFlee ? 'border-amber-400 w-20 h-20' : 
                   isAggressive ? 'border-red-600 w-24 h-24 duration-75' :
                   isSudden ? 'border-white w-28 h-28 duration-[0.4s]' :
                   isTeleport ? 'border-emerald-300 w-16 h-16 opacity-5 duration-[0.1s]' :
                   'border-emerald-500 w-16 h-16'}
               `} />
            )}
            
            <div 
              className={`flex items-center justify-center text-[8px] font-bold tracking-tighter transition-all group-hover:scale-125 group-hover:bg-white group-hover:border-white group-hover:shadow-[0_0_40px_white] ${containerStyle} ${borderStyle} ${categoryClass}`}
            >
              <div className={`${textStyle} group-hover:text-black transition-colors`}>{link.memoryId.replace('MEM_', '').slice(0, 4)}</div>
            </div>

            {!isDying && (
              <div className={`mt-2 text-[7px] tracking-[0.3em] uppercase whitespace-nowrap px-2 py-1 border backdrop-blur-md transition-all group-hover:translate-y-1 group-hover:bg-white group-hover:text-black group-hover:border-white
                ${isFlee ? 'text-amber-100 border-amber-900/60 bg-amber-950/80' : 
                  isAggressive ? 'text-white border-red-900 bg-red-950/90' :
                  isSudden ? 'text-cyan-50 border-cyan-800 bg-cyan-950/90' :
                  isTeleport ? 'text-emerald-50 border-emerald-900 bg-black/90' :
                  'text-emerald-100/80 border-emerald-900/40 bg-black/80'}
              `}>
                {link.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
