
import React from 'react';
import { PortalOverlay } from '../PortalOverlay';
import { ScreenEffects } from '../Visuals/ScreenEffects';
import { RemoteView } from '../Visuals/RemoteView';
import { GameState } from '../../types';

interface SceneShellProps {
  gameState: GameState;
  glitchIntensity: number;
  isCrashing: boolean;
  isStabilizing: boolean;
  isFinderPhase: boolean;
  isProcessing: boolean;
  phaseIndex: number;
  surfaceStyle: React.CSSProperties;
  children?: React.ReactNode; 
  hudContent?: React.ReactNode; 
  logContent?: React.ReactNode; 
}

export const SceneShell: React.FC<SceneShellProps> = ({
  gameState,
  glitchIntensity,
  isCrashing,
  isStabilizing,
  isFinderPhase,
  isProcessing,
  phaseIndex,
  surfaceStyle,
  children,
  hudContent,
  logContent,
}) => {
  const isCrisp = !!gameState.world.flags['VISUAL_FEED_CRISP'];

  return (
    <div className="fixed inset-0 bg-black overflow-hidden flex flex-col">
      {/* 1. Global Screen Effects */}
      <ScreenEffects 
        glitchIntensity={glitchIntensity}
        isCrashing={isCrashing}
        isStabilizing={isStabilizing}
        isFinderPhase={isFinderPhase}
        locusMode={gameState.locus.mode}
        phaseIndex={phaseIndex}
        surfaceStyle={surfaceStyle}
        drift={gameState.biometrics.drift}
        integrity={gameState.world.integrity}
      />

      {/* 2. Transform Layer */}
      <div 
        className="relative z-10 w-full h-full pointer-events-none"
        style={surfaceStyle}
      >
        {/* Render RemoteView whenever we are in the Finder phase */}
        {isFinderPhase && (
          <div className="absolute inset-0 z-0">
            <RemoteView 
              isDark={!gameState.world.flags['LAB_LIGHTS_ON']} 
              power={gameState.world.power} 
              flashlightOn={gameState.world.flags['FLASHLIGHT_ON']} 
              labLightsOn={gameState.world.flags['LAB_LIGHTS_ON']}
              isCrisp={isCrisp}
              alarmActive={gameState.world.alarmActive}
              shakeIntensity={gameState.world.shakeIntensity}
              isRemoteViewActive={gameState.world.isRemoteViewActive}
              spatial={gameState.finder.spatial}
              detectedEmotions={gameState.lastTags || []}
              isTalking={isProcessing}
            />
          </div>
        )}

        {/* Background children (Links, etc) */}
        <div className="absolute inset-0 z-10">
          {children}
        </div>
      </div>

      {/* 3. HUD Layer */}
      <PortalOverlay>
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {hudContent}
        </div>
      </PortalOverlay>

      {/* 4. Log Layer */}
      <PortalOverlay>
        <div className="fixed inset-0 pointer-events-none z-[200]">
          {logContent}
        </div>
      </PortalOverlay>
    </div>
  );
};

export default SceneShell;
