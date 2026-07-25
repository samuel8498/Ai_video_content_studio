import React, { useState } from 'react';
import {
  Sparkles,
  Link,
  FileText,
  Upload,
  Globe,
  Sliders,
  Play,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { InputType, AspectRatio, Project } from '../../types';
import { ApiClient } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { ScriptGeneratorSkeleton } from '../UI/Skeletons';

interface CreateProjectTabProps {
  onProjectGenerated: (project: Project) => void;
  onUpgradeNeeded: () => void;
}

export const CreateProjectTab: React.FC<CreateProjectTabProps> = ({
  onProjectGenerated,
  onUpgradeNeeded
}) => {
  const { user, usage, incrementGenerationUsage } = useAuth();
  const [inputType, setInputType] = useState<InputType>('topic');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState('Tech & Content Creators');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [style, setStyle] = useState('Cinematic & Engaging');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const inputTabs: Array<{ id: InputType; label: string; icon: any; placeholder: string }> = [
    {
      id: 'topic',
      label: 'Topic / Idea',
      icon: Sparkles,
      placeholder: 'e.g. "How AI Agents are replacing traditional video production pipelines in 2026"'
    },
    {
      id: 'blog',
      label: 'Blog Post',
      icon: FileText,
      placeholder: 'Paste full blog post text or summary...'
    },
    {
      id: 'article',
      label: 'Article',
      icon: FileText,
      placeholder: 'Paste news article, press release, or document text...'
    },
    {
      id: 'pdf',
      label: 'PDF Document',
      icon: Upload,
      placeholder: 'Paste extracted text content from your research PDF...'
    },
    {
      id: 'url',
      label: 'Website URL',
      icon: Globe,
      placeholder: 'https://example.com/blog/future-of-content-creation'
    }
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMsg('Please enter your topic, text, or website URL');
      return;
    }

    // Check daily quota limit
    const allowed = incrementGenerationUsage();
    if (!allowed) {
      setErrorMsg('Daily generation limit reached for Free Plan. Please upgrade to Pro for unlimited AI.');
      onUpgradeNeeded();
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const project = await ApiClient.generateScript({
        inputType,
        content,
        targetAudience,
        aspectRatio,
        style
      });

      onProjectGenerated(project);
    } catch (err: any) {
      setErrorMsg(err.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 space-y-6">
        <div className="text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 text-purple-400 mx-auto flex items-center justify-center animate-bounce">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Synthesizing Video Pre-Production</h3>
          <p className="text-xs text-gray-400">
            Parsing input text, writing structured scenes, estimating timeline duration, and generating ElevenLabs script payload...
          </p>
        </div>
        <ScriptGeneratorSkeleton />
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" /> AI Video Project Generator
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Select your input source type and configure video preferences to generate complete pre-production assets.
        </p>
      </div>

      {/* Input Source Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
        {inputTabs.map(tab => {
          const Icon = tab.icon;
          const isSelected = inputType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setInputType(tab.id); setErrorMsg(''); }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" /> {errorMsg}
          </span>
          {user?.tier === 'free' && (
            <button onClick={onUpgradeNeeded} className="text-xs font-bold underline text-purple-300">
              Upgrade to Pro
            </button>
          )}
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleGenerate} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-300 mb-2">
            {inputTabs.find(t => t.id === inputType)?.label} Input Content
          </label>
          <textarea
            required
            rows={5}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={inputTabs.find(t => t.id === inputType)?.placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-sans leading-relaxed"
          />
        </div>

        {/* Configuration Selectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Target Audience</label>
            <select
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
              className="w-full bg-[#111827] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option>Tech & Content Creators</option>
              <option>General Audience</option>
              <option>Business & Marketing Professionals</option>
              <option>Students & Educational</option>
              <option>Shorts & Reels Consumers</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Video Format / Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={e => setAspectRatio(e.target.value as AspectRatio)}
              className="w-full bg-[#111827] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="16:9">YouTube Landscape (16:9)</option>
              <option value="9:16">Shorts / TikTok / Reels (9:16)</option>
              <option value="1:1">Square Social (1:1)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Video Style & Tone</label>
            <select
              value={style}
              onChange={e => setStyle(e.target.value)}
              className="w-full bg-[#111827] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option>Cinematic & Engaging</option>
              <option>Fast-Paced Viral Storytelling</option>
              <option>Educational & Deep-Dive</option>
              <option>Corporate & Professional</option>
              <option>Energetic & Hype</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-xl shadow-purple-600/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 text-amber-400" /> Generate Complete Video Pre-Production Suite
        </button>
      </form>
    </div>
  );
};
