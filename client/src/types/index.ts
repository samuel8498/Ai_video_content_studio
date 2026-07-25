export type InputType = 'topic' | 'blog' | 'article' | 'pdf' | 'url';
export type SubscriptionTier = 'free' | 'pro';
export type AspectRatio = '16:9' | '9:16' | '1:1';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  tier: SubscriptionTier;
  ai_provider_key?: string;
}

export interface Usage {
  daily_generations_count: number;
  max_daily_generations: number;
  total_projects_count: number;
  max_stored_projects: number;
}

export interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description: string;
  preview_url: string;
}

export interface SubtitleTimingItem {
  word: string;
  start: number;
  end: number;
}

/**
 * Exact Structured Scene Schema
 */
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
  soundEffect?: string;
  music?: string;

  // Compatibility fields
  id?: string;
  startTime?: number;
  endTime?: number;
  backgroundAsset?: string;
  scene_number?: number;
  heading?: string;
  narration?: string;
  visual_suggestion?: string;
  camera_angle?: string;
  estimated_duration_sec?: number;
  imageUrl?: string;
  voiceUrl?: string;
}

export interface AIProjectOutput {
  title: string;
  totalDuration: number;
  music: string;
  scenes: StructuredSceneItem[];
}

export type TimelineScene = StructuredSceneItem;
export type StructuredScene = StructuredSceneItem;
export type Scene = StructuredSceneItem;

export interface SubtitleChunk {
  index: number;
  startTime: string;
  endTime: string;
  text: string;
}

export interface ScriptData {
  title: string;
  hook: string;
  intro: string;
  sections: any[];
  outro: string;
  total_duration_sec: number;
}

export interface Project {
  id: string;
  user_id?: string;
  title: string;
  input_type: InputType;
  input_content: string;
  target_audience: string;
  aspect_ratio: AspectRatio;
  video_style: string;
  topic?: string;
  style?: string;
  totalDuration?: number;
  music?: string;
  script: ScriptData;
  scene_breakdown: StructuredSceneItem[];
  scenes: StructuredSceneItem[];
  voiceover_text: string;
  voice_id: string;
  audio_url?: string;
  subtitles: SubtitleChunk[];
  thumbnail_prompt: string;
  youtube_title: string;
  title_variations?: string[];
  seo_description: string;
  seo_keywords: string[];
  hashtags: string[];
  call_to_action: string;
  
  status: 'draft' | 'generating' | 'completed' | 'failed';
  is_favorite?: boolean;
  created_at: string;
  updated_at: string;
}
