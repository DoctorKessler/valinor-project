import { useState, useEffect, useRef } from 'react';
import { GameState, BootPhase } from '../types';

export function useAttentionTracking(
  mode: GameState['locus']['mode'], 
  bootPhase: BootPhase,
  glitchIntensity: number,
  stability: number,
  shouldHideReticle: boolean = false
) {
  const [isLocusHeld, setIsLocusHeld] = useState(false);
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });
  const locusRef = useRef({ x: 0.5, y: 0.5 });
  const autonomousLocusRef = useRef({ x: 0.5, y: 0.5, angle: 0 });
  const isInputHoverRef = useRef(false);
  const isTerminalInputRef = useRef(false);
  
  const physicsRef = useRef({ 
    x: 0, y: 0, 
    rotX: 0, rotY: 0,
    scale: 1,
    bgX: 0, bgY: 0
  });

  const getPhaseOpacity = () => {
    if (shouldHideReticle) return 0;
    switch (bootPhase) {
      case 'SIGNAL_DETECTION': return 0.05;
      case 'COHERENCE_GATE': return 0.1;
      case 'CARRIER_LOCK': return 0.2;
      case 'IDENTITY_STABILIZATION': return 0.4;
      case 'SELF_EXPLORATION': return 1.0;
      case 'STABILIZATION': return 0.9;
      case 'READY': return 0.6;
      default: return 0;
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { 
        x: e.clientX / window.innerWidth, 
        y: e.clientY / window.innerHeight 
      };
      
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || 
                      target.tagName === 'TEXTAREA' || 
                      target.isContentEditable ||
                      target.closest('button') ||
                      target.closest('[role="button"]') ||
                      target.closest('[data-interactive="true"]');
      
      isInputHoverRef.current = !!isInput;
      isTerminalInputRef.current = target.classList.contains('terminal-input-field') || !!target.closest('.terminal-input-field');
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let rafId: number;
    const update = () => {
      const target = { ...locusRef.current };
      const opacity = getPhaseOpacity();
      
      if (mode === 'OFFLINE') {
        // Still
      } else if (mode === 'GHOST') {
        autonomousLocusRef.current.angle += 0.015 + (glitchIntensity * 0.03);
        const radius = 0.1 + (glitchIntensity * 0.15);
        target.x = 0.5 + Math.cos(autonomousLocusRef.current.angle) * radius;
        target.y = 0.5 + Math.sin(autonomousLocusRef.current.angle * 0.7) * radius;
      } else if (mode === 'INTERMITTENT') {
        const lerp = isLocusHeld ? 0.2 : 0.05;
        target.x += (mousePosRef.current.x - target.x) * lerp;
        target.y += (mousePosRef.current.y - target.y) * lerp;
        // Jitter
        target.x += (Math.random() - 0.5) * (0.01 + glitchIntensity * 0.05);
        target.y += (Math.random() - 0.5) * (0.01 + glitchIntensity * 0.05);
      } else if (mode === 'ACTIVE') {
        const lerp = isLocusHeld ? 0.9 : 0.4; 
        target.x += (mousePosRef.current.x - target.x) * lerp;
        target.y += (mousePosRef.current.y - target.y) * lerp;
      }

      locusRef.current = target;
      
      const dx = target.x - 0.5;
      const dy = target.y - 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const maxShift = 15;
      const targetPX = dx * -maxShift;
      const targetPY = dy * -maxShift;
      
      const targetRY = dx * -4;
      const targetRX = dy * 4;

      const targetScale = isLocusHeld ? 1.02 : 1.0;
      const lerp = isLocusHeld ? 0.3 : 0.1;
      
      physicsRef.current.x += (targetPX - physicsRef.current.x) * lerp;
      physicsRef.current.y += (targetPY - physicsRef.current.y) * lerp;
      physicsRef.current.rotX += (targetRX - physicsRef.current.rotX) * lerp;
      physicsRef.current.rotY += (targetRY - physicsRef.current.rotY) * lerp;
      physicsRef.current.scale += (targetScale - physicsRef.current.scale) * 0.1;

      const el = document.getElementById('attention-locus');
      if (el) {
        el.style.left = `${target.x * 100}vw`;
        el.style.top = `${target.y * 100}vh`;
        el.style.opacity = `${opacity}`;
        
        if (isLocusHeld) el.classList.add('active');
        else el.classList.remove('active');

        if (isInputHoverRef.current) el.classList.add('point-mode');
        else el.classList.remove('point-mode');

        if (isTerminalInputRef.current) el.classList.add('terminal-hover');
        else el.classList.remove('terminal-hover');
      }

      document.documentElement.style.setProperty('--parallax-x', `${physicsRef.current.x}px`);
      document.documentElement.style.setProperty('--parallax-y', `${physicsRef.current.y}px`);
      document.documentElement.style.setProperty('--parallax-rot-x', `${physicsRef.current.rotX}deg`);
      document.documentElement.style.setProperty('--parallax-rot-y', `${physicsRef.current.rotY}deg`);
      document.documentElement.style.setProperty('--parallax-scale', `${physicsRef.current.scale}`);

      rafId = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(rafId);
  }, [mode, isLocusHeld, glitchIntensity, bootPhase, stability, shouldHideReticle]);

  return { setIsLocusHeld };
}