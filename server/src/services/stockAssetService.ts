import fs from 'fs';
import path from 'path';
import { searchVideo } from './pexelsService';
import { ImageGeneratorBackendService } from './imageGeneratorService';

export class StockAssetService {
  private static assetCache = new Map<string, string>();

  /**
   * Process scenes using pexelsQuery -> searchVideo -> fallback to AI Visual
   */
  static async processScenesWithStockAssets(scenes: any[], aspectRatio: string = '16:9'): Promise<any[]> {
    const updatedScenes = [];

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const queryToSearch = scene.pexelsQuery || scene.videoPrompt || scene.title || 'artificial intelligence';
      const cacheKey = `${queryToSearch}_${aspectRatio}`;

      let videoUrl: string | null = null;

      if (this.assetCache.has(cacheKey)) {
        videoUrl = this.assetCache.get(cacheKey)!;
      } else {
        console.log(`\n🎥 [Pexels Integration] Searching Pexels video for Scene #${i + 1} ("${queryToSearch}")...`);
        videoUrl = await searchVideo(queryToSearch);

        if (videoUrl) {
          this.assetCache.set(cacheKey, videoUrl);
        }
      }

      const finalAssetUrl = videoUrl || ImageGeneratorBackendService.getPollinationsImageUrl(scene.imagePrompt || queryToSearch, i + 1, aspectRatio);

      updatedScenes.push({
        ...scene,
        video: finalAssetUrl,
        videoUrl: finalAssetUrl,
        asset: finalAssetUrl,
        imageUrl: finalAssetUrl,
        backgroundAsset: finalAssetUrl,
        isStockVideo: !!videoUrl
      });
    }

    return updatedScenes;
  }
}
