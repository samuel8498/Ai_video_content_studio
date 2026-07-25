import React, { useState, useEffect } from 'react';
import {
  FileText,
  Mic,
  Subtitles,
  Image as ImageIcon,
  Search,
  Copy,
  Check,
  Play,
  Pause,
  Download,
  Share2,
  Sparkles,
  Clock,
  Video,
  ChevronRight,
  RefreshCw,
  Save,
  Volume2,
  Film
} from 'lucide-react';
import { Project, Voice } from '../../types';
import { ApiClient } from '../../lib/api';
import { VideoPlayer } from '../UI/VideoPlayer';

interface ProjectStudioTabProps {
  project: Project;
  onSaveProject: (updated: Project) => void;
  onDuplicateProject: (project: Project) => void;
}

export const ProjectStudioTab: React.FC<ProjectStudioTabProps> = ({
  project: initialProject,
  onSaveProject,
  onDuplicateProject
}) => {
  const [project, setProject] = useState<Project>(initialProject);
  const [activeSubTab, setActiveSubTab] = useState<'video' | 'script' | 'scenes' | 'voice' | 'subtitles' | 'thumbnail' | 'seo'>('video');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(project.voice_id || '21m00Tcm4TlvDq8ikWAM');

  // Audio Playback State
  const [audioUrl, setAudioUrl] = useState<string>(project.audio_url || '');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string>('');

  useEffect(() => {
    // Load voices catalog
    ApiClient.getVoices().then(data => setVoices(data));
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleSynthesizeAudio = async () => {
    setAudioLoading(true);
    try {
      const textToSynthesize = project.voiceover_text || project.script.hook + ' ' + project.script.intro;
      const url = await ApiClient.generateVoiceover(textToSynthesize, selectedVoiceId);
      setAudioUrl(url);
      const updated = { ...project, voice_id: selectedVoiceId, audio_url: url };
      setProject(updated);
      onSaveProject(updated);
    } catch (err) {
      console.error('Audio synthesis failed:', err);
    } finally {
      setAudioLoading(false);
    }
  };

  const downloadSrtFile = () => {
    const srtText = project.subtitles.map(s => `${s.index}\n${s.startTime} --> ${s.endTime}\n${s.text}\n`).join('\n');
    const blob = new Blob([srtText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}_captions.srt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {project.input_type.toUpperCase()}
            </span>
            <span className="text-xs text-gray-400 font-mono">ID: {project.id}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">{project.title}</h2>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-3">
            <span>Target: {project.target_audience}</span>
            <span>•</span>
            <span>Ratio: {project.aspect_ratio}</span>
            <span>•</span>
            <span className="text-purple-400 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> ~{project.script?.total_duration_sec || 45}s Estimated
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSaveProject(project)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-purple-400" /> Save Snapshot
          </button>
          <button
            onClick={() => onDuplicateProject(project)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 transition-all flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" /> Duplicate Project
          </button>
        </div>
      </div>

      {/* Workspace Sub-Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 no-scrollbar">
        {[
          { id: 'video', label: '🎬 Live Video Preview', icon: Film, highlight: true },
          { id: 'script', label: 'Script', icon: FileText },
          { id: 'scenes', label: 'Scene Breakdown', icon: Video },
          { id: 'voice', label: 'Voiceover Studio', icon: Mic },
          { id: 'subtitles', label: 'Subtitles (SRT)', icon: Subtitles },
          { id: 'thumbnail', label: 'Thumbnail Prompt', icon: ImageIcon },
          { id: 'seo', label: 'YouTube SEO & Tags', icon: Search }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : tab.highlight
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 0: LIVE VIDEO PREVIEW PLAYER */}
      {activeSubTab === 'video' && (
        <VideoPlayer project={project} audioUrl={audioUrl} />
      )}

      {/* SUB-TAB 1: SCRIPT EDITOR */}
      {activeSubTab === 'script' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" /> Script Narration Payload
            </h3>
            <button
              onClick={() => copyToClipboard(project.voiceover_text, 'script')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 flex items-center gap-1.5"
            >
              {copiedKey === 'script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'script' ? 'Copied Full Script' : 'Copy Full Script'}
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30">
              <span className="text-[10px] uppercase font-bold text-purple-400 block mb-1">Hook (First 5 Seconds)</span>
              <p className="text-white font-medium leading-relaxed">{project.script.hook}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Intro Narrative</span>
              <p className="text-gray-200 leading-relaxed">{project.script.intro}</p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Body Scene Narrations</span>
              {project.script.sections.map((sec, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between font-bold text-purple-300">
                    <span>Scene {sec.scene_number}: {sec.heading}</span>
                    <span className="text-gray-400 font-mono">~{sec.estimated_duration_sec}s</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{sec.narration}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Outro & Call To Action</span>
              <p className="text-gray-200 leading-relaxed">{project.script.outro}</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SCENE BREAKDOWN */}
      {activeSubTab === 'scenes' && (
        <div className="space-y-6">
          <VideoPlayer project={project} audioUrl={audioUrl} />

          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-400" /> Timed Visual Scene Breakdown & Camera Cues
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.scene_breakdown.map((sec, idx) => (
                <div key={idx} className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-purple-400">Scene #{sec.scene_number}</span>
                    <span className="text-[11px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                      {sec.estimated_duration_sec} Seconds
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{sec.heading}</h4>
                  
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">🎬 Visual Prompt / B-Roll Cue</span>
                    <p className="text-xs text-gray-300 italic">{sec.visual_suggestion}</p>
                  </div>

                  <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                    <span className="font-bold text-gray-300">Camera Angle:</span> {sec.camera_angle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: VOICEOVER STUDIO */}
      {activeSubTab === 'voice' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-pink-400" /> ElevenLabs Voice Synthesis Studio
              </h3>
              <p className="text-xs text-gray-400">Select a voice actor model and generate natural text-to-speech audio.</p>
            </div>
          </div>

          {/* Voice Model Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {voices.map(voice => (
              <div
                key={voice.voice_id}
                onClick={() => setSelectedVoiceId(voice.voice_id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedVoiceId === voice.voice_id
                    ? 'bg-purple-950/50 border-purple-500 shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white">{voice.name}</span>
                  {selectedVoiceId === voice.voice_id && (
                    <Check className="w-4 h-4 text-purple-400" />
                  )}
                </div>
                <p className="text-[11px] text-gray-400 leading-snug">{voice.description}</p>
              </div>
            ))}
          </div>

          {/* Generate Audio Button */}
          <button
            onClick={handleSynthesizeAudio}
            disabled={audioLoading}
            className="w-full py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2"
          >
            {audioLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Volume2 className="w-4 h-4" /> Synthesize Voiceover Audio with ElevenLabs API
              </>
            )}
          </button>

          {/* HTML5 Audio Player */}
          {audioUrl && (
            <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-purple-400 fill-purple-400" /> Generated Narration Audio Track
                </span>
                <a
                  href={audioUrl}
                  download="voiceover.mp3"
                  className="text-xs text-purple-300 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" /> Download MP3
                </a>
              </div>
              <audio controls src={audioUrl} className="w-full rounded-lg" />
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: SUBTITLES */}
      {activeSubTab === 'subtitles' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Subtitles className="w-5 h-5 text-emerald-400" /> Auto-Timed SRT Subtitle Captions
              </h3>
              <p className="text-xs text-gray-400">Export timed SRT subtitle file for video editors.</p>
            </div>
            <button
              onClick={downloadSrtFile}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download .SRT File
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {project.subtitles.map(sub => (
              <div key={sub.index} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-4">
                <span className="text-xs font-mono font-bold text-purple-400 shrink-0">#{sub.index}</span>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 block">{sub.startTime} ──&gt; {sub.endTime}</span>
                  <p className="text-xs text-gray-200">{sub.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: THUMBNAIL PROMPT */}
      {activeSubTab === 'thumbnail' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" /> Midjourney & DALL-E Thumbnail Visual Prompt
            </h3>
            <button
              onClick={() => copyToClipboard(project.thumbnail_prompt, 'thumb')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 flex items-center gap-1.5"
            >
              {copiedKey === 'thumb' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'thumb' ? 'Copied Prompt' : 'Copy Visual Prompt'}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/30 text-xs text-amber-200 font-mono leading-relaxed">
            {project.thumbnail_prompt}
          </div>

          {/* Visual Preview Render Placeholder */}
          <div className="p-8 rounded-2xl bg-gradient-to-tr from-purple-950/40 via-slate-900 to-black border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Thumbnail Composition Blueprint</h4>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Copy the synthesized prompt above into Midjourney v6, DALL-E 3, or Leonardo.ai to generate 8K viral YouTube thumbnails.
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: YOUTUBE SEO & TAGS */}
      {activeSubTab === 'seo' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" /> YouTube Title & SEO Package
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Recommended YouTube Title</span>
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-white font-bold flex justify-between items-center">
                <span>{project.youtube_title}</span>
                <button
                  onClick={() => copyToClipboard(project.youtube_title, 'yt_title')}
                  className="text-purple-300 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Title Variations</span>
              <div className="space-y-2">
                {project.title_variations?.map((t, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 text-gray-200 flex justify-between items-center">
                    <span>{t}</span>
                    <button onClick={() => copyToClipboard(t, `title_${i}`)} className="text-gray-400 hover:text-white">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">SEO Description</span>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                {project.seo_description}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Trending Hashtags</span>
              <div className="flex flex-wrap gap-2">
                {project.hashtags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
