import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Image — stronger so the cityscape reads clearly */}
      <div
        className="absolute inset-0 opacity-[0.88] sm:opacity-[0.85]"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1768066360882-14302bb37971?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'saturate(1.6) contrast(1.05)',
        }}
      />

      {/* Gradient: lighter over the sky / buildings, darker toward the bottom for type contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/[0.82]" />

      {/* Subtle vignette so edges don’t blow out */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_50%_35%,transparent_0%,rgba(0,0,0,0.25)_100%)]"
        aria-hidden
      />

      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-white/[0.025] rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10">
        <motion.div 
          className="flex items-center gap-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <motion.div 
            className="w-8 h-0.5 bg-zinc-300"
            initial={{ width: 0 }}
            animate={{ width: 32 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            />
            <span className="font-['JetBrains_Mono'] text-xs text-zinc-200 tracking-wider">
              STARTUP MATCHING
            </span>
          </div>
        </motion.div>
        <motion.div
          className="flex items-center gap-8 text-sm antialiased"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            type="button"
            className="font-['Plus_Jakarta_Sans'] text-[13px] font-medium tracking-[0.04em] text-zinc-200 transition-colors hover:text-white"
          >
            founders
          </button>
          <button
            type="button"
            className="font-['Plus_Jakarta_Sans'] text-[13px] font-medium tracking-[0.04em] text-zinc-200 transition-colors hover:text-white"
          >
            talent
          </button>
          <button
            type="button"
            className="font-['Plus_Jakarta_Sans'] text-[13px] font-medium tracking-[0.04em] text-zinc-200 transition-colors hover:text-white"
          >
            about
          </button>
          <Link to="/onboarding">
            <motion.button
              type="button"
              className="px-4 py-2 font-['Plus_Jakarta_Sans'] text-[13px] font-semibold tracking-[0.06em] text-zinc-100 transition-colors border border-white/25 hover:border-white/45 hover:bg-white/5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              apply
            </motion.button>
          </Link>
        </motion.div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-start justify-center min-h-[calc(100vh-120px)] px-16 max-w-7xl">
        <motion.div 
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div 
            className="w-12 h-0.5 bg-zinc-300"
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          <span className="font-['JetBrains_Mono'] text-xs text-zinc-200 tracking-wider">
            VENTURE INFRASTRUCTURE
          </span>
        </motion.div>

        <motion.h1 
          className="font-['Playfair_Display'] text-8xl mb-8 tracking-tight leading-none"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="inline-block text-white">
            foundr
          </span>
        </motion.h1>

        <motion.p 
          className="font-['Plus_Jakarta_Sans'] text-lg font-normal leading-relaxed text-zinc-200 mb-12 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          all the <span className="text-white">infrastructure</span> for your startup.
        </motion.p>

        <motion.div 
          className="flex gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Link to="/onboarding">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost"
                className="px-8 py-6 bg-transparent border border-white/80
                 text-white font-['Plus_Jakarta_Sans'] text-sm font-semibold tracking-[0.06em] hover:bg-white/15 hover:text-white hover:border-white/70 transition-all duration-200 group"
              >
                Apply to Build
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </Link>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline"
              className="px-8 py-6 bg-transparent border-white/40 text-white hover:bg-white/30 hover:border-white/40 font-['Plus_Jakarta_Sans'] text-sm font-semibold tracking-[0.06em] group"
            >
              Explore Ventures
              <Sparkles className="ml-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats — same voice as hero: mono label + Playfair figures + Jakarta captions */}
        <motion.div
          className="mt-20 w-full max-w-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-zinc-300" />
            <span className="font-['JetBrains_Mono'] text-[11px] text-zinc-200 tracking-[0.18em]">
              THE NETWORK
            </span>
          </div>
          <div className="flex flex-col gap-10 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-16 sm:gap-y-8">
            {[
              { value: '500+', label: 'Active founders' },
              { value: '1000+', label: 'Builders' },
              { value: '200+', label: 'Matches made' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-['Playfair_Display'] text-[2rem] leading-none tracking-tight text-white sm:text-[2.125rem]">
                  {stat.value}
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-sm font-normal text-zinc-300">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}