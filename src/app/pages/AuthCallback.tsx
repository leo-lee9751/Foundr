import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { navigate('/', { replace: true }); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_complete')
        .eq('id', data.session.user.id)
        .single();

      navigate(profile?.onboarding_complete ? '/discover' : '/onboarding', { replace: true });
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0d18] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Sparkles className="w-8 h-8 text-white/20 animate-pulse" />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>
          SIGNING IN
        </span>
      </div>
    </div>
  );
}
