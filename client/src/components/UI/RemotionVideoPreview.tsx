import React, { useRef } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { AIVideoComposition } from '../../remotion/AIVideoComposition';
import { Project } from '../../types';
import { TimelineManager } from '../../lib/timelineManager';
import { RemotionTimelineScrubber } from './RemotionTimelineScrubber';

interface RemotionVideoPreviewProps {
  project: Project;
  audioUrl?: string;
}

export const RemotionVideoPreview: React.FC<RemotionVideoPreviewProps> = ({ project, audioUrl }) => {
  const playerRef = useRef<PlayerRef | null>(null);

  const { scenes, totalDuration } = TimelineManager.buildTimeline(project);
  const isShorts = project.aspect_ratio === '9:16';
  const width = isShorts ? 720 : 1280;
  const height = isShorts ? 1280 : 720;
  const fps = 30;
  const durationInFrames = Math.max(30, Math.floor(totalDuration * fps));

  const inputProps = {
    title: project.title,
    scenes: scenes.map(s => ({
      sceneNumber: s.sceneNumber,
      duration: s.duration,
      voiceText: s.voiceText,
      subtitle: s.subtitle || s.voiceText,
      cameraMotion: s.cameraMotion || s.animation || 'zoomIn',
      animation: s.animation || s.cameraMotion || 'KenBurns',
      transition: s.transition || 'fade',
      backgroundPrompt: s.backgroundPrompt || s.imagePrompt || '',
      imagePrompt: s.imagePrompt || s.backgroundPrompt || '',
      asset: s.asset || s.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
      voiceAudio: s.voiceAudio || audioUrl || ''
    })),
    aspectRatio: project.aspect_ratio || '16:9',
    audioUrl: audioUrl || project.audio_url,
    music: project.music || 'corporate'
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {/* Remotion Live Viewport */}
      <div
        className={`w-full relative rounded-3xl overflow-hidden border border-purple-500/40 shadow-2xl bg-black ${
          isShorts ? 'max-w-xs h-[520px]' : 'w-full aspect-video min-h-[360px] max-h-[520px]'
        }`}
      >
        <Player
          ref={playerRef}
          component={AIVideoComposition as any}
          inputProps={inputProps}
          durationInFrames={durationInFrames}
          compositionWidth={width}
          compositionHeight={height}
          fps={fps}
          style={{
            width: '100%',
            height: '100%'
          }}
          controls={false}
          autoPlay={false}
          loop
        />
      </div>

      {/* Real Remotion Timeline Scrubber with Frame Updates */}
      <RemotionTimelineScrubber
        playerRef={playerRef}
        project={project}
        totalDuration={totalDuration}
      />
    </div>
  );
};
