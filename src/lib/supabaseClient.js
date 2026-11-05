import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-supabase-url") &&
    !supabaseAnonKey.includes("your-supabase-anon-key")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * SQL Migration script for setting up Supabase tables with Row Level Security (RLS)
 */
export const SUPABASE_SCHEMA_SQL = `-- SkillBridge Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  location TEXT,
  education TEXT,
  experience_level TEXT,
  preferred_roles TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  career_interests TEXT[] DEFAULT '{}',
  portfolio_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Saved Connections Table
CREATE TABLE IF NOT EXISTS public.saved_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_id TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('recruiter', 'mentor', 'community')),
  entity_name TEXT NOT NULL,
  entity_company TEXT,
  entity_role TEXT,
  entity_avatar TEXT,
  entity_data JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'Saved' CHECK (status IN ('Saved', 'Message drafted', 'Contacted', 'Responded')),
  notes TEXT DEFAULT '',
  match_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, entity_id, entity_type)
);

-- Enable RLS for Saved Connections
ALTER TABLE public.saved_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved connections"
  ON public.saved_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved connections"
  ON public.saved_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved connections"
  ON public.saved_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved connections"
  ON public.saved_connections FOR DELETE
  USING (auth.uid() = user_id);
`;
