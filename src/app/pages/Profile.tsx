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
  LogOut
} from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { motion } from 'motion/react';

// Mock current user data
const currentUser = {
  id: 'me',
  name: 'You',
  track: 'founder' as const,
  profilePicture: 'https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  location: 'San Francisco, CA',
  linkedInUrl: 'https://linkedin.com/in/yourprofile',
  githubUrl: 'https://github.com/yourprofile',
  calendlyUrl: 'https://calendly.com/yourprofile',
  bio: 'Product-minded founder with background in design and engineering. Previously built products at tech startups. Passionate about creating tools that help people learn and grow.',
  oneLiner: 'Building the future of collaborative learning',
  startupIdea: 'A platform that combines real-time collaboration with AI-powered learning assistance to help students and professionals master complex topics together.',
  skillsNeeded: ['Full-stack Engineer', 'ML Engineer', 'Growth Marketer'],
  workingStyle: ['Fast-paced', 'User-focused', 'Data-driven'],
  remoteWilling: true,
  sleepSchedule: 'Night owl',
  workSchedule: 'Flexible hours',
  riskTolerance: 'vc' as const,
  vertical: 'EdTech',
};

export default function Profile() {
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="bg-black/40 border-white/10 text-white backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={currentUser.profilePicture} />
                  <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="font-['Playfair_Display'] text-3xl tracking-tight mb-1">{currentUser.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-['Inter']">
                      <MapPin className="w-4 h-4" />
                      {currentUser.location}
                    </div>
                    <Badge className="bg-white/10 text-gray-100 border border-white/10">
                      {currentUser.track === 'founder' ? '🚀 Founder' : '💼 Looking for Role'}
                    </Badge>
                  </div>

                  <p className="text-sm italic text-gray-200 font-['Inter']">"{currentUser.oneLiner}"</p>

                  <div className="flex flex-wrap gap-3">
                    {currentUser.linkedInUrl && (
                      <a
                        href={currentUser.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 font-['Inter']"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                    {currentUser.githubUrl && (
                      <a
                        href={currentUser.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-gray-200 hover:text-white font-['Inter']"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {currentUser.calendlyUrl && (
                      <a
                        href={currentUser.calendlyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 font-['Inter']"
                      >
                        <Calendar className="w-4 h-4" />
                        Calendly
                      </a>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="bg-black/40 border-white/10 text-white backdrop-blur">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 font-['Inter']">{currentUser.bio}</p>
            </CardContent>
          </Card>

          {/* Startup Info */}
          <Card className="bg-black/40 border-white/10 text-white backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-300" />
                <CardTitle>Startup Idea</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-300 font-['Inter']">{currentUser.startupIdea}</p>

              <div>
                <h4 className="text-sm font-semibold mb-2 font-['Inter']">Vertical</h4>
                <Badge className="bg-white/10 text-gray-100 border border-white/10">{currentUser.vertical}</Badge>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 font-['Inter']">Looking For</h4>
                <div className="flex flex-wrap gap-2">
                  {currentUser.skillsNeeded.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-white/20 text-gray-200 hover:bg-white/10 font-['Inter']"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Working Style */}
          <Card className="bg-black/40 border-white/10 text-white backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-zinc-400" />
                <CardTitle>Working Style & Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2 font-['Inter']">Working Style</h4>
                <div className="flex flex-wrap gap-2">
                  {currentUser.workingStyle.map((style) => (
                    <Badge key={style} className="bg-white/10 text-gray-100 border border-white/10 font-['Inter']">
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm font-['Inter']">
                <div>
                  <span className="text-gray-400">Work Schedule:</span>
                  <span className="ml-2 text-white font-medium">{currentUser.workSchedule}</span>
                </div>
                <div>
                  <span className="text-gray-400">Remote:</span>
                  <span className="ml-2 text-white font-medium">{currentUser.remoteWilling ? 'Open to remote' : 'In-person preferred'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Risk Tolerance:</span>
                  <span className="ml-2 text-white font-medium capitalize">{currentUser.riskTolerance}</span>
                </div>
                <div>
                  <span className="text-gray-400">Sleep Schedule:</span>
                  <span className="ml-2 text-white font-medium">{currentUser.sleepSchedule}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="bg-black/40 border-white/10 text-white backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-300" />
                <CardTitle>Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                <Code className="w-4 h-4 mr-2" />
                Notification Preferences
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent border-white/20 text-red-300 hover:text-red-200 hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="bg-black/40 border-white/10 text-white backdrop-blur">
            <CardHeader>
              <CardTitle>Your Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-xs text-gray-400 font-['Inter']">Profiles Viewed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">4</div>
                  <div className="text-xs text-gray-400 font-['Inter']">Matches</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">3</div>
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
