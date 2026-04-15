import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  MapPin,
  Linkedin,
  Github,
  Calendar,
  Lightbulb,
  Code,
  Briefcase,
  Edit,
  Settings,
  LogOut,
  Loader2,
} from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { motion } from 'motion/react';
import { supabase, DbProfile } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [matchCount, setMatchCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [profileRes, matchRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase
          .from('matches')
          .select('id', { count: 'exact', head: true })
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`),
      ]);
      if (profileRes.data) setProfile(profileRes.data as DbProfile);
      setMatchCount(matchRes.count ?? 0);
      setLoading(false);
    };
    load();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const isFounder = profile.track === 'founder';
  const initials = profile.name
    ? profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-24 -left-24 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-24 -right-24 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"
          animate={{ x: [0, -60, 0], y: [0, -40, 0], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <Navigation />

      <div className="flex-1 overflow-y-auto p-6 relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Profile Header */}
          <Card className="bg-black/40 border-white/10 text-white backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="w-24 h-24">
                  {profile.profile_picture_url && (
                    <AvatarImage src={profile.profile_picture_url} />
                  )}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="font-['Playfair_Display'] text-3xl tracking-tight mb-1">
                      {profile.name ?? 'Your Profile'}
                    </h2>
                    {profile.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-['Inter']">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </div>
                    )}
                    {profile.track && (
                      <Badge className="bg-white/10 text-gray-100 border border-white/10">
                        {isFounder ? '🚀 Founder' : '💼 Builder'}
                      </Badge>
                    )}
                  </div>

                  {profile.one_liner && (
                    <p className="text-sm italic text-gray-200 font-['Inter']">
                      "{profile.one_liner}"
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {profile.linkedin_url && (
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 font-['Inter']">
                        <Linkedin className="w-4 h-4" /> LinkedIn
                      </a>
                    )}
                    {profile.github_url && (
                      <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-gray-200 hover:text-white font-['Inter']">
                        <Github className="w-4 h-4" /> GitHub
                      </a>
                    )}
                    {profile.calendly_url && (
                      <a href={profile.calendly_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 font-['Inter']">
                        <Calendar className="w-4 h-4" /> Calendly
                      </a>
                    )}
                  </div>
                </div>

                <Button variant="outline" size="sm"
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
                  <Edit className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          {profile.bio && (
            <Card className="bg-black/40 border-white/10 text-white backdrop-blur">
              <CardHeader><CardTitle>About</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 font-['Inter']">{profile.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Founder: Startup Info */}
          {isFounder && (profile.startup_idea || profile.vertical || profile.skills_needed?.length > 0) && (
            <Card className="bg-black/40 border-white/10 text-white backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-300" />
                  <CardTitle>Startup Idea</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.startup_idea && (
                  <p className="text-sm text-gray-300 font-['Inter']">{profile.startup_idea}</p>
                )}
                {profile.vertical && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 font-['Inter']">Vertical</h4>
                    <Badge className="bg-white/10 text-gray-100 border border-white/10">{profile.vertical}</Badge>
                  </div>
                )}
                {profile.skills_needed?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 font-['Inter']">Looking For</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills_needed.map((skill) => (
                        <Badge key={skill} variant="outline"
                          className="border-white/20 text-gray-200 hover:bg-white/10 font-['Inter']">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Builder: Skills & Experience */}
          {!isFounder && (profile.role || profile.experience || profile.skills?.length > 0) && (
            <Card className="bg-black/40 border-white/10 text-white backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-cyan-300" />
                  <CardTitle>Skills & Experience</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.role && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1 font-['Inter']">Role</h4>
                    <p className="text-sm text-gray-300 font-['Inter']">{profile.role}</p>
                  </div>
                )}
                {profile.experience && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1 font-['Inter']">Experience</h4>
                    <p className="text-sm text-gray-300 font-['Inter']">{profile.experience}</p>
                  </div>
                )}
                {profile.skills?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 font-['Inter']">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <Badge key={skill} variant="outline"
                          className="border-white/20 text-gray-200 hover:bg-white/10 font-['Inter']">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {profile.startup_preferences?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 font-['Inter']">Interested Verticals</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.startup_preferences.map((pref) => (
                        <Badge key={pref} className="bg-white/10 text-gray-100 border border-white/10 font-['Inter']">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Working Style */}
          {(profile.working_style?.length > 0 || profile.work_schedule || profile.risk_tolerance) && (
            <Card className="bg-black/40 border-white/10 text-white backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-zinc-400" />
                  <CardTitle>Working Style & Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.working_style?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 font-['Inter']">Working Style</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.working_style.map((style) => (
                        <Badge key={style} className="bg-white/10 text-gray-100 border border-white/10 font-['Inter']">
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-4 text-sm font-['Inter']">
                  {profile.work_schedule && (
                    <div>
                      <span className="text-gray-400">Work Schedule:</span>
                      <span className="ml-2 text-white font-medium">{profile.work_schedule}</span>
                    </div>
                  )}
                  {isFounder && (
                    <div>
                      <span className="text-gray-400">Remote:</span>
                      <span className="ml-2 text-white font-medium">
                        {profile.remote_willing ? 'Open to remote' : 'In-person preferred'}
                      </span>
                    </div>
                  )}
                  {profile.risk_tolerance && (
                    <div>
                      <span className="text-gray-400">Risk Tolerance:</span>
                      <span className="ml-2 text-white font-medium capitalize">{profile.risk_tolerance}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Settings */}
          <Card className="bg-black/40 border-white/10 text-white backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-300" />
                <CardTitle>Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline"
                className="w-full justify-start bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
                <Settings className="w-4 h-4 mr-2" /> Account Settings
              </Button>
              <Button variant="outline"
                className="w-full justify-start bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
                <Code className="w-4 h-4 mr-2" /> Notification Preferences
              </Button>
              <Button onClick={handleLogout} variant="outline"
                className="w-full justify-start bg-transparent border-white/20 text-red-300 hover:text-red-200 hover:bg-white/10">
                <LogOut className="w-4 h-4 mr-2" /> Log Out
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="bg-black/40 border-white/10 text-white backdrop-blur">
            <CardHeader><CardTitle>Your Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">—</div>
                  <div className="text-xs text-gray-400 font-['Inter']">Profiles Viewed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                    {matchCount}
                  </div>
                  <div className="text-xs text-gray-400 font-['Inter']">Matches</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">—</div>
                  <div className="text-xs text-gray-400 font-['Inter']">Conversations</div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
