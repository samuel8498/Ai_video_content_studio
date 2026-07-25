import { useCurrentFrame, useVideoConfig } from 'remotion';
import { calculateCameraMotion, MotionTransform } from '../animations/cameraMotions';

export function useRemotionAnimation(
  durationSec: number,
  cameraMotion: string = 'KenBurns',
  transition: string = 'fade'
): MotionTransform & { progress: number; frame: number } {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = durationSec * fps;
  const progress = Math.min(1, Math.max(0, frame / totalFrames));

  const motion = calculateCameraMotion(cameraMotion, transition, progress, frame, totalFrames);

  return {
    ...motion,
    progress,
    frame
  };
}
