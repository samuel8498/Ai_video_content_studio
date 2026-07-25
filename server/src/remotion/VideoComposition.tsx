import React from 'react';
import { AbsoluteFill, Audio, Sequence, useVideoConfig } from 'remotion';
import { VideoCompositionProps } from './types';
import { Scene } from './Scene';

export const VideoComposition: React.FC<VideoCompositionProps> = ({ scenes, audioUrl, music }) => {
  const { fps } = useVideoConfig();

  let accumulatedFrames = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0F19' }}>
      {/* Sequenced Scenes */}
      {scenes.map((sceneItem, idx) => {
        const durationInFrames = Math.max(30, Math.floor(sceneItem.duration * fps));
        const startFrame = accumulatedFrames;
        accumulatedFrames += durationInFrames;

        return (
          <Sequence key={idx} from={startFrame} durationInFrames={durationInFrames}>
            <Scene scene={sceneItem} />
          </Sequence>
        );
      })}

      {/* ElevenLabs Narration Audio Track */}
      {audioUrl && !audioUrl.includes('MOCK') && (
        <Audio src={audioUrl} />
      )}

      {/* Background Music Layer */}
      {music && music !== 'none' && (
        <Audio src="https://samples.elevenlabs.io/rachel.mp3" volume={0.15} />
      )}
    </AbsoluteFill>
  );
};
