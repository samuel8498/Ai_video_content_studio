import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, useVideoConfig } from 'remotion';
import { RemotionCompositionProps, RemotionSceneProps } from '../src/remotion/types';
import { useRemotionAnimation } from './hooks/useRemotionAnimation';
import { Subtitle } from './components/Subtitle';
import { SceneHeader } from './components/SceneHeader';

const resolveAudioUrl = (url: string | undefined): string => {
  if (!url || url.includes('MOCK')) return 'https://samples.elevenlabs.io/rachel.mp3';
  if (url.startsWith('/')) {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${url}`;
    }
    return `http://localhost:5000${url}`;
  }
  return url;
};

export const RemotionSceneRenderer: React.FC<{ scene: RemotionSceneProps; title: string }> = ({ scene, title }) => {
  const { scale, translateX, translateY, rotateDeg, opacity, progress } = useRemotionAnimation(
    scene.duration,
    scene.cameraMotion || scene.animation,
    scene.transition
  );

  const activeVoiceUrl = resolveAudioUrl(scene.voiceAudio);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0F19', opacity }}>
      {/* Background Image Layer */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img
          src={scene.asset || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px) rotate(${rotateDeg}deg)`
          }}
        />
        <AbsoluteFill
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.75) 100%)'
          }}
        />
      </AbsoluteFill>

      {/* Header Badge */}
      <SceneHeader sceneNumber={scene.sceneNumber} cameraMotion={scene.cameraMotion || scene.animation} title={scene.sceneNumber === 1 ? title : undefined} />

      {/* Timed Karaoke Subtitles */}
      <Subtitle text={scene.subtitle || scene.voiceText} progress={progress} />

      {/* Scene Audio Narration */}
      {activeVoiceUrl && (
        <Audio src={activeVoiceUrl} />
      )}
    </AbsoluteFill>
  );
};

export const VideoComposition: React.FC<RemotionCompositionProps> = ({ title, scenes, audioUrl, music }) => {
  const { fps } = useVideoConfig();

  let accumulatedFrames = 0;
  const projectAudioUrl = resolveAudioUrl(audioUrl);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0F19' }}>
      {/* Render Scenes Sequentially */}
      {scenes.map((scene, idx) => {
        const durationInFrames = Math.max(30, Math.floor(scene.duration * fps));
        const startFrame = accumulatedFrames;
        accumulatedFrames += durationInFrames;

        return (
          <Sequence key={idx} from={startFrame} durationInFrames={durationInFrames}>
            <RemotionSceneRenderer scene={scene} title={title} />
          </Sequence>
        );
      })}

      {/* Global Fallback Narration Track */}
      {projectAudioUrl && !scenes.some(s => s.voiceAudio) && (
        <Audio src={projectAudioUrl} />
      )}

      {/* Background Music Track */}
      {music && music !== 'none' && (
        <Audio src="https://samples.elevenlabs.io/rachel.mp3" volume={0.12} />
      )}
    </AbsoluteFill>
  );
};
