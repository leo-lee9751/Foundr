import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router';
import { useAuth } from '../../lib/auth';
import { Sparkles } from 'lucide-react';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0d18] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="w-8 h-8 text-white/20 animate-pulse" />
          <span
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.15em' }}
            className="text-white/30"
          >
            LOADING
          </span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <Outlet />;
}
