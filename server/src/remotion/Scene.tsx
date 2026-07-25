import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { RemotionSceneProps } from './types';
import { Subtitle } from './Subtitle';
import { Transition } from './Transition';

const resolveAudioUrl = (url: string | undefined): string => {
  if (!url || url.includes('MOCK')) return 'https://samples.elevenlabs.io/rachel.mp3';
  if (url.startsWith('/')) {
    return `http://localhost:5000${url}`;
  }
  return url;
};

export const Scene: React.FC<{ scene: RemotionSceneProps }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = scene.duration * fps;
  const progress = Math.min(1, Math.max(0, frame / totalFrames));

  const isZoom = (scene.animation || scene.cameraMotion || 'zoomIn').toLowerCase().includes('zoom') || (scene.animation || '').toLowerCase().includes('kenburns');
  const isPan = (scene.animation || scene.cameraMotion || '').toLowerCase().includes('pan');

  const scale = isZoom
    ? interpolate(progress, [0, 1], [1.0, 1.25], { extrapolateRight: 'clamp' })
    : interpolate(progress, [0, 1], [1.1, 1.15], { extrapolateRight: 'clamp' });

  const translateX = isPan
    ? interpolate(progress, [0, 1], [-20, 20], { extrapolateRight: 'clamp' })
    : interpolate(progress, [0, 1], [0, 10], { extrapolateRight: 'clamp' });

  const translateY = interpolate(progress, [0, 1], [0, -10], { extrapolateRight: 'clamp' });

  const activeVoiceUrl = resolveAudioUrl(scene.voiceAudio);

  return (
    <Transition type={scene.transition || 'fade'} totalFrames={totalFrames}>
      <AbsoluteFill style={{ backgroundColor: '#0B0F19' }}>
        {/* Background Image with Ken Burns Motion */}
        <AbsoluteFill style={{ overflow: 'hidden' }}>
          <Img
            src={scene.asset || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`
            }}
          />

          <AbsoluteFill
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.75) 100%)'
            }}
          />
        </AbsoluteFill>

        {/* Scene HUD Badge */}
        <div
          style={{
            position: 'absolute',
            top: 35,
            left: 35,
            backgroundColor: 'rgba(17, 24, 39, 0.85)',
            border: '1px solid rgba(139, 92, 246, 0.5)',
            borderRadius: 30,
            padding: '10px 24px',
            color: '#A78BFA',
            fontWeight: 'bold',
            fontSize: 15,
            fontFamily: 'sans-serif'
          }}
        >
          SCENE #{scene.sceneNumber} • {(scene.cameraMotion || 'ZOOMIN').toUpperCase()}
        </div>

        {/* Timed Karaoke Subtitles */}
        <Subtitle text={scene.subtitle || scene.voiceText} progress={progress} />

        {/* Scene Audio Narration Track */}
        {activeVoiceUrl && (
          <Audio src={activeVoiceUrl} />
        )}
      </AbsoluteFill>
    </Transition>
  );
};
