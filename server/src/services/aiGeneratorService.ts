export interface GenerationInput {
  inputType: 'topic' | 'blog' | 'article' | 'pdf' | 'url';
  content: string;
  targetAudience?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  style?: string;
}

export interface SubtitleTimingItem {
  word: string;
  start: number;
  end: number;
}

export interface StructuredSceneItem {
  sceneNumber: number;
  duration: number;
  voiceText: string;
  subtitle: string;
  cameraMotion: string;
  animation: string;
  transition: string;
  backgroundPrompt: string;
  imagePrompt: string;
  videoPrompt: string;
  asset: string;
  voiceAudio: string;
  subtitleTiming: SubtitleTimingItem[];

  // Compatibility aliases
  id?: string;
  startTime?: number;
  endTime?: number;
  backgroundAsset?: string;
  heading?: string;
  narration?: string;
  visual_suggestion?: string;
  camera_angle?: string;
  estimated_duration_sec?: number;
}

export interface AIProjectOutput {
  title: string;
  totalDuration: number;
  music: string;
  scenes: StructuredSceneItem[];
}

export class AIGeneratorService {
  /**
   * Calculate exact dynamic duration for key points based on spoken narration word count
   */
  private static calculateKeyPointDuration(text: string): number {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(4, Math.ceil(words / 2.5));
  }

  /**
   * Main AI Pre-Production Pipeline: Generates dynamic scene content based strictly on user input!
   */
  static async generateCompleteVideoProject(input: GenerationInput) {
    const userTopic = (input.content || 'AI Innovation & Future Tech').trim();
    const isShorts = input.aspectRatio === '9:16';
    const lines = userTopic.split(/\n\s*\n/).map(l => l.trim()).filter(Boolean);

    let title = lines[0]?.substring(0, 60) || userTopic.substring(0, 60);
    title = title.charAt(0).toUpperCase() + title.slice(1);

    const cameraMotions = ['zoomIn', 'panRight', 'tiltUp', 'zoomOut', 'panLeft', 'slideRight'];
    const transitions = ['fade', 'slide', 'dissolve', 'crossfade'];
    const animations = ['KenBurns', 'PanLeft', 'Scale', 'Rotate'];

    let rawScenes: Array<{ voiceText: string; heading: string }> = [];

    if (lines.length >= 2) {
      rawScenes = lines.map((line, idx) => ({
        voiceText: line,
        heading: `Key Point #${idx + 1}`
      }));
    } else {
      // Topic breakdown into 4 distinct key point scenes derived from user's topic
      rawScenes = [
        {
          heading: `Introduction`,
          voiceText: `Welcome to our complete breakdown on ${userTopic}. Today we uncover the key insights and essential takeaways.`
        },
        {
          heading: `Core Concept`,
          voiceText: `Understanding ${userTopic} requires looking at how advanced technology and innovative design come together.`
        },
        {
          heading: `Key Impact`,
          voiceText: `The real power of ${userTopic} lies in its ability to streamline workflows, boost efficiency, and deliver outstanding results.`
        },
        {
          heading: `Summary & Call to Action`,
          voiceText: `Subscribe now to get weekly deep-dive updates on ${userTopic} and stay ahead in the world of modern technology.`
        }
      ];
    }

    const scenes: StructuredSceneItem[] = rawScenes.map((item, idx) => {
      const duration = this.calculateKeyPointDuration(item.voiceText);
      const motion = cameraMotions[idx % cameraMotions.length];
      const trans = transitions[idx % transitions.length];
      const anim = animations[idx % animations.length];

      const cleanPrompt = `${userTopic}, ${item.heading}, cinematic lighting, high quality 8k`;
      const width = isShorts ? 720 : 1280;
      const height = isShorts ? 1280 : 720;
      const assetUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=${width}&height=${height}&seed=${100 + idx * 37}&nologo=true`;

      return {
        sceneNumber: idx + 1,
        duration,
        estimated_duration_sec: duration,
        heading: item.heading,
        voiceText: item.voiceText,
        subtitle: item.voiceText,
        cameraMotion: motion,
        animation: anim,
        transition: trans,
        backgroundPrompt: cleanPrompt,
        imagePrompt: cleanPrompt,
        videoPrompt: `${cleanPrompt}, camera moving with ${motion}`,
        asset: assetUrl,
        voiceAudio: 'https://samples.elevenlabs.io/rachel.mp3',
        subtitleTiming: []
      };
    });

    const voiceoverText = scenes.map(s => s.voiceText).join(' ');
    const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);

    return {
      title,
      totalDuration,
      music: 'corporate',
      scenes,
      input_type: input.inputType,
      input_content: input.content,
      target_audience: input.targetAudience || 'General Audience',
      aspect_ratio: input.aspectRatio || '16:9',
      video_style: input.style || 'Cinematic & Key Points',
      script: {
        title,
        hook: scenes[0].voiceText,
        intro: scenes[1].voiceText,
        sections: scenes,
        outro: scenes[scenes.length - 1].voiceText,
        total_duration_sec: totalDuration
      },
      scene_breakdown: scenes,
      voiceover_text: voiceoverText,
      voice_id: '21m00Tcm4TlvDq8ikWAM',
      audio_url: 'https://samples.elevenlabs.io/rachel.mp3',
      subtitles: scenes.map((s, idx) => ({
        index: idx + 1,
        startTime: `00:00:${String(idx * 6).padStart(2, '0')},000`,
        endTime: `00:00:${String((idx + 1) * 6).padStart(2, '0')},000`,
        text: s.subtitle
      })),
      thumbnail_prompt: `Hyper-realistic 8k thumbnail prompt for "${title}". Key points focus, high contrast subject, cinematic composition --ar ${isShorts ? '9:16' : '16:9'}`,
      youtube_title: `🔥 Key Takeaways: ${title} | Complete Breakdown`,
      title_variations: [
        `🔥 Key Takeaways: ${title} | Complete Breakdown`,
        `How ${title} Changes Everything`,
        `Top 3 Insights on ${title} You Need to Know!`
      ],
      seo_description: `Concise breakdown on ${title}. Learn the core takeaways quickly with AI narration.`,
      seo_keywords: [title.toLowerCase(), 'key points', 'ai video', 'content studio'],
      hashtags: [`#${title.replace(/[^a-zA-Z0-9]/g, '')}`, '#KeyPoints', '#AIVideo'],
      call_to_action: 'Like, comment your thoughts below, and subscribe for weekly key point summaries!'
    };
  }
}
