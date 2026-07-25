export interface RemotionSceneProps {
  sceneNumber: number;
  duration: number;
  voiceText: string;
  subtitle: string;
  cameraMotion: string;
  animation: string;
  transition: string;
  backgroundPrompt: string;
  imagePrompt: string;
  asset: string;
  voiceAudio: string;
  heading?: string;
  title?: string;
}

export interface VideoCompositionProps {
  title: string;
  scenes: RemotionSceneProps[];
  aspectRatio: '16:9' | '9:16' | '1:1';
  audioUrl?: string;
  music?: string;
}
