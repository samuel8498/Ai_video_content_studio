export interface ScenePlanItem {
  sceneId: number;
  title: string;
  duration: number;
  voiceText: string;
  subtitle: string;
  pexelsQuery: string;
  imagePrompt: string;
  videoPrompt: string;
  cameraMovement: string;
  transition: string;
  animation: string;
  backgroundMusic: string;
  soundEffects: string[];
  assetType: 'video' | 'image';
  video?: string;
}

export class ScenePlanningEngine {
  /**
   * Enhanced prompt builder featuring pexelsQuery and cinematic parameters
   */
  private static generateCinematicPrompt(title: string, cameraMotion: string, isShorts: boolean = false): { imagePrompt: string; videoPrompt: string; pexelsQuery: string } {
    const environments = [
      'futuristic AI laboratory holographic workstation',
      'doctor using AI hospital technology',
      'high tech digital editing suite neural network',
      'futuristic city neon skyline'
    ];

    const idx = Math.abs(title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    const pexelsQuery = environments[idx % environments.length];

    const promptText = `${title}. ${pexelsQuery}. Cinematic lighting, 8k resolution, Masterpiece --ar ${isShorts ? '9:16' : '16:9'}`;
    const videoPromptText = `${pexelsQuery}. Camera ${cameraMotion}. Cinematic motion clip 8k.`;

    return {
      imagePrompt: promptText,
      videoPrompt: videoPromptText,
      pexelsQuery
    };
  }

  /**
   * Parse input content into paragraphs and plan one scene per paragraph with pexelsQuery
   */
  static planScenesFromText(content: string, aspectRatio: string = '16:9'): ScenePlanItem[] {
    const isShorts = aspectRatio === '9:16';
    const paragraphs = content
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const paragraphsToProcess = paragraphs.length > 0 ? paragraphs : [content];

    const cameraMovements = ['zoomIn', 'panRight', 'tiltUp', 'zoomOut', 'panLeft', 'slideRight'];
    const transitions = ['fade', 'slide', 'dissolve', 'crossfade'];
    const animations = ['KenBurns', 'PanLeft', 'Scale', 'Rotate'];

    return paragraphsToProcess.map((para, idx) => {
      const words = para.split(/\s+/).filter(Boolean);
      const wordCount = words.length;
      const duration = Math.max(4, Math.ceil(wordCount / 2.5));

      const title = words.slice(0, 5).join(' ') || `Scene ${idx + 1}`;
      const cameraMovement = cameraMovements[idx % cameraMovements.length];
      const transition = transitions[idx % transitions.length];
      const animation = animations[idx % animations.length];

      const { imagePrompt, videoPrompt, pexelsQuery } = this.generateCinematicPrompt(
        title.charAt(0).toUpperCase() + title.slice(1),
        cameraMovement,
        isShorts
      );

      return {
        sceneId: idx + 1,
        title: title.charAt(0).toUpperCase() + title.slice(1),
        duration,
        voiceText: para,
        subtitle: para,
        pexelsQuery,
        imagePrompt,
        videoPrompt,
        cameraMovement,
        transition,
        animation,
        backgroundMusic: 'corporate',
        soundEffects: ['whoosh', 'subtle_ambience'],
        assetType: 'video'
      };
    });
  }
}
