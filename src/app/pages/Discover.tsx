import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { SwipeCard } from '../components/SwipeCard';
import { Profile } from '../types';
import { allProfiles } from '../data/mockProfiles';
import { Button } from '../components/ui/button';
import { X, Heart, Star, RotateCcw, UserCheck } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { FloatingParticles } from '../components/FloatingParticles';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

function triggerMatchConfetti() {
  confetti({
    particleCount: 55,
    spread: 58,
    origin: { y: 0.72 },
    scalar: 0.9,
    gravity: 1.05,
    ticks: 120,
    colors: ['#d4d4d8', '#a1a1aa', '#e5e7eb', '#f4f4f5'],
    zIndex: 9999,
  });
}

export default function Discover() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [superLikesRemaining, setSuperLikesRemaining] = useState(1);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchPartnerName, setMatchPartnerName] = useState<string | null>(null);

  useEffect(() => {
    // Shuffle profiles
    const shuffled = [...allProfiles].sort(() => Math.random() - 0.5);
    setProfiles(shuffled);
  }, []);

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const handleSwipe = (direction: 'left' | 'right' | 'super') => {
    const active = profiles[currentIndex];
    if (!active) return;

    let scheduleMatch = false;

    if (direction === 'super' && superLikesRemaining > 0) {
      setSuperLikesRemaining((prev) => prev - 1);
      triggerConfetti();
      if (Math.random() > 0.7) {
        scheduleMatch = true;
      }
    } else if (direction === 'right') {
      if (Math.random() > 0.8) {
        scheduleMatch = true;
      }
    }

    if (scheduleMatch) {
      setTimeout(() => {
        setMatchPartnerName(active.name);
        setShowMatchModal(true);
        triggerMatchConfetti();
      }, 280);
    }

    if (currentIndex < profiles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(profiles.length);
    }
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="font-['Inter']">Loading profiles...</p>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <motion.div 
              className="text-6xl mb-4"
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              ✨
            </motion.div>
            <h2 className="font-['Playfair_Display'] text-4xl text-white">
              you've seen everyone
            </h2>
            <p className="text-gray-400 font-['Inter']">check back later for more matches</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost"
                onClick={() => setCurrentIndex(0)}
                className="mt-4 bg-transparent border border-white/55 text-white hover:bg-white hover:text-zinc-950 hover:border-white transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  const remainingProfiles = profiles.slice(currentIndex);

  return (
    <motion.div
      className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      {/* Ambient: gradients + subtle grid + particles — less empty while swiping */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <FloatingParticles count={22} />
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Header */}
      <Navigation />

      {/* Main: card + status + actions — stacked so nothing overlaps */}
      <div className="flex-1 flex flex-col items-center min-h-0 px-4 pb-6 pt-2 relative z-10">
        <div className="w-full max-w-md flex flex-col flex-1 min-h-0 gap-4 max-h-[min(100dvh-10rem,820px)]">
          <div className="relative flex-1 min-h-[420px] w-full">
            <div className="absolute inset-0">
              {remainingProfiles.slice(0, 3).map((profile, index) => (
                <motion.div
                  key={profile.id}
                  className="absolute inset-0"
                  initial={{ scale: 1 - index * 0.05, y: index * 10 }}
                  animate={{
                    scale: 1 - index * 0.05,
                    y: index * 10,
                    opacity: index === 0 ? 1 : 0.45,
                  }}
                  style={{
                    zIndex: remainingProfiles.length - index,
                  }}
                >
                  {index === 0 && (
                    <SwipeCard profile={profile} onSwipe={handleSwipe} />
                  )}
                  {index > 0 && (
                    <div className="h-full w-full rounded-2xl border border-white/10 bg-zinc-900/90 backdrop-blur-sm shadow-xl" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Compact actions — equal controls, muted; swipe remains primary */}
          <div className="flex shrink-0 justify-center px-1 pb-2">
            <div className="inline-flex items-center gap-0.5 rounded-full border border-white/[0.07] bg-black/50 px-1 py-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <button
                type="button"
                aria-label="Undo last swipe"
                disabled={currentIndex === 0}
                onClick={handleUndo}
                className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-200 disabled:pointer-events-none disabled:opacity-25"
              >
                <RotateCcw className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>
              <span className="mx-0.5 h-6 w-px shrink-0 bg-white/[0.08]" aria-hidden />
              <button
                type="button"
                aria-label="Pass"
                onClick={() => handleSwipe('left')}
                className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400/90"
              >
                <X className="h-[20px] w-[20px]" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                aria-label="Super like"
                disabled={superLikesRemaining === 0}
                onClick={() => handleSwipe('super')}
                className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/[0.07] hover:text-zinc-200 disabled:pointer-events-none disabled:opacity-25"
              >
                <Star className="h-[18px] w-[18px]" strokeWidth={1.75} fill="none" />
              </button>
              <button
                type="button"
                aria-label="Like"
                onClick={() => handleSwipe('right')}
                className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400/90"
              >
                <Heart className="h-[20px] w-[20px]" strokeWidth={1.75} fill="none" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Match — calm, product-style */}
      <AnimatePresence>
        {showMatchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-md"
            onClick={() => {
              setShowMatchModal(false);
              setMatchPartnerName(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 p-8 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_24px_80px_-20px_rgba(0,0,0,0.85)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />

              <div className="relative z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                  <UserCheck className="h-6 w-6 text-zinc-300" strokeWidth={1.75} />
                </div>

                <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Mutual interest
                </p>
                <h2 className="mt-2 font-['Plus_Jakarta_Sans'] text-2xl font-semibold tracking-tight text-white sm:text-[1.65rem]">
                  You&apos;re connected
                </h2>
                <p className="mt-3 font-['Plus_Jakarta_Sans'] text-sm leading-relaxed text-zinc-400">
                  You and{' '}
                  <span className="font-medium text-zinc-200">{matchPartnerName ?? '—'}</span>
                  {' '}both expressed interest. Start a conversation from Matches.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMatchModal(false);
                      setMatchPartnerName(null);
                    }}
                    className="w-full border-white/15 bg-transparent font-['Plus_Jakarta_Sans'] text-sm font-medium text-zinc-200 hover:bg-white/[0.06] hover:text-white sm:w-auto"
                  >
                    Continue swiping
                  </Button>
                  <Button
                    onClick={() => {
                      setShowMatchModal(false);
                      setMatchPartnerName(null);
                      navigate('/matches');
                    }}
                    variant="ghost"
                    className="w-full bg-transparent border border-white/55 text-white font-['Plus_Jakarta_Sans'] text-sm font-semibold hover:bg-white hover:text-zinc-950 hover:border-white transition-all duration-200 sm:w-auto"
                  >
                    Open messages
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}