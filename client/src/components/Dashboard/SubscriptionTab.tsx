import React, { useState } from 'react';
import { CreditCard, Check, Sparkles, Shield, CheckCircle2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PaymentModal } from '../UI/PaymentModal';

export const SubscriptionTab: React.FC = () => {
  const { user, upgradeToPro } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activePlan, setActivePlan] = useState<string>(user?.tier === 'pro' ? 'Pro Creator' : 'Starter');
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<{ name: string; price: string; period: string } | null>(null);

  const handleOpenPaymentModal = (planName: string, monthlyPrice: number, yearlyPrice: number) => {
    const isYearly = billingCycle === 'yearly';
    const priceStr = isYearly ? `$${yearlyPrice}` : `$${monthlyPrice}`;
    const periodStr = isYearly ? 'year (billed annually)' : 'month';

    setSelectedCheckoutPlan({
      name: planName,
      price: priceStr,
      period: periodStr
    });
  };

  const handlePaymentSuccess = (planName: string) => {
    upgradeToPro();
    setActivePlan(planName);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-8">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Billing & Quotas
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Active Tier: {activePlan}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-400" /> SaaS Subscription & Payment Checkout
          </h2>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Yearly <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Active Plan Status Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-purple-900/40 to-black border border-purple-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-extrabold text-white">
              CURRENT PLAN: {activePlan.toUpperCase()}
            </h3>
          </div>
          <p className="text-xs text-purple-300">
            Enjoy full access to AI script generation, ElevenLabs voice synthesis, Pexels HD video search, and Remotion 1080p exports.
          </p>
        </div>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Subscription Active
        </span>
      </div>

      {/* Pricing Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Starter Plan */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-white">Free Starter</h3>
              <p className="text-xs text-gray-400">For beginners exploring AI video content creation.</p>
            </div>
            <div className="text-2xl font-black text-white">$0 <span className="text-xs font-normal text-gray-400">/ mo</span></div>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> 3 AI generations per day</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Standard 720p HD exports</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Basic Web Speech voice synthesis</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> 5 stored projects</li>
            </ul>
          </div>
          <button
            disabled={activePlan === 'Starter'}
            className="w-full py-2.5 rounded-xl font-bold text-xs border border-white/10 text-gray-300 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {activePlan === 'Starter' ? 'Current Active Plan' : 'Downgrade to Starter'}
          </button>
        </div>

        {/* Pro Creator Plan (Featured) */}
        <div className="glass-panel p-6 rounded-2xl border-2 border-purple-500 bg-purple-950/20 relative flex flex-col justify-between space-y-6 shadow-2xl shadow-purple-600/20">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase font-black px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md">
            Most Popular
          </span>
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                Pro Creator Plan <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-purple-200">For YouTubers, TikTokers, and serious content creators.</p>
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {billingCycle === 'yearly' ? '$24' : '$29'} <span className="text-xs font-normal text-purple-300">/ mo</span>
            </div>
            <ul className="space-y-2.5 text-xs text-gray-200">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Unlimited AI Generations</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Full HD 1080p Remotion MP4 Exports</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> ElevenLabs Multilingual Voice Synthesis</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Pexels & Pixabay HD Video Search</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Export SRT Captions & Subtitles</li>
            </ul>
          </div>
          <button
            onClick={() => handleOpenPaymentModal('Pro Creator', 29, 288)}
            className="w-full py-3 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 hover:from-purple-500 hover:to-pink-500 shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5"
          >
            {activePlan === 'Pro Creator' ? 'Renew Pro Plan' : 'Subscribe to Pro'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Enterprise Ultra Plan */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                Enterprise Ultra <Zap className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-gray-400">For agencies, production teams, and API power users.</p>
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {billingCycle === 'yearly' ? '$79' : '$99'} <span className="text-xs font-normal text-gray-400">/ mo</span>
            </div>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Everything in Pro Creator</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Priority GPU Render Queue (5x faster)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Custom Watermark & Brand Kit</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> REST API Access (`POST /api/render`)</li>
            </ul>
          </div>
          <button
            onClick={() => handleOpenPaymentModal('Enterprise Ultra', 99, 948)}
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            Upgrade to Enterprise
          </button>
        </div>
      </div>

      {/* Payment Gateway Architecture */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-400 space-y-1">
        <p className="font-bold text-white flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-purple-400" /> Production Stripe & Razorpay Gateway Architecture
        </p>
        <p className="text-[11px] text-gray-400">
          Integrated with Supabase `public.subscriptions` table (`stripe_customer_id`, `stripe_subscription_id`, `status`). Prepared to accept webhooks at `POST /api/webhooks/stripe`.
        </p>
      </div>

      {/* Interactive Payment Checkout Modal */}
      {selectedCheckoutPlan && (
        <PaymentModal
          isOpen={!!selectedCheckoutPlan}
          onClose={() => setSelectedCheckoutPlan(null)}
          onSuccess={handlePaymentSuccess}
          plan={selectedCheckoutPlan}
        />
      )}
    </div>
  );
};
