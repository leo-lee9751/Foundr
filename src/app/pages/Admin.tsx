import { useEffect, useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  Handle,
  Position,
  NodeProps,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { supabase, DbProfile, DbMatch } from '../../lib/supabase';
import { Sparkles, Users, Heart, Rocket, Zap, CheckCircle, Clock, X, Linkedin, Github, Calendar, ExternalLink } from 'lucide-react';

type AdminView = 'graph' | 'users';

// ── User detail panel ─────────────────────────────────────────────────────────

function UserDetailPanel({ profile, onClose }: { profile: DbProfile; onClose: () => void }) {
  const isFounder = profile.track === 'founder';
  const initials = profile.name
    ? profile.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  const joined = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  const Field = ({ label, value }: { label: string; value: string | null | undefined }) =>
    value ? (
      <div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>{label}</div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{value}</div>
      </div>
    ) : null;

  const Tags = ({ label, items }: { label: string; items: string[] }) =>
    items?.length > 0 ? (
      <div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>{label}</div>
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span key={item} className="px-2 py-0.5 rounded-full text-xs"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif' }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-20" onClick={onClose} />
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full z-30 overflow-y-auto"
        style={{ width: 360, background: 'rgba(10,10,15,0.97)', borderLeft: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
        {/* Close */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)' }}>USER DETAIL</span>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors"><X size={16} /></button>
        </div>

        <div className="p-5 space-y-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold overflow-hidden shrink-0"
              style={{
                background: isFounder ? 'rgba(217,119,6,0.2)' : 'rgba(14,116,144,0.2)',
                border: isFounder ? '1px solid rgba(217,119,6,0.3)' : '1px solid rgba(14,116,144,0.3)',
                color: isFounder ? '#FCD34D' : '#67E8F9',
              }}>
              {profile.profile_picture_url
                ? <img src={profile.profile_picture_url} className="w-full h-full object-cover" />
                : initials}
            </div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#fff' }}>{profile.name ?? '—'}</div>
              {profile.location && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{profile.location}</div>}
              {profile.track && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.08em',
                    background: isFounder ? 'rgba(217,119,6,0.15)' : 'rgba(14,116,144,0.15)',
                    color: isFounder ? '#FCD34D' : '#67E8F9',
                  }}>
                  {isFounder ? 'FOUNDER' : 'BUILDER'}
                </span>
              )}
            </div>
          </div>

          {/* One-liner */}
          {profile.one_liner && (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
              "{profile.one_liner}"
            </p>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

          {/* Bio */}
          <Field label="BIO" value={profile.bio} />

          {/* Founder fields */}
          {isFounder && (
            <>
              <Field label="STARTUP IDEA" value={profile.startup_idea} />
              <Field label="VERTICAL" value={profile.vertical} />
              <Tags label="SKILLS NEEDED" items={profile.skills_needed} />
              <Tags label="WORKING STYLE" items={profile.working_style} />
              <Field label="REMOTE" value={profile.remote_willing ? 'Open to remote' : 'In-person preferred'} />
            </>
          )}

          {/* Builder fields */}
          {!isFounder && profile.track === 'role-player' && (
            <>
              <Field label="ROLE" value={profile.role} />
              <Field label="EXPERIENCE" value={profile.experience} />
              <Tags label="SKILLS" items={profile.skills} />
              <Tags label="INTERESTED VERTICALS" items={profile.startup_preferences} />
            </>
          )}

          {/* Common */}
          <Field label="WORK SCHEDULE" value={profile.work_schedule} />
          {profile.risk_tolerance && <Field label="RISK TOLERANCE" value={profile.risk_tolerance.charAt(0).toUpperCase() + profile.risk_tolerance.slice(1)} />}

          {/* Social links */}
          {(profile.linkedin_url || profile.github_url || profile.calendly_url) && (
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
          )}
          <div className="space-y-2">
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                <Linkedin size={13} /> LinkedIn <ExternalLink size={10} />
              </a>
            )}
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                <Github size={13} /> GitHub <ExternalLink size={10} />
              </a>
            )}
            {profile.calendly_url && (
              <a href={profile.calendly_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                <Calendar size={13} /> Calendly <ExternalLink size={10} />
              </a>
            )}
          </div>

          {/* Meta */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)' }}>JOINED</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{joined}</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)' }}>ONBOARDING</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: profile.onboarding_complete ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>
                {profile.onboarding_complete ? 'complete' : 'pending'}
              </span>
            </div>
            {profile.is_admin && (
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)' }}>ROLE</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#a78bfa' }}>admin</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Custom node ──────────────────────────────────────────────────────────────

type ProfileNodeData = {
  profile: DbProfile;
  onSelect: (profile: DbProfile) => void;
};

function ProfileNode({ data }: NodeProps) {
  const { profile, onSelect } = data as ProfileNodeData;
  const isFounder = profile.track === 'founder';
  const initials = profile.name
    ? profile.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.2)', width: 8, height: 8 }}
      />
      <div
        onClick={() => onSelect(profile)}
        className="flex flex-col items-center gap-2 p-3 rounded-xl backdrop-blur-sm transition-all duration-200 hover:scale-105 cursor-pointer"
        style={{
          width: 128,
          background: isFounder
            ? 'linear-gradient(135deg, rgba(217,119,6,0.15) 0%, rgba(180,83,9,0.1) 100%)'
            : 'linear-gradient(135deg, rgba(14,116,144,0.15) 0%, rgba(8,145,178,0.1) 100%)',
          border: isFounder
            ? '1px solid rgba(217,119,6,0.3)'
            : '1px solid rgba(14,116,144,0.35)',
          boxShadow: isFounder
            ? '0 4px 24px rgba(217,119,6,0.08), inset 0 1px 0 rgba(255,255,255,0.05)'
            : '0 4px 24px rgba(14,116,144,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold overflow-hidden"
          style={{
            background: isFounder ? 'rgba(217,119,6,0.2)' : 'rgba(14,116,144,0.2)',
            border: isFounder ? '1px solid rgba(217,119,6,0.3)' : '1px solid rgba(14,116,144,0.3)',
          }}
        >
          {profile.profile_picture_url ? (
            <img
              src={profile.profile_picture_url}
              alt={profile.name ?? ''}
              className="w-full h-full object-cover"
            />
          ) : (
            <span style={{ color: isFounder ? '#FCD34D' : '#67E8F9' }}>{initials}</span>
          )}
        </div>

        {/* Name */}
        <span
          className="text-center leading-tight font-medium"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            color: 'rgba(255,255,255,0.9)',
            wordBreak: 'break-word',
          }}
        >
          {profile.name ?? 'Unnamed'}
        </span>

        {/* Track badge */}
        <span
          className="px-2 py-0.5 rounded-full"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 8,
            letterSpacing: '0.08em',
            background: isFounder ? 'rgba(217,119,6,0.2)' : 'rgba(14,116,144,0.2)',
            color: isFounder ? '#FCD34D' : '#67E8F9',
          }}
        >
          {isFounder ? 'FOUNDER' : 'BUILDER'}
        </span>

        {/* Location */}
        {profile.location && (
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 9,
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            {profile.location}
          </span>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.2)', width: 8, height: 8 }}
      />
    </div>
  );
}

const nodeTypes = { profile: ProfileNode };

// ── Layout helpers ────────────────────────────────────────────────────────────

const NODE_WIDTH = 128;
const NODE_HEIGHT = 160;
const COL_GAP = 500;
const ROW_GAP = 40;

function buildGraph(profiles: DbProfile[], matches: DbMatch[], onSelect: (p: DbProfile) => void): { nodes: Node[]; edges: Edge[] } {
  const founders = profiles.filter((p) => p.track === 'founder');
  const builders = profiles.filter((p) => p.track === 'role-player');

  const totalLeft = founders.length;
  const totalRight = builders.length;

  const leftX = 80;
  const rightX = leftX + NODE_WIDTH + COL_GAP;

  const leftStartY = (Math.max(totalLeft, totalRight) * (NODE_HEIGHT + ROW_GAP) - totalLeft * (NODE_HEIGHT + ROW_GAP)) / 2;
  const rightStartY = (Math.max(totalLeft, totalRight) * (NODE_HEIGHT + ROW_GAP) - totalRight * (NODE_HEIGHT + ROW_GAP)) / 2;

  const nodes: Node[] = [
    ...founders.map((p, i) => ({
      id: p.id,
      type: 'profile',
      position: { x: leftX, y: leftStartY + i * (NODE_HEIGHT + ROW_GAP) },
      data: { profile: p, onSelect } as ProfileNodeData,
      draggable: true,
    })),
    ...builders.map((p, i) => ({
      id: p.id,
      type: 'profile',
      position: { x: rightX, y: rightStartY + i * (NODE_HEIGHT + ROW_GAP) },
      data: { profile: p, onSelect } as ProfileNodeData,
      draggable: true,
    })),
  ];

  const profileIds = new Set(profiles.map((p) => p.id));
  const edges: Edge[] = matches
    .filter((m) => profileIds.has(m.user1_id) && profileIds.has(m.user2_id))
    .map((m) => ({
      id: `match-${m.id}`,
      source: m.user1_id,
      target: m.user2_id,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: 'rgba(236,72,153,0.4)',
        strokeWidth: 1.5,
        strokeDasharray: '4 3',
      },
      label: '♥',
      labelStyle: { fill: 'rgba(236,72,153,0.7)', fontSize: 10 },
      labelBgStyle: { fill: 'transparent' },
    }));

  return { nodes, edges };
}

// ── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-3 rounded-lg"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center"
        style={{ background: accent + '20', border: `1px solid ${accent}30` }}
      >
        <Icon size={15} style={{ color: accent }} />
      </div>
      <div>
        <div
          style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#fff', lineHeight: 1.1 }}
        >
          {value}
        </div>
        <div
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Admin() {
  const [profiles, setProfiles] = useState<DbProfile[]>([]);
  const [matches, setMatches] = useState<DbMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<AdminView>('graph');
  const [selectedProfile, setSelectedProfile] = useState<DbProfile | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [profilesRes, matchesRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('matches').select('*'),
    ]);

    if (profilesRes.error) {
      setError(profilesRes.error.message);
      setLoading(false);
      return;
    }
    if (matchesRes.error) {
      setError(matchesRes.error.message);
      setLoading(false);
      return;
    }

    const p = (profilesRes.data ?? []) as DbProfile[];
    const m = (matchesRes.data ?? []) as DbMatch[];

    setProfiles(p);
    setMatches(m);

    // Graph only shows users who completed onboarding (have a track)
    const { nodes: n, edges: e } = buildGraph(p.filter(x => x.onboarding_complete), m, setSelectedProfile);
    setNodes(n);
    setEdges(e);
    setLoading(false);
  }, [setNodes, setEdges]);

  useEffect(() => {
    load();

    // Live updates
    const profileSub = supabase
      .channel('admin-profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, load)
      .subscribe();

    const matchSub = supabase
      .channel('admin-matches')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, load)
      .subscribe();

    return () => {
      supabase.removeChannel(profileSub);
      supabase.removeChannel(matchSub);
    };
  }, [load]);

  const founders = profiles.filter((p) => p.track === 'founder');
  const builders = profiles.filter((p) => p.track === 'role-player');
  const matchRate = profiles.length > 0 ? Math.round((matches.length / profiles.length) * 100) : 0;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#0a0a0f', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-8 py-5 shrink-0"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(10,10,15,0.9)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-3">
          <Sparkles size={18} style={{ color: 'rgba(255,255,255,0.5)' }} />
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#fff' }}>
            foundr
          </span>
          <span
            className="px-2 py-0.5 rounded"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9,
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            ADMIN
          </span>
        </div>

        <div className="flex items-center gap-3">
          <StatCard icon={Users} label="TOTAL USERS" value={profiles.length} accent="#a78bfa" />
          <StatCard icon={Rocket} label="FOUNDERS" value={founders.length} accent="#FCD34D" />
          <StatCard icon={Zap} label="BUILDERS" value={builders.length} accent="#67E8F9" />
          <StatCard icon={Heart} label="MATCHES" value={matches.length} accent="#f472b6" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            Refresh
          </button>
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              color: 'rgba(255,255,255,0.35)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: loading ? '#facc15' : '#4ade80', boxShadow: loading ? '0 0 6px #facc15' : '0 0 6px #4ade80' }}
            />
            {loading ? 'LOADING' : 'LIVE'}
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div
        className="flex items-center gap-6 px-8 py-3 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        {/* View toggle */}
        <div
          className="flex rounded-md overflow-hidden shrink-0"
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {(['graph', 'users'] as AdminView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-4 py-1.5 transition-all duration-200"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                letterSpacing: '0.1em',
                background: view === v ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: view === v ? '#fff' : 'rgba(255,255,255,0.35)',
              }}
            >
              {v === 'graph' ? 'NETWORK' : 'USERS'}
            </button>
          ))}
        </div>

        {view === 'graph' && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ background: 'rgba(217,119,6,0.3)', border: '1px solid rgba(217,119,6,0.5)' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Founders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ background: 'rgba(14,116,144,0.3)', border: '1px solid rgba(14,116,144,0.5)' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Builders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-px" style={{ background: 'rgba(236,72,153,0.5)' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Match</span>
            </div>
          </>
        )}

        {profiles.length > 0 && (
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.25)', marginLeft: 'auto' }}>
            {matchRate}% MATCH RATE · {profiles.filter(p => p.onboarding_complete).length} ACTIVE
          </span>
        )}
      </div>

      {/* Users table */}
      {view === 'users' && (
        <div className="flex-1 overflow-auto px-8 py-6">
          <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
            <thead>
              <tr>
                {['User', 'Track', 'Location', 'Role / Vertical', 'Onboarding', 'Joined'].map((h) => (
                  <th
                    key={h}
                    className="text-left pb-3 px-4"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10,
                      letterSpacing: '0.1em',
                      color: 'rgba(255,255,255,0.3)',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => {
                const isFounder = p.track === 'founder';
                const initials = p.name
                  ? p.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
                  : '?';
                const joined = new Date(p.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                });
                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedProfile(p)}
                    style={{ background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}
                    className="hover:bg-white/[0.04] transition-colors"
                  >
                    {/* User */}
                    <td className="px-4 py-3 rounded-l-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden"
                          style={{
                            background: isFounder ? 'rgba(217,119,6,0.2)' : 'rgba(14,116,144,0.2)',
                            border: isFounder ? '1px solid rgba(217,119,6,0.3)' : '1px solid rgba(14,116,144,0.3)',
                            color: isFounder ? '#FCD34D' : '#67E8F9',
                          }}
                        >
                          {p.profile_picture_url
                            ? <img src={p.profile_picture_url} className="w-full h-full object-cover" />
                            : initials}
                        </div>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
                          {p.name ?? <span style={{ color: 'rgba(255,255,255,0.25)' }}>—</span>}
                        </span>
                      </div>
                    </td>
                    {/* Track */}
                    <td className="px-4 py-3">
                      {p.track ? (
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 9,
                            letterSpacing: '0.08em',
                            background: isFounder ? 'rgba(217,119,6,0.15)' : 'rgba(14,116,144,0.15)',
                            color: isFounder ? '#FCD34D' : '#67E8F9',
                          }}
                        >
                          {isFounder ? 'FOUNDER' : 'BUILDER'}
                        </span>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>—</span>
                      )}
                    </td>
                    {/* Location */}
                    <td className="px-4 py-3" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                      {p.location ?? '—'}
                    </td>
                    {/* Role / Vertical */}
                    <td className="px-4 py-3" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                      {isFounder ? (p.vertical ?? '—') : (p.role ?? '—')}
                    </td>
                    {/* Onboarding */}
                    <td className="px-4 py-3">
                      {p.onboarding_complete ? (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle size={13} style={{ color: '#4ade80' }} />
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#4ade80' }}>complete</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} style={{ color: 'rgba(255,255,255,0.25)' }} />
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>pending</span>
                        </div>
                      )}
                    </td>
                    {/* Joined */}
                    <td className="px-4 py-3 rounded-r-lg" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                      {joined}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {profiles.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Users size={32} style={{ color: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'rgba(255,255,255,0.15)' }}>
                no users yet
              </span>
            </div>
          )}
        </div>
      )}

      {/* Graph */}
      {view === 'graph' && <div className="flex-1 relative">
        {error && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10"
            style={{ background: 'rgba(10,10,15,0.95)' }}
          >
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#f87171' }}>
              ERROR
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)', maxWidth: 400, textAlign: 'center' }}>
              {error}
            </div>
            <button
              onClick={load}
              className="px-4 py-2 rounded-lg"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', fontSize: 12 }}
            >
              Retry
            </button>
          </div>
        )}

        {!error && profiles.length === 0 && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
            <Sparkles size={32} style={{ color: 'rgba(255,255,255,0.1)' }} />
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'rgba(255,255,255,0.15)' }}>
              no users yet
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>
              users will appear here as they sign up
            </div>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.2}
          maxZoom={2}
          style={{ background: 'transparent' }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="rgba(255,255,255,0.06)"
          />
          <Controls
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
            }}
          />
        </ReactFlow>
      </div>}

      {/* User detail panel */}
      {selectedProfile && (
        <UserDetailPanel profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
      )}
    </div>
  );
}
