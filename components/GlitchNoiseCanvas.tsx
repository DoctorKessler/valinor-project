
import React, { useEffect, useRef } from "react";

interface Props {
  intensity: number; // 0 to 1
}

export const GlitchNoiseCanvas: React.FC<Props> = ({ intensity }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let rafId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      // Set actual size in memory (scaled to account for extra pixel density)
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      
      // Normalize coordinate system to use css pixels
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      // Clear using the scaled dimensions
      // Note: check logic since we scaled context, clearing w/h needs to match logic units
      // canvas.width is physical pixels. canvas.width / dpr is logical.
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      
      ctx.clearRect(0, 0, width, height);

      if (intensity > 0.02) {
        // Grain noise
        const density = Math.floor(intensity * 1200);
        ctx.fillStyle = `rgba(16, 185, 129, ${intensity * 0.25})`;
        
        for (let i = 0; i < density; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = Math.random() * (1 + intensity * 2);
          ctx.fillRect(x, y, size, size);
        }

        // Horizontal tearing bands
        const bands = Math.floor(intensity * 6);
        const bandColor = `rgba(16, 185, 129, ${intensity * 0.12})`;
        const lineColor = `rgba(255, 255, 255, ${intensity * 0.08})`;

        for (let i = 0; i < bands; i++) {
          const y = Math.random() * height;
          const h = 1 + Math.random() * (intensity * 15);
          const offset = (Math.random() - 0.5) * (intensity * 50);
          
          ctx.fillStyle = bandColor;
          ctx.fillRect(0, y, width, h);
          
          // Mimic a "shifted" pixel line
          ctx.fillStyle = lineColor;
          ctx.fillRect(offset, y + h / 2, width, 1);
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1000000,
        opacity: Math.min(0.9, 0.4 + intensity * 0.5),
        transition: "opacity 0.2s ease-out", // Faster transition for beat-matching
        mixBlendMode: "overlay",
      }}
    />
  );
};
