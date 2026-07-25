import { Request, Response } from 'express';
import { AIGeneratorService } from '../services/aiGeneratorService';
import { ImageGeneratorBackendService } from '../services/imageGeneratorService';
import { VideoGeneratorService } from '../services/videoGeneratorService';
import { StockAssetService } from '../services/stockAssetService';
import { ElevenLabsService } from '../services/elevenLabsService';
import { RenderVideoService } from '../services/renderVideo';
import { SupabaseStorageService } from '../services/supabaseService';
import fs from 'fs';
import path from 'path';

export class RenderController {
  /**
   * Endpoint: POST /api/render
   * Input: { "projectId": "", "title": "", "scenes": [] }
   * Workflow: Receive scene JSON -> Pass scene JSON to Remotion -> Render MP4 -> Save into server/output/ -> Return { status: "success", videoUrl: "..." }
   */
  static async renderApi(req: Request, res: Response) {
    try {
      const { projectId, title, scenes } = req.body;

      if (!scenes || !Array.isArray(scenes)) {
        return res.status(400).json({ status: 'error', message: 'Scenes array is required' });
      }

      console.log(`\n==================================================`);
      console.log(`🚀 [POST /api/render] Processing multi-provider assets & rendering: "${title || projectId || 'Untitled'}"...`);
      console.log(`==================================================`);

      // 1. Process Multi-Provider Asset Search (Pexels -> Pixabay -> AI Visual)
      const scenesWithStockAssets = await StockAssetService.processScenesWithStockAssets(
        scenes,
        req.body.aspect_ratio || '16:9'
      );

      // 2. Generate video clips
      const scenesWithVideoClips = await VideoGeneratorService.generateVideoClipsForScenes(
        scenesWithStockAssets,
        req.body.aspect_ratio || '16:9'
      );

      const renderResult = await RenderVideoService.renderVideo({
        projectId: projectId || `proj_${Date.now()}`,
        title: title || 'AI Video Composition',
        scenes: scenesWithVideoClips,
        aspect_ratio: req.body.aspect_ratio || '16:9'
      });

      return res.status(200).json({
        status: 'success',
        videoUrl: renderResult.supabaseUrl || renderResult.videoUrl,
        localUrl: renderResult.videoUrl
      });
    } catch (err: any) {
      console.error(`❌ [POST /api/render Error]:`, err);
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Remotion rendering failed'
      });
    }
  }

  /**
   * Complete End-to-End SaaS Pipeline Endpoint
   */
  static async generateAndRenderVideo(req: Request, res: Response) {
    const startTime = Date.now();
    try {
      const { inputType, content, targetAudience, aspectRatio, style, voiceId } = req.body;
      if (!content) {
        return res.status(400).json({ error: 'Input content is required' });
      }

      const projectData = await AIGeneratorService.generateCompleteVideoProject({
        inputType: inputType || 'topic',
        content,
        targetAudience,
        aspectRatio,
        style
      });

      // Step 1: Multi-Provider Stock Asset Pipeline (Pexels -> Pixabay -> AI Visual)
      const scenesWithStockAssets = await StockAssetService.processScenesWithStockAssets(
        projectData.scenes || projectData.scene_breakdown,
        aspectRatio || '16:9'
      );

      // Step 2: AI Video Clip Generation & Caching
      const scenesWithVideoClips = await VideoGeneratorService.generateVideoClipsForScenes(
        scenesWithStockAssets,
        aspectRatio || '16:9'
      );

      // Step 3: ElevenLabs Audio Synchronization
      const chosenVoiceId = voiceId || projectData.voice_id || '21m00Tcm4TlvDq8ikWAM';
      const scenesWithAudio = await ElevenLabsService.generateAudioForEveryScene(
        scenesWithVideoClips,
        chosenVoiceId
      );

      const fullProject = {
        ...projectData,
        scenes: scenesWithAudio,
        scene_breakdown: scenesWithAudio,
        voice_id: chosenVoiceId
      };

      // Step 4: Remotion MP4 Render & Supabase Upload
      const renderResult = await RenderVideoService.renderVideo(fullProject);
      const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

      return res.status(200).json({
        success: true,
        downloadUrl: renderResult.videoUrl,
        supabaseUrl: renderResult.supabaseUrl || renderResult.videoUrl,
        project: fullProject,
        executionTimeSec: parseFloat(durationSec)
      });
    } catch (err: any) {
      console.error(`❌ End-to-End Render Failed:`, err);
      return res.status(500).json({
        error: err.message || 'End-to-End Video Generation Pipeline Failed',
        details: err.stack
      });
    }
  }

  /**
   * Endpoint to persist rendered video blob (base64) directly to Supabase Storage
   */
  static async renderVideo(req: Request, res: Response) {
    try {
      const { projectTitle, videoBase64, mimeType } = req.body;

      if (!videoBase64) {
        return res.status(400).json({ error: 'Rendered video payload (base64) is required' });
      }

      const base64Data = videoBase64.replace(/^data:video\/\w+;base64,/, '');
      const videoBuffer = Buffer.from(base64Data, 'base64');

      const titleSlug = (projectTitle || 'render').replace(/[^a-zA-Z0-9]/g, '_');
      const ext = (mimeType && mimeType.includes('mp4')) ? 'mp4' : 'webm';
      const fileName = `${titleSlug}_${Date.now()}.${ext}`;

      const supabaseUrl = await SupabaseStorageService.uploadRenderedVideo(
        videoBuffer,
        fileName,
        mimeType || 'video/webm'
      );

      const outputDir = path.resolve(__dirname, '../../output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const localPath = path.join(outputDir, fileName);
      fs.writeFileSync(localPath, videoBuffer);

      const localDownloadUrl = `/output/${fileName}`;

      return res.status(200).json({
        success: true,
        downloadUrl: localDownloadUrl,
        supabaseUrl: supabaseUrl || localDownloadUrl,
        fileName
      });
    } catch (err: any) {
      console.error('Video Render & Export Error:', err);
      return res.status(500).json({ error: err.message || 'Video export failed' });
    }
  }
}
