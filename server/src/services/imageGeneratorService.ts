import { SupabaseStorageService } from './supabaseService';

export class ImageGeneratorBackendService {
  /**
   * Helper to construct Pollinations AI visual URL
   */
  static getPollinationsImageUrl(prompt: string, sceneNumber: number, aspectRatio: string = '16:9'): string {
    const isShorts = aspectRatio === '9:16';
    const width = isShorts ? 720 : 1280;
    const height = isShorts ? 1280 : 720;
    const seed = (sceneNumber * 1337 + prompt.length) % 99999;
    const cleanPrompt = encodeURIComponent(`cinematic 8k video scene background, ${prompt.slice(0, 120)}, highly detailed, masterpiece`);
    return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
  }

  /**
   * Synthesize AI scene artwork for every scene, upload to Supabase Storage, and return public URLs
   */
  static async generateArtworkForScenes(scenes: any[], aspectRatio: string = '16:9'): Promise<any[]> {
    const updatedScenes = [];

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const promptText = scene.imagePrompt || scene.backgroundPrompt || scene.visual_suggestion || 'cinematic video background';
      const imageUrl = this.getPollinationsImageUrl(promptText, i + 1, aspectRatio);

      try {
        const imgRes = await fetch(imageUrl);
        if (imgRes.ok) {
          const arrayBuffer = await imgRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const fileName = `scene_${i + 1}_${Date.now()}.png`;

          const supabasePublicUrl = await SupabaseStorageService.uploadSceneArtwork(buffer, fileName);
          const finalAssetUrl = supabasePublicUrl || imageUrl;

          updatedScenes.push({
            ...scene,
            asset: finalAssetUrl,
            imageUrl: finalAssetUrl,
            backgroundAsset: finalAssetUrl
          });
          continue;
        }
      } catch (err: any) {
        console.warn(`Scene #${i + 1} artwork upload warning:`, err.message);
      }

      updatedScenes.push({
        ...scene,
        asset: imageUrl,
        imageUrl: imageUrl,
        backgroundAsset: imageUrl
      });
    }

    return updatedScenes;
  }
}
