import { Request, Response } from 'express';
import { ElevenLabsService } from '../services/elevenLabsService';

export class VoiceController {
  static async getVoices(req: Request, res: Response) {
    try {
      const voices = await ElevenLabsService.getVoices();
      return res.status(200).json({ success: true, voices });
    } catch (err: any) {
      console.error('Error fetching ElevenLabs voices:', err);
      return res.status(err.message.includes('429') ? 429 : 500).json({ error: err.message });
    }
  }

  static async generateVoice(req: Request, res: Response) {
    try {
      const { text, voiceId } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text narration is required' });
      }

      const audioBuffer = await ElevenLabsService.generateVoiceoverWithRetry(text, voiceId);

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length,
        'Content-Disposition': 'inline; filename="voiceover.mp3"'
      });

      return res.send(audioBuffer);
    } catch (err: any) {
      console.error('Error generating voiceover:', err);
      const isQuotaError = err.message.includes('429') || err.message.includes('Quota');
      return res.status(isQuotaError ? 429 : 500).json({
        error: isQuotaError ? 'ElevenLabs API Rate Limit / Quota Exceeded (429). Please check subscription quota.' : (err.message || 'Voiceover generation failed')
      });
    }
  }

  /**
   * Batch Synthesize Scene-by-Scene Audio Files
   */
  static async generateSceneVoices(req: Request, res: Response) {
    try {
      const { scenes, voiceId } = req.body;
      if (!scenes || !Array.isArray(scenes)) {
        return res.status(400).json({ error: 'Scenes array is required' });
      }

      const updatedScenes = await ElevenLabsService.generateAudioForEveryScene(scenes, voiceId);
      return res.status(200).json({ success: true, scenes: updatedScenes });
    } catch (err: any) {
      console.error('Error generating scene voices:', err);
      const isQuotaError = err.message.includes('429') || err.message.includes('Quota');
      return res.status(isQuotaError ? 429 : 500).json({
        error: isQuotaError ? 'ElevenLabs API Rate Limit / Quota Exceeded (429).' : err.message
      });
    }
  }
}
