import React from 'react';
import { Composition } from 'remotion';
import { VideoComposition } from './VideoComposition';
import { VideoCompositionProps } from './types';

export const RemotionServerRoot: React.FC = () => {
  const defaultProps: VideoCompositionProps = {
    title: 'AI Video Content Studio Production',
    aspectRatio: '16:9',
    music: 'corporate',
    audioUrl: 'https://samples.elevenlabs.io/rachel.mp3',
    scenes: [
      {
        sceneNumber: 1,
        duration: 8,
        voiceText: 'Artificial intelligence is fundamentally transforming video content creation.',
        subtitle: 'AI is fundamentally transforming video content creation.',
        cameraMotion: 'zoomIn',
        animation: 'KenBurns',
        transition: 'fade',
        backgroundPrompt: 'Futuristic AI video laboratory with glowing purple light strands',
        imagePrompt: 'Futuristic AI video laboratory with glowing purple light strands',
        asset: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920',
        voiceAudio: 'https://samples.elevenlabs.io/rachel.mp3'
      },
      {
        sceneNumber: 2,
        duration: 10,
        voiceText: 'Remotion server composition engines bundle and render MP4 videos in seconds.',
        subtitle: 'Remotion composition engines render MP4 videos in seconds.',
        cameraMotion: 'panRight',
        animation: 'PanRight',
        transition: 'slide',
        backgroundPrompt: 'High tech digital editing suite showing real time timeline rendering',
        imagePrompt: 'High tech digital editing suite showing real time timeline rendering',
        asset: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920',
        voiceAudio: 'https://samples.elevenlabs.io/rachel.mp3'
      }
    ]
  };

  return (
    <>
      {/* Professional Full HD 1080p Compositions */}
      <Composition
        id="VideoCompositionHD"
        component={VideoComposition as any}
        durationInFrames={540} // 18 seconds * 30 fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
      />
      <Composition
        id="VideoCompositionShortsHD"
        component={VideoComposition as any}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultProps,
          aspectRatio: '9:16'
        }}
      />
      <Composition
        id="VideoComposition"
        component={VideoComposition as any}
        durationInFrames={540}
        fps={30}
        width={1280}
        height={720}
        defaultProps={defaultProps}
      />
    </>
  );
};

export default RemotionServerRoot;
