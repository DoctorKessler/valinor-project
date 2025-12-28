import React from 'react';

interface Props {
  text: string;
  className?: string;
}

/**
 * GlitchText component wraps text and adds a `data-text` attribute 
 * which the CSS pseudo-elements use for the glitch effect.
 */
export const GlitchText: React.FC<Props> = ({ text, className = "" }) => {
  return (
    <span 
      className={`glitch-text ${className}`} 
      data-text={text}
    >
      {text}
    </span>
  );
};

export default GlitchText;