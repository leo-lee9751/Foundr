import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Send, ArrowLeft, MapPin, ExternalLink } from 'lucide-react';
import { Match, Message } from '../types';
import { allProfiles } from '../data/mockProfiles';
import { Navigation } from '../components/Navigation';
import { motion } from 'motion/react';

// Mock matches data
const mockMatches: Match[] = [
  {
    id: '1',
    profile: allProfiles[0],
    matchedAt: new Date('2026-03-15T10:30:00'),
    messages: [
      {
        id: '1',
        senderId: allProfiles[0].id,
        text: 'Hey! Loved reading about your EdTech idea. Would love to chat more!',
        timestamp: new Date('2026-03-15T10:35:00'),
      },
      {
        id: '2',
        senderId: 'me',
        text: 'Thanks! Your ML background would be perfect for what we\'re building. Free for a call this week?',
        timestamp: new Date('2026-03-15T11:20:00'),
      },
      {
        id: '3',
        senderId: allProfiles[0].id,
        text: 'Definitely! I\'ll send over my Calendly link.',
        timestamp: new Date('2026-03-15T11:25:00'),
      },
    ],
  },
  {
    id: '2',
    profile: allProfiles[4],
    matchedAt: new Date('2026-03-15T14:20:00'),
    messages: [
      {
        id: '1',
        senderId: allProfiles[4].id,
        text: 'Super interested in what you\'re building!',
        timestamp: new Date('2026-03-15T14:25:00'),
      },
    ],
  },
  {
    id: '3',
    profile: allProfiles[1],
    matchedAt: new Date('2026-03-14T16:45:00'),
    messages: [],
  },
  {
    id: '4',
    profile: allProfiles[5],
    matchedAt: new Date('2026-03-14T09:15:00'),
    messages: [],
  },
];

export default function Matches() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedMatch) return;

    // In a real app, this would send to backend
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 -left-24 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"
          animate={{ x: [0, 80, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-0 -right-24 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"
          animate={{ x: [0, -80, 0], y: [0, -50, 0], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <Navigation />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Matches List */}
        <div
          className={`${selectedMatch ? 'hidden md:block' : 'block'} w-full md:w-96 border-r border-white/10 bg-black/40 backdrop-blur overflow-y-auto`}
        >
          <div className="p-5 border-b border-white/10">
            <h2 className="font-['Playfair_Display'] text-2xl tracking-tight">
              matches <span className="text-gray-400 font-['Inter'] text-sm">({mockMatches.length})</span>
            </h2>
          </div>

          <div className="divide-y">
            {mockMatches.map((match) => {
              const lastMessage = match.messages[match.messages.length - 1];
              const hasUnread = match.messages.length > 0 && match.messages.some(m => m.senderId !== 'me');

              return (
                <button
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className={`w-full p-5 text-left transition-colors ${
                    selectedMatch?.id === match.id ? 'bg-white/5' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex gap-3">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={match.profile.profilePicture} />
                      <AvatarFallback>{match.profile.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-['Inter'] font-semibold text-white">{match.profile.name}</h3>
                          <p className="text-xs text-gray-400 line-clamp-1 font-['Inter']">
                            {match.profile.oneLiner}
                          </p>
                        </div>
                        {hasUnread && (
                          <div className="w-2 h-2 bg-zinc-400 rounded-full mt-1" />
                        )}
                      </div>

                      {lastMessage ? (
                        <p className="text-sm text-gray-300 line-clamp-1 mt-1 font-['Inter']">
                          {lastMessage.senderId === 'me' ? 'You: ' : ''}
                          {lastMessage.text}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 mt-1 font-['Inter']">
                          Start a conversation
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-black/20 backdrop-blur">
          {selectedMatch ? (
            <>
              {/* Chat Header */}
              <div className="p-5 border-b border-white/10 flex items-center gap-3">
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="md:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedMatch.profile.profilePicture} />
                  <AvatarFallback>{selectedMatch.profile.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h3 className="font-['Inter'] font-semibold text-white">{selectedMatch.profile.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400 font-['Inter']">
                    <MapPin className="w-3 h-3" />
                    {selectedMatch.profile.location}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Open profile modal
                    console.log('View profile', selectedMatch.profile);
                  }}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Profile
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Match Notification */}
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-200 px-4 py-2 rounded-full text-sm font-['Inter']">
                    <span className="text-base">🎉</span>
                    <span className="text-sm">
                      You matched with {selectedMatch.profile.name} on{' '}
                      {selectedMatch.matchedAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Profile Card */}
                <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedMatch.profile.profilePicture} />
                      <AvatarFallback>{selectedMatch.profile.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-['Inter'] font-semibold text-white">{selectedMatch.profile.name}</h4>
                      <p className="text-sm text-gray-300 italic mb-2 font-['Inter']">
                        "{selectedMatch.profile.oneLiner}"
                      </p>
                      <Badge
                        variant={selectedMatch.profile.track === 'founder' ? 'default' : 'secondary'}
                        className="bg-white/10 text-gray-100 border border-white/10"
                      >
                        {selectedMatch.profile.track === 'founder' ? '🚀 Founder' : '💼 Looking for Role'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 font-['Inter']">{selectedMatch.profile.bio}</p>
                </div>

                {/* Messages */}
                {selectedMatch.messages.map((message) => {
                  const isMe = message.senderId === 'me';
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md rounded-2xl px-4 py-2 ${
                          isMe
                            ? 'bg-zinc-800 border border-white/15 text-white'
                            : 'bg-white/10 text-gray-100 border border-white/10'
                        }`}
                      >
                        <p className="text-sm font-['Inter']">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isMe ? 'text-white/70' : 'text-gray-400'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="p-5 border-t border-white/10 bg-black/30">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="bg-black/40 border-white/10 text-white placeholder:text-gray-500 font-['Inter']"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    variant="ghost"
                    className="bg-transparent border border-white/55 text-white hover:bg-white hover:text-zinc-950 hover:border-white transition-all duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-['Inter']">
                  💡 Tip: Use the Calendly links in profiles to schedule coffee chats
                </p>
              </div>
            </>
          ) : (
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
