export type UserTrack = 'founder' | 'role-player';

export interface User {
  id: string;
  name: string;
  track: UserTrack;
  profilePicture: string;
  location: string;
  linkedInUrl?: string;
  githubUrl?: string;
  calendlyUrl?: string;
  bio: string;
  oneLiner: string;
}

export interface FounderProfile extends User {
  track: 'founder';
  startupIdea: string;
  skillsNeeded: string[];
  workingStyle: string[];
  remoteWilling: boolean;
  sleepSchedule: string;
  workSchedule: string;
  riskTolerance: 'bootstrapping' | 'vc' | 'flexible';
  vertical: string;
}

export interface RolePlayerProfile extends User {
  track: 'role-player';
  skills: string[];
  role: string;
  experience: string;
  startupPreferences: string[];
  sleepSchedule: string;
  workSchedule: string;
  riskTolerance: 'bootstrapping' | 'vc' | 'flexible';
}

export type Profile = FounderProfile | RolePlayerProfile;

export interface Match {
  id: string;
  profile: Profile;
  matchedAt: Date;
  messages: Message[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface OnboardingData {
  track?: UserTrack;
  name?: string;
  location?: string;
  profilePicture?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  calendlyUrl?: string;
  bio?: string;
  oneLiner?: string;
  // Founder specific
  startupIdea?: string;
  skillsNeeded?: string[];
  workingStyle?: string[];
  remoteWilling?: boolean;
  // Role player specific
  skills?: string[];
  role?: string;
  experience?: string;
  startupPreferences?: string[];
  // Common
  sleepSchedule?: string;
  workSchedule?: string;
  riskTolerance?: 'bootstrapping' | 'vc' | 'flexible';
  vertical?: string;
}
