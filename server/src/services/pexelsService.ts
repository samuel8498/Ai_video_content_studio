import axios from "axios";
import { config } from "../config";

const API_URL = "https://api.pexels.com/videos/search";

export async function searchVideo(query: string): Promise<string | null> {
  try {
    const apiKey = config.pexelsApiKey || process.env.PEXELS_API_KEY || "apgXE1l2VxkBi6wB074XbzCR0eFqGd8b5BUyTC7gGf9pAlMPiuhqLlxX";
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: apiKey,
      },
      params: {
        query: query || "artificial intelligence",
        per_page: 1,
      },
    });

    if (
      response.data.videos &&
      response.data.videos.length > 0 &&
      response.data.videos[0].video_files &&
      response.data.videos[0].video_files.length > 0
    ) {
      const link = response.data.videos[0].video_files[0].link;
      console.log(`✅ [Pexels Service] Found video for query "${query}": ${link}`);
      return link;
    }

    return null;
  } catch (error) {
    console.error("Pexels Error:", error);
    return null;
  }
}

export const searchPexelsVideo = searchVideo;