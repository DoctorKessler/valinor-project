
import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../audio/AudioProvider';
import { SfxId } from '../audio/AudioSystem';

interface Props {
  text: string;
  speed?: number; // Base ms per character
  animate?: boolean;
  onComplete?: () => void;
  className?: string;
  soundId?: SfxId;
}

export const TypewriterText: React.FC<Props> = ({ 
  text, 
  speed = 10, 
  animate = true, 
  className,
  onComplete,
  soundId = "ui_key"
}) => {
  const [displayedLength, setDisplayedLength] = useState(animate ? 0 : text.length);
  const timeoutRef = useRef<number | null>(null);
  const audio = useAudio();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!animate) {
      setDisplayedLength(text.length);
      return;
    }

    setDisplayedLength(0);
    
    if (text.length === 0) {
      onComplete?.();
      return;
    }

    let currentIdx = 0;

    const typeNextChar = () => {
      if (currentIdx >= text.length) {
        onComplete?.();
        return;
      }

      const char = text[currentIdx];
      let delay = speed;

      // Refined Timing Logic for "Fast but Organic" feel
      // Punctuation hits brakes hard, regular text flies.
      
      if (char === '.' || char === '!' || char === '?') {
        delay = speed * 30; // Significant pause for sentence end
      } else if (char === ',' || char === ';') {
        delay = speed * 15; // Breath pause
      } else if (char === '\n') {
        delay = speed * 25; // Line break pause
      } else if (char === ' ') {
        delay = speed * 2; // Slight word gap
      } else if (Math.random() < 0.005) {
        delay = speed * 12; // Rare "thinking" stutter
      } else {
        // Fast burst typing
        delay = speed * (0.8 + Math.random() * 0.4); 
      }

      timeoutRef.current = window.setTimeout(() => {
        // Play sound for characters, not spaces/newlines
        if (char !== ' ' && char !== '\n') {
          audio.play(soundId, { gain: soundId === "log_key" ? 0.04 : 0.03 });
        }
        
        setDisplayedLength((prev) => prev + 1);
        currentIdx++;
        typeNextChar();
      }, delay);
    };

    typeNextChar();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, animate, onComplete, audio, soundId]);

  // Use opacity:0 for the invisible part. 
  // This reserves exact layout space (including kerning/ligatures/wrapping) 
  // preventing any overlap or shifting during the animation.
  return (
    <span className={`${className} whitespace-pre-wrap`}>
      <span>{text.substring(0, displayedLength)}</span>
      <span style={{ opacity: 0 }}>{text.substring(displayedLength)}</span>
    </span>
  );
};

export default TypewriterText;
