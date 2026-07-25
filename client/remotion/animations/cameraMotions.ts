import { interpolate } from 'remotion';

export interface MotionTransform {
  scale: number;
  translateX: number;
  translateY: number;
  rotateDeg: number;
  opacity: number;
}

export function calculateCameraMotion(
  motionType: string = 'KenBurns',
  transitionType: string = 'fade',
  progress: number,
  frame: number,
  totalFrames: number
): MotionTransform {
  const motion = motionType.toLowerCase();
  const transition = transitionType.toLowerCase();

  let scale = interpolate(progress, [0, 1], [1.0, 1.3], { extrapolateRight: 'clamp' });
  let translateX = 0;
  let translateY = 0;
  let rotateDeg = 0;

  if (motion.includes('zoomout') || motion.includes('zoom-out')) {
    scale = interpolate(progress, [0, 1], [1.3, 1.0], { extrapolateRight: 'clamp' });
  } else if (motion.includes('panleft') || motion.includes('pan-left')) {
    scale = 1.15;
    translateX = interpolate(progress, [0, 1], [40, -40], { extrapolateRight: 'clamp' });
  } else if (motion.includes('panright') || motion.includes('pan-right')) {
    scale = 1.15;
    translateX = interpolate(progress, [0, 1], [-40, 40], { extrapolateRight: 'clamp' });
  } else if (motion.includes('slideleft') || motion.includes('slide-left')) {
    translateX = interpolate(progress, [0, 0.3], [120, 0], { extrapolateRight: 'clamp' });
  } else if (motion.includes('slideright') || motion.includes('slide-right')) {
    translateX = interpolate(progress, [0, 0.3], [-120, 0], { extrapolateRight: 'clamp' });
  } else if (motion.includes('scale')) {
    scale = interpolate(progress, [0, 1], [0.85, 1.25], { extrapolateRight: 'clamp' });
  } else if (motion.includes('rotate')) {
    scale = 1.15;
    rotateDeg = interpolate(progress, [0, 1], [-6, 6], { extrapolateRight: 'clamp' });
  } else if (motion.includes('kenburns') || motion.includes('ken-burns')) {
    scale = interpolate(progress, [0, 1], [1.0, 1.25], { extrapolateRight: 'clamp' });
    translateX = interpolate(progress, [0, 1], [0, 25], { extrapolateRight: 'clamp' });
    translateY = interpolate(progress, [0, 1], [0, -18], { extrapolateRight: 'clamp' });
  }

  const opacity = transition.includes('crossfade') || transition.includes('fade')
    ? interpolate(frame, [0, 12, totalFrames - 12, totalFrames], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      })
    : 1;

  return { scale, translateX, translateY, rotateDeg, opacity };
}
