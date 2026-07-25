import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const CinematicVFXOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated Light Rays Beam Angle Sweep
  const lightRayAngle = interpolate(frame % 150, [0, 150], [-15, 15], { extrapolateRight: 'clamp' });
  const lightRayOpacity = interpolate(frame % 90, [0, 45, 90], [0.15, 0.35, 0.15]);

  // Lens Flare Position Sweep
  const flareX = interpolate(frame % 180, [0, 180], [10, 85]);
  const flareY = interpolate(frame % 180, [0, 180], [20, 40]);

  // Floating Glowing Particles (12 particle positions computed dynamically)
  const particles = Array.from({ length: 12 }).map((_, i) => {
    const seed = i * 47;
    const speed = 0.5 + (i % 3) * 0.3;
    const yPos = (100 - ((frame * speed + seed) % 110));
    const xPos = (seed % 90) + Math.sin((frame + seed) / 20) * 5;
    const size = 3 + (i % 4) * 2;
    const pOpacity = 0.3 + Math.sin((frame + seed) / 10) * 0.25;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          top: `${yPos}%`,
          left: `${xPos}%`,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: i % 2 === 0 ? '#A78BFA' : '#60A5FA',
          boxShadow: `0 0 ${size * 2}px ${i % 2 === 0 ? '#8B5CF6' : '#3B82F6'}`,
          opacity: pOpacity,
          pointerEvents: 'none'
        }}
      />
    );
  });

  // Film Grain Noise Overlay (Opacity micro jitter)
  const grainOpacity = 0.04 + (frame % 3) * 0.015;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {/* 1. Volumetric Light Rays */}
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          left: '-20%',
          width: '140%',
          height: '140%',
          background: 'radial-gradient(ellipse at 30% 0%, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.1) 45%, transparent 70%)',
          transform: `rotate(${lightRayAngle}deg)`,
          opacity: lightRayOpacity,
          transition: 'opacity 0.2s ease-out'
        }}
      />

      {/* 2. Lens Flare Streak */}
      <div
        style={{
          position: 'absolute',
          top: `${flareY}%`,
          left: `${flareX}%`,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, rgba(139, 92, 246, 0.15) 40%, transparent 70%)',
          filter: 'blur(20px)',
          pointerEvents: 'none'
        }}
      />

      {/* 3. Floating Particles Overlay */}
      {particles}

      {/* 4. Film Grain Noise Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
          opacity: grainOpacity,
          mixBlendMode: 'overlay'
        }}
      />
    </AbsoluteFill>
  );
};
