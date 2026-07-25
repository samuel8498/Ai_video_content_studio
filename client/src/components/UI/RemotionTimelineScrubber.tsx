import React, { useState, useEffect, useRef } from 'react';
import { PlayerRef } from '@remotion/player';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Layers, Clock } from 'lucide-react';
import { TimelineManager } from '../../lib/timelineManager';
import { Project } from '../../types';

interface RemotionTimelineScrubberProps {
  playerRef: React.RefObject<PlayerRef | null>;
  project: Project;
  totalDuration: number;
}

export const RemotionTimelineScrubber: React.FC<RemotionTimelineScrubberProps> = ({ playerRef, project, totalDuration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const { scenes } = TimelineManager.buildTimeline(project);
  const fps = 30;
  const totalFrames = Math.max(30, Math.floor(totalDuration * fps));
  const currentTimeSec = currentFrame / fps;

  const { scene: activeScene, index: activeSceneIndex } = TimelineManager.getActiveSceneAtTime(scenes, currentTimeSec);

  // Attach listener to update timeline state every frame
  useEffect(() => {
    let animationFrameId: number;

    const updateLoop = () => {
      if (playerRef.current) {
        const frame = playerRef.current.getCurrentFrame();
        const playing = playerRef.current.isPlaying();
        if (frame !== undefined) setCurrentFrame(frame);
        if (playing !== undefined) setIsPlaying(playing);
      }
      animationFrameId = requestAnimationFrame(updateLoop);
    };

    animationFrameId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [playerRef]);

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const frame = parseInt(e.target.value, 10);
    setCurrentFrame(frame);
    if (playerRef.current) {
      playerRef.current.seekTo(frame);
    }
  };

  const handleReplay = () => {
    setCurrentFrame(0);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.play();
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (playerRef.current) {
      if (nextMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unmute();
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 shadow-xl">
      {/* Visual Scene Breakdown Segment Markers */}
      <div className="relative w-full h-3 rounded-lg bg-gray-950 overflow-hidden flex items-center border border-white/10">
        {scenes.map((scene, idx) => {
          const startPercent = ((scene.startTime || 0) / totalDuration) * 100;
          const widthPercent = (scene.duration / totalDuration) * 100;
          const isActive = idx === activeSceneIndex;

          return (
            <div
              key={idx}
              onClick={() => {
                const targetFrame = Math.floor((scene.startTime || 0) * fps);
                setCurrentFrame(targetFrame);
                if (playerRef.current) playerRef.current.seekTo(targetFrame);
              }}
              style={{ left: `${startPercent}%`, width: `${widthPercent}%` }}
              className={`absolute top-0 bottom-0 cursor-pointer border-r border-black/40 transition-all duration-200 flex items-center justify-center ${
                isActive
                  ? 'bg-purple-600/70 border-y border-purple-400 shadow-inner'
                  : 'bg-purple-950/40 hover:bg-purple-800/40'
              }`}
              title={`Scene #${scene.sceneNumber} (${scene.duration}s)`}
            >
              <span className="text-[8px] font-extrabold text-white/70 tracking-tighter truncate px-1">
                S#{scene.sceneNumber}
              </span>
            </div>
          );
        })}

        {/* Current Time Indicator Line */}
        <div
          style={{ left: `${(currentFrame / totalFrames) * 100}%` }}
          className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-md pointer-events-none transition-all duration-75"
        />
      </div>

      {/* Frame Scrubber Range Control */}
      <input
        type="range"
        min={0}
        max={totalFrames}
        step={1}
        value={currentFrame}
        onChange={handleSeek}
        className="w-full accent-purple-500 cursor-pointer h-1.5 rounded-lg bg-gray-800"
      />

      {/* Controls Bar & Metadata HUD */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition-all"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>

          <button
            onClick={handleReplay}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
            title="Replay Video"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleMute}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
          </button>

          <span className="text-xs font-mono font-bold text-gray-200 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            {formatTime(currentTimeSec)} <span className="text-gray-500">/</span> {formatTime(totalDuration)}
            <span className="text-[10px] text-gray-300 ml-1">({currentFrame}f)</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            Active: Scene #{activeScene?.sceneNumber || 1} of {scenes.length}
          </span>
        </div>
      </div>
    </div>
  );
};
