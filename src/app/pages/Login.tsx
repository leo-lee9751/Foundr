import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { FloatingParticles } from '../components/FloatingParticles';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

const duskGradient = {
  background: `
    radial-gradient(ellipse 140% 120% at -5%  -5%,  #5a1828 0%, rgba(90,24,40,0.4) 40%, transparent 68%),
    radial-gradient(ellipse 130% 110% at 105% -5%,  #2a3058 0%, rgba(42,48,88,0.4) 38%, transparent 65%),
    radial-gradient(ellipse 120% 140% at -5%  52%,  #1a6070 0%, rgba(26,96,112,0.4) 38%, transparent 65%),
    radial-gradient(ellipse 130% 120% at 105% 52%,  #1c3d58 0%, rgba(28,61,88,0.35) 38%, transparent 65%),
    radial-gradient(ellipse 140% 100% at -5% 105%,  #d4785a 0%, rgba(212,120,90,0.45) 40%, transparent 68%),
    radial-gradient(ellipse 120%  90% at 52% 108%,  #c08070 0%, rgba(192,128,112,0.4) 38%, transparent 65%),
    radial-gradient(ellipse 100% 100% at 48%  46%,  #d4987a 0%, rgba(212,152,122,0.5) 35%, transparent 62%),
    #0e0d18
  `,
};

// Minimal inline Google icon
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

type Mode = 'signin' | 'signup' | 'confirm';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('signin');
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

  // After a successful auth, decide where to send the user
  const redirectAfterAuth = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('id', userId)
      .single();

    if (data?.onboarding_complete) {
      navigate('/discover', { replace: true });
    } else {
      navigate('/onboarding', { replace: true });
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setSubmitting(false); return; }
      // No session yet = email confirmation required
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
    <div
      className="min-h-screen text-white flex items-center justify-center p-6 relative overflow-hidden"
      style={duskGradient}
    >
      {/* Back to home */}
      <Link
        to="/"
        className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-md text-inherit no-underline outline-none transition-opacity hover:opacity-90"
      >
        <Sparkles className="h-5 w-5 text-white/60" />
        <span className="font-['Playfair_Display'] text-xl text-white">foundr</span>
      </Link>

      <FloatingParticles count={15} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* ── Confirm email screen ── */}
        {mode === 'confirm' && (
          <div
            className="p-10 text-center space-y-5"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex justify-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <Mail className="w-6 h-6 text-white/60" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-['Playfair_Display'] text-2xl text-white">check your email</h2>
              <p className="font-['Inter'] text-sm text-white/50 leading-relaxed">
                We sent a confirmation link to <span className="text-white/80">{email}</span>.
                Click it to verify your account, then come back here to sign in.
              </p>
            </div>
            <button
              onClick={() => switchMode('signin')}
              className="font-['Inter'] text-xs text-white/40 hover:text-white/70 transition-colors underline underline-offset-2"
            >
              Back to sign in
            </button>
          </div>
        )}

        {/* ── Auth card ── */}
        {mode !== 'confirm' && <div
          className="p-8 space-y-6"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Heading */}
          <div className="space-y-1">
            <h1 className="font-['Playfair_Display'] text-3xl text-white">
              {mode === 'signin' ? 'welcome back' : 'join foundr'}
            </h1>
            <p className="font-['Inter'] text-sm text-white/50">
              {mode === 'signin'
                ? 'sign in to continue building'
                : 'create your account to get started'}
            </p>
          </div>

          {/* Tab switcher */}
          <div
            className="flex rounded-md overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {(['signin', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className="flex-1 py-2 font-['Inter'] text-sm transition-all duration-200"
                style={{
                  background: mode === m ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: mode === m ? '#fff' : 'rgba(255,255,255,0.4)',
                }}
              >
                {m === 'signin' ? 'sign in' : 'sign up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/60 font-['Inter'] text-xs font-normal tracking-wide">
                EMAIL
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 bg-white/[0.07] border-white/10 text-white placeholder:text-white/25 font-['Inter']"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/60 font-['Inter'] text-xs font-normal tracking-wide">
                PASSWORD
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-9 pr-9 bg-white/[0.07] border-white/10 text-white placeholder:text-white/25 font-['Inter']"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label className="text-white/60 font-['Inter'] text-xs font-normal tracking-wide">
                    CONFIRM PASSWORD
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="pl-9 bg-white/[0.07] border-white/10 text-white placeholder:text-white/25 font-['Inter']"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="font-['Inter'] text-xs text-red-400/80 py-2 px-3 rounded"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-transparent border border-white/40 text-white hover:bg-white/10 hover:border-white/60 font-['Inter'] text-sm tracking-wide transition-all duration-200 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="font-['Inter'] text-xs text-white/30">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded font-['Inter'] text-sm text-white/70 transition-all duration-200 hover:text-white hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>}
      </motion.div>
    </div>
  );
}
