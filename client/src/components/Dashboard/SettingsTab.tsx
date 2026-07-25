import React, { useState } from 'react';
import { Settings, Moon, Sun, Globe, Mic, Bell, Key, Save, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const SettingsTab: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState('English (US)');
  const [defaultVoice, setDefaultVoice] = useState('21m00Tcm4TlvDq8ikWAM');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [customKey, setCustomKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-purple-400" /> Platform & AI Settings
        </h2>
        <p className="text-xs text-gray-400 mt-1">Configure workspace defaults, theme preference, voice actors, and API keys.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Theme Preference */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="font-bold text-white flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-400" />} Theme Preference
            </span>
            <p className="text-gray-400 text-[11px]">Toggle between sleek dark mode and light mode.</p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold"
          >
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>

        {/* Language Selection */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
          <label className="font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" /> Script Generation Language
          </label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full bg-[#111827] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option>English (US)</option>
            <option>English (UK)</option>
            <option>Spanish (Español)</option>
            <option>French (Français)</option>
            <option>German (Deutsch)</option>
            <option>Japanese (日本語)</option>
          </select>
        </div>

        {/* Voice Preference */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
          <label className="font-bold text-white flex items-center gap-2">
            <Mic className="w-4 h-4 text-pink-400" /> Default ElevenLabs Voice Actor
          </label>
          <select
            value={defaultVoice}
            onChange={e => setDefaultVoice(e.target.value)}
            className="w-full bg-[#111827] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="21m00Tcm4TlvDq8ikWAM">Rachel (Documentary & Tech)</option>
            <option value="AZnzlk1XvdvUeBnXmlld">Domi (Shorts & Energetic)</option>
            <option value="EXAVITQu4vr4xnSDxMaL">Bella (Lifestyle & Warm)</option>
            <option value="ErXwobaYiN019PkySvjV">Antoni (Corporate & Educational)</option>
          </select>
        </div>

        {/* Notification Settings */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" /> Email Notifications
            </span>
            <p className="text-gray-400 text-[11px]">Receive monthly usage summaries and product updates.</p>
          </div>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={e => setEmailNotifications(e.target.checked)}
            className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
          />
        </div>

        {/* Default AI Key Configuration */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
          <label className="font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-400" /> Custom ElevenLabs API Key (Optional)
          </label>
          <p className="text-[11px] text-gray-400">
            Leave empty to use our managed background proxy server. Enter your key to use personal custom voices.
          </p>
          <input
            type="password"
            value={customKey}
            onChange={e => setCustomKey(e.target.value)}
            placeholder="xi-api-key-••••••••••••••••"
            className="w-full bg-[#111827] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-500 transition-all flex items-center justify-center gap-2"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
          {saved ? 'Preferences Saved!' : 'Save Settings Preferences'}
        </button>
      </form>
    </div>
  );
};
