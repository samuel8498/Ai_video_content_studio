import { Project, StructuredSceneItem } from '../types';
import { ImageCacheService } from './imageCache';

export class TimelineManager {
  /**
   * Normalize project scenes into precise timeline items with calculated key point durations
   */
  static buildTimeline(project: Project): { scenes: StructuredSceneItem[]; totalDuration: number } {
    const rawScenes: any[] = project.scenes || project.scene_breakdown || project.script?.sections || [];
    let currentTimePointer = 0;

    const scenes: StructuredSceneItem[] = rawScenes.map((s: any, idx: number) => {
      const text = s.voiceText || s.subtitle || s.narration || '';
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      // Calculate key point duration dynamically from spoken words (~2.5 words per second)
      const dynamicDurationFromWords = wordCount > 0 ? Math.max(4, Math.ceil(wordCount / 2.5)) : (project.aspect_ratio === '9:16' ? 6 : 8);

      const duration = s.duration || s.estimated_duration_sec || dynamicDurationFromWords;
      const startTime = currentTimePointer;
      const endTime = startTime + duration;
      currentTimePointer = endTime;

      const backgroundPrompt = s.backgroundPrompt || s.imagePrompt || s.visual_suggestion || project.title;
      const asset = s.asset || s.imageUrl || s.backgroundAsset || ImageCacheService.getSceneImageUrl(backgroundPrompt, idx + 1, project.aspect_ratio);

      return {
        id: s.id || `scene_${idx + 1}_${Date.now()}`,
        sceneNumber: s.sceneNumber || s.scene_number || idx + 1,
        duration,
        startTime,
        endTime,
        voiceText: s.voiceText || s.narration || '',
        subtitle: s.subtitle || s.narration || '',
        cameraMotion: s.cameraMotion || s.camera_angle || 'zoomIn',
        animation: s.animation || 'KenBurns',
        transition: s.transition || 'fade',
        backgroundPrompt,
        imagePrompt: s.imagePrompt || backgroundPrompt,
        videoPrompt: s.videoPrompt || backgroundPrompt,
        asset,
        voiceAudio: s.voiceAudio || s.voiceUrl || project.audio_url || '',
        subtitleTiming: s.subtitleTiming || [],

        // Compatibility aliases
        backgroundAsset: asset,
        scene_number: s.sceneNumber || s.scene_number || idx + 1,
        heading: s.heading || `Key Point ${idx + 1}`,
        narration: s.voiceText || s.narration || '',
        visual_suggestion: backgroundPrompt,
        camera_angle: s.cameraMotion || s.camera_angle || 'zoomIn',
        estimated_duration_sec: duration,
        imageUrl: asset,
        voiceUrl: s.voiceAudio || project.audio_url || ''
      };
    });

    return {
      scenes,
      totalDuration: currentTimePointer
    };
  }

  /**
   * Find active scene at given time in seconds
   */
  static getActiveSceneAtTime(scenes: StructuredSceneItem[], timeSec: number) {
    if (!scenes || scenes.length === 0) return { scene: null, index: 0, progress: 0 };

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const start = scene.startTime || 0;
      const end = scene.endTime || (start + scene.duration);
      if (timeSec >= start && timeSec <= end) {
        const progress = (timeSec - start) / scene.duration;
        return { scene, index: i, progress };
      }
    }

    const lastIdx = scenes.length - 1;
    return { scene: scenes[lastIdx], index: lastIdx, progress: 1.0 };
  }
}
