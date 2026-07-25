export class ImageCacheService {
  private static memoryCache: Map<string, string> = new Map();

  /**
   * Get cached image URL or generate new AI scene image URL from backgroundPrompt
   */
  static getSceneImageUrl(backgroundPrompt: string, sceneNumber: number, aspectRatio: '16:9' | '9:16' | '1:1' = '16:9'): string {
    const cacheKey = `${aspectRatio}_${sceneNumber}_${backgroundPrompt.slice(0, 60)}`;

    if (this.memoryCache.has(cacheKey)) {
      return this.memoryCache.get(cacheKey)!;
    }

    // Try reading from localStorage
    try {
      const stored = localStorage.getItem(`img_cache_${cacheKey}`);
      if (stored) {
        this.memoryCache.set(cacheKey, stored);
        return stored;
      }
    } catch (e) {
      // ignore storage quota errors
    }

    const isShorts = aspectRatio === '9:16';
    const width = isShorts ? 720 : 1280;
    const height = isShorts ? 1280 : 720;
    const seed = Math.abs(this.hashCode(backgroundPrompt + sceneNumber));

    const cleanPrompt = encodeURIComponent(
      `cinematic 8k video scene background, ${backgroundPrompt.slice(0, 120)}, masterpiece, highly detailed, photorealistic`
    );

    const generatedUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

    // Save into cache
    this.memoryCache.set(cacheKey, generatedUrl);
    try {
      localStorage.setItem(`img_cache_${cacheKey}`, generatedUrl);
    } catch (e) {
      // ignore
    }

    return generatedUrl;
  }

  /**
   * Preload an image URL into memory and return HTMLImageElement
   */
  static async preloadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => {
        // High quality Unsplash backup fallback if external API is slow
        const fallback = new Image();
        fallback.crossOrigin = 'anonymous';
        fallback.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80';
        fallback.onload = () => resolve(fallback);
        fallback.onerror = () => resolve(img);
      };
    });
  }

  private static hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}
