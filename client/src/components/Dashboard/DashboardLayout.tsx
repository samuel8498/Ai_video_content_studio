import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  CreditCard,
  BarChart3,
  User,
  Settings,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type DashboardTab = 'overview' | 'create' | 'projects' | 'subscription' | 'usage' | 'profile' | 'settings';

interface DashboardLayoutProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  onSelectTab,
  children
}) => {
  const { user, usage } = useAuth();

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Create Project', icon: PlusCircle, highlight: true },
    { id: 'projects', label: 'My Projects', icon: FolderKanban },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'usage', label: 'Usage Metrics', icon: BarChart3 },
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const remainingDaily = user?.tier === 'pro' ? 'Unlimited' : Math.max(0, usage.max_daily_generations - usage.daily_generations_count);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 glass-panel p-4 rounded-3xl border border-white/10 space-y-6 sticky top-20">
          {/* User Badge */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
              {user?.full_name?.charAt(0) || 'C'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{user?.full_name}</h4>
              <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
              <div className="mt-1 flex items-center gap-1">
                <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                  {user?.tier === 'pro' ? 'PRO PLAN' : 'FREE PLAN'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as DashboardTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : item.highlight
                      ? 'bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Daily Usage Counter Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-950/40 to-black/40 border border-purple-500/20 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-gray-300">
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> Today's Quota</span>
              <span className="text-purple-400 font-mono">{remainingDaily} left</span>
            </div>
            {user?.tier === 'free' && (
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all"
                  style={{ width: `${(usage.daily_generations_count / usage.max_daily_generations) * 100}%` }}
                />
              </div>
            )}
            {user?.tier === 'free' && (
              <button
                onClick={() => onSelectTab('subscription')}
                className="w-full py-2 rounded-xl text-[11px] font-bold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-400" /> Upgrade for Unlimited
              </button>
            )}
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="lg:col-span-9 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
