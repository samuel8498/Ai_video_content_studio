import { Project, Voice, InputType, AspectRatio, StructuredSceneItem } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiClient {
  /**
   * Create & Save Project to Database
   */
  static async createProject(projectData: Partial<Project>): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      if (!response.ok) throw new Error('Failed to create project');
      const data = await response.json();
      return data.project;
    } catch (err: any) {
      console.warn('Project creation warning:', err.message);
      return projectData as Project;
    }
  }

  static async getProjects(): Promise<Project[]> {
    try {
      const response = await fetch(`${API_BASE}/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      return data.projects;
    } catch (err: any) {
      return [];
    }
  }

  /**
   * Generate Full Video Pre-Production Project
   */
  static async generateScript(payload: {
    inputType: InputType;
    content: string;
    targetAudience?: string;
    aspectRatio?: AspectRatio;
    style?: string;
  }): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE}/generate-script`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.project;
    } catch (err) {
      console.warn('Backend API connection failed, generating fallback project locally:', err);
      return this.fallbackGenerate(payload);
    }
  }

  /**
   * Post scene JSON directly to POST /api/render
   */
  static async renderApi(payload: {
    projectId: string;
    title: string;
    scenes: any[];
    aspect_ratio?: string;
  }): Promise<{ status: string; videoUrl: string; localUrl?: string }> {
    const response = await fetch(`${API_BASE}/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Render API Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.status === 'error') {
      throw new Error(data.message || 'Rendering failed');
    }

    return data;
  }

  /**
   * Complete End-to-End AI Video Generation & Remotion Render Pipeline
   */
  static async generateAndRenderVideo(payload: {
    inputType: InputType;
    content: string;
    targetAudience?: string;
    aspectRatio?: AspectRatio;
    style?: string;
    voiceId?: string;
  }): Promise<{ success: boolean; downloadUrl: string; supabaseUrl: string; project: Project }> {
    try {
      const response = await fetch(`${API_BASE}/generate-and-render-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`End-to-End Video Pipeline Error: ${response.statusText}`);

      const data = await response.json();
      return {
        success: data.success,
        downloadUrl: data.downloadUrl,
        supabaseUrl: data.supabaseUrl,
        project: data.project
      };
    } catch (err: any) {
      console.warn('End-to-End Pipeline Warning:', err.message);
      throw err;
    }
  }

  /**
   * Upload rendered video blob to server & Supabase Storage
   */
  static async renderAndExportVideo(projectTitle: string, videoBase64: string, mimeType: string): Promise<{ downloadUrl: string; supabaseUrl: string }> {
    try {
      const response = await fetch(`${API_BASE}/render-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectTitle, videoBase64, mimeType })
      });

      if (!response.ok) throw new Error('Server video rendering export failed');

      const data = await response.json();
      return {
        downloadUrl: data.downloadUrl,
        supabaseUrl: data.supabaseUrl
      };
    } catch (err: any) {
      console.warn('Render export server sync warning:', err.message);
      return { downloadUrl: '', supabaseUrl: '' };
    }
  }

  /**
   * Synthesize AI scene artwork images and store in Supabase Storage
   */
  static async generateSceneArtwork(scenes: any[], aspectRatio: string = '16:9'): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/generate-scene-artwork`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenes, aspectRatio })
      });

      if (!response.ok) throw new Error('Scene artwork generation failed');

      const data = await response.json();
      return data.scenes;
    } catch (err: any) {
      console.warn('Scene artwork synthesis warning:', err.message);
      return scenes;
    }
  }
  static async getVoices(): Promise<Voice[]> {
    try {
      const response = await fetch(`${API_BASE}/voices`);
      if (!response.ok) throw new Error('Voices fetch failed');
      const data = await response.json();
      return data.voices;
    } catch (err) {
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
  }

  /**
   * Synthesize Narration to MP3 Audio via ElevenLabs Backend Route
   */
  static async generateVoiceover(text: string, voiceId: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE}/generate-voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId })
      });

      if (response.status === 429) {
        throw new Error('ElevenLabs API Rate Limit / Quota Exceeded (429). Please check subscription tier.');
      }

      if (!response.ok) throw new Error('Audio generation failed');

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (err: any) {
      console.warn('Voiceover synthesis warning:', err.message);
      throw err;
    }
  }

  /**
   * Batch Synthesize Scene-by-Scene Audio Tracks
   */
  static async generateSceneVoices(scenes: any[], voiceId: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/generate-scene-voices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenes, voiceId })
      });

      if (response.status === 429) {
        throw new Error('ElevenLabs API Rate Limit Exceeded (429). Please check your account quota.');
      }

      if (!response.ok) throw new Error('Scene voiceover generation failed');

      const data = await response.json();
      return data.scenes;
    } catch (err: any) {
      console.warn('Scene voice synthesis warning:', err.message);
      throw err;
    }
  }

  /**
   * Fallback AI pre-production generator returning StructuredSceneItem objects
   */
  private static fallbackGenerate(payload: {
    inputType: InputType;
    content: string;
    targetAudience?: string;
    aspectRatio?: AspectRatio;
    style?: string;
  }): Project {
    const title = payload.content.slice(0, 50) || 'AI Video Production';
    const isShorts = payload.aspectRatio === '9:16';

    const scenes: StructuredSceneItem[] = [
      {
        id: 'scene_1',
        sceneNumber: 1,
        duration: isShorts ? 6 : 10,
        startTime: 0,
        endTime: isShorts ? 6 : 10,
        voiceText: `Are you still spending hours creating video scripts? Here is how ${title} turns ideas into viral videos in 60 seconds.`,
        subtitle: `Are you still spending hours on scripts? Turn ideas into viral videos in 60 seconds.`,
        cameraMotion: 'zoomIn',
        animation: 'KenBurns',
        transition: 'fade',
        backgroundPrompt: `Dynamic zoom into neon dark matrix dashboard. High contrast lighting with glowing purple particle effects.`,
        imagePrompt: `Dynamic zoom into neon dark matrix dashboard. High contrast lighting with glowing purple particle effects.`,
        videoPrompt: `Camera zooming smoothly into glowing matrix dashboard with rising purple graphs`,
        asset: `https://image.pollinations.ai/prompt/${encodeURIComponent(`Dynamic zoom into neon dark matrix dashboard with glowing purple particle effects`)}?width=${isShorts ? 720 : 1280}&height=${isShorts ? 1280 : 720}&seed=111&nologo=true`,
        backgroundAsset: `https://image.pollinations.ai/prompt/${encodeURIComponent(`Dynamic zoom into neon dark matrix dashboard with glowing purple particle effects`)}?width=${isShorts ? 720 : 1280}&height=${isShorts ? 1280 : 720}&seed=111&nologo=true`,
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(`Dynamic zoom into neon dark matrix dashboard with glowing purple particle effects`)}?width=${isShorts ? 720 : 1280}&height=${isShorts ? 1280 : 720}&seed=111&nologo=true`,
        voiceAudio: 'https://samples.elevenlabs.io/rachel.mp3',
        subtitleTiming: [{ word: 'Are', start: 0, end: 0.3 }],
        soundEffect: 'whoosh.mp3',
        music: 'synth.mp3',
        scene_number: 1,
        heading: 'Hook & Visual Impact',
        narration: `Are you still spending hours creating video scripts? Here is how ${title} turns ideas into viral videos in 60 seconds.`,
        visual_suggestion: `Dynamic zoom into neon dark matrix dashboard. High contrast lighting with glowing purple particle effects.`,
        camera_angle: 'zoomIn',
        estimated_duration_sec: isShorts ? 6 : 10
      },
      {
        id: 'scene_2',
        sceneNumber: 2,
        duration: isShorts ? 10 : 15,
        startTime: isShorts ? 6 : 10,
        endTime: isShorts ? 16 : 25,
        voiceText: `By utilizing natural language AI pipelines, pre-production tasks like scene breakdown, speech synthesis, and SEO indexing occur synchronously.`,
        subtitle: `Pre-production tasks like scene breakdown, speech synthesis, and SEO indexing occur synchronously.`,
        cameraMotion: 'panRight',
        animation: 'PanRight',
        transition: 'slide',
        backgroundPrompt: `Split screen animated visual layout displaying automated video generation steps.`,
        imagePrompt: `Split screen animated visual layout displaying automated video generation steps.`,
        videoPrompt: `Pan right visual animation showing AI project steps`,
        asset: `https://image.pollinations.ai/prompt/${encodeURIComponent(`Split screen animated visual layout displaying automated video generation steps`)}?width=${isShorts ? 720 : 1280}&height=${isShorts ? 1280 : 720}&seed=222&nologo=true`,
        backgroundAsset: `https://image.pollinations.ai/prompt/${encodeURIComponent(`Split screen animated visual layout displaying automated video generation steps`)}?width=${isShorts ? 720 : 1280}&height=${isShorts ? 1280 : 720}&seed=222&nologo=true`,
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(`Split screen animated visual layout displaying automated video generation steps`)}?width=${isShorts ? 720 : 1280}&height=${isShorts ? 1280 : 720}&seed=222&nologo=true`,
        voiceAudio: 'https://samples.elevenlabs.io/rachel.mp3',
        subtitleTiming: [{ word: 'Pre-production', start: 0, end: 0.5 }],
        soundEffect: 'digital_click.mp3',
        music: 'beat.mp3',
        scene_number: 2,
        heading: 'Core Method Breakdown',
        narration: `By utilizing natural language AI pipelines, pre-production tasks like scene breakdown, speech synthesis, and SEO indexing occur synchronously.`,
        visual_suggestion: `Split screen animated visual layout displaying automated video generation steps.`,
        camera_angle: 'panRight',
        estimated_duration_sec: isShorts ? 10 : 15
      },
      {
        id: 'scene_3',
        sceneNumber: 3,
        duration: isShorts ? 8 : 12,
        startTime: isShorts ? 16 : 25,
        endTime: isShorts ? 24 : 37,
        voiceText: `Top creators save over 15 hours per video while boosting audience retention by 3.5x using targeted thumbnail prompts and voice matching.`,
        subtitle: `Top creators save 15+ hours per video while boosting audience retention by 3.5x.`,
        cameraMotion: 'tiltUp',
        animation: 'Scale',
        transition: 'dissolve',
        backgroundPrompt: `3D neon gold growth bar chart expanding smoothly towards 300% indicator label.`,
        imagePrompt: `3D neon gold growth bar chart expanding smoothly towards 300% indicator label.`,
        videoPrompt: `Tilt up camera tracking expanding bar chart`,
        asset: `https://image.pollinations.ai/prompt/${encodeURIComponent(`3D neon gold growth bar chart expanding smoothly towards 300% indicator label`)}?width=${isShorts ? 720 : 1280}&height=${isShorts ? 1280 : 720}&seed=333&nologo=true`,
        backgroundAsset: `https://image.pollinations.ai/prompt/${encodeURIComponent(`3D neon gold growth bar chart expanding smoothly towards 300% indicator label`)}?width=${isShorts ? 720 : 1280}&height=${isShorts ? 1280 : 720}&seed=333&nologo=true`,
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(`3D neon gold growth bar chart expanding smoothly towards 300% indicator label`)}?width=${isShorts ? 720 : 1280}&height=${isShorts ? 1280 : 720}&seed=333&nologo=true`,
        voiceAudio: 'https://samples.elevenlabs.io/rachel.mp3',
        subtitleTiming: [{ word: 'Top', start: 0, end: 0.3 }],
        soundEffect: 'chime.mp3',
        music: 'upbeat.mp3',
        scene_number: 3,
        heading: 'Key Benefits & ROI',
        narration: `Top creators save over 15 hours per video while boosting audience retention by 3.5x using targeted thumbnail prompts and voice matching.`,
        visual_suggestion: `3D neon gold growth bar chart expanding smoothly towards 300% indicator label.`,
        camera_angle: 'tiltUp',
        estimated_duration_sec: isShorts ? 8 : 12
      },
      {
        id: 'scene_4',
        sceneNumber: 4,
        duration: isShorts ? 6 : 10,
        startTime: isShorts ? 24 : 37,
        endTime: isShorts ? 30 : 47,
        voiceText: `Try AI Video Content Studio today to turn your next blog or URL into a high-impact video.`,
        subtitle: `Try AI Video Content Studio today to turn your next blog or URL into a high-impact video.`,
        cameraMotion: 'slideRight',
        animation: 'ZoomOut',
        transition: 'crossfade',
        backgroundPrompt: `Sleek dark laptop screen showing active Studio dashboard, cursor pressing Export Subtitles.`,
        imagePrompt: `Sleek dark laptop screen showing active Studio dashboard, cursor pressing Export Subtitles.`,
        videoPrompt: `Zoom out of laptop screen showing studio workspace`,
        asset: `https://image.pollinations.ai/prompt/${encodeURIComponent(`Sleek dark laptop screen showing active Studio dashboard`)}?width=${isShorts ? 720 : 1280}&height=${isShorts ? 1280 : 720}&seed=444&nologo=true`,
        backgroundAsset: `https://image.pollinations.ai/prompt/${encodeURIComponent(`Sleek dark laptop screen showing active Studio dashboard`)}?width=${isShorts ? 720 : 1280}&height=${isShorts ? 1280 : 720}&seed=444&nologo=true`,
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(`Sleek dark laptop screen showing active Studio dashboard`)}?width=${isShorts ? 720 : 1280}&height=${isShorts ? 1280 : 720}&seed=444&nologo=true`,
        voiceAudio: 'https://samples.elevenlabs.io/rachel.mp3',
        subtitleTiming: [{ word: 'Try', start: 0, end: 0.3 }],
        soundEffect: 'click.mp3',
        music: 'outro.mp3',
        scene_number: 4,
        heading: 'Call To Action',
        narration: `Try AI Video Content Studio today to turn your next blog or URL into a high-impact video.`,
        visual_suggestion: `Sleek dark laptop screen showing active Studio dashboard, cursor pressing Export Subtitles.`,
        camera_angle: 'slideRight',
        estimated_duration_sec: isShorts ? 6 : 10
      }
    ];

    const voiceover = scenes.map(s => s.voiceText).join(' ');

    return {
      id: `proj_${Date.now()}`,
      title,
      input_type: payload.inputType,
      input_content: payload.content,
      target_audience: payload.targetAudience || 'General Audience',
      aspect_ratio: payload.aspectRatio || '16:9',
      video_style: payload.style || 'Cinematic & Engaging',
      totalDuration: isShorts ? 30 : 47,
      music: 'corporate',
      script: {
        title,
        hook: scenes[0].voiceText,
        intro: scenes[1].voiceText,
        sections: scenes,
        outro: scenes[scenes.length - 1].voiceText,
        total_duration_sec: isShorts ? 30 : 47
      },
      scene_breakdown: scenes,
      scenes: scenes,
      voiceover_text: voiceover,
      voice_id: '21m00Tcm4TlvDq8ikWAM',
      audio_url: 'https://samples.elevenlabs.io/rachel.mp3',
      subtitles: scenes.map((s, idx) => ({
        index: idx + 1,
        startTime: `00:00:${String(idx * 8).padStart(2, '0')},000`,
        endTime: `00:00:${String((idx + 1) * 8).padStart(2, '0')},000`,
        text: s.subtitle
      })),
      thumbnail_prompt: `Hyper-realistic 8k thumbnail prompt for "${title}". Vibrant neon lights, high contrast subject, cinematic composition --ar ${isShorts ? '9:16' : '16:9'}`,
      youtube_title: `🔥 Master ${title} in 5 Minutes | Complete Step-by-Step Blueprint`,
      title_variations: [
        `🔥 Master ${title} in 5 Minutes | Complete Step-by-Step Blueprint`,
        `How ${title} Changes Video Creation Forever`,
        `10 Secrets of ${title} Exposed!`,
        `The Ultimate ${title} Guide for Creators`
      ],
      seo_description: `Learn how to master ${title} with our complete automated breakdown. Perfect for creators, marketers, and video editors.`,
      seo_keywords: [title.toLowerCase(), 'ai video', 'content studio', 'scriptwriter', 'elevenlabs', 'viral shorts'],
      hashtags: [`#${title.replace(/[^a-zA-Z0-9]/g, '')}`, '#AIVideo', '#ContentCreation', '#ViralShorts'],
      call_to_action: 'Like, comment your thoughts below, and subscribe for weekly AI content strategies!',
      status: 'completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}
