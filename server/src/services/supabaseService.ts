import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

export class SupabaseStorageService {
  private static client: SupabaseClient | null = null;
  private static readonly ARTWORK_BUCKET = 'scene-artwork';
  private static readonly VIDEO_BUCKET = 'rendered-videos';

  private static getClient(): SupabaseClient | null {
    if (!this.client && config.supabaseUrl && config.supabaseServiceRoleKey) {
      this.client = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
    }
    return this.client;
  }

  /**
   * Ensure public storage buckets exist for artwork and rendered videos
   */
  static async ensureBucketsExist(): Promise<void> {
    const supabase = this.getClient();
    if (!supabase) return;

    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      
      const artworkExists = buckets?.some(b => b.name === this.ARTWORK_BUCKET);
      if (!artworkExists) {
        await supabase.storage.createBucket(this.ARTWORK_BUCKET, { public: true, fileSizeLimit: 10485760 });
      }

      const videoExists = buckets?.some(b => b.name === this.VIDEO_BUCKET);
      if (!videoExists) {
        await supabase.storage.createBucket(this.VIDEO_BUCKET, { public: true, fileSizeLimit: 524288000 }); // 500MB
      }
    } catch (err: any) {
      console.warn('Supabase storage buckets initialization warning:', err.message);
    }
  }

  /**
   * Upload image buffer to Supabase Storage bucket and return public URL
   */
  static async uploadSceneArtwork(imageBuffer: Buffer, fileName: string): Promise<string | null> {
    const supabase = this.getClient();
    if (!supabase) return null;

    try {
      await this.ensureBucketsExist();

      const filePath = `scenes/${fileName}`;
      const { error } = await supabase.storage
        .from(this.ARTWORK_BUCKET)
        .upload(filePath, imageBuffer, { contentType: 'image/png', upsert: true });

      if (error) {
        console.warn('Supabase Storage upload warning:', error.message);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from(this.ARTWORK_BUCKET)
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (err: any) {
      console.warn('Supabase Storage error:', err.message);
      return null;
    }
  }

  /**
   * Upload compiled MP4/WebM video buffer to Supabase Storage bucket
   */
  static async uploadRenderedVideo(videoBuffer: Buffer, fileName: string, mimeType: string = 'video/mp4'): Promise<string | null> {
    const supabase = this.getClient();
    if (!supabase) return null;

    try {
      await this.ensureBucketsExist();

      const filePath = `exports/${fileName}`;
      const { error } = await supabase.storage
        .from(this.VIDEO_BUCKET)
        .upload(filePath, videoBuffer, { contentType: mimeType, upsert: true });

      if (error) {
        console.warn('Supabase Video Storage upload warning:', error.message);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from(this.VIDEO_BUCKET)
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (err: any) {
      console.warn('Supabase Video Storage error:', err.message);
      return null;
    }
  }
}
