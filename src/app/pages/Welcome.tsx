import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { FloatingParticles } from '../components/FloatingParticles';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

type Mode = 'signin' | 'signup' | 'confirm';

function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function Welcome() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');

  // Already logged in — skip the landing page entirely
  useEffect(() => {
    if (!loading && user) {
      navigate('/discover', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || user) return null;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setPassword('');
    setConfirm('');
  };

  const redirectAfterAuth = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('onboarding_complete').eq('id', userId).single();
    navigate(data?.onboarding_complete ? '/discover' : '/onboarding', { replace: true });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setSubmitting(true);

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setSubmitting(false); return; }
      if (data.user && !data.session) { setMode('confirm'); setSubmitting(false); return; }
      if (data.user && data.session) await redirectAfterAuth(data.user.id);
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setSubmitting(false); return; }
      if (data.user) await redirectAfterAuth(data.user.id);
    }
    setSubmitting(false);
  };

  const handleGoogle = async () => {
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1768066360882-14302bb37971?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.35,
          filter: 'saturate(1.4) contrast(1.1)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-20 -left-20 w-96 h-96 bg-white/[0.015] rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-20 right-40 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -30, 0], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
      </div>

      <FloatingParticles count={12} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <motion.div className="w-8 h-0.5 bg-zinc-300"
            initial={{ width: 0 }} animate={{ width: 32 }}
            transition={{ duration: 0.8, delay: 0.2 }} />
          <span className="font-['Playfair_Display'] text-2xl text-white">foundr</span>
        </div>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>
          COFOUNDER MATCHING
        </span>
      </nav>

      {/* Main: split layout */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">

        {/* ── Left: Hero ── */}
        <div className="flex flex-col justify-center px-8 lg:px-16 py-12 lg:py-20 w-full lg:w-[55%]">
          <motion.div className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="w-12 h-px bg-zinc-400" />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em' }}>
              FIND YOUR OTHER HALF
            </span>
          </motion.div>

          <motion.h1
            className="font-['Playfair_Display'] text-6xl lg:text-8xl tracking-tight leading-none mb-6 text-white"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}>
            find your<br />co-founder
          </motion.h1>

          <motion.p
            className="font-['Plus_Jakarta_Sans'] text-base lg:text-lg text-zinc-300 mb-12 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}>
            Swipe through founders and builders. Match on vision, values, and working style.
            Build something great together.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="flex flex-col sm:flex-row gap-8 sm:gap-12"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}>
            {[
              { value: '500+', label: 'Founders' },
              { value: '1,000+', label: 'Builders' },
              { value: '200+', label: 'Matches made' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-['Playfair_Display'] text-3xl text-white leading-none">{stat.value}</div>
                <div className="font-['Plus_Jakarta_Sans'] text-sm text-zinc-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: Auth card ── */}
        <div className="flex items-center justify-center px-8 lg:px-12 py-12 lg:py-20 w-full lg:w-[45%]">
          <motion.div className="w-full max-w-sm"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}>

            {/* Confirm email screen */}
            {mode === 'confirm' && (
              <div className="p-8 text-center space-y-5"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <Mail className="w-6 h-6 text-white/60" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="font-['Playfair_Display'] text-2xl text-white">check your email</h2>
                  <p className="font-['Inter'] text-sm text-white/50 leading-relaxed">
                    We sent a confirmation link to <span className="text-white/80">{email}</span>.
                    Click it to verify your account, then come back to sign in.
                  </p>
                </div>
                <button onClick={() => switchMode('signin')}
                  className="font-['Inter'] text-xs text-white/40 hover:text-white/70 transition-colors underline underline-offset-2">
                  Back to sign in
                </button>
              </div>
            )}

            {/* Auth form */}
            {mode !== 'confirm' && (
              <div className="p-8 space-y-5"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>

                {/* Heading */}
                <div className="space-y-1">
                  <h2 className="font-['Playfair_Display'] text-2xl text-white">
                    {mode === 'signin' ? 'welcome back' : 'join foundr'}
                  </h2>
                  <p className="font-['Inter'] text-xs text-white/40">
                    {mode === 'signin' ? 'sign in to continue' : 'create your account'}
                  </p>
                </div>

                {/* Tab switcher */}
                <div className="flex rounded-md overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  {(['signin', 'signup'] as Mode[]).map((m) => (
                    <button key={m} onClick={() => switchMode(m)}
                      className="flex-1 py-2 font-['Inter'] text-sm transition-all duration-200"
                      style={{ background: mode === m ? 'rgba(255,255,255,0.1)' : 'transparent', color: mode === m ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                      {m === 'signin' ? 'sign in' : 'sign up'}
                    </button>
                  ))}
                </div>

                {/* Form */}
                <form onSubmit={handleEmailAuth} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-white/50 font-['Inter'] text-xs font-normal tracking-wide">EMAIL</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                      <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                        className="pl-9 bg-white/[0.07] border-white/10 text-white placeholder:text-white/20 font-['Inter'] text-sm" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-white/50 font-['Inter'] text-xs font-normal tracking-wide">PASSWORD</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                      <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required
                        className="pl-9 pr-9 bg-white/[0.07] border-white/10 text-white placeholder:text-white/20 font-['Inter'] text-sm" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {mode === 'signup' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} className="space-y-1.5 overflow-hidden">
                        <Label className="text-white/50 font-['Inter'] text-xs font-normal tracking-wide">CONFIRM PASSWORD</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                          <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                            className="pl-9 bg-white/[0.07] border-white/10 text-white placeholder:text-white/20 font-['Inter'] text-sm" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                        className="font-['Inter'] text-xs text-red-400/80 py-2 px-3 rounded"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <Button type="submit" disabled={submitting}
                    className="w-full bg-transparent border border-white/40 text-white hover:bg-white/10 hover:border-white/60 font-['Inter'] text-sm tracking-wide transition-all duration-200 disabled:opacity-40 flex items-center justify-center gap-2">
                    {submitting
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
                      : <>{mode === 'signin' ? 'Sign In' : 'Create Account'}<ArrowRight className="w-4 h-4" /></>}
                  </Button>
                </form>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="font-['Inter'] text-xs text-white/25">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <button onClick={handleGoogle}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded font-['Inter'] text-sm text-white/60 transition-all duration-200 hover:text-white hover:bg-white/10"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  <GoogleIcon />
                  Continue with Google
                </button>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
