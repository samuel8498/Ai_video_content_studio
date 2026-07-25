import React from 'react';
import { Composition } from 'remotion';
import { VideoComposition } from './VideoComposition';
import { RemotionCompositionProps } from '../src/remotion/types';

export const RemotionClientRoot: React.FC = () => {
  const defaultProps: RemotionCompositionProps = {
    title: 'AI Video Production Engine',
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
      {/* Full HD 1080p Compositions */}
      <Composition
        id="VideoCompositionHD"
        component={VideoComposition as any}
        durationInFrames={540} // 18s * 30fps
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

      {/* Standard HD 720p Compositions */}
      <Composition
        id="VideoComposition"
        component={VideoComposition as any}
        durationInFrames={540}
        fps={30}
        width={1280}
        height={720}
        defaultProps={defaultProps}
      />
      <Composition
        id="VideoCompositionShorts"
        component={VideoComposition as any}
        durationInFrames={540}
        fps={30}
        width={720}
        height={1280}
        defaultProps={{
          ...defaultProps,
          aspectRatio: '9:16'
        }}
      />
    </>
  );
};

export default RemotionClientRoot;
