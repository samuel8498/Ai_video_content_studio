import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { signIn, signUp, resetPassword, loginAsDemoUser } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);

    try {
      if (tab === 'signin') {
        await signIn(email, password);
        onSuccess();
      } else if (tab === 'signup') {
        await signUp(email, password, fullName);
        setInfoMsg('Account created successfully! Verification email sent.');
        setTimeout(() => onSuccess(), 1000);
      } else if (tab === 'reset') {
        await resetPassword(email);
        setInfoMsg('Password reset instructions sent to your email.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = (tier: 'free' | 'pro') => {
    loginAsDemoUser(tier);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 mx-auto mb-3 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {tab === 'signin' && 'Welcome Back'}
            {tab === 'signup' && 'Create Your Account'}
            {tab === 'reset' && 'Reset Password'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {tab === 'signin' && 'Access your AI video pre-production suite'}
            {tab === 'signup' && 'Start generating video scripts & voices in seconds'}
            {tab === 'reset' && 'Enter your email to receive recovery link'}
          </p>
        </div>

        {/* Tab Switcher */}
        {tab !== 'reset' && (
          <div className="flex bg-white/5 p-1 rounded-2xl mb-6 border border-white/5">
            <button
              onClick={() => { setTab('signin'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === 'signin' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === 'signup' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}
        {infoMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {infoMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Alex Vance"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="creator@aivideostudio.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {tab !== 'reset' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-300">Password</label>
                {tab === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setTab('reset')}
                    className="text-[11px] text-purple-400 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {tab === 'signin' && 'Sign In'}
                {tab === 'signup' && 'Create Account'}
                {tab === 'reset' && 'Send Reset Email'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Sandbox Quick Login Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <span className="relative bg-[#111827] px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Quick Sandbox Demo Access
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleDemoClick('free')}
            className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
          >
            Free Plan Demo
          </button>
          <button
            onClick={() => handleDemoClick('pro')}
            className="py-2.5 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-purple-300 hover:text-purple-200 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Pro Plan Demo
          </button>
        </div>
      </div>
    </div>
  );
};
