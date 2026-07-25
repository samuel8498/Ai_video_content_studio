import React from 'react';
import { Composition } from 'remotion';
import { AIVideoComposition } from './AIVideoComposition';
import { MainComposition } from './MainComposition';
import { RemotionCompositionProps } from './types';

export const RemotionRoot: React.FC = () => {
  const defaultProps: RemotionCompositionProps = {
    title: 'How AI is Changing Healthcare',
    aspectRatio: '16:9',
    music: 'corporate',
    audioUrl: 'https://samples.elevenlabs.io/rachel.mp3',
    scenes: [
      {
        sceneNumber: 1,
        duration: 8,
        voiceText: 'Artificial intelligence is fundamentally transforming healthcare and patient treatment.',
        subtitle: 'AI is fundamentally transforming healthcare and patient treatment.',
        cameraMotion: 'zoomIn',
        animation: 'KenBurns',
        transition: 'fade',
        backgroundPrompt: 'Futuristic medical laboratory with glowing blue DNA strands',
        imagePrompt: 'Futuristic medical laboratory with glowing blue DNA strands',
        asset: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920',
        voiceAudio: 'https://samples.elevenlabs.io/rachel.mp3'
      },
      {
        sceneNumber: 2,
        duration: 10,
        voiceText: 'Advanced machine learning models analyze complex MRI and CT scans in seconds.',
        subtitle: 'Machine learning models analyze MRI scans in seconds.',
        cameraMotion: 'panRight',
        animation: 'PanRight',
        transition: 'slide',
        backgroundPrompt: 'High tech radiological suite with glowing AI brain scan overlay',
        imagePrompt: 'High tech radiological suite with glowing AI brain scan overlay',
        asset: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920',
        voiceAudio: 'https://samples.elevenlabs.io/rachel.mp3'
      }
    ]
  };

  return (
    <>
      {/* Professional Full HD 1080p Compositions */}
      <Composition
        id="AIVideoCompositionHD"
        component={AIVideoComposition as any}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
      />
      <Composition
        id="AIVideoCompositionShortsHD"
        component={AIVideoComposition as any}
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
        id="AIVideoComposition"
        component={AIVideoComposition as any}
        durationInFrames={540}
        fps={30}
        width={1280}
        height={720}
        defaultProps={defaultProps}
      />
      <Composition
        id="MainComposition"
        component={MainComposition as any}
        durationInFrames={540}
        fps={30}
        width={1280}
        height={720}
        defaultProps={defaultProps}
      />
    </>
  );
};

export default RemotionRoot;
