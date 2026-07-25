import React, { useState, useEffect } from 'react';
import {
  Download,
  Film,
  AlertTriangle,
  CheckCircle2,
  Volume1,
  Play
} from 'lucide-react';
import { Project } from '../../types';
import { TimelineManager } from '../../lib/timelineManager';
import { ImageCacheService } from '../../lib/imageCache';
import { ApiClient } from '../../lib/api';
import { RemotionVideoPreview } from './RemotionVideoPreview';

interface VideoPlayerProps {
  project: Project;
  audioUrl?: string;
  onAudioGenerated?: (url: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ project, audioUrl: initialAudioUrl, onAudioGenerated }) => {
  const [rendering, setRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStatus, setRenderStatus] = useState('');
  const [renderError, setRenderError] = useState('');
  const [finishedVideoUrl, setFinishedVideoUrl] = useState<string>('');

  const [audioUrl, setAudioUrl] = useState<string>(initialAudioUrl || project.audio_url || '');
  const [audioSynthesizing, setAudioSynthesizing] = useState<boolean>(false);
  const [quotaError, setQuotaError] = useState<string>('');
  const [audioStatus, setAudioStatus] = useState<string>('Ready');

  const { scenes } = TimelineManager.buildTimeline(project);

  const resolveAudioUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('/')) {
      return `${window.location.origin}${url}`;
    }
    return url;
  };

  useEffect(() => {
    scenes.forEach(s => {
      if (s.asset) ImageCacheService.preloadImage(s.asset);
    });

    if (!audioUrl || audioUrl.includes('MOCK')) {
      autoSynthesizeVoice();
    }
  }, [project]);

  const autoSynthesizeVoice = async () => {
    setAudioSynthesizing(true);
    setQuotaError('');
    setAudioStatus('Synthesizing ElevenLabs Voice...');
    try {
      const updatedScenes = await ApiClient.generateSceneVoices(scenes, project.voice_id || '21m00Tcm4TlvDq8ikWAM');
      if (updatedScenes && updatedScenes[0]?.voiceAudio) {
        const fullUrl = resolveAudioUrl(updatedScenes[0].voiceAudio);
        setAudioUrl(fullUrl);
        setAudioStatus('ElevenLabs Voice Active');
        if (onAudioGenerated) onAudioGenerated(fullUrl);
      }
    } catch (err: any) {
      console.warn('ElevenLabs API warning:', err.message);
      setAudioStatus('Browser Speech Active');
      if (err.message?.includes('429') || err.message?.includes('Quota')) {
        setQuotaError('ElevenLabs Quota Exceeded (429). Using Browser Speech Fallback.');
      }
    } finally {
      setAudioSynthesizing(false);
    }
  };

  /**
   * Render Video Button Workflow:
   * 1. Save project
   * 2. Send scene JSON to POST /api/render
   * 3. Wait for rendering
   * 4. Display progress
   * 5. Display finished video
   * 6. Enable download
   */
  const handleRenderExport = async () => {
    setRendering(true);
    setRenderProgress(10);
    setRenderStatus('Saving project to database...');
    setRenderError('');
    setFinishedVideoUrl('');

    try {
      // 1. Save project
      setRenderProgress(25);
      setRenderStatus('Saving project payload (25%)...');
      let savedProject = project;
      try {
        savedProject = await ApiClient.createProject({
          title: project.title,
          topic: project.topic,
          aspect_ratio: project.aspect_ratio,
          voice_id: project.voice_id,
          scenes: scenes
        });
      } catch (err) {
        console.warn('Project save notice:', err);
      }

      // 2 & 3 & 4. Send scene JSON to POST /api/render and wait for rendering
      setRenderProgress(55);
      setRenderStatus('Rendering Remotion MP4 video on backend (55%)...');

      const response = await ApiClient.renderApi({
        projectId: savedProject.id || project.id || `proj_${Date.now()}`,
        title: project.title,
        scenes: scenes,
        aspect_ratio: project.aspect_ratio
      });

      // 5 & 6. Display finished video & enable download
      const finalUrl = resolveAudioUrl(response.videoUrl);
      setFinishedVideoUrl(finalUrl);

      setRenderProgress(100);
      setRenderStatus('Remotion Video Render Complete! Video Ready.');

      // Trigger direct browser download
      const a = document.createElement('a');
      a.href = finalUrl;
      a.download = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}_remotion.mp4`;
      a.target = '_blank';
      a.click();
    } catch (err: any) {
      console.error('Render API error:', err);
      setRenderError(err.message || 'Remotion video rendering failed.');
    } finally {
      setRendering(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
      {/* Header & Remotion Render Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {project.aspect_ratio} Remotion Render Engine
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Volume1 className="w-3.5 h-3.5 text-emerald-400" /> Audio: {audioStatus}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-purple-400" /> Production AI Remotion Studio
          </h3>
        </div>

        <button
          onClick={handleRenderExport}
          disabled={rendering}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 ${rendering
              ? 'bg-purple-900/60 cursor-not-allowed opacity-80 border border-purple-500/30'
              : 'bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-600/30'
            }`}
        >
          {rendering ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{renderStatus || `Rendering (${renderProgress}%)`}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Render Video (.mp4)
            </>
          )}
        </button>
      </div>

      {/* Render Progress & Status Bar */}
      {rendering && (
        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-purple-300">
            <span>{renderStatus}</span>
            <span>{renderProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${renderProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Finished Video Player Display */}
      {finishedVideoUrl && (
        <div className="p-5 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-300 text-sm font-extrabold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Finished Remotion MP4 Video Ready!
            </div>
            <a
              href={finishedVideoUrl}
              download={`${project.title.replace(/[^a-zA-Z0-9]/g, '_')}_remotion.mp4`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
            >
              <Download className="w-4 h-4" /> Download Finished MP4
            </a>
          </div>

          <div className="w-full rounded-2xl overflow-hidden border border-emerald-500/30 bg-black aspect-video max-h-[420px]">
            <video src={finishedVideoUrl} controls autoPlay className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {/* Error Alert */}
      {renderError && (
        <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="font-semibold">{renderError}</span>
        </div>
      )}

      {quotaError && (
        <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold">{quotaError}</span>
        </div>
      )}

      {/* Live Remotion Viewport */}
      {!finishedVideoUrl && <RemotionVideoPreview project={project} audioUrl={audioUrl} />}
    </div>
  );
};
