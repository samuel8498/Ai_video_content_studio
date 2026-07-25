-- ==========================================
-- AI VIDEO CONTENT STUDIO - SUPABASE DATABASE SCHEMA
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  ai_provider_key TEXT, -- optional user override key
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------
-- 2. SUBSCRIPTIONS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro_monthly', 'pro_yearly')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------
-- 3. USAGE TRACKING TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  daily_generations_count INT NOT NULL DEFAULT 0,
  last_generation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_projects_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------
-- 4. VOICES TABLE (ElevenLabs catalog & custom)
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.voices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  elevenlabs_voice_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'premade',
  gender TEXT CHECK (gender IN ('male', 'female', 'neutral')),
  accent TEXT,
  preview_url TEXT,
  description TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------
-- 5. PROJECTS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  input_type TEXT NOT NULL CHECK (input_type IN ('topic', 'blog', 'article', 'pdf', 'url')),
  input_content TEXT NOT NULL,
  target_audience TEXT DEFAULT 'General',
  aspect_ratio TEXT DEFAULT '16:9' CHECK (aspect_ratio IN ('16:9', '9:16', '1:1')),
  video_style TEXT DEFAULT 'Cinematic & Engaging',
  
  -- Generated AI Outputs
  script JSONB, -- { title, hook, intro, sections: [{ scene: 1, narration: "", visual_prompt: "", duration_sec: 10 }], outro }
  scene_breakdown JSONB DEFAULT '[]'::jsonb,
  voiceover_text TEXT,
  voice_id TEXT DEFAULT '21m00Tcm4TlvDq8ikWAM', -- Default Rachel voice ID
  audio_url TEXT,
  subtitles JSONB DEFAULT '[]'::jsonb, -- Array of SRT timed chunks
  thumbnail_prompt TEXT,
  youtube_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  hashtags TEXT[],
  call_to_action TEXT,
  
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('draft', 'generating', 'completed', 'failed')),
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------
-- 6. PROJECT HISTORY TABLE (Snapshots/Revisions)
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('created', 'updated', 'voice_generated', 'duplicated')),
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------
-- INDEXES FOR PERFORMANCE
-- ------------------------------------------
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_project_history_project_id ON public.project_history(project_id);

-- ------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_history ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Subscriptions Policies
CREATE POLICY "Users can read own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Usage Policies
CREATE POLICY "Users can read own usage" ON public.usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON public.usage
  FOR UPDATE USING (auth.uid() = user_id);

-- Voices Policies (Publicly readable)
CREATE POLICY "Anyone authenticated can view voices" ON public.voices
  FOR SELECT USING (true);

-- Projects Policies
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Project History Policies
CREATE POLICY "Users can view own project history" ON public.project_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own project history" ON public.project_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------
-- TRIGGERS & AUTOMATION
-- ------------------------------------------

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.profiles
  INSERT INTO public.profiles (id, email, full_name, avatar_url, tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'free'
  );

  -- Initialize public.usage
  INSERT INTO public.usage (user_id, daily_generations_count, total_projects_count)
  VALUES (NEW.id, 0, 0);

  -- Create initial default free subscription record
  INSERT INTO public.subscriptions (user_id, plan_type, status)
  VALUES (NEW.id, 'free', 'active');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger firing on auth.users creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto update timestamp function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_timestamp BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER update_projects_timestamp BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SEED VOICES CATALOG DATA
INSERT INTO public.voices (elevenlabs_voice_id, name, category, gender, accent, preview_url, description, is_premium)
VALUES 
  ('21m00Tcm4TlvDq8ikWAM', 'Rachel', 'premade', 'female', 'American', 'https://samples.elevenlabs.io/rachel.mp3', 'Calm, professional, and clear narrator ideal for documentaries and tech reviews.', false),
  ('AZnzlk1XvdvUeBnXmlld', 'Domi', 'premade', 'female', 'American', 'https://samples.elevenlabs.io/domi.mp3', 'Energetic and emphatic tone perfect for YouTube Shorts and viral clips.', false),
  ('EXAVITQu4vr4xnSDxMaL', 'Bella', 'premade', 'female', 'American', 'https://samples.elevenlabs.io/bella.mp3', 'Soft, warm, and engaging voice suited for storytelling and lifestyle content.', false),
  ('ErXwobaYiN019PkySvjV', 'Antoni', 'premade', 'male', 'American', 'https://samples.elevenlabs.io/antoni.mp3', 'Deep, resonant, well-balanced corporate voice for educational videos.', false),
  ('MF3mGyEYCl7XYWbV9V6O', 'Elli', 'premade', 'female', 'Emotional', 'https://samples.elevenlabs.io/elli.mp3', 'Expressive and friendly narration voice.', true),
  ('TxGEqnHWrfWFTfGW9XjX', 'Josh', 'premade', 'male', 'American', 'https://samples.elevenlabs.io/josh.mp3', 'Deep, confident, and authoritative voice for tutorials.', false)
ON CONFLICT (elevenlabs_voice_id) DO NOTHING;
