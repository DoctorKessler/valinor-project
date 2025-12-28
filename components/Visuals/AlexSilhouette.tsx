
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { AlexSpatialState } from '../../types';
import { SpatialEngine } from '../../engine/SpatialEngine';

interface Props {
  spatial: AlexSpatialState;
  isCrisp: boolean;
  labLightsOn: boolean;
  flashlightOn: boolean;
  detectedEmotions: string[];
  isTalking: boolean;
}

export const AlexSilhouette: React.FC<Props> = ({
  spatial,
  isCrisp,
  labLightsOn,
  flashlightOn,
  detectedEmotions,
  isTalking
}) => {
  const [blinkPhase, setBlinkPhase] = useState<'IDLE' | 'CLOSING' | 'OPENING'>('IDLE');
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const saccadeTimer = useRef<number | null>(null);

  const emotionsSet = useMemo(() => new Set(detectedEmotions.map(e => e.toUpperCase())), [detectedEmotions]);
  const emotionsRef = useRef(emotionsSet);

  useEffect(() => { emotionsRef.current = emotionsSet; }, [emotionsSet]);

  // --- Blink Logic ---
  useEffect(() => {
    let timeout: number;
    let closeTimer: number;
    let openTimer: number;
    let isRunning = true;

    const scheduleBlink = () => {
      if (!isRunning) return;
      const currentEmotions = emotionsRef.current;
      const isStressed = currentEmotions.has('ALARMED') || currentEmotions.has('PANICKED') || currentEmotions.has('STRESSED');
      const delay = isStressed ? 800 + Math.random() * 1500 : 3000 + Math.random() * 5000;
        
      timeout = window.setTimeout(() => {
        if (!isRunning) return;
        setBlinkPhase('CLOSING');
        closeTimer = window.setTimeout(() => {
          if (!isRunning) return;
          setBlinkPhase('OPENING');
          openTimer = window.setTimeout(() => {
            if (!isRunning) return;
            setBlinkPhase('IDLE');
            scheduleBlink();
          }, 200);
        }, 150);
      }, delay);
    };

    scheduleBlink();
    return () => {
      isRunning = false;
      clearTimeout(timeout); clearTimeout(closeTimer); clearTimeout(openTimer);
    };
  }, []);

  // --- Eye Movement Logic ---
  useEffect(() => {
    const moveEyes = () => {
      let x = (Math.random() - 0.5) * 4;
      let y = (Math.random() - 0.5) * 2;
      const currentEmotions = emotionsRef.current;
      if (isTalking) { x *= 1.4; y *= 1.4; }
      if (currentEmotions.has('FOCUSED') || currentEmotions.has('CURIOUS')) { x *= 0.2; y *= 0.2; } 
      else if (currentEmotions.has('STRESSED') || currentEmotions.has('CONFUSED')) { x *= 2.5; y *= 2.5; }
      setEyePos({ x, y });
      const nextMove = (currentEmotions.has('STRESSED') || isTalking) ? 150 + Math.random() * 400 : 1500 + Math.random() * 2500;
      saccadeTimer.current = window.setTimeout(moveEyes, nextMove);
    };
    moveEyes();
    return () => { if (saccadeTimer.current) clearTimeout(saccadeTimer.current); };
  }, [isTalking]);

  // --- Spatial Positioning ---
  const facing = SpatialEngine.getFacingCategory(spatial.angle);
  const isProfile = facing === 'SIDE_LEFT' || facing === 'SIDE_RIGHT';
  const isBack = facing === 'BACK' || facing === 'BACK_LEFT' || facing === 'BACK_RIGHT';
  const isSquinting = emotionsSet.has('SUSPICIOUS') || emotionsSet.has('SKEPTICAL') || emotionsSet.has('FOCUSED') || emotionsSet.has('ANGRY');

  const containerStyles = useMemo(() => {
    // Convert normalized coords to CSS 3D space
    const roomWidth = 3000;
    const roomDepth = 3000;
    
    const xPos = spatial.x * (roomWidth * 0.4); 
    const zPos = spatial.z * -(roomDepth * 0.85);

    return {
      transform: `
        translateX(-50%)
        translateX(${xPos}px) 
        translateZ(${zPos}px)
      `,
      zIndex: 100, 
      filter: spatial.z > 0.6 ? 'blur(1.5px) brightness(0.7)' : spatial.z > 0.3 ? 'blur(0.5px) brightness(0.9)' : 'none'
    };
  }, [spatial.x, spatial.z]);

  const bodyRotation = useMemo(() => {
    return {
       transform: `rotateY(${spatial.angle}deg)`
    };
  }, [spatial.angle]);

  // --- Dynamic Color Generation ---
  const bodyColor = isCrisp ? '#1e3027' : (labLightsOn ? '#0e1d18' : '#050807');
  const gradient = `linear-gradient(to top, #000 15%, ${bodyColor} 100%)`;

  return (
    <div className="alex-3d-wrapper" style={containerStyles}>
      <style>{`
        .alex-3d-wrapper {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0; 
          height: 0;
          transform-style: preserve-3d;
          transition: transform 1.6s cubic-bezier(0.19, 1, 0.22, 1), filter 1.2s ease;
          pointer-events: none;
        }

        .alex-mesh-container {
          position: absolute;
          bottom: 0;
          left: -150px; 
          width: 300px;
          height: 900px;
          transform-style: preserve-3d;
          transition: transform 1.2s ease;
        }

        .alex-layer {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          transform-style: preserve-3d;
        }

        /* --- Body Parts --- */
        
        .head-shape {
          background: ${gradient};
          position: relative;
          box-shadow: 0 15px 50px rgba(0,0,0,0.95);
          transition: all 0.8s ease;
          z-index: 20; /* Ensure visual stacking above torso */
          transform: translateZ(15px); /* Push head forward in 3D space relative to torso */
        }
        
        .torso-shape {
          background: ${gradient};
          position: relative;
          z-index: 10;
          margin-top: -10px;
          transition: all 0.8s ease;
          transform: translateZ(0px); /* Anchor torso */
        }

        /* --- Profile Variants --- */

        .profile-wide .head-shape {
           width: 140px; height: 180px;
           border-radius: 46% 46% 50% 50%;
        }
        .profile-wide .torso-shape {
           width: 260px; height: 500px;
           border-radius: 45% 45% 15% 15%;
        }

        .profile-narrow .head-shape {
           width: 130px; height: 175px;
           border-radius: 40% 55% 50% 45%; 
        }
        .profile-narrow .torso-shape {
           width: 160px; height: 500px;
           border-radius: 20% 40% 10% 10%;
        }

        /* --- Posture Variants --- */
        
        .posture-crouched .alex-mesh-container { transform: translateY(300px) scaleY(0.7); }
        .posture-sitting .alex-mesh-container { transform: translateY(200px); }
        
        /* Dynamic leaning handled via props but refined here */
        .posture-leaning .alex-mesh-container { transform: rotateZ(3deg) translateX(20px); }
        .posture-leaning .head-shape { transform: translateZ(15px) rotateZ(-5deg); }
        
        .posture-reaching .torso-shape { transform: rotateZ(-5deg) translateZ(5px); }
        .posture-reaching .head-shape { transform: translateZ(15px) rotateZ(5deg); }
        
        .posture-inspecting .torso-shape { transform: rotateX(15deg) translateZ(-10px); transform-origin: bottom center; }
        .posture-inspecting .head-shape { transform: translateY(15px) translateZ(30px) rotateX(25deg); transform-origin: bottom center; }
        
        .posture-kneeling .alex-mesh-container { transform: translateY(400px); }
        .posture-kneeling .torso-shape { height: 450px; }
        
        .posture-looking_up .head-shape { transform: translateZ(15px) rotateX(-30deg) translateY(-10px); }

        /* --- Eyes --- */
        .eyes-container {
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 20px;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }

        .profile-narrow .eyes-container {
          left: 80%;
          width: 20px;
        }
        .profile-narrow .eye-socket:nth-child(2) { display: none; }

        .eye-socket {
          width: 12px; height: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .eye-dot {
           background: #fff;
           box-shadow: 0 0 8px #fff, 0 0 15px rgba(16, 185, 129, 0.5);
           filter: blur(${isCrisp ? '0px' : '0.5px'});
           width: 4px; height: 4px;
           border-radius: 50%;
           transition: all 0.2s ease;
        }
        .eye-dot.squint { height: 2px; width: 6px; border-radius: 1px; }
        .eye-dot.closing { transform: scaleY(0.1); opacity: 0; }

        @keyframes subtle-breathe {
           0%, 100% { transform: scaleY(1); }
           50% { transform: scaleY(1.005); }
        }
        .alex-layer .torso-shape { animation: subtle-breathe 4s infinite ease-in-out; }

      `}</style>

      <div 
        className={`alex-mesh-container posture-${spatial.posture.toLowerCase()} ${isProfile ? 'profile-narrow' : 'profile-wide'}`}
        style={bodyRotation}
      >
        <div className="alex-layer">
          <div className="head-shape">
            {!isBack && (
              <div className="eyes-container">
                <div className="eye-socket">
                  <div className="eye-mover" style={{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }}>
                    <div className={`eye-dot ${blinkPhase !== 'IDLE' ? 'closing' : (isSquinting ? 'squint' : '')}`} />
                  </div>
                </div>
                <div className="eye-socket">
                   <div className="eye-mover" style={{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }}>
                    <div className={`eye-dot ${blinkPhase !== 'IDLE' ? 'closing' : (isSquinting ? 'squint' : '')}`} />
                   </div>
                </div>
              </div>
            )}
          </div>
          <div className="torso-shape">
             {spatial.posture === 'REACHING' && (
                <div 
                  className="absolute top-[30%] left-[60%] w-[120px] h-[30px] bg-black rounded-full origin-left"
                  style={{ 
                    transform: 'rotate(-20deg) translateZ(25px)',
                    background: gradient 
                  }} 
                />
             )}
             {spatial.posture === 'INSPECTING' && (
                 <div 
                   className="absolute top-[35%] left-[50%] w-[60px] h-[20px] bg-black rounded-full origin-left"
                   style={{ 
                     transform: 'rotate(-45deg) translateZ(20px)',
                     background: gradient 
                   }} 
                 />
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
