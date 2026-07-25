import React, { useState } from 'react';
import { Video, Sparkles, User, LogOut, LayoutDashboard, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onNavigateDashboard: () => void;
  onNavigateLanding: () => void;
  isDashboardView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onNavigateDashboard,
  onNavigateLanding,
  isDashboardView = false
}) => {
  const { user, signOut, loginAsDemoUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateLanding}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Video className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              AI Video Studio
              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                Pro AI
              </span>
            </span>
          </div>
        </div>

        {/* Center Nav Links (Landing View) */}
        {!isDashboardView && (
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-purple-400 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-purple-400 transition-colors">FAQ</a>
          </div>
        )}

        {/* Right Auth Action */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all"
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs text-white">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-gray-200 hidden sm:inline">{user.full_name}</span>
                {user.tier === 'pro' && <Crown className="w-3.5 h-3.5 text-amber-400" />}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-2 border border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-xs font-bold text-white">{user.full_name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full w-max">
                      <Sparkles className="w-3 h-3" /> Plan: {user.tier.toUpperCase()}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onNavigateDashboard();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-2 mt-1"
                  >
                    <LayoutDashboard className="w-4 h-4 text-purple-400" /> Dashboard Studio
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => loginAsDemoUser('free')}
                className="text-xs font-semibold px-3 py-2 text-gray-300 hover:text-white transition-colors hidden sm:block"
              >
                Instant Demo
              </button>
              <button
                onClick={onOpenAuth}
                className="relative group overflow-hidden px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" /> Launch App
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
