import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Database row types ──────────────────────────────────────────────────────

export interface DbProfile {
  id: string;
  track: 'founder' | 'role-player' | null;
  name: string | null;
  location: string | null;
  bio: string | null;
  one_liner: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  calendly_url: string | null;
  profile_picture_url: string | null;
  // Founder
  startup_idea: string | null;
  skills_needed: string[];
  vertical: string | null;
  remote_willing: boolean;
  working_style: string[];
  // Role-player
  skills: string[];
  role: string | null;
  experience: string | null;
  startup_preferences: string[];
  // Common
  sleep_schedule: string | null;
  work_schedule: string | null;
  risk_tolerance: 'bootstrapping' | 'vc' | 'flexible' | null;
  // Meta
  is_admin: boolean;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbMatch {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
}

export interface DbSwipe {
  id: string;
  swiper_id: string;
  swiped_id: string;
  direction: 'like' | 'pass' | 'super';
  created_at: string;
}

export interface DbMessage {
  id: string;
  match_id: string;
  sender_id: string;
  text: string;
  created_at: string;
}
