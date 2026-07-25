import React from 'react';
import { Video, ShieldCheck, Zap, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 glass-panel bg-[#0B0F19]/80 py-12 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base text-white">AI Video Content Studio</span>
          </div>
          <p className="text-gray-400 leading-relaxed max-w-sm">
            Autonomous video pre-production platform. Transform topics, articles, PDFs, and links into scripts, voice-overs, timed scene timelines, and YouTube SEO packages in seconds.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-3 py-1 rounded-full w-max border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> All Systems Operational
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3 text-sm">Product</h4>
          <ul className="space-y-2">
            <li><a href="#features" className="hover:text-purple-400 transition-colors">Script Generator</a></li>
            <li><a href="#features" className="hover:text-purple-400 transition-colors">ElevenLabs Voice TTS</a></li>
            <li><a href="#features" className="hover:text-purple-400 transition-colors">SRT Subtitles</a></li>
            <li><a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing Plans</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3 text-sm">Resources</h4>
          <ul className="space-y-2">
            <li><a href="#faq" className="hover:text-purple-400 transition-colors">API Documentation</a></li>
            <li><a href="#how-it-works" className="hover:text-purple-400 transition-colors">Workflow Blueprint</a></li>
            <li><a href="#faq" className="hover:text-purple-400 transition-colors">Supabase RLS Architecture</a></li>
            <li><a href="#faq" className="hover:text-purple-400 transition-colors">ElevenLabs Integration Guide</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3 text-sm">Legal & Security</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Supabase Row Level Security</li>
            <li className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-purple-400" /> End-to-End API Proxy</li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-500">© 2026 AI Video Content Studio Inc. All rights reserved.</p>
        <p className="flex items-center gap-1 text-gray-500">
          Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for Creators Worldwide.
        </p>
      </div>
    </footer>
  );
};
