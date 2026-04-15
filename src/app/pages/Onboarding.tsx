import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { supabase } from '../../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Checkbox } from '../components/ui/checkbox';
import { OnboardingData, UserTrack } from '../types';
import { Badge } from '../components/ui/badge';
import { X, Rocket, Sparkles, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FloatingParticles } from '../components/FloatingParticles';

const duskGradient = {
  background: `
    radial-gradient(ellipse 140% 120% at -5%  -5%,  #5a1828 0%, rgba(90,24,40,0.4) 40%, transparent 68%),
    radial-gradient(ellipse 130% 110% at 105% -5%,  #2a3058 0%, rgba(42,48,88,0.4) 38%, transparent 65%),
    radial-gradient(ellipse 120% 140% at -5%  52%,  #1a6070 0%, rgba(26,96,112,0.4) 38%, transparent 65%),
    radial-gradient(ellipse 130% 120% at 105% 52%,  #1c3d58 0%, rgba(28,61,88,0.35) 38%, transparent 65%),
    radial-gradient(ellipse 140% 100% at -5% 105%,  #d4785a 0%, rgba(212,120,90,0.45) 40%, transparent 68%),
    radial-gradient(ellipse 120%  90% at 52% 108%,  #c08070 0%, rgba(192,128,112,0.4) 38%, transparent 65%),
    radial-gradient(ellipse 110% 110% at 108% 105%, #263545 0%, rgba(38,53,69,0.4)  38%, transparent 65%),
    radial-gradient(ellipse 100% 100% at 48%  46%,  #d4987a 0%, rgba(212,152,122,0.5) 35%, transparent 62%),
    radial-gradient(ellipse  90%  85% at 22%  28%,  #e89868 0%, rgba(232,152,104,0.4) 35%, transparent 60%),
    radial-gradient(ellipse  90%  80% at 76%  24%,  #c87068 0%, rgba(200,112,104,0.4) 35%, transparent 60%),
    radial-gradient(ellipse  85%  85% at 35%  74%,  #e0a878 0%, rgba(224,168,120,0.4) 35%, transparent 60%),
    radial-gradient(ellipse  80%  80% at 68%  70%,  #b87870 0%, rgba(184,120,112,0.4) 35%, transparent 60%),
    #0e0d18
  `
};

function OnboardingHomeLink() {
  return (
    <Link
      to="/"
      className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-md text-inherit no-underline outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:left-8 sm:top-6"
      aria-label="Back to home"
    >
      <Sparkles className="h-5 w-5 shrink-0 text-white/60" />
      <span className="font-['Playfair_Display'] text-xl text-white sm:text-2xl">
        foundr
      </span>
    </Link>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({});
  const [direction, setDirection] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = async () => {
    if (step === 0 && !data.track) return;

    setDirection(1);
    if (step < 2) {
      setStep(step + 1);
    } else {
      setIsTransitioning(true);

      // Save profile to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({
          track: data.track,
          name: data.name ?? null,
          location: data.location ?? null,
          bio: data.bio ?? null,
          one_liner: data.oneLiner ?? null,
          linkedin_url: data.linkedInUrl ?? null,
          github_url: data.githubUrl ?? null,
          calendly_url: data.calendlyUrl ?? null,
          startup_idea: data.startupIdea ?? null,
          skills_needed: data.skillsNeeded ?? [],
          vertical: data.vertical ?? null,
          remote_willing: data.remoteWilling ?? false,
          working_style: data.workingStyle ?? [],
          skills: data.skills ?? [],
          role: data.role ?? null,
          experience: data.experience ?? null,
          startup_preferences: data.startupPreferences ?? [],
          work_schedule: data.workSchedule ?? null,
          risk_tolerance: data.riskTolerance ?? null,
          onboarding_complete: true,
          updated_at: new Date().toISOString(),
        }).eq('id', user.id);
      }

      setTimeout(() => navigate('/discover'), 2600);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  // Progress indicator
  const progress = ((step + 1) / 3) * 100;

  // Track Selection
  if (step === 0) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center p-6 relative overflow-hidden" style={duskGradient}>
        <OnboardingHomeLink />
        <FloatingParticles count={15} />
        
        {/* Progress bar */}
        <motion.div 
          className="absolute top-0 left-0 h-[2px] bg-white/30"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -100 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl w-full space-y-12 relative z-10"
          >
            <div className="text-center space-y-4">
              <motion.div 
                className="flex items-center justify-center gap-2 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div 
                  className="w-8 h-0.5 bg-zinc-600"
                  initial={{ width: 0 }}
                  animate={{ width: 32 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                />
                <span className="font-['JetBrains_Mono'] text-xs text-white/70 tracking-wider">
                  STEP 01
                </span>
              </motion.div>
              <motion.h1 
                className="font-['Playfair_Display'] text-6xl mb-4 tracking-tight text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                choose your path
              </motion.h1>
              <motion.p 
                  className="text-white/70 font-['Inter']"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                select the track that best describes your journey
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.button
                onClick={() => {
                  updateData({ track: 'founder' });
                }}
                className={`p-12 border transition-all text-left group relative overflow-hidden backdrop-blur-sm ${
                  data.track === 'founder' ? 'bg-white/[0.12] border-white/30' : 'bg-white/[0.06] border-white/12 hover:bg-white/[0.10] hover:border-white/25'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Glow effect */}
                {data.track === 'founder' && (
                  <motion.div
                    className="absolute inset-0 bg-white/[0.03]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                <div className="space-y-6 relative z-10">
                  <motion.div 
                    className="flex items-center gap-3"
                    animate={data.track === 'founder' ? { x: [0, 5, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Rocket className="w-6 h-6 text-zinc-400" />
                    {data.track === 'founder' && (
                      <motion.div 
                        className="w-8 h-0.5 bg-zinc-500"
                        initial={{ width: 0 }}
                        animate={{ width: 32 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    <span className="font-['JetBrains_Mono'] text-xs text-white/70 tracking-wider">
                      FOUNDER TRACK
                    </span>
                  </motion.div>
                  <h3 className="font-['Playfair_Display'] text-3xl">founder</h3>
                  <p className="text-sm text-white/70 font-['Inter'] leading-relaxed">
                    building a startup and seeking co-founders or early team members to join the mission
                  </p>
                </div>
              </motion.button>

              <motion.button
                onClick={() => {
                  updateData({ track: 'role-player' });
                }}
                className={`p-12 border transition-all text-left group relative overflow-hidden backdrop-blur-sm ${
                  data.track === 'role-player' ? 'bg-white/[0.12] border-white/30' : 'bg-white/[0.06] border-white/12 hover:bg-white/[0.10] hover:border-white/25'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Glow effect */}
                {data.track === 'role-player' && (
                  <motion.div
                    className="absolute inset-0 bg-white/[0.03]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                <div className="space-y-6 relative z-10">
                  <motion.div 
                    className="flex items-center gap-3"
                    animate={data.track === 'role-player' ? { x: [0, 5, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <UserIcon className="w-6 h-6 text-zinc-400" />
                    {data.track === 'role-player' && (
                      <motion.div 
                        className="w-8 h-0.5 bg-zinc-500"
                        initial={{ width: 0 }}
                        animate={{ width: 32 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    <span className="font-['JetBrains_Mono'] text-xs text-white/70 tracking-wider">
                      TALENT TRACK
                    </span>
                  </motion.div>
                  <h3 className="font-['Playfair_Display'] text-3xl">builder</h3>
                  <p className="text-sm text-white/70 font-['Inter'] leading-relaxed">
                    offering skills and expertise to join an early-stage startup as a founding team member
                  </p>
                </div>
              </motion.button>
            </div>

            <div className="flex justify-center pt-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost"
                  size="lg" 
                  onClick={handleNext}
                  disabled={!data.track}
                  className="px-12 py-6 bg-transparent border border-white/40 text-white hover:bg-white/10 hover:border-white/60 disabled:opacity-30 font-['Inter'] text-sm tracking-wide transition-all duration-200"
                >
                  Continue
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Basic Info
  if (step === 1) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center p-6 relative overflow-hidden" style={duskGradient}>
        <OnboardingHomeLink />
        <FloatingParticles count={15} />
        
        {/* Progress bar */}
        <motion.div 
          className="absolute top-0 left-0 h-[2px] bg-white/30"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -100 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl w-full space-y-12 relative z-10"
          >
            <div className="text-center space-y-4">
              <motion.div 
                className="flex items-center justify-center gap-2 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div 
                  className="w-8 h-0.5 bg-zinc-600"
                  initial={{ width: 0 }}
                  animate={{ width: 32 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                />
                <span className="font-['JetBrains_Mono'] text-xs text-white/70 tracking-wider">
                  STEP 02
                </span>
              </motion.div>
              <motion.h1 
                className="font-['Playfair_Display'] text-6xl mb-4 tracking-tight text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                basic information
              </motion.h1>
              <motion.p 
                  className="text-white/70 font-['Inter']"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                tell us about yourself
              </motion.p>
            </div>

            <div className="bg-white/[0.07] backdrop-blur-sm border border-white/10 p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-white/70 font-['Inter'] text-sm font-normal">Full Name</Label>
                <Input
                  placeholder="Jane Doe"
                  value={data.name || ''}
                  onChange={(e) => updateData({ name: e.target.value })}
                  className="bg-white/10 border-white/15 text-white placeholder:text-white/30 font-['Inter']"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/70 font-['Inter'] text-sm font-normal">Location</Label>
                <Input
                  placeholder="San Francisco, CA"
                  value={data.location || ''}
                  onChange={(e) => updateData({ location: e.target.value })}
                  className="bg-white/10 border-white/15 text-white placeholder:text-white/30 font-['Inter']"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/70 font-['Inter'] text-sm font-normal">Bio</Label>
                <Textarea
                  placeholder="Tell us about yourself..."
                  rows={4}
                  value={data.bio || ''}
                  onChange={(e) => updateData({ bio: e.target.value })}
                  className="bg-white/10 border-white/15 text-white placeholder:text-white/30 font-['Inter'] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/70 font-['Inter'] text-sm font-normal">One-Sentence Pitch</Label>
                <Input
                  placeholder={
                    data.track === 'founder'
                      ? 'Building AI-powered platform for...'
                      : 'Full-stack engineer seeking mission-driven startup'
                  }
                  value={data.oneLiner || ''}
                  onChange={(e) => updateData({ oneLiner: e.target.value })}
                  className="bg-white/10 border-white/15 text-white placeholder:text-white/30 font-['Inter']"
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <Label className="text-white/70 font-['Inter'] text-sm font-normal">Connect Profiles (optional)</Label>
                <Input
                  placeholder="LinkedIn URL"
                  value={data.linkedInUrl || ''}
                  onChange={(e) => updateData({ linkedInUrl: e.target.value })}
                  className="bg-white/10 border-white/15 text-white placeholder:text-white/30 font-['Inter']"
                />
                <Input
                  placeholder="GitHub URL"
                  value={data.githubUrl || ''}
                  onChange={(e) => updateData({ githubUrl: e.target.value })}
                  className="bg-white/10 border-white/15 text-white placeholder:text-white/30 font-['Inter']"
                />
                <Input
                  placeholder="Calendly URL"
                  value={data.calendlyUrl || ''}
                  onChange={(e) => updateData({ calendlyUrl: e.target.value })}
                  className="bg-white/10 border-white/15 text-white placeholder:text-white/30 font-['Inter']"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="bg-transparent border-white/25 text-white hover:bg-white/10 font-['Inter']"
              >
                Back
              </Button>
              <Button 
                variant="ghost"
                className="flex-1 bg-transparent border border-white/40 text-white hover:bg-white/10 hover:border-white/60 font-['Inter'] transition-all duration-200" 
                onClick={handleNext}
              >
                Continue
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Track-Specific Questions
  return (
      <div className="min-h-screen text-white flex items-center justify-center p-6 overflow-y-auto relative overflow-hidden" style={duskGradient}>
      <OnboardingHomeLink />
      <FloatingParticles count={15} />
      
      {/* Progress bar */}
      <motion.div 
          className="absolute top-0 left-0 h-[2px] bg-white/30"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: direction * 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -100 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl w-full space-y-12 py-12 relative z-10"
        >
          <div className="text-center space-y-4">
            <motion.div 
              className="flex items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                  className="w-8 h-0.5 bg-zinc-600"
                  initial={{ width: 0 }}
                  animate={{ width: 32 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                />
                <span className="font-['JetBrains_Mono'] text-xs text-white/70 tracking-wider">
                  STEP 03
              </span>
            </motion.div>
            <motion.h1 
              className="font-['Playfair_Display'] text-6xl mb-4 tracking-tight text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
              {data.track === 'founder' ? 'your startup' : 'your skills'}
            </motion.h1>
            <motion.p 
                  className="text-white/70 font-['Inter']"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              help us find your perfect match
            </motion.p>
          </div>

            <div className="bg-white/[0.07] backdrop-blur-sm border border-white/10 p-8 space-y-6">
            {data.track === 'founder' ? (
              <>
                <div className="space-y-2">
                  <Label className="text-white/70 font-['Inter'] text-sm font-normal">Startup Idea</Label>
                  <Textarea
                    placeholder="Describe your startup idea in detail..."
                    rows={4}
                    value={data.startupIdea || ''}
                    onChange={(e) => updateData({ startupIdea: e.target.value })}
                    className="bg-white/10 border-white/15 text-white placeholder:text-white/30 font-['Inter'] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/70 font-['Inter'] text-sm font-normal">Skills You're Looking For</Label>
                  <SkillSelector
                    skills={data.skillsNeeded || []}
                    onChange={(skills) => updateData({ skillsNeeded: skills })}
                    suggestions={['Full-stack Engineer', 'ML Engineer', 'Product Designer', 'Mobile Developer', 'DevOps', 'Growth Marketer']}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/70 font-['Inter'] text-sm font-normal">Vertical/Industry</Label>
                  <Input
                    placeholder="e.g., FinTech, HealthTech, EdTech"
                    value={data.vertical || ''}
                    onChange={(e) => updateData({ vertical: e.target.value })}
                    className="bg-white/10 border-white/15 text-white placeholder:text-white/30 font-['Inter']"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="remote"
                    checked={data.remoteWilling || false}
                    onCheckedChange={(checked) => updateData({ remoteWilling: checked as boolean })}
                    className="border-white/40 bg-transparent data-[state=checked]:bg-white data-[state=checked]:text-black"
                  />
                  <Label htmlFor="remote" className="font-['Inter'] text-sm font-normal text-white/70">
                    Open to remote co-founders
                  </Label>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="text-white/70 font-['Inter'] text-sm font-normal">Primary Role</Label>
                  <Input
                    placeholder="e.g., Full-stack Engineer, Product Designer"
                    value={data.role || ''}
                    onChange={(e) => updateData({ role: e.target.value })}
                    className="bg-white/10 border-white/15 text-white placeholder:text-white/30 font-['Inter']"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/70 font-['Inter'] text-sm font-normal">Your Skills</Label>
                  <SkillSelector
                    skills={data.skills || []}
                    onChange={(skills) => updateData({ skills })}
                    suggestions={['React', 'Node.js', 'Python', 'Product Design', 'ML/AI', 'DevOps', 'Marketing']}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/70 font-['Inter'] text-sm font-normal">Experience</Label>
                  <Input
                    placeholder="e.g., 5 years at Google, 2 years at startup"
                    value={data.experience || ''}
                    onChange={(e) => updateData({ experience: e.target.value })}
                    className="bg-white/10 border-white/15 text-white placeholder:text-white/30 font-['Inter']"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/70 font-['Inter'] text-sm font-normal">Interested Verticals</Label>
                  <SkillSelector
                    skills={data.startupPreferences || []}
                    onChange={(prefs) => updateData({ startupPreferences: prefs })}
                    suggestions={['FinTech', 'HealthTech', 'EdTech', 'Climate Tech', 'AI/ML', 'Consumer']}
                  />
                </div>
              </>
            )}

            {/* Common Questions */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="space-y-3">
                <Label className="text-white/70 font-['Inter'] text-sm font-normal">Risk Tolerance</Label>
                <RadioGroup
                  value={data.riskTolerance}
                  onValueChange={(value) => updateData({ riskTolerance: value as any })}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bootstrapping" id="bootstrapping" className="border-white/20" />
                    <Label htmlFor="bootstrapping" className="font-['Inter'] text-sm font-normal text-white/70">
                      Bootstrapping - Build sustainably
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vc" id="vc" className="border-white/20" />
                    <Label htmlFor="vc" className="font-['Inter'] text-sm font-normal text-white/70">
                      VC-backed - Scale fast
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flexible" id="flexible" className="border-white/20" />
                    <Label htmlFor="flexible" className="font-['Inter'] text-sm font-normal text-white/70">
                      Flexible - Open to either
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-white/70 font-['Inter'] text-sm font-normal">Work Schedule Preference</Label>
                <Input
                  placeholder="e.g., 9-6 focused, Flexible hours, Async-first"
                  value={data.workSchedule || ''}
                  onChange={(e) => updateData({ workSchedule: e.target.value })}
                  className="bg-white/10 border-white/15 text-white placeholder:text-white/30 font-['Inter']"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="bg-transparent border-white/25 text-white hover:bg-white/10 font-['Inter']"
            >
              Back
            </Button>
            <Button 
              variant="ghost"
              className="flex-1 bg-transparent border border-white/40 text-white hover:bg-white/10 hover:border-white/60 font-['Inter'] transition-all duration-200" 
              onClick={handleNext}
            >
              Start Swiping
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Expanding circle */}
            <motion.div
              className="absolute rounded-full"
              style={{ background: 'radial-gradient(circle, #1a1628 0%, #0e0d18 60%, #080710 100%)' }}
              initial={{ width: 0, height: 0, opacity: 0.9 }}
              animate={{ width: '300vmax', height: '300vmax', opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Soft glow orb */}
            <motion.div
              className="absolute w-64 h-64 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(212,152,122,0.35) 0%, transparent 70%)', filter: 'blur(40px)' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2.5, opacity: [0, 1, 0] }}
              transition={{ duration: 1.4, ease: 'easeOut', times: [0, 0.4, 1] }}
            />
            {/* Logo / wordmark reveal */}
            <motion.div
              className="relative flex flex-col items-center gap-3"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 1.1], y: [20, 0, 0, -30] }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], times: [0, 0.3, 0.7, 1] }}
            >
              <Sparkles className="h-8 w-8 text-white/80" />
              <span className="font-['Playfair_Display'] text-5xl text-white tracking-wide">foundr</span>
              <motion.p
                className="font-['Inter'] text-white/50 text-sm tracking-widest uppercase"
                initial={{ opacity: 0, letterSpacing: '0.1em' }}
                animate={{ opacity: [0, 1, 0], letterSpacing: ['0.1em', '0.3em', '0.3em'] }}
                transition={{ duration: 1.4, ease: 'easeOut', times: [0, 0.4, 1] }}
              >
                let's find your co-founder
              </motion.p>
            </motion.div>

            {/* Warp acceleration streaks */}
            {[...Array(24)].map((_, i) => {
              const angle = (i / 24) * 360;
              const length = 120 + Math.random() * 180;
              const delay = 1.3 + (i % 4) * 0.04;
              return (
                <motion.div
                  key={i}
                  className="absolute origin-left"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: length,
                    height: 1.5,
                    rotate: angle,
                    background: `linear-gradient(to right, transparent, rgba(255,255,255,${0.15 + (i % 3) * 0.1}))`,
                    borderRadius: 9999,
                  }}
                  initial={{ scaleX: 0, opacity: 0, translateX: 0 }}
                  animate={{
                    scaleX: [0, 1, 1],
                    opacity: [0, 0.9, 0],
                    translateX: [0, 0, 600],
                  }}
                  transition={{
                    duration: 0.7,
                    delay,
                    ease: [0.4, 0, 0.6, 1],
                    times: [0, 0.3, 1],
                  }}
                />
              );
            })}

            {/* Central white flash at warp moment */}
            <motion.div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 60%)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, delay: 1.35, ease: 'easeOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Skill Selector Component
function SkillSelector({
  skills,
  onChange,
  suggestions,
}: {
  skills: string[];
  onChange: (skills: string[]) => void;
  suggestions: string[];
}) {
  const [input, setInput] = useState('');

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      onChange([...skills, skill]);
      setInput('');
    }
  };

  const removeSkill = (skill: string) => {
    onChange(skills.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addSkill(input);
            }
          }}
          placeholder="Type and press Enter"
          className="bg-white/10 border-white/15 text-white placeholder:text-white/30 font-['Inter']"
        />
        <Button 
          type="button" 
          onClick={() => addSkill(input)} 
          variant="outline"
          className="bg-transparent border-white/20 text-white hover:bg-white/10 font-['Inter']"
        >
          Add
        </Button>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge 
              key={skill} 
              className="bg-white/10 text-zinc-200 border-white/15 hover:bg-white/15 font-['Inter'] text-xs"
            >
              {skill}
              <button onClick={() => removeSkill(skill)} className="ml-1">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {suggestions
          .filter((s) => !skills.includes(s))
          .map((suggestion) => (
            <Badge
              key={suggestion}
              variant="outline"
              className="cursor-pointer border-white/20 text-white/60 hover:bg-white/10 hover:text-white font-['Inter'] text-xs"
              onClick={() => addSkill(suggestion)}
            >
              + {suggestion}
            </Badge>
          ))}
      </div>
    </div>
  );
}