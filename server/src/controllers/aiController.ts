import { Request, Response } from 'express';
import { AIGeneratorService } from '../services/aiGeneratorService';
import { ImageGeneratorBackendService } from '../services/imageGeneratorService';
import { ScenePlanningEngine } from '../services/scenePlanningEngine';

export class AIController {
  static async generateScript(req: Request, res: Response) {
    try {
      const { inputType, content, targetAudience, aspectRatio, style } = req.body;
      if (!content) {
        return res.status(400).json({ error: 'Input content is required' });
      }

      const result = await AIGeneratorService.generateCompleteVideoProject({
        inputType: inputType || 'topic',
        content,
        targetAudience,
        aspectRatio,
        style
      });

      return res.status(200).json({ success: true, project: result });
    } catch (err: any) {
      console.error('Script generation error:', err);
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  }

  /**
   * Scene Planning Engine Endpoint:
   * Splits script paragraph-by-paragraph into structured JSON scene plan
   */
  static async generateScenes(req: Request, res: Response) {
    try {
      const { content, aspectRatio } = req.body;
      const textToProcess = content || `Artificial intelligence is fundamentally transforming video content creation.\n\nAdvanced machine learning models generate high quality scene visuals in real time.\n\nAutomated narration and video rendering engines export broadcast quality MP4 files.`;

      const scenes = ScenePlanningEngine.planScenesFromText(textToProcess, aspectRatio || '16:9');
      return res.status(200).json(scenes);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  /**
   * Synthesize AI scene artwork and store in Supabase Storage
   */
  static async generateSceneArtwork(req: Request, res: Response) {
    try {
      const { scenes, aspectRatio } = req.body;
      if (!scenes || !Array.isArray(scenes)) {
        return res.status(400).json({ error: 'Scenes array is required' });
      }

      const updatedScenes = await ImageGeneratorBackendService.generateArtworkForScenes(scenes, aspectRatio);
      return res.status(200).json({ success: true, scenes: updatedScenes });
    } catch (err: any) {
      console.error('Scene artwork generation error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async generateThumbnail(req: Request, res: Response) {
    try {
      const { topic } = req.body;
      const prompt = `Hyper-realistic 8k visual thumbnail prompt for "${topic || 'AI Video'}". Cinematic lighting, high vibrant contrast, detailed 3D composition.`;
      return res.status(200).json({ success: true, thumbnail_prompt: prompt });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async generateTitle(req: Request, res: Response) {
    try {
      const { topic } = req.body;
      const titles = [
        `🔥 Master ${topic} in 5 Minutes`,
        `Why Everyone is Talking About ${topic}`,
        `The Ultimate Blueprint for ${topic}`
      ];
      return res.status(200).json({ success: true, titles });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async generateDescription(req: Request, res: Response) {
    try {
      const { topic } = req.body;
      const description = `Complete step-by-step breakdown on ${topic}. Learn how to optimize your video content creation workflow automatically with AI.`;
      return res.status(200).json({ success: true, description });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async generateHashtags(req: Request, res: Response) {
    try {
      const { topic } = req.body;
      const cleanTopic = (topic || 'AIVideo').replace(/[^a-zA-Z0-9]/g, '');
      const hashtags = [`#${cleanTopic}`, '#AIVideo', '#ContentCreator', '#ViralShorts', '#TechNews'];
      return res.status(200).json({ success: true, hashtags });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
