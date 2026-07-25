import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export interface TransitionProps {
  type?: string;
  totalFrames: number;
  children: React.ReactNode;
}

export const Transition: React.FC<TransitionProps> = ({ type = 'fade', totalFrames, children }) => {
  const frame = useCurrentFrame();
  const transitionType = type.toLowerCase();

  const opacity = transitionType.includes('fade')
    ? interpolate(frame, [0, 15, totalFrames - 15, totalFrames], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      })
    : 1;

  const slideX = transitionType.includes('slide')
    ? interpolate(frame, [0, 15], [-80, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      })
    : 0;

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateX(${slideX}px)`
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
