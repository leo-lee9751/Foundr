import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { Profile, FounderProfile, RolePlayerProfile } from '../types';
import { MapPin, Linkedin, Github, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right' | 'super') => void;
  style?: React.CSSProperties;
}

function SectionLabel({
  accent: _accent,
  children,
}: {
  accent: 'blue' | 'cyan' | 'amber';
  children: React.ReactNode;
}) {
  const bar = 'bg-zinc-600';
  return (
    <div className="flex items-center gap-2.5 mb-2.5">
      <span className={`h-px w-6 ${bar} shrink-0 rounded-full`} />
      <span className="font-['JetBrains_Mono'] text-[10px] tracking-[0.2em] text-gray-500 uppercase">
        {children}
      </span>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 backdrop-blur-sm">
      <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
        {label}
      </p>
      <p className="font-['Inter'] text-sm text-white/90 leading-snug">{value}</p>
    </div>
  );
}

function formatRisk(r: string) {
  if (r === 'vc') return 'VC-backed';
  if (r === 'bootstrapping') return 'Bootstrapping';
  return 'Flexible';
}

export function SwipeCard({ profile, onSwipe, style }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  /** Red outline intensity when dragging left (pass) */
  const passRingOpacity = useTransform(x, [-130, -20, 0], [1, 0.35, 0], { clamp: true });
  /** Green outline intensity when dragging right (like) */
  const likeRingOpacity = useTransform(x, [0, 20, 130], [0, 0.35, 1], { clamp: true });
  /** Slight lift while dragging — feels more alive */
  const dragScale = useTransform(x, (v) => 1 + (Math.min(Math.abs(v), 120) / 120) * 0.035);
  /** Directional glow on the whole card */
  const cardGlow = useTransform(
    x,
    [-200, 0, 200],
    [
      '0 22px 70px -20px rgba(239,68,68,0.35), 0 0 60px -15px rgba(239,68,68,0.2)',
      '0 28px 90px -24px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)',
      '0 22px 70px -20px rgba(16,185,129,0.3), 0 0 60px -15px rgba(16,185,129,0.18)',
    ],
  );

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(offset) > 100 || Math.abs(velocity) > 500) {
      if (offset > 0) {
        onSwipe('right');
      } else {
        onSwipe('left');
      }
    } else {
      x.set(0);
    }
  };

  const isFounder = profile.track === 'founder';
  const founderProfile = profile as FounderProfile;
  const rolePlayerProfile = profile as RolePlayerProfile;

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        scale: dragScale,
        boxShadow: cardGlow,
        ...style,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.12}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className="absolute inset-0 w-full max-w-md mx-auto flex flex-col rounded-2xl overflow-hidden cursor-grab border border-white/[0.08] bg-zinc-950"
    >
      {/* Drag feedback: colored outline only (no text stamps) */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 rounded-2xl border-2 border-red-500"
        style={{ opacity: passRingOpacity }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 rounded-2xl border-2 border-emerald-500"
        style={{ opacity: likeRingOpacity }}
      />

      {/* Hero */}
      <div className="relative shrink-0 h-[min(42vh,360px)] min-h-[280px]">
        <img
          src={profile.profilePicture}
          alt={profile.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent h-1/3" />

        {/* Drag tint on photo — reinforces pass / like without text */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[1] bg-red-500/50 mix-blend-overlay"
          style={{ opacity: passRingOpacity }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 z-[1] bg-emerald-500/45 mix-blend-overlay"
          style={{ opacity: likeRingOpacity }}
        />

        <div className="absolute top-4 right-4 z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 backdrop-blur-md">
            <span className="h-1 w-1 rounded-full bg-white/50" />
            <span className="font-['JetBrains_Mono'] text-[10px] tracking-[0.15em] text-white/90">
              {isFounder ? 'FOUNDER' : 'BUILDER'}
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-6">
          <h2 className="font-['Playfair_Display'] text-[1.75rem] sm:text-3xl font-medium tracking-tight text-white mb-1.5">
            {profile.name}
          </h2>
          <div className="flex items-center gap-1.5 text-sm text-white/75 font-['Inter'] mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0 opacity-80" />
            <span>{profile.location}</span>
          </div>
          <p className="font-['Inter'] text-sm text-white/90 leading-snug line-clamp-2">
            <span className="text-white/55 not-italic">— </span>
            <span className="italic text-white/95">“{profile.oneLiner}”</span>
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="scrollbar-sleek flex-1 min-h-0 overflow-y-auto overscroll-contain border-t border-white/[0.06] bg-zinc-950">
        <div className="p-5 sm:p-6 space-y-5">
          <div>
            <SectionLabel accent="amber">About</SectionLabel>
            <p className="font-['Inter'] text-[13px] leading-relaxed text-zinc-300 pl-0">
              {profile.bio}
            </p>
          </div>

          {isFounder && (
            <>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <SectionLabel accent="amber">Startup idea</SectionLabel>
                <p className="font-['Inter'] text-[13px] leading-relaxed text-zinc-300">
                  {founderProfile.startupIdea}
                </p>
              </div>

              <div>
                <SectionLabel accent="blue">Looking for</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {founderProfile.skillsNeeded.map((skill) => (
                    <Badge
                      key={skill}
                      className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 font-['Inter'] text-[11px] font-medium text-white/80"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <SectionLabel accent="cyan">Working style</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {founderProfile.workingStyle.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 font-['Inter'] text-[11px] text-zinc-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <StatCell label="Vertical" value={founderProfile.vertical} />
                <StatCell
                  label="Remote"
                  value={founderProfile.remoteWilling ? 'Yes' : 'No'}
                />
                <StatCell label="Risk" value={formatRisk(founderProfile.riskTolerance)} />
                <StatCell label="Schedule" value={founderProfile.workSchedule} />
              </div>
            </>
          )}

          {!isFounder && (
            <>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-1">
                <SectionLabel accent="blue">Role & experience</SectionLabel>
                <p className="font-['Inter'] text-[13px] text-zinc-200">{rolePlayerProfile.role}</p>
                <p className="font-['Inter'] text-xs text-zinc-500">{rolePlayerProfile.experience}</p>
              </div>

              <div>
                <SectionLabel accent="cyan">Skills</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {rolePlayerProfile.skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 font-['Inter'] text-[11px] font-medium text-white/80"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <SectionLabel accent="amber">Interested in</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {rolePlayerProfile.startupPreferences.map((pref) => (
                    <span
                      key={pref}
                      className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 font-['Inter'] text-[11px] text-zinc-300"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <StatCell label="Risk" value={formatRisk(rolePlayerProfile.riskTolerance)} />
                <StatCell label="Schedule" value={rolePlayerProfile.workSchedule} />
              </div>
            </>
          )}

          <div className="flex flex-wrap gap-2 pt-1 border-t border-white/[0.06]">
            {profile.linkedInUrl && (
              <motion.a
                href={profile.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-['Inter'] text-zinc-400 hover:bg-white/[0.08] hover:border-white/15 hover:text-zinc-200 transition-colors"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Linkedin className="w-4 h-4 opacity-90" />
                LinkedIn
              </motion.a>
            )}
            {profile.githubUrl && (
              <motion.a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-['Inter'] text-zinc-200 hover:bg-white/[0.08] transition-colors"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Github className="w-4 h-4 opacity-90" />
                GitHub
              </motion.a>
            )}
            {profile.calendlyUrl && (
              <motion.a
                href={profile.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-['Inter'] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200 transition-colors"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calendar className="w-4 h-4 opacity-90" />
                Calendly
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
