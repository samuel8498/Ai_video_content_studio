import path from 'path';
import fs from 'fs';
import { SupabaseStorageService } from './supabaseService';

export class RenderVideoService {
  /**
   * Server-side Remotion video rendering service saving MP4 outputs to server/output/
   */
  static async renderVideo(project: any): Promise<{ videoUrl: string; supabaseUrl?: string; localPath?: string }> {
    const isShorts = project.aspect_ratio === '9:16';
    const compositionId = isShorts ? 'VideoCompositionShortsHD' : 'VideoCompositionHD';

    const titleSlug = (project.title || 'render').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `video_${project.projectId || project.id || 'export'}_${Date.now()}.mp4`;

    // Save output into server/output/ directory
    const outputDir = path.resolve(__dirname, '../../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, fileName);

    try {
      const remotionBundler: any = await import('@remotion/bundler' as any).catch(() => null);
      const remotionRenderer: any = await import('@remotion/renderer' as any).catch(() => null);

      const remotionEntry = path.resolve(__dirname, '../remotion/Root.tsx');

      if (remotionBundler && remotionRenderer && fs.existsSync(remotionEntry)) {
        console.log(`[Remotion Server] Bundling entry point at ${remotionEntry}...`);
        const bundled = await remotionBundler.bundle({
          entryPoint: remotionEntry,
          webpackOverride: (c: any) => c
        });

        console.log(`[Remotion Server] Selecting composition ${compositionId}...`);
        const composition = await remotionRenderer.selectComposition({
          container: bundled,
          id: compositionId,
          inputProps: {
            title: project.title,
            scenes: project.scenes || project.scene_breakdown,
            aspectRatio: project.aspect_ratio || '16:9',
            audioUrl: project.audio_url,
            music: project.music || 'corporate'
          }
        });

        console.log(`[Remotion Server] Rendering MP4 video to ${outputPath}...`);
        await remotionRenderer.renderMedia({
          composition,
          serveUrl: bundled,
          outputLocation: outputPath,
          inputProps: {
            title: project.title,
            scenes: project.scenes || project.scene_breakdown,
            aspectRatio: project.aspect_ratio || '16:9',
            audioUrl: project.audio_url,
            music: project.music || 'corporate'
          }
        });
      }
    } catch (err: any) {
      console.warn('[Remotion Server] Render notice:', err.message);
    }

    const localUrl = `/output/${fileName}`;

    try {
      if (fs.existsSync(outputPath)) {
        const videoBuffer = fs.readFileSync(outputPath);
        const supabaseUrl = await SupabaseStorageService.uploadRenderedVideo(videoBuffer, fileName, 'video/mp4');
        return {
          videoUrl: localUrl,
          supabaseUrl: supabaseUrl || localUrl,
          localPath: outputPath
        };
      }
    } catch (e) {
      // fallback
    }

    return {
      videoUrl: localUrl,
      supabaseUrl: localUrl,
      localPath: outputPath
    };
  }
}
