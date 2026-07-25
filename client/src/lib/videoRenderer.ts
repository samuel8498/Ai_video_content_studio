import { Project, StructuredSceneItem } from '../types';
import { TimelineManager } from './timelineManager';
import { ImageCacheService } from './imageCache';

export interface RenderProgressCallback {
  (progressPercent: number, statusText: string): void;
}

export class VideoRendererEngine {
  /**
   * Timeline-based video composition engine compiling scenes, animations, transitions, subtitles, and WebAudio into downloadable MP4/WebM
   */
  static async renderProjectToVideo(
    project: Project,
    audioUrl: string | undefined,
    onProgress: RenderProgressCallback
  ): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      try {
        onProgress(5, 'Initializing Video Timeline Engine...');

        const { scenes, totalDuration } = TimelineManager.buildTimeline(project);
        const isShorts = project.aspect_ratio === '9:16';
        const width = isShorts ? 720 : 1280;
        const height = isShorts ? 1280 : 720;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas 2D context not supported');
        }

        const fps = 30;
        const totalFrames = Math.floor(totalDuration * fps);

        // Preload visual background assets
        onProgress(15, 'Synthesizing scene background media...');
        const preloadedImages: HTMLImageElement[] = await Promise.all(
          scenes.map((scene) => ImageCacheService.preloadImage(scene.asset || scene.imageUrl || ''))
        );

        onProgress(30, 'Setting up WebAudio Composition Node...');

        const canvasStream = canvas.captureStream(fps);
        let combinedStream = new MediaStream(canvasStream.getVideoTracks());

        if (audioUrl && !audioUrl.includes('MOCK')) {
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const audioEl = new Audio(audioUrl);
            audioEl.crossOrigin = 'anonymous';

            const source = audioCtx.createMediaElementSource(audioEl);
            const destination = audioCtx.createMediaStreamDestination();
            source.connect(destination);
            source.connect(audioCtx.destination);

            destination.stream.getAudioTracks().forEach(track => {
              combinedStream.addTrack(track);
            });

            audioEl.play().catch(() => {});
          } catch (e) {
            console.warn('WebAudio track merge fallback:', e);
          }
        }

        let mediaRecorder: MediaRecorder;
        const chunks: Blob[] = [];

        try {
          mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=vp9' });
        } catch (e) {
          mediaRecorder = new MediaRecorder(combinedStream);
        }

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          onProgress(100, 'Video Render Complete!');
          const blob = new Blob(chunks, { type: mediaRecorder.mimeType || 'video/webm' });
          resolve(blob);
        };

        mediaRecorder.start();

        let frameCount = 0;

        const renderFrame = () => {
          if (frameCount >= totalFrames) {
            mediaRecorder.stop();
            return;
          }

          const currentTimeSec = frameCount / fps;
          const progressPercent = Math.min(95, Math.floor(30 + (frameCount / totalFrames) * 65));
          onProgress(progressPercent, `Rendering Frame ${frameCount}/${totalFrames} (${Math.floor(currentTimeSec)}s)...`);

          const { scene: activeScene, index: activeSceneIdx, progress: progressInScene } = TimelineManager.getActiveSceneAtTime(scenes, currentTimeSec);
          const img = preloadedImages[activeSceneIdx];

          // Clear background
          ctx.fillStyle = '#0B0F19';
          ctx.fillRect(0, 0, width, height);

          // Apply Animation Transformations
          ctx.save();
          const animation = (activeScene?.animation || activeScene?.cameraMotion || 'KenBurns').toLowerCase();
          
          if (animation.includes('zoom') || animation.includes('kenburns')) {
            const scale = 1.0 + progressInScene * 0.25;
            ctx.translate(width / 2, height / 2);
            ctx.scale(scale, scale);
            if (img && img.complete) ctx.drawImage(img, -width / 2, -height / 2, width, height);
          } else if (animation.includes('panleft')) {
            const translateX = (0.5 - progressInScene) * 80;
            ctx.translate(width / 2 + translateX, height / 2);
            ctx.scale(1.15, 1.15);
            if (img && img.complete) ctx.drawImage(img, -width / 2, -height / 2, width, height);
          } else if (animation.includes('panright')) {
            const translateX = (progressInScene - 0.5) * 80;
            ctx.translate(width / 2 + translateX, height / 2);
            ctx.scale(1.15, 1.15);
            if (img && img.complete) ctx.drawImage(img, -width / 2, -height / 2, width, height);
          } else {
            const scale = 1.05 + progressInScene * 0.15;
            ctx.translate(width / 2, height / 2);
            ctx.scale(scale, scale);
            if (img && img.complete) ctx.drawImage(img, -width / 2, -height / 2, width, height);
          }
          ctx.restore();

          // Dark Vignette & Gradient Overlays
          const gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
          gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);

          // Top Scene HUD Pill
          ctx.fillStyle = 'rgba(17, 24, 39, 0.85)';
          ctx.beginPath();
          ctx.roundRect(30, 30, width - 60, 50, 25);
          ctx.fill();
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#A78BFA';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(`SCENE #${activeScene?.sceneNumber}: ${(activeScene?.animation || 'KenBurns').toUpperCase()}`, 50, 62);



          // Subtitle Box
          let currentSubtitleText = activeScene?.subtitle || activeScene?.voiceText || '';
          if (project.subtitles && project.subtitles.length > 0) {
            const sub = project.subtitles.find(s => {
              const startSec = parseSrtTimeToSec(s.startTime);
              const endSec = parseSrtTimeToSec(s.endTime);
              return currentTimeSec >= startSec && currentTimeSec <= endSec;
            });
            if (sub) currentSubtitleText = sub.text;
          }

          ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
          ctx.beginPath();
          ctx.roundRect(40, height - 100, width - 80, 70, 20);
          ctx.fill();
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)';
          ctx.stroke();

          ctx.fillStyle = '#FCD34D';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText((currentSubtitleText || '').slice(0, 75), width / 2, height - 58);

          frameCount++;
          requestAnimationFrame(renderFrame);
        };

        renderFrame();
      } catch (err: any) {
        reject(err);
      }
    });
  }
}

function parseSrtTimeToSec(srtTime: string): number {
  if (!srtTime) return 0;
  const parts = srtTime.split(':');
  if (parts.length < 3) return 0;
  const hrs = parseFloat(parts[0]);
  const mins = parseFloat(parts[1]);
  const secsParts = parts[2].split(',');
  const secs = parseFloat(secsParts[0]);
  const ms = secsParts[1] ? parseFloat(secsParts[1]) / 1000 : 0;
  return hrs * 3600 + mins * 60 + secs + ms;
}
