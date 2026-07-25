import React from 'react';
import { AbsoluteFill, Audio, Sequence, useVideoConfig } from 'remotion';
import { RemotionCompositionProps } from './types';
import { SceneComposition } from './SceneComposition';

export const MainComposition: React.FC<RemotionCompositionProps> = ({ scenes, audioUrl }) => {
  const { fps } = useVideoConfig();

  let accumulatedFrames = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0F19' }}>
      {/* Scene Sequences */}
      {scenes.map((scene, idx) => {
        const durationInFrames = Math.max(30, Math.floor(scene.duration * fps));
        const startFrame = accumulatedFrames;
        accumulatedFrames += durationInFrames;

        return (
          <Sequence key={idx} from={startFrame} durationInFrames={durationInFrames}>
            <SceneComposition scene={scene} />
          </Sequence>
        );
      })}

      {/* Audio Track */}
      {audioUrl && !audioUrl.includes('MOCK') && (
        <Audio src={audioUrl} />
      )}
    </AbsoluteFill>
  );
};
