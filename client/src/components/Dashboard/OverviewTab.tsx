import React from 'react';
import { Sparkles, Video, PlusCircle, Mic, Subtitles, FileText, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface OverviewTabProps {
  onStartCreate: () => void;
  onViewProjects: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onStartCreate, onViewProjects }) => {
  const { user, usage } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-r from-purple-950/60 via-black to-slate-950/80">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Studio Dashboard
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.full_name || 'Creator'}!
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            Ready to produce your next viral video? Convert any topic, article, PDF, or link into scripts, voice-overs, and YouTube SEO packages instantly.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onStartCreate}
              className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Create New AI Project
            </button>
            <button
              onClick={onViewProjects}
              className="px-5 py-3 rounded-xl text-xs font-bold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
            >
              <Video className="w-4 h-4 text-purple-400" /> View Stored Projects
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400 font-semibold">
            <span>Daily AI Quota</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            {usage.daily_generations_count} / {user?.tier === 'pro' ? '∞' : usage.max_daily_generations}
          </p>
          <p className="text-[10px] text-gray-400">Resets daily at 00:00 UTC</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400 font-semibold">
            <span>Total Projects</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{usage.total_projects_count}</p>
          <p className="text-[10px] text-gray-400">Stored in Supabase DB</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400 font-semibold">
            <span>ElevenLabs TTS</span>
            <Mic className="w-4 h-4 text-pink-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">Active</p>
          <p className="text-[10px] text-gray-400">6 Premade & Custom Voices</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400 font-semibold">
            <span>Subscription</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-purple-300 uppercase">{user?.tier || 'Free'}</p>
          <p className="text-[10px] text-purple-400 font-bold">
            {user?.tier === 'pro' ? 'Unlimited Features' : 'Freemium Active'}
          </p>
        </div>
      </div>

      {/* Quick Start Presets */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> Quick-Start Video Ideas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: 'YouTube Shorts Tech Review',
              type: 'Topic',
              format: '9:16 Shorts',
              desc: 'Generate viral tech breakdown scripts with high-paced hooks.'
            },
            {
              title: 'Blog Article to Documentary',
              type: 'Blog URL',
              format: '16:9 Landscape',
              desc: 'Transform long-form articles into timed scene narrations.'
            },
            {
              title: 'Explainer Video Blueprint',
              type: 'Article Text',
              format: '16:9 Landscape',
              desc: 'Synthesize educational concepts into camera directions.'
            }
          ].map((item, i) => (
            <div
              key={i}
              onClick={onStartCreate}
              className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/40 hover:bg-white/10 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex justify-between items-center text-[10px] font-bold text-purple-400">
                <span>{item.type}</span>
                <span className="bg-purple-500/10 px-2 py-0.5 rounded-full">{item.format}</span>
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                {item.title}
              </h4>
              <p className="text-[11px] text-gray-400 leading-snug">{item.desc}</p>
              <div className="pt-2 text-[11px] font-bold text-purple-400 flex items-center gap-1">
                Launch Preset <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
