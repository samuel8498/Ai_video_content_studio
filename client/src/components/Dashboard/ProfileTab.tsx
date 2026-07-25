import React from 'react';
import { User, Mail, Shield, Sparkles, BarChart3, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfileTab: React.FC = () => {
  const { user, usage } = useAuth();

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <User className="w-6 h-6 text-purple-400" /> User Profile & Billing Info
        </h2>
        <p className="text-xs text-gray-400 mt-1">Manage your account identity, current plan tier, and usage statistics.</p>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-purple-600 flex items-center justify-center font-extrabold text-2xl text-white shadow-xl shadow-purple-600/30 shrink-0">
          {user?.full_name?.charAt(0) || 'C'}
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <h3 className="text-xl font-bold text-white">{user?.full_name}</h3>
          <p className="text-xs text-gray-400 flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5" /> {user?.email}
          </p>
          <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
              Plan: {user?.tier || 'Free'}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Supabase Auth Active
            </span>
          </div>
        </div>
      </div>

      {/* Account Usage Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
          <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-purple-400" /> Daily Generations Quota
          </span>
          <p className="text-2xl font-extrabold text-white">
            {usage.daily_generations_count} / {user?.tier === 'pro' ? 'Unlimited' : usage.max_daily_generations}
          </p>
          <p className="text-[10px] text-gray-400">Resets daily automatically.</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
          <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-pink-400" /> Saved Projects Stored
          </span>
          <p className="text-2xl font-extrabold text-white">{usage.total_projects_count}</p>
          <p className="text-[10px] text-gray-400">Stored under RLS security policies.</p>
        </div>
      </div>
    </div>
  );
};
