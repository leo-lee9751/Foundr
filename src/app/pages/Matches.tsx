import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Send, ArrowLeft, MapPin, Loader2, Heart } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { motion } from 'motion/react';
import { supabase, DbProfile, DbMessage } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';

interface MatchWithProfiles {
  id: string;
  created_at: string;
  user1_id: string;
  user2_id: string;
  user1: DbProfile;
  user2: DbProfile;
}

export default function Matches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchWithProfiles[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchWithProfiles | null>(null);
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch matches on mount
  useEffect(() => {
    if (!user) return;
    const fetchMatches = async () => {
      const { data } = await supabase
        .from('matches')
        .select(`
          id, created_at, user1_id, user2_id,
          user1:profiles!matches_user1_id_fkey(id, name, track, location, one_liner, bio, profile_picture_url, role, vertical, skills, skills_needed),
          user2:profiles!matches_user2_id_fkey(id, name, track, location, one_liner, bio, profile_picture_url, role, vertical, skills, skills_needed)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      setMatches((data as MatchWithProfiles[]) ?? []);
      setLoadingMatches(false);
    };
    fetchMatches();
  }, [user]);

  // Fetch messages + subscribe to realtime when match is selected
  useEffect(() => {
    if (!selectedMatch) { setMessages([]); return; }

    setLoadingMessages(true);
    supabase
      .from('messages')
      .select('*')
      .eq('match_id', selectedMatch.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setMessages((data as DbMessage[]) ?? []);
        setLoadingMessages(false);
      });

    const channel = supabase
      .channel(`messages-${selectedMatch.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${selectedMatch.id}` },
        (payload) => setMessages((prev) => [...prev, payload.new as DbMessage]),
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedMatch?.id]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || !selectedMatch || !user || sending) return;
    const text = messageInput.trim();
    setMessageInput('');
    setSending(true);
    await supabase.from('messages').insert({ match_id: selectedMatch.id, sender_id: user.id, text });
    setSending(false);
  }, [messageInput, selectedMatch, user, sending]);

  const getOtherUser = (match: MatchWithProfiles): DbProfile =>
    match.user1_id === user?.id ? match.user2 : match.user1;

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatMatchDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-0 -left-24 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"
          animate={{ x: [0, 80, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="absolute bottom-0 -right-24 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"
          animate={{ x: [0, -80, 0], y: [0, -50, 0], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} />
      </div>

      <Navigation />

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* ── Matches list ── */}
        <div className={`${selectedMatch ? 'hidden md:block' : 'block'} w-full md:w-96 border-r border-white/10 bg-black/40 backdrop-blur overflow-y-auto`}>
          <div className="p-5 border-b border-white/10">
            <h2 className="font-['Playfair_Display'] text-2xl tracking-tight">
              matches{' '}
              {!loadingMatches && (
                <span className="text-gray-400 font-['Inter'] text-sm">({matches.length})</span>
              )}
            </h2>
          </div>

          {loadingMatches ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-5 h-5 text-white/30 animate-spin" />
            </div>
          ) : matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 gap-3 text-center">
              <Heart className="w-10 h-10 text-white/10" />
              <p className="font-['Playfair_Display'] text-lg text-white/20">no matches yet</p>
              <p className="font-['Inter'] text-xs text-white/25">keep swiping on the discover page</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {matches.map((match) => {
                const other = getOtherUser(match);
                const initials = other.name
                  ? other.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
                  : '?';

                return (
                  <button key={match.id} onClick={() => setSelectedMatch(match)}
                    className={`w-full p-5 text-left transition-colors ${selectedMatch?.id === match.id ? 'bg-white/5' : 'hover:bg-white/5'}`}>
                    <div className="flex gap-3">
                      <Avatar className="w-14 h-14">
                        {other.profile_picture_url && <AvatarImage src={other.profile_picture_url} />}
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-['Inter'] font-semibold text-white">{other.name ?? 'Unknown'}</h3>
                        <p className="text-xs text-gray-400 line-clamp-1 font-['Inter']">{other.one_liner ?? ''}</p>
                        <p className="text-xs text-gray-500 mt-1 font-['Inter']">
                          matched {formatMatchDate(match.created_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Chat area ── */}
        <div className="flex-1 flex flex-col bg-black/20 backdrop-blur">
          {selectedMatch ? (() => {
            const other = getOtherUser(selectedMatch);
            const initials = other.name
              ? other.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
              : '?';
            return (
              <>
                {/* Chat header */}
                <div className="p-5 border-b border-white/10 flex items-center gap-3">
                  <button onClick={() => setSelectedMatch(null)} className="md:hidden">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <Avatar className="w-10 h-10">
                    {other.profile_picture_url && <AvatarImage src={other.profile_picture_url} />}
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-['Inter'] font-semibold text-white">{other.name ?? 'Unknown'}</h3>
                    {other.location && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 font-['Inter']">
                        <MapPin className="w-3 h-3" />{other.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {/* Match notification */}
                  <div className="text-center py-4">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-200 px-4 py-2 rounded-full text-sm font-['Inter']">
                      <span>🎉</span>
                      <span className="text-sm">
                        You matched with {other.name ?? 'them'} on {formatMatchDate(selectedMatch.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Profile card */}
                  <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12">
                        {other.profile_picture_url && <AvatarImage src={other.profile_picture_url} />}
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-['Inter'] font-semibold text-white">{other.name ?? 'Unknown'}</h4>
                        {other.one_liner && (
                          <p className="text-sm text-gray-300 italic mb-2 font-['Inter']">"{other.one_liner}"</p>
                        )}
                        {other.track && (
                          <Badge className="bg-white/10 text-gray-100 border border-white/10">
                            {other.track === 'founder' ? '🚀 Founder' : '💼 Builder'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {other.bio && (
                      <p className="text-sm text-gray-300 font-['Inter']">{other.bio}</p>
                    )}
                  </div>

                  {/* Message bubbles */}
                  {loadingMessages ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-4 h-4 text-white/30 animate-spin" />
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender_id === user?.id;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs md:max-w-md rounded-2xl px-4 py-2 ${
                            isMe ? 'bg-zinc-800 border border-white/15 text-white' : 'bg-white/10 text-gray-100 border border-white/10'
                          }`}>
                            <p className="text-sm font-['Inter']">{msg.text}</p>
                            <p className={`text-xs mt-1 ${isMe ? 'text-white/50' : 'text-gray-400'}`}>
                              {formatTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="p-5 border-t border-white/10 bg-black/30">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      className="bg-black/40 border-white/10 text-white placeholder:text-gray-500 font-['Inter']"
                    />
                    <Button onClick={handleSendMessage} disabled={!messageInput.trim() || sending}
                      variant="ghost"
                      className="bg-transparent border border-white/55 text-white hover:bg-white hover:text-zinc-950 hover:border-white transition-all duration-200">
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-['Inter']">
                    💡 Tip: Use Calendly links in profiles to schedule coffee chats
                  </p>
                </div>
              </>
            );
          })() : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="font-['Inter']">Select a match to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
