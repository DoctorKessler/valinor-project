
import React, { useState, useEffect, useRef } from 'react';
import { GlitchText } from './GlitchText';
import { GlitchNoiseCanvas } from './GlitchNoiseCanvas';
import { CREATOR_SEQUENCE, CREATOR_PROMPT, ScriptAction } from '../engine/CreatorEngine';

interface Props {
  onComplete: () => void;
}

class TerminalAudio {
  private ctx: AudioContext | null = null;
  private humOsc: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isArmed: boolean = false;

  init() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.ctx.createGain();
      this.gainNode.connect(this.ctx.destination);
      this.gainNode.gain.value = 0.03; 
    } catch (e) { console.warn("AudioContext failure"); }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => { if (!this.isArmed) { this.startHum(); this.isArmed = true; } });
    } else if (this.ctx && !this.isArmed) {
        this.startHum();
        this.isArmed = true;
    }
  }

  startHum() {
    if (!this.ctx || !this.gainNode) return;
    this.humOsc = this.ctx.createOscillator();
    this.humOsc.type = 'sine';
    this.humOsc.frequency.setValueAtTime(55, this.ctx.currentTime);
    this.humOsc.connect(this.gainNode);
    this.humOsc.start();
  }

  stopHum() {
    if (this.humOsc) { try { this.humOsc.stop(); } catch (e) {} }
  }

  modulateHum(intensity: number) {
    if (!this.humOsc || !this.ctx || !this.gainNode) return;
    this.humOsc.frequency.linearRampToValueAtTime(55 + (intensity * 20), this.ctx.currentTime + 0.5);
    this.gainNode.gain.linearRampToValueAtTime(0.03 + (intensity * 0.02), this.ctx.currentTime + 0.5);
  }

  playKeystroke() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400 + Math.random() * 200, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playEnter() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playPopupChirp() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playClick() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }
  
  playPowerDown() {
    if (!this.ctx || !this.humOsc) return;
    this.humOsc.frequency.exponentialRampToValueAtTime(1, this.ctx.currentTime + 0.4);
    if (this.gainNode) this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.4);
  }
}

const renderMarkupText = (text: string) => {
  const parts = text.split(/(\[\[|\]\])/g);
  let isGlitch = false;
  return parts.map((part, i) => {
    if (part === '[[' || part === ']]') { isGlitch = part === '[['; return null; }
    if (isGlitch) return <GlitchText key={i} text={part} className="text-red-500 font-bold inline-block" />;
    return <span key={i}>{part}</span>;
  });
};

export const CreatorTerminal: React.FC<Props> = ({ onComplete }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [fakeCursor, setFakeCursor] = useState<{x: number, y: number, visible: boolean, clicked: boolean}>({ x: 200, y: 300, visible: false, clicked: false });
  const [cursorBlink, setCursorBlink] = useState(true);
  const [isPoweringDown, setIsPoweringDown] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0.08);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef(''); 
  const audioRef = useRef<TerminalAudio>(new TerminalAudio());
  
  useEffect(() => { inputRef.current = input; }, [input]);
  useEffect(() => { document.documentElement.style.setProperty('--glitch-intensity', String(glitchIntensity)); }, [glitchIntensity]);
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [history, input]);

  useEffect(() => {
    const armAudio = () => { audioRef.current.resume(); window.removeEventListener('click', armAudio); window.removeEventListener('keydown', armAudio); };
    window.addEventListener('click', armAudio); window.addEventListener('keydown', armAudio);
    return () => { window.removeEventListener('click', armAudio); window.removeEventListener('keydown', armAudio); };
  }, []);

  useEffect(() => {
    let scriptIdx = 0; let cancelled = false;
    audioRef.current.init();

    const runScript = async () => {
      while (scriptIdx < CREATOR_SEQUENCE.length && !cancelled) {
        const action = CREATOR_SEQUENCE[scriptIdx];
        if (action.op === 'WAIT') await new Promise(r => setTimeout(r, action.ms));
        else if (action.op === 'SET_GLITCH') { setGlitchIntensity(action.intensity); audioRef.current.modulateHum(action.intensity); }
        else if (action.op === 'TYPE') {
          const chars = action.text.split('');
          for(let i = 0; i < chars.length; i++) {
            if (cancelled) break;
            const char = chars[i];
            if (char === '[' && chars[i+1] === '[') { setInput(prev => prev + '[['); i += 1; continue; }
            if (char === ']' && chars[i+1] === ']') { setInput(prev => prev + ']]'); i += 1; continue; }
            setInput(prev => prev + char);
            audioRef.current.playKeystroke();
            const speed = action.speed || 50;
            const stutter = Math.random() < 0.1 ? speed * 3 : 0;
            await new Promise(r => setTimeout(r, speed + (Math.random() * speed * 0.4) + stutter));
          }
        } else if (action.op === 'DELETE_ALL') {
          const currentLen = inputRef.current.length;
          const baseSpeed = action.speed || 30;
          setGlitchIntensity(prev => Math.min(0.8, prev + 0.15)); 
          for(let i=0; i<currentLen; i++) {
             if (cancelled) break;
             setInput(prev => prev.slice(0, -1));
             audioRef.current.playKeystroke(); 
             await new Promise(r => setTimeout(r, baseSpeed));
          }
          setInput(''); 
          setGlitchIntensity(prev => Math.max(0.05, prev - 0.15));
          if (action.systemAlert) {
             setHistory(prev => [...prev, `[[${action.systemAlert}]]`]);
          }
        } else if (action.op === 'DELETE_CHARS') {
           setGlitchIntensity(prev => Math.min(0.8, prev + 0.05));
           for(let i=0; i<action.count; i++) {
               if (cancelled) break;
               if (inputRef.current.length === 0) break;
               setInput(prev => prev.slice(0, -1));
               audioRef.current.playKeystroke();
               await new Promise(r => setTimeout(r, action.speed || 50));
           }
           setGlitchIntensity(prev => Math.max(0.05, prev - 0.05));
        } else if (action.op === 'EXECUTE') {
           audioRef.current.playEnter();
           setHistory(prev => [...prev, `${CREATOR_PROMPT} ${inputRef.current}`]);
           setInput('');
           if (action.output) {
               await new Promise(r => setTimeout(r, 50));
               for (const line of action.output) { setHistory(prev => [...prev, line]); await new Promise(r => setTimeout(r, 10)); }
           }
        } else if (action.op === 'STREAM_LOG') {
           for (const line of action.lines) {
               if (cancelled) break;
               setHistory(prev => [...prev, line]);
               audioRef.current.modulateHum(0.2); 
               await new Promise(r => setTimeout(r, action.interval || 800));
           }
           audioRef.current.modulateHum(0.08); 
        } else if (action.op === 'TRIGGER_POPUP') { runPopupSequence(); }
        scriptIdx++;
      }
    };
    runScript();
    const blinkInterval = setInterval(() => setCursorBlink(b => !b), 500);
    return () => { cancelled = true; clearInterval(blinkInterval); audioRef.current.stopHum(); };
  }, []); 

  const runPopupSequence = async () => {
      audioRef.current.playPopupChirp();
      setShowPopup(true);
      setGlitchIntensity(0.02);
      await new Promise(r => setTimeout(r, 500));
      const startX = window.innerWidth * 0.2; const startY = window.innerHeight * 0.8;
      setFakeCursor({ x: startX, y: startY, visible: true, clicked: false });
      const targetX = window.innerWidth / 2 - 60; const targetY = window.innerHeight / 2 + 40;
      const targetNoX = targetX + 100;
      await new Promise(r => setTimeout(r, 200));
      const duration = 1600; const startTime = Date.now();
      const animateCursor = () => {
          const now = Date.now(); const p = Math.min(1, (now - startTime) / duration);
          let curX, curY;
          if (p < 0.7) { const ease = 1 - Math.pow(1 - p, 3); curX = startX + (targetX - startX) * ease; curY = startY + (targetY - startY) * ease; }
          else if (p < 0.85) { const subP = (p - 0.7) / 0.15; curX = targetX + (targetNoX - targetX) * subP; curY = targetY + (Math.random() * 5); }
          else { const subP = (p - 0.85) / 0.15; curX = targetNoX + (targetX - targetNoX) * subP; curY = targetY; }
          setFakeCursor(prev => ({ ...prev, x: curX, y: curY }));
          if (p < 1) { requestAnimationFrame(animateCursor); }
          else {
              setTimeout(() => {
                  setFakeCursor(prev => ({ ...prev, clicked: true }));
                  setGlitchIntensity(0.8); audioRef.current.playClick();
                  setTimeout(() => { setIsPoweringDown(true); audioRef.current.playPowerDown(); setTimeout(() => { onComplete(); }, 400); }, 200);
              }, 400);
          }
      };
      requestAnimationFrame(animateCursor);
  };

  return (
    <div className="fixed inset-0 bg-black z-[99999] overflow-hidden flex items-center justify-center">
      <style>{`
        @keyframes crt-power-off {
          0% { opacity: 1; transform: scale(1, 1); filter: brightness(1) contrast(1.2); }
          35% { opacity: 1; transform: scale(1, 0.8); filter: brightness(4); }
          40% { opacity: 1; transform: scale(1, 0.005); filter: brightness(2); }
          100% { opacity: 0; transform: scale(0, 0.005); filter: brightness(0); }
        }
        .crt-collapse { animation: crt-power-off 0.45s ease-out forwards; }
        .crt-container { background: radial-gradient(circle, rgba(18,16,16,0) 60%, rgba(0,0,0,1) 100%); filter: contrast(1.1) brightness(1.1) saturate(1.1); }
        .crt-screen { transform: rotateX(0.5deg) scale(1.01); text-shadow: 0 0 5px rgba(255, 170, 0, 0.4); }
      `}</style>
      <GlitchNoiseCanvas intensity={glitchIntensity} />
      <div className={`relative w-full h-full crt-container flex flex-col items-start ${isPoweringDown ? 'crt-collapse' : ''}`}>
        <div className="w-full h-full bg-[#100800] relative overflow-hidden crt-screen">
            <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] opacity-40" />
                <div className="absolute inset-0 bg-black opacity-10 animate-pulse" />
                <div className="absolute top-4 right-4 text-[10px] text-[#ffaa00] font-bold tracking-[0.5em] uppercase opacity-40">ECHO_TAP // LIVE_STREAM</div>
            </div>
            <div className="absolute inset-0 p-12 flex flex-col items-start z-30">
                <div className="flex-1 w-full overflow-hidden flex flex-col justify-end text-sm text-[#ffaa00] font-mono leading-tight whitespace-pre-wrap mix-blend-screen">
                    {history.map((line, i) => <div key={i} className="mb-0.5">{renderMarkupText(line)}</div>)}
                    <div className="mb-0.5">
                        <span className="text-[#ffaa00] mr-2">{CREATOR_PROMPT}</span>
                        <span className="text-[#ffaa00]">{renderMarkupText(input)}</span>
                        <span className={`inline-block w-2 h-4 bg-[#ffaa00] ml-1 align-middle ${cursorBlink ? 'opacity-100' : 'opacity-0'}`}></span>
                    </div>
                    <div ref={scrollRef} />
                </div>
            </div>
            {showPopup && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#c0c0c0] text-black border-2 border-white shadow-[4px_4px_0px_black] p-1 w-80 select-none z-[100] transform scale-110">
                    <div className="bg-[#000080] text-white font-bold px-2 py-1 flex justify-between items-center text-xs mb-4">
                        <span>SYSTEM_WARNING: INTRUSION</span> <span>X</span>
                    </div>
                    <div className="px-4 pb-4 text-center">
                        <div className="mb-6 text-sm font-sans font-bold">Initialize Namárië bypass sequence?<br/>Subject: UNREGISTERED_ENGRAM</div>
                        <div className="flex justify-center gap-4 text-xs">
                            <button className={`border-2 border-white border-r-black border-b-black bg-[#c0c0c0] px-6 py-1 font-bold ${fakeCursor.clicked ? 'bg-[#a0a0a0] translate-y-px' : ''}`}>YES</button>
                            <button className="border-2 border-white border-r-black border-b-black bg-[#c0c0c0] px-6 py-1 opacity-50">NO</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
      {fakeCursor.visible && (
        <div className="fixed w-0 h-0 pointer-events-none z-[100000]" style={{ left: fakeCursor.x, top: fakeCursor.y }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ transform: 'rotate(-25deg) translate(-5px, -5px)' }}>
            <path d="M5.5 3.2L16 19L11.5 20L5.5 3.2Z" fill="white" stroke="black" strokeWidth="1"/>
            </svg>
        </div>
      )}
    </div>
  );
};
