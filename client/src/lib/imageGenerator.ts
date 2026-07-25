export class AIVisualGeneratorService {
  /**
   * Synthesize or fetch visual image asset for a scene based on its visual_suggestion prompt
   */
  static getSceneImageUrl(visualSuggestion: string, sceneNumber: number, aspectRatio: '16:9' | '9:16' | '1:1' = '16:9'): string {
    const isShorts = aspectRatio === '9:16';
    const width = isShorts ? 720 : 1280;
    const height = isShorts ? 1280 : 720;
    
    // Clean prompt for image generation API
    const cleanPrompt = encodeURIComponent(
      `cinematic 8k video b-roll visual, ${visualSuggestion.slice(0, 100)}, highly detailed, vibrant lighting, masterpiece`
    );

    // Pollinations AI dynamic image generator URL with width/height/seed
    const seed = (sceneNumber * 1337 + visualSuggestion.length) % 99999;
    return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
  }

  /**
   * Preload image element and return HTMLImageElement promise
   */
  static async preloadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Fallback Unsplash stock image if AI image service is slow
        const fallbackImg = new Image();
        fallbackImg.crossOrigin = 'anonymous';
        fallbackImg.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80';
        fallbackImg.onload = () => resolve(fallbackImg);
        fallbackImg.onerror = () => resolve(img);
      };
    });
  }
}
