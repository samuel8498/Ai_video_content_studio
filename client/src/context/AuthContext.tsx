import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile, Usage } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  usage: Usage;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginAsDemoUser: (tier?: 'free' | 'pro') => void;
  incrementGenerationUsage: () => boolean;
  upgradeToPro: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [usage, setUsage] = useState<Usage>({
    daily_generations_count: 1,
    max_daily_generations: 3,
    total_projects_count: 2,
    max_stored_projects: 5
  });

  useEffect(() => {
    // Initial Supabase auth check
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || 'Creator',
            tier: 'free'
          });
        }
      } catch (err) {
        console.log('Supabase session listener using fallback demo profile.');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          full_name: data.user.user_metadata?.full_name || email.split('@')[0],
          tier: 'free'
        });
      }
    } catch (err: any) {
      // Fallback for immediate demo testing
      setUser({
        id: `usr_${Date.now()}`,
        email,
        full_name: email.split('@')[0] || 'Demo Creator',
        tier: 'free'
      });
    }
  };

  const signUp = async (email: string, pass: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { full_name: fullName } }
      });
      if (error) throw error;
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          full_name: fullName,
          tier: 'free'
        });
      }
    } catch (err: any) {
      setUser({
        id: `usr_${Date.now()}`,
        email,
        full_name: fullName,
        tier: 'free'
      });
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await supabase.auth.resetPasswordForEmail(email);
  };

  const loginAsDemoUser = (tier: 'free' | 'pro' = 'free') => {
    setUser({
      id: 'demo_user_123',
      email: 'creator@aivideostudio.com',
      full_name: 'Alex Vance',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      tier
    });
    setUsage(prev => ({
      ...prev,
      max_daily_generations: tier === 'pro' ? 9999 : 3,
      max_stored_projects: tier === 'pro' ? 9999 : 5
    }));
  };

  const incrementGenerationUsage = (): boolean => {
    if (user?.tier === 'free' && usage.daily_generations_count >= usage.max_daily_generations) {
      return false; // Limit reached
    }
    setUsage(prev => ({
      ...prev,
      daily_generations_count: prev.daily_generations_count + 1,
      total_projects_count: prev.total_projects_count + 1
    }));
    return true;
  };

  const upgradeToPro = () => {
    if (user) {
      setUser({ ...user, tier: 'pro' });
      setUsage(prev => ({
        ...prev,
        max_daily_generations: 9999,
        max_stored_projects: 9999
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        usage,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        loginAsDemoUser,
        incrementGenerationUsage,
        upgradeToPro
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
