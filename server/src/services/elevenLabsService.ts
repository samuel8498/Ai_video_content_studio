import { config } from '../config';
import fs from 'fs';
import path from 'path';

export interface VoiceItem {
  voice_id: string;
  name: string;
  category: string;
  description: string;
  preview_url: string;
}

export class ElevenLabsService {
  /**
   * Directory where generated scene MP3 files are persisted
   */
  private static getAudioOutputDir(): string {
    const dir = path.resolve(__dirname, '../public/audio');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  /**
   * Fetch available ElevenLabs voices securely
   */
  static async getVoices(): Promise<VoiceItem[]> {
    if (!config.elevenlabsApiKey) {
      return [
        {
          voice_id: '21m00Tcm4TlvDq8ikWAM',
          name: 'Rachel (Documentary & Tech)',
          category: 'premade',
          description: 'Calm, clear, and professional female voice.',
          preview_url: 'https://samples.elevenlabs.io/rachel.mp3'
        },
        {
          voice_id: 'AZnzlk1XvdvUeBnXmlld',
          name: 'Domi (Shorts & Energetic)',
          category: 'premade',
          description: 'High-energy, fast-paced storytelling voice.',
          preview_url: 'https://samples.elevenlabs.io/domi.mp3'
        },
        {
          voice_id: 'EXAVITQu4vr4xnSDxMaL',
          name: 'Bella (Lifestyle & Warm)',
          category: 'premade',
          description: 'Warm, engaging narrator for blogs and reviews.',
          preview_url: 'https://samples.elevenlabs.io/bella.mp3'
        },
        {
          voice_id: 'ErXwobaYiN019PkySvjV',
          name: 'Antoni (Corporate & Educational)',
          category: 'premade',
          description: 'Deep resonant voice ideal for deep-dive tutorials.',
          preview_url: 'https://samples.elevenlabs.io/antoni.mp3'
        }
      ];
    }

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': config.elevenlabsApiKey,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 429) {
        throw new Error('ElevenLabs API Rate Limit Exceeded (429). Please check your plan quota or wait before retrying.');
      }

      if (!response.ok) {
        throw new Error(`ElevenLabs API returned status ${response.status}`);
      }

      const data = await response.json() as { voices: any[] };
      return data.voices.map((v: any) => ({
        voice_id: v.voice_id,
        name: v.name,
        category: v.category || 'custom',
        description: v.labels?.description || `${v.name} voice profile`,
        preview_url: v.preview_url || 'https://samples.elevenlabs.io/rachel.mp3'
      }));
    } catch (err: any) {
      console.warn('ElevenLabs API fetch error:', err.message);
      throw err;
    }
  }

  /**
   * Convert narration text to audio MP3 buffer with automatic retry logic (up to 3 retries)
   */
  static async generateVoiceoverWithRetry(text: string, voiceId: string = '21m00Tcm4TlvDq8ikWAM', retries: number = 3): Promise<Buffer> {
    if (!config.elevenlabsApiKey) {
      throw new Error('ElevenLabs API key is missing. Please provide a valid ELEVENLABS_API_KEY in your .env configuration.');
    }

    let lastError: any = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'xi-api-key': config.elevenlabsApiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        });

        if (response.status === 429) {
          throw new Error('ElevenLabs API Rate Limit / Quota Exceeded (429). Please check your subscription usage.');
        }

        if (response.status === 401) {
          throw new Error('Invalid ElevenLabs API key (401 Unauthorized). Please check your key.');
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`ElevenLabs TTS Error (${response.status}): ${errorText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      } catch (err: any) {
        lastError = err;
        console.warn(`ElevenLabs TTS attempt ${attempt}/${retries} failed: ${err.message}`);
        
        // Don't retry if auth or quota limit
        if (err.message.includes('429') || err.message.includes('401')) {
          throw err;
        }

        if (attempt < retries) {
          // Exponential delay before retry
          await new Promise(r => setTimeout(r, attempt * 1000));
        }
      }
    }

    throw lastError || new Error('Voiceover generation failed after retries.');
  }

  /**
   * Generate audio for EVERY scene, save as MP3 files, and return relative/absolute URLs
   */
  static async generateAudioForEveryScene(scenes: any[], voiceId: string = '21m00Tcm4TlvDq8ikWAM'): Promise<any[]> {
    const outputDir = this.getAudioOutputDir();
    const updatedScenes = [];

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const textToSynthesize = scene.voiceText || scene.narration || scene.subtitle || '';

      if (!textToSynthesize) {
        updatedScenes.push(scene);
        continue;
      }

      try {
        const audioBuffer = await this.generateVoiceoverWithRetry(textToSynthesize, voiceId);
        const fileName = `scene_${i + 1}_${Date.now()}_${Math.floor(Math.random() * 1000)}.mp3`;
        const filePath = path.join(outputDir, fileName);

        // Save MP3 file to disk
        fs.writeFileSync(filePath, audioBuffer);

        const audioUrl = `/audio/${fileName}`;
        updatedScenes.push({
          ...scene,
          voiceAudio: audioUrl,
          voiceUrl: audioUrl
        });
      } catch (err: any) {
        console.error(`Failed to generate audio for Scene #${i + 1}:`, err.message);
        // Retain fallback audio if synthesis fails
        updatedScenes.push({
          ...scene,
          audioError: err.message
        });
      }
    }

    return updatedScenes;
  }
}
