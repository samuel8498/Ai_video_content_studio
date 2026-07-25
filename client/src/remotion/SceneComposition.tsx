import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { RemotionSceneProps } from './types';

export const SceneComposition: React.FC<{ scene: RemotionSceneProps }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = scene.duration * fps;
  const progress = Math.min(1, Math.max(0, frame / totalFrames));

  const animationMode = (scene.animation || scene.cameraMotion || 'KenBurns').toLowerCase();
  const transitionMode = (scene.transition || 'fade').toLowerCase();

  // 1. Zoom In
  let scale = interpolate(progress, [0, 1], [1.0, 1.3], { extrapolateRight: 'clamp' });
  let translateX = 0;
  let translateY = 0;
  let rotateDeg = 0;

  // 2. Zoom Out
  if (animationMode.includes('zoomout') || animationMode.includes('zoom-out')) {
    scale = interpolate(progress, [0, 1], [1.3, 1.0], { extrapolateRight: 'clamp' });
  }

  // 3. Pan Left
  if (animationMode.includes('panleft') || animationMode.includes('pan-left')) {
    scale = 1.15;
    translateX = interpolate(progress, [0, 1], [40, -40], { extrapolateRight: 'clamp' });
  }

  // 4. Pan Right
  if (animationMode.includes('panright') || animationMode.includes('pan-right')) {
    scale = 1.15;
    translateX = interpolate(progress, [0, 1], [-40, 40], { extrapolateRight: 'clamp' });
  }

  // 5. Slide Left
  if (animationMode.includes('slideleft') || animationMode.includes('slide-left')) {
    translateX = interpolate(progress, [0, 0.3], [120, 0], { extrapolateRight: 'clamp' });
  }

  // 6. Slide Right
  if (animationMode.includes('slideright') || animationMode.includes('slide-right')) {
    translateX = interpolate(progress, [0, 0.3], [-120, 0], { extrapolateRight: 'clamp' });
  }

  // 7. Scale
  if (animationMode.includes('scale')) {
    scale = interpolate(progress, [0, 1], [0.85, 1.25], { extrapolateRight: 'clamp' });
  }

  // 8. Rotate
  if (animationMode.includes('rotate')) {
    scale = 1.15;
    rotateDeg = interpolate(progress, [0, 1], [-6, 6], { extrapolateRight: 'clamp' });
  }

  // 9. Ken Burns (Default cinematic blend)
  if (animationMode.includes('kenburns') || animationMode.includes('ken-burns')) {
    scale = interpolate(progress, [0, 1], [1.0, 1.25], { extrapolateRight: 'clamp' });
    translateX = interpolate(progress, [0, 1], [0, 25], { extrapolateRight: 'clamp' });
    translateY = interpolate(progress, [0, 1], [0, -18], { extrapolateRight: 'clamp' });
  }

  // 10. Fade & 11. Crossfade Transitions
  const opacity = transitionMode.includes('crossfade') || transitionMode.includes('fade')
    ? interpolate(frame, [0, 12, totalFrames - 12, totalFrames], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      })
    : 1;

  const words = (scene.subtitle || scene.voiceText || '').split(' ');
  const activeWordIdx = Math.min(words.length - 1, Math.floor(progress * words.length));

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0F19', opacity }}>
      {/* Background Image with Cinematic Camera Motion */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img
          src={scene.asset || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px) rotate(${rotateDeg}deg)`
          }}
        />

        <AbsoluteFill
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.7) 100%)'
          }}
        />
      </AbsoluteFill>

      {/* Top HUD Badge */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 30,
          backgroundColor: 'rgba(17, 24, 39, 0.85)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
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

      {/* Bottom Timed Karaoke Subtitles */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
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
            borderRadius: 22,
            padding: '18px 30px',
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#FFFFFF',
            fontFamily: 'sans-serif',
            maxWidth: 800
          }}
        >
          {words.map((word, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-block',
                margin: '0 4px',
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
    </AbsoluteFill>
  );
};
