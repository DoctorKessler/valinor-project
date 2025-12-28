
import React from 'react';

interface Props {
  labLightsOn: boolean;
  flashlightOn: boolean;
  isCrisp: boolean;
  power: number;
}

/**
 * RoomGeometry Component
 * Renders a deep 3D-simulated research environment with multi-layered parallax.
 */
export const RoomGeometry: React.FC<Props> = ({ labLightsOn, flashlightOn, isCrisp, power }) => {
  // Wireframe visibility tuning
  const wireframeOpacity = isCrisp
    ? (labLightsOn ? 0.6 : (flashlightOn ? 0.4 : 0.2))
    : (labLightsOn ? 0.3 : (flashlightOn ? 0.15 : 0.08));

  const featherExtent = labLightsOn ? '100%' : (flashlightOn ? '90%' : '70%');
  const color = "16, 185, 129"; // Emerald 500

  // Calculate power factor to dim lighting as facility resources deplete
  const powerFactor = Math.max(0.15, Math.min(1, power / 100));

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      <style>{`
        .room-viewport {
          position: absolute;
          inset: 0;
          perspective: 2500px;
          perspective-origin: 50% 35%;
        }

        .room-box {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          
          /* Primary 3D camera feel leveraging vars from RemoteView */
          transform: 
            translateX(calc(var(--cam-x) * -140px))
            translateZ(calc((var(--cam-z) - 0.5) * 900px))
            rotateY(calc(var(--cam-angle) * -0.35deg))
            rotateX(calc((var(--cam-z) - 0.5) * 7deg));
          transition: transform 1.8s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .room-scaffold {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          pointer-events: none;
          opacity: ${wireframeOpacity * 1.4};
          filter: drop-shadow(0 0 12px rgba(${color}, ${wireframeOpacity * 0.35}));
        }

        .frame-rail {
          position: absolute;
          background: linear-gradient(
            to right,
            rgba(${color}, 0) 0%,
            rgba(${color}, ${wireframeOpacity * 0.6}) 30%,
            rgba(${color}, ${wireframeOpacity * 0.8}) 70%,
            rgba(${color}, 0) 100%
          );
          border: 1px solid rgba(${color}, ${wireframeOpacity * 0.6});
          transform-origin: center;
        }

        .frame-rail.floor {
          width: 5200px;
          height: 12px;
          bottom: -60px;
          left: -600px;
          transform: translateZ(-2900px) translateX(calc(var(--cam-x) * 60px));
        }

        .frame-rail.ceiling {
          width: 5200px;
          height: 10px;
          top: -420px;
          left: -600px;
          transform: translateZ(-2800px) translateX(calc(var(--cam-x) * 60px));
        }

        .frame-rail.vertical {
          width: 10px;
          height: 2400px;
          top: -400px;
          transform: translateZ(-2900px) translateX(calc(var(--cam-x) * 60px));
          background: linear-gradient(
            to bottom,
            rgba(${color}, 0) 0%,
            rgba(${color}, ${wireframeOpacity * 0.6}) 20%,
            rgba(${color}, ${wireframeOpacity * 0.9}) 80%,
            rgba(${color}, 0) 100%
          );
        }

        .frame-rail.vertical.left { left: -600px; }
        .frame-rail.vertical.right { left: 4600px; }

        .ceiling-strut {
          position: absolute;
          top: -320px;
          left: -400px;
          width: 4800px;
          height: 2px;
          background: rgba(${color}, ${wireframeOpacity * 0.55});
          transform-origin: left;
          transform: translateZ(-2200px) rotateY(12deg);
          box-shadow: 0 0 16px rgba(${color}, ${wireframeOpacity * 0.45});
        }

        .ceiling-strut.secondary {
          transform: translateZ(-1800px) rotateY(-9deg);
          opacity: 0.75;
        }

        .floor-anchor {
          position: absolute;
          bottom: -40px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(${color}, ${wireframeOpacity * 0.8});
          box-shadow:
            inset 0 0 12px rgba(${color}, ${wireframeOpacity * 0.5}),
            0 0 20px rgba(${color}, ${wireframeOpacity * 0.2});
          background: radial-gradient(circle,
            rgba(${color}, ${wireframeOpacity}) 0%,
            rgba(${color}, ${wireframeOpacity * 0.3}) 65%,
            rgba(${color}, 0) 100%
          );
          transform: translateZ(-2950px) translateX(calc(var(--cam-x) * 50px));
        }

        .floor-anchor::after {
          content: '';
          position: absolute;
          inset: 8px;
          border: 1px dashed rgba(${color}, ${wireframeOpacity * 0.8});
          border-radius: 50%;
          opacity: 0.7;
        }

        .floor-anchor.small {
          width: 26px;
          height: 26px;
          opacity: 0.7;
        }

        .depth-marker {
          position: absolute;
          bottom: 260px;
          left: 50%;
          width: 1px;
          height: 800px;
          background: linear-gradient(
            to top,
            rgba(${color}, 0),
            rgba(${color}, ${wireframeOpacity * 0.8}) 40%,
            rgba(${color}, 0)
          );
          transform-origin: bottom;
          transform: translateX(-50%) rotateX(86deg) translateZ(-2600px);
          opacity: 0.45;
        }

        .lab-surface {
          position: absolute;
          background: #000;
          border: 1px solid rgba(${color}, ${wireframeOpacity * 0.2});
          transition: border 1.5s ease, transform 1.8s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .grid-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(${color}, ${wireframeOpacity * 0.4}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(${color}, ${wireframeOpacity * 0.4}) 1px, transparent 1px);
          background-size: 120px 120px;
          transition: background-image 2s ease;
        }

        /* Environmental Props */
        .door-outline {
          position: absolute;
          left: 42%;
          bottom: 0;
          width: 16%;
          height: 70%;
          border: 1.5px solid rgba(${color}, ${wireframeOpacity * 2});
          border-bottom: 0;
          background: rgba(0,0,0,0.6);
          box-shadow: inset 0 0 40px rgba(${color}, ${wireframeOpacity * 0.1});
        }

        .server-rack {
          position: absolute;
          bottom: 0;
          width: 450px;
          height: 85%;
          background: linear-gradient(to top, #020202, #080808);
          border: 1px solid rgba(${color}, ${wireframeOpacity * 0.6});
          box-shadow: 0 0 60px rgba(0,0,0,1);
        }

        .rack-slots {
          position: absolute;
          inset: 15px;
          background-image: linear-gradient(rgba(${color}, ${wireframeOpacity * 0.25}) 1.5px, transparent 1.5px);
          background-size: 100% 16px;
        }

        @keyframes tube-flicker {
          0%, 100% { opacity: 0.95; filter: blur(0px); }
          50% { opacity: 0.75; filter: blur(0.6px); }
          55% { opacity: 1.0; }
          62% { opacity: 0.7; }
        }

        .light-tube {
          position: absolute;
          top: 20%;
          left: 50%;
          width: 600px;
          height: 8px;
          background: rgba(255, 255, 255, ${labLightsOn ? (isCrisp ? 1.0 : 0.8) : 0.02});
          box-shadow: 0 0 ${labLightsOn ? (isCrisp ? '200px' : '80px') : '5px'} rgba(255,255,255, ${labLightsOn ? (isCrisp ? 0.8 : 0.3) : 0.05});
          border-radius: 10px;
          transform: translateX(-50%);
          transition: background 1.5s, box-shadow 2.5s;
          animation: tube-flicker 6s infinite ease-in-out;
        }

        /* Wall Geometry with Depth Parallax */
        .wall-back {
          width: 4000px;
          height: 2500px;
          left: -1000px;
          top: -500px;
          transform: translateZ(-3000px) translateX(calc(var(--cam-x) * 60px));
          background-color: #010102;
          -webkit-mask-image: radial-gradient(circle at 50% 40%, black 0%, transparent ${featherExtent});
          mask-image: radial-gradient(circle at 50% 40%, black 0%, transparent ${featherExtent});
          transition: -webkit-mask-image 2s ease, transform 1.8s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .wall-left {
          width: 5000px;
          height: 3000px;
          left: 0;
          top: -1000px;
          transform: rotateY(90deg) translateZ(-1200px) translateZ(calc(var(--cam-z) * -120px));
          transform-origin: left;
          -webkit-mask-image: linear-gradient(to right, black 20%, transparent 90%);
          mask-image: linear-gradient(to right, black 20%, transparent 90%);
        }

        .wall-right {
          width: 5000px;
          height: 3000px;
          right: 0;
          top: -1000px;
          transform: rotateY(-90deg) translateZ(-1200px) translateZ(calc(var(--cam-z) * -120px));
          transform-origin: right;
          -webkit-mask-image: linear-gradient(to left, black 20%, transparent 90%);
          mask-image: linear-gradient(to left, black 20%, transparent 90%);
        }

        .wall-floor {
          width: 6000px;
          height: 5000px;
          left: -2000px;
          bottom: 0;
          transform: rotateX(90deg) translateZ(-800px) translateX(calc(var(--cam-x) * 40px));
          transform-origin: bottom;
          -webkit-mask-image: radial-gradient(circle at 50% 0%, black 10%, transparent 80%);
          mask-image: radial-gradient(circle at 50% 0%, black 10%, transparent 80%);
        }

        .wall-ceiling {
          width: 6000px;
          height: 5000px;
          left: -2000px;
          top: 0;
          transform: rotateX(-90deg) translateZ(-800px) translateX(calc(var(--cam-x) * 40px));
          transform-origin: top;
          -webkit-mask-image: radial-gradient(circle at 50% 100%, black 10%, transparent 80%);
          mask-image: radial-gradient(circle at 50% 100%, black 10%, transparent 80%);
        }
        
        /* Explicit Room Seams */
        .seam {
          position: absolute;
          background: rgba(${color}, ${wireframeOpacity * 0.35});
          filter: blur(0.2px);
          transition: background 1.5s ease;
        }

        .seam-floor-back {
          left: -1000px;
          width: 4000px;
          height: 2px;
          top: calc(2000px - 2px);
          transform: translateZ(-3000px) translateX(calc(var(--cam-x) * 60px));
        }

        .seam-corner-left {
          width: 2px;
          height: 2500px;
          left: -1000px;
          top: -500px;
          transform: translateZ(-3000px) translateX(calc(var(--cam-x) * 60px));
        }

        .seam-corner-right {
          width: 2px;
          height: 2500px;
          left: 3000px;
          top: -500px;
          transform: translateZ(-3000px) translateX(calc(var(--cam-x) * 60px));
        }

        .overhead-cone {
          position: absolute;
          top: -10%;
          left: 50%;
          width: 300%;
          height: 100%;
          transform: translateX(-50%) translateZ(-800px);
          background: radial-gradient(ellipse at top, 
            rgba(${color}, ${labLightsOn ? (isCrisp ? 0.4 : 0.15) : 0.05}) 0%, 
            transparent 70%
          );
          pointer-events: none;
          z-index: 5;
          transition: background 2.5s;
        }

        .foreground-lip {
          position: absolute;
          left: -10%;
          bottom: -8%;
          width: 120%;
          height: 28%;
          transform: translateZ(120px);
          background: linear-gradient(to top, rgba(0,0,0,0.85), transparent 85%);
          border-top: 1px solid rgba(${color}, ${wireframeOpacity * 0.22});
          pointer-events: none;
        }
      `}</style>

      <div className="room-viewport">
        <div className="room-box">
          <div className="overhead-cone" />

          <div className="room-scaffold">
            <div className="frame-rail floor" />
            <div className="frame-rail ceiling" />
            <div className="frame-rail vertical left" />
            <div className="frame-rail vertical right" />
            <div className="ceiling-strut" />
            <div className="ceiling-strut secondary" />
            <div className="depth-marker" />
            <div className="floor-anchor" style={{ left: '18%' }} />
            <div className="floor-anchor small" style={{ left: '48%' }} />
            <div className="floor-anchor" style={{ left: '78%' }} />
          </div>

          <div className="lab-surface wall-back">
            <div className="grid-pattern" />
            <div className="door-outline" />
          </div>

          <div className="lab-surface wall-left">
            <div className="grid-pattern" />
            <div className="server-rack" style={{ right: '5%', bottom: '0', height: '95%' }}>
              <div className="rack-slots" />
            </div>
            <div className="server-rack" style={{ right: '40%', bottom: '0', height: '80%' }}>
              <div className="rack-slots" />
            </div>
            <div className="server-rack" style={{ right: '70%', bottom: '0', height: '90%' }}>
              <div className="rack-slots" />
            </div>
          </div>

          <div className="lab-surface wall-right">
            <div className="grid-pattern" />
            <div className="server-rack" style={{ left: '15%', bottom: '0', height: '90%' }}>
              <div className="rack-slots" />
            </div>
            <div className="server-rack" style={{ left: '50%', bottom: '0', height: '85%' }}>
              <div className="rack-slots" />
            </div>
          </div>

          <div className="lab-surface wall-floor">
            <div className="grid-pattern" />
          </div>

          <div className="lab-surface wall-ceiling">
            <div className="grid-pattern" />
            <div className="light-tube" style={{ top: '10%', opacity: (labLightsOn ? 0.9 : 0.1) * powerFactor }} />
            <div className="light-tube" style={{ top: '40%', opacity: (labLightsOn ? 0.9 : 0.1) * powerFactor }} />
            <div className="light-tube" style={{ top: '70%', opacity: (labLightsOn ? 0.9 : 0.1) * powerFactor }} />
          </div>
          
          {/* Explicit Room Seams */}
          <div className="seam seam-floor-back" />
          <div className="seam seam-corner-left" />
          <div className="seam seam-corner-right" />

          {/* Foreground Frame */}
          <div className="foreground-lip" />
        </div>
      </div>
    </div>
  );
};
