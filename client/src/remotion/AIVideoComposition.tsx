import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { RemotionCompositionProps, RemotionSceneProps } from './types';
import { CinematicVFXOverlay } from './components/CinematicVFXOverlay';

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

export const AISceneItem: React.FC<{ scene: RemotionSceneProps; title: string }> = ({ scene, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = scene.duration * fps;
  const progress = Math.min(1, Math.max(0, frame / totalFrames));

  const animationMode = (scene.animation || scene.cameraMotion || 'KenBurns').toLowerCase();
  const transitionMode = (scene.transition || 'fade').toLowerCase();

  // 1. Ken Burns / Zoom In / Zoom Out / Pan Interpolations
  let scale = interpolate(progress, [0, 1], [1.0, 1.3], { extrapolateRight: 'clamp' });
  let translateX = 0;
  let translateY = 0;
  let rotateDeg = 0;

  if (animationMode.includes('zoomout') || animationMode.includes('zoom-out')) {
    scale = interpolate(progress, [0, 1], [1.3, 1.0], { extrapolateRight: 'clamp' });
  } else if (animationMode.includes('panleft') || animationMode.includes('pan-left')) {
    scale = 1.18;
    translateX = interpolate(progress, [0, 1], [50, -50], { extrapolateRight: 'clamp' });
  } else if (animationMode.includes('panright') || animationMode.includes('pan-right')) {
    scale = 1.18;
    translateX = interpolate(progress, [0, 1], [-50, 50], { extrapolateRight: 'clamp' });
  } else if (animationMode.includes('slideleft') || animationMode.includes('slide-left')) {
    translateX = interpolate(progress, [0, 0.3], [140, 0], { extrapolateRight: 'clamp' });
  } else if (animationMode.includes('slideright') || animationMode.includes('slide-right')) {
    translateX = interpolate(progress, [0, 0.3], [-140, 0], { extrapolateRight: 'clamp' });
  } else if (animationMode.includes('scale')) {
    scale = interpolate(progress, [0, 1], [0.85, 1.3], { extrapolateRight: 'clamp' });
  } else if (animationMode.includes('rotate')) {
    scale = 1.18;
    rotateDeg = interpolate(progress, [0, 1], [-7, 7], { extrapolateRight: 'clamp' });
  } else if (animationMode.includes('kenburns') || animationMode.includes('ken-burns')) {
    scale = interpolate(progress, [0, 1], [1.0, 1.28], { extrapolateRight: 'clamp' });
    translateX = interpolate(progress, [0, 1], [0, 30], { extrapolateRight: 'clamp' });
    translateY = interpolate(progress, [0, 1], [0, -22], { extrapolateRight: 'clamp' });
  }

  // 2. Camera Shake Jitter
  const shakeX = Math.sin(frame * 0.8) * 1.5;
  const shakeY = Math.cos(frame * 0.9) * 1.2;

  // 3. Depth & Parallax Blur
  const blurAmount = interpolate(progress, [0, 0.1, 0.9, 1], [2, 0, 0, 2], { extrapolateRight: 'clamp' });

  // 4. Smooth Crossfade Transition
  const opacity = transitionMode.includes('crossfade') || transitionMode.includes('fade')
    ? interpolate(frame, [0, 12, totalFrames - 12, totalFrames], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      })
    : 1;

  const slideX = transitionMode.includes('slide')
    ? interpolate(frame, [0, 12], [-120, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 }
  });

  const words = (scene.subtitle || scene.voiceText || '').split(' ');
  const activeWordIdx = Math.min(words.length - 1, Math.floor(progress * words.length));
  const activeVoiceUrl = resolveAudioUrl(scene.voiceAudio);

  const mediaSource = (scene as any).video || scene.asset || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200';
  const isVideoAsset = mediaSource.includes('.mp4') || mediaSource.includes('.webm') || mediaSource.includes('video') || mediaSource.includes('pexels');
  const sceneTitleDisplay = scene.heading || scene.voiceText?.substring(0, 30) || title;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0F19', opacity, transform: `translateX(${slideX}px)` }}>
      {/* Dynamic MP4 Video / Visual Layer (Muted background video so voice narration audio is pristine) */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        {isVideoAsset ? (
          <OffthreadVideo
            src={mediaSource}
            volume={0}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: `blur(${blurAmount}px)`,
              transform: `scale(${scale}) translate(${translateX + shakeX}px, ${translateY + shakeY}px) rotate(${rotateDeg}deg)`
            }}
          />
        ) : (
          <Img
            src={mediaSource}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: `blur(${blurAmount}px)`,
              transform: `scale(${scale}) translate(${translateX + shakeX}px, ${translateY + shakeY}px) rotate(${rotateDeg}deg)`
            }}
          />
        )}

        {/* Gradient Shadow Overlay */}
        <AbsoluteFill
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.75) 100%)'
          }}
        />

        {/* Cinematic VFX: Particles, Lens Flare, Film Grain & Light Rays */}
        <CinematicVFXOverlay />
      </AbsoluteFill>

      {/* Top Header Badge & Scene Title */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          right: 40,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(17, 24, 39, 0.85)',
            border: '1px solid rgba(139, 92, 246, 0.5)',
            borderRadius: 30,
            padding: '10px 24px',
            color: '#A78BFA',
            fontWeight: 'bold',
            fontSize: 16,
            fontFamily: 'sans-serif'
          }}
        >
          SCENE #{scene.sceneNumber} • MOTION: {(scene.cameraMotion || scene.animation || 'KenBurns').toUpperCase()}
        </div>

        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            border: '1px solid rgba(236, 72, 153, 0.5)',
            borderRadius: 30,
            padding: '10px 24px',
            color: '#F472B6',
            fontWeight: 'extrabold',
            fontSize: 16,
            fontFamily: 'sans-serif',
            transform: `scale(${titleSpring})`
          }}
        >
          🎬 {sceneTitleDisplay}
        </div>
      </div>

      {/* Timed Karaoke Overlay Subtitles */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 40,
          right: 40,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            border: '1px solid rgba(139, 92, 246, 0.6)',
            borderRadius: 24,
            padding: '20px 32px',
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#FFFFFF',
            fontFamily: 'sans-serif',
            maxWidth: 850,
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}
        >
          {words.map((word, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-block',
                margin: '0 5px',
                color: idx === activeWordIdx ? '#FCD34D' : '#E5E7EB',
                transform: idx === activeWordIdx ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.15s ease-out',
                textDecoration: idx === activeWordIdx ? 'underline' : 'none'
              }}
            >
              {word}{' '}
            </span>
          ))}
        </div>
      </div>

      {/* Scene ElevenLabs Audio Narration Track */}
      <Audio src={activeVoiceUrl || 'https://samples.elevenlabs.io/rachel.mp3'} volume={1.0} />
    </AbsoluteFill>
  );
};

export const AIVideoComposition: React.FC<RemotionCompositionProps> = ({ title, scenes, audioUrl, music }) => {
  const { fps } = useVideoConfig();

  let accumulatedFrames = 0;
  const projectAudioUrl = resolveAudioUrl(audioUrl);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0F19' }}>
      {/* Sequenced Scenes */}
      {scenes.map((scene, idx) => {
        const durationInFrames = Math.max(30, Math.floor(scene.duration * fps));
        const startFrame = accumulatedFrames;
        accumulatedFrames += durationInFrames;

        return (
          <Sequence key={idx} from={startFrame} durationInFrames={durationInFrames}>
            <AISceneItem scene={scene} title={title} />
          </Sequence>
        );
      })}

      {/* Global Narration Track */}
      {projectAudioUrl && !scenes.some(s => s.voiceAudio) && (
        <Audio src={projectAudioUrl} volume={1.0} />
      )}

      {/* Background Music Track */}
      {music && music !== 'none' && (
        <Audio src="https://samples.elevenlabs.io/rachel.mp3" volume={0.12} />
      )}
    </AbsoluteFill>
  );
};
