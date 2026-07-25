import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Mic,
  FileText,
  Subtitles,
  Image as ImageIcon,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Play,
  Share2,
  Sliders,
  CheckCircle,
  HelpCircle,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onOpenAuth: () => void;
  onNavigateDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onNavigateDashboard }) => {
  const { user, loginAsDemoUser } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleLaunchApp = () => {
    if (user) {
      onNavigateDashboard();
    } else {
      onOpenAuth();
    }
  };

  const faqs = [
    {
      q: 'How does AI Video Content Studio turn a topic or link into a complete video setup?',
      a: 'Our natural language pre-production engine reads your input topic, blog URL, or article text and instantly outputs a structured hook, scene-by-scene narration script, visual cues, ElevenLabs synthetic voiceover, SRT captions, and YouTube SEO metadata.'
    },
    {
      q: 'Can I connect my own ElevenLabs API key?',
      a: 'Yes! In your Studio Settings, you can either use our managed voice proxy or enter your custom ElevenLabs API key for direct voice model access and voice cloning features.'
    },
    {
      q: 'What is included in the Free tier versus Pro?',
      a: 'Free plan accounts get 3 AI pre-productions per day and up to 5 saved projects. Pro plan subscribers enjoy unlimited generations, unlimited project storage, priority ElevenLabs synthesis processing, full SRT exports, and advanced thumbnail synthesis.'
    },
    {
      q: 'How are database records and files secured?',
      a: 'All project data is stored in Supabase PostgreSQL with strict Row Level Security (RLS) policies. Your scripts, generated voices, and settings are strictly accessible only by your authenticated user session.'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Glow Spheres Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-pink-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-purple-500/30 text-purple-300 text-xs font-bold mb-6 shadow-lg shadow-purple-900/20 animate-pulse-slow">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Next-Gen Video Pre-Production Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Turn Any Topic, Article or Link Into a <span className="gradient-text">Complete AI Video</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Automate video pre-production in seconds. Generate professional scripts, scene breakdowns, ElevenLabs voice-overs, SRT subtitles, and viral YouTube SEO packages.
          </p>

          {/* CTA Group */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleLaunchApp}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-xl shadow-purple-600/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" /> Start Generating Free <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { loginAsDemoUser('pro'); onNavigateDashboard(); }}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl font-bold text-sm text-gray-200 glass-panel hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-purple-400 fill-purple-400" /> Explore Interactive Demo
            </button>
          </div>

          {/* Live Studio Mockup Card */}
          <div className="mt-16 max-w-5xl mx-auto glass-panel p-4 sm:p-6 rounded-3xl border border-white/15 shadow-2xl relative group">
            <div className="absolute -top-3 left-6 bg-purple-600 text-white text-[10px] uppercase font-bold px-3 py-0.5 rounded-full shadow">
              Live Interactive Pre-Production Studio
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {/* Col 1: Topic Input */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                  <span className="flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-purple-400" /> Input Source</span>
                  <span className="text-purple-400">Topic / URL</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-purple-500/30 text-xs text-purple-200 font-mono">
                  Topic: "Quantum Computing Breakthroughs in 2026"
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">Shorts 9:16</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">Rachel Voice</span>
                </div>
              </div>

              {/* Col 2: Generated Scene & Narration */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                  <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-emerald-400" /> Scene Breakdown #1</span>
                  <span className="text-emerald-400">Duration: 10s</span>
                </div>
                <p className="text-xs text-gray-300 italic">
                  "Did you know quantum processors just achieved 99.9% error correction? Here is why tech giants are shifting overnight..."
                </p>
                <div className="text-[10px] text-gray-400 bg-black/30 p-2 rounded-lg">
                  🎬 Visual: Dynamic zoom into glowing quantum grid chip with neon particle trails.
                </div>
              </div>

              {/* Col 3: Audio & Subtitle Sync */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                  <span className="flex items-center gap-1.5"><Mic className="w-3.5 h-3.5 text-pink-400" /> ElevenLabs Speech</span>
                  <span className="text-pink-400">Sync: 100%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                    <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="h-1.5 bg-purple-500/40 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-purple-400 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-[10px] text-purple-300 font-mono">00:00:04 / 00:00:10</p>
                  </div>
                </div>
                <div className="text-[10px] text-amber-300 font-semibold bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 flex items-center gap-1.5">
                  <Subtitles className="w-3.5 h-3.5" /> Auto SRT & VTT Subtitles Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need for Viral Video Creation
          </h2>
          <p className="mt-4 text-gray-400 text-sm">
            Replace separate scriptwriters, voice actors, subtitle generators, and SEO tools with one unified AI workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: FileText,
              color: 'from-purple-500 to-indigo-600',
              title: 'Professional Scriptwriting',
              desc: 'Generates structured hooks, intro problems, multi-scene body narratives, and high-converting call-to-actions.'
            },
            {
              icon: Sliders,
              color: 'from-pink-500 to-rose-600',
              title: 'Timed Scene Breakdown',
              desc: 'Calculates exact scene duration, camera angles (zoom, tilt, macro), and visual prompt descriptions for editors.'
            },
            {
              icon: Mic,
              color: 'from-violet-500 to-purple-600',
              title: 'ElevenLabs Voiceover',
              desc: 'Direct integration with ElevenLabs text-to-speech engine with hyper-realistic human voice models.'
            },
            {
              icon: Subtitles,
              color: 'from-emerald-500 to-teal-600',
              title: 'SRT Subtitle Export',
              desc: 'Auto-aligned timestamp captions ready for direct import into CapCut, Premiere Pro, DaVinci Resolve, or YouTube.'
            },
            {
              icon: ImageIcon,
              color: 'from-amber-500 to-orange-600',
              title: 'Midjourney Thumbnail Prompts',
              desc: 'Synthesizes high-click-through visual prompts optimized for Midjourney and DALL-E 3 image rendering.'
            },
            {
              icon: Search,
              color: 'from-blue-500 to-cyan-600',
              title: 'YouTube SEO Suite',
              desc: 'Generates 5 catchy title variations, timestamped SEO descriptions, indexed keywords, and trending hashtags.'
            }
          ].map((f, i) => (
            <div key={i} className="glass-panel p-6 rounded-3xl border border-white/10 glass-panel-hover group">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 glass-panel rounded-3xl border border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white">How It Works in 4 Steps</h2>
          <p className="text-xs text-gray-400 mt-2">From raw concept to broadcast-ready assets in under 60 seconds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            { step: '01', title: 'Input Content', desc: 'Paste a topic idea, blog link, news article, or raw text.' },
            { step: '02', title: 'AI Generation', desc: 'Engine generates script, scene breakdown, and visual instructions.' },
            { step: '03', title: 'Synthesize Audio', desc: 'ElevenLabs voice model renders realistic MP3 narration.' },
            { step: '04', title: 'Export Package', desc: 'Download SRT subtitles, SEO metadata, and thumbnail prompts.' }
          ].map((s, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5 relative">
              <span className="text-3xl font-extrabold text-purple-400/30 block mb-2 font-mono">{s.step}</span>
              <h4 className="text-sm font-bold text-white mb-1">{s.title}</h4>
              <p className="text-xs text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 text-xs mt-2">Scale as your channel grows. Cancel anytime.</p>

          {/* Billing Switcher */}
          <div className="mt-6 inline-flex items-center gap-3 glass-panel p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
                billingCycle === 'monthly' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly Billing <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* FREE PLAN */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Free Starter</h3>
                <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">Freemium</span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-gray-400"> / forever</span>
              </div>
              <ul className="space-y-3 text-xs text-gray-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> 3 AI generations per day</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Save up to 5 projects</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Basic script & scene breakdown</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Standard text-to-speech audio</li>
                <li className="flex items-center gap-2 text-gray-500 line-through">Unlimited project storage</li>
                <li className="flex items-center gap-2 text-gray-500 line-through">Priority ElevenLabs TTS engine</li>
              </ul>
            </div>
            <button
              onClick={() => { loginAsDemoUser('free'); onNavigateDashboard(); }}
              className="w-full py-3 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              Get Started Free
            </button>
          </div>

          {/* PRO PLAN */}
          <div className="glass-panel p-8 rounded-3xl border border-purple-500/50 relative flex flex-col justify-between space-y-6 bg-gradient-to-b from-purple-950/40 to-black/60 shadow-2xl">
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] uppercase font-bold px-3 py-0.5 rounded-full shadow">
              Most Popular
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Pro Creator <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">
                  {billingCycle === 'monthly' ? '$29' : '$23'}
                </span>
                <span className="text-xs text-gray-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-gray-200">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Unlimited AI Generations</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Unlimited Stored Projects</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Premium ElevenLabs Voice Models</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Export SRT & VTT Subtitles</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Priority Processing Queue</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Custom ElevenLabs API Key Integration</li>
              </ul>
            </div>
            <button
              onClick={() => { loginAsDemoUser('pro'); onNavigateDashboard(); }}
              className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-600/30 transition-all"
            >
              Upgrade to Pro Creator
            </button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-purple-400" /> Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              className="glass-panel p-5 rounded-2xl border border-white/10 cursor-pointer transition-all"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white">{faq.q}</h4>
                {activeFaq === index ? (
                  <ChevronUp className="w-4 h-4 text-purple-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
              {activeFaq === index && (
                <p className="mt-3 text-xs text-gray-300 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 mx-auto flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Have Questions or Custom Enterprise Needs?</h3>
            <p className="text-xs text-gray-400 mt-1">Our engineering and product team is here to support your workflow.</p>
          </div>

          {contactSent ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
              Thank you! Your message has been sent. We will respond within 2 hours.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setContactSent(true);
              }}
              className="space-y-3 text-left"
            >
              <textarea
                required
                rows={3}
                value={contactMessage}
                onChange={e => setContactMessage(e.target.value)}
                placeholder="How can we help your video production workflow?"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors"
              >
                Send Support Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
