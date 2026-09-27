import React, { useState } from 'react';
import { 
  MessageSquare, 
  Hash, 
  Volume2, 
  Mic, 
  MicOff, 
  Headphones, 
  Settings, 
  Send, 
  Plus, 
  Smile, 
  Gift, 
  Pin, 
  Bell, 
  Users, 
  PhoneOff, 
  Radio, 
  Code, 
  Sparkles,
  Search,
  Check,
  Compass
} from 'lucide-react';
import { DiscordServer, DiscordMessage } from '../../types/distro';
import { INITIAL_DISCORD_SERVERS, INITIAL_DISCORD_MESSAGES } from '../../data/securityAndNewAppsDefaults';

export const DiscordApp: React.FC = () => {
  const [servers, setServers] = useState<DiscordServer[]>(INITIAL_DISCORD_SERVERS);
  const [activeServerId, setActiveServerId] = useState<string>('srv-devforge');
  const [activeChannelId, setActiveChannelId] = useState<string>('ch-announcements');
  const [messages, setMessages] = useState<Record<string, DiscordMessage[]>>(INITIAL_DISCORD_MESSAGES);
  const [inputMessage, setInputMessage] = useState<string>('');
  
  // Voice call state
  const [connectedVoiceChannel, setConnectedVoiceChannel] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDeafened, setIsDeafened] = useState<boolean>(false);
  const [showMemberList, setShowMemberList] = useState<boolean>(true);

  const activeServer = servers.find(s => s.id === activeServerId) || servers[0];
  const activeChannel = activeServer.channels.find(c => c.id === activeChannelId) || activeServer.channels[0];
  const currentMessages = messages[activeChannelId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: DiscordMessage = {
      id: `msg-${Date.now()}`,
      author: 'devforge',
      avatarBg: 'bg-gradient-to-tr from-cyan-600 to-blue-600',
      roleColor: 'text-cyan-400',
      timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: inputMessage.trim(),
      reactions: []
    };

    setMessages(prev => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMessage]
    }));

    setInputMessage('');
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    setMessages(prev => {
      const channelMsgs = prev[activeChannelId] || [];
      const updated = channelMsgs.map(m => {
        if (m.id === msgId) {
          const rxList = m.reactions || [];
          const existing = rxList.find(r => r.emoji === emoji);
          if (existing) {
            return {
              ...m,
              reactions: rxList.map(r => r.emoji === emoji ? { ...r, count: r.active ? r.count - 1 : r.count + 1, active: !r.active } : r).filter(r => r.count > 0)
            };
          } else {
            return {
              ...m,
              reactions: [...rxList, { emoji, count: 1, active: true }]
            };
          }
        }
        return m;
      });
      return { ...prev, [activeChannelId]: updated };
    });
  };

  const handleConnectVoice = (chId: string) => {
    if (connectedVoiceChannel === chId) {
      setConnectedVoiceChannel(null);
    } else {
      setConnectedVoiceChannel(chId);
    }
  };

  return (
    <div className="flex h-full w-full bg-[#1e1f22] text-[#dbdee1] text-xs font-sans overflow-hidden select-text">
      {/* 1. Leftmost Server Rail */}
      <div className="w-[72px] bg-[#1e1f22] border-r border-[#111214] flex flex-col items-center py-3 space-y-2 shrink-0 select-none">
        {/* Discord Home / DMs Icon */}
        <button
          onClick={() => {
            setActiveServerId('srv-devforge');
            setActiveChannelId('ch-announcements');
          }}
          className="relative group w-12 h-12 rounded-3xl hover:rounded-2xl bg-[#313338] hover:bg-[#5865f2] flex items-center justify-center text-white transition-all cursor-pointer shadow-md"
          title="Direct Messages"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </button>

        <div className="w-8 h-[2px] bg-[#35363c] rounded-full my-1" />

        {/* Server Icons */}
        {servers.map(server => {
          const isActive = server.id === activeServerId;
          return (
            <button
              key={server.id}
              onClick={() => {
                setActiveServerId(server.id);
                setActiveChannelId(server.channels[0]?.id || 'ch-general');
              }}
              className={`relative group w-12 h-12 rounded-3xl hover:rounded-2xl flex items-center justify-center font-bold text-white transition-all cursor-pointer shadow-md ${
                isActive 
                  ? 'rounded-2xl bg-[#5865f2] ring-2 ring-white/20' 
                  : `${server.iconBg} hover:bg-[#5865f2]`
              }`}
              title={server.name}
            >
              {server.shortName}

              {/* Active pill indicator */}
              {isActive && (
                <div className="absolute -left-3 w-1.5 h-10 bg-white rounded-r-full" />
              )}
            </button>
          );
        })}

        <button
          onClick={() => alert('DevForge Server Discovery: Rust, Linux, Docker, K8s public communities verified.')}
          className="w-12 h-12 rounded-3xl hover:rounded-2xl bg-[#313338] hover:bg-[#23a55a] flex items-center justify-center text-[#23a55a] hover:text-white transition-all cursor-pointer"
          title="Explore Public Servers"
        >
          <Compass className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Channels Sidebar */}
      <div className="w-60 bg-[#2b2d31] flex flex-col justify-between shrink-0 select-none border-r border-[#1f2023]">
        {/* Server Header */}
        <div className="h-12 px-4 border-b border-[#1f2023] flex items-center justify-between shadow-xs">
          <span className="font-bold text-white text-xs truncate">{activeServer.name}</span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
            Verified
          </span>
        </div>

        {/* Channel Categories & List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {/* Text Channels */}
          <div className="space-y-0.5">
            <div className="px-2 text-[10px] font-bold text-[#949ba4] uppercase tracking-wider font-mono">
              Text Channels
            </div>
            {activeServer.channels.filter(c => c.type === 'text').map(ch => {
              const isSelected = ch.id === activeChannelId;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannelId(ch.id)}
                  className={`w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#404249] text-white font-medium'
                      : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
                  }`}
                >
                  <Hash className="w-4 h-4 text-[#80848e] shrink-0" />
                  <span className="truncate">{ch.name}</span>
                </button>
              );
            })}
          </div>

          {/* Voice Channels */}
          <div className="space-y-0.5">
            <div className="px-2 text-[10px] font-bold text-[#949ba4] uppercase tracking-wider font-mono">
              Voice Channels (PipeWire)
            </div>
            {activeServer.channels.filter(c => c.type === 'voice').map(ch => {
              const isConnected = connectedVoiceChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => handleConnectVoice(ch.id)}
                  className={`w-full px-2 py-1.5 rounded-md flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    isConnected
                      ? 'bg-[#23a55a]/20 text-[#23a55a] font-medium'
                      : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Volume2 className={`w-4 h-4 shrink-0 ${isConnected ? 'text-[#23a55a]' : 'text-[#80848e]'}`} />
                    <span className="truncate">{ch.name}</span>
                  </div>

                  {isConnected && (
                    <span className="text-[9px] font-mono bg-[#23a55a] text-white px-1.5 py-0.2 rounded">
                      Live
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Voice Connected Box (if active) */}
        {connectedVoiceChannel && (
          <div className="p-3 bg-[#111214] border-t border-[#1f2023] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[#23a55a] font-bold text-[11px]">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Voice Connected (RTC 12ms)</span>
              </div>
              <div className="text-[10px] text-[#949ba4] font-mono">
                PipeWire ProAudio / 48kHz lossless
              </div>
            </div>

            <button
              onClick={() => setConnectedVoiceChannel(null)}
              className="p-1.5 bg-red-950/80 hover:bg-red-900 text-red-400 rounded-lg transition-colors cursor-pointer"
              title="Disconnect Voice"
            >
              <PhoneOff className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* User Footer Profile */}
        <div className="h-14 bg-[#232428] px-3 flex items-center justify-between border-t border-[#1f2023]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
                DF
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#23a55a] border-2 border-[#232428] rounded-full" />
            </div>

            <div className="min-w-0">
              <div className="font-bold text-white text-xs truncate">devforge</div>
              <div className="text-[10px] text-[#23a55a] font-mono truncate">
                🎮 Playing Cyber Defender 2026
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[#b5bac1]">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-1.5 rounded hover:bg-[#35373c] ${isMuted ? 'text-red-400' : ''}`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setIsDeafened(!isDeafened)}
              className={`p-1.5 rounded hover:bg-[#35373c] ${isDeafened ? 'text-red-400' : ''}`}
              title={isDeafened ? 'Undeafen' : 'Deafen'}
            >
              <Headphones className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => alert('Discord Linux Settings: PipeWire input/output, Krisp noise suppression active.')}
              className="p-1.5 rounded hover:bg-[#35373c]"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Chat View */}
      <div className="flex-1 flex flex-col bg-[#313338] min-w-0 overflow-hidden">
        {/* Chat Header */}
        <div className="h-12 px-4 border-b border-[#1f2023] flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Hash className="w-5 h-5 text-[#80848e] shrink-0" />
            <span className="font-bold text-white text-xs">{activeChannel.name}</span>
            {activeChannel.topic && (
              <>
                <div className="w-px h-4 bg-[#3f4147]" />
                <span className="text-[11px] text-[#949ba4] truncate">{activeChannel.topic}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 text-[#b5bac1]">
            <button 
              onClick={() => setShowMemberList(!showMemberList)}
              className={`hover:text-white p-1 rounded ${showMemberList ? 'text-white' : ''}`}
              title="Toggle Member List"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentMessages.length > 0 ? (
            currentMessages.map(msg => (
              <div key={msg.id} className="flex items-start gap-3 group">
                <div className={`w-9 h-9 rounded-full ${msg.avatarBg} flex items-center justify-center font-bold text-white text-xs shrink-0`}>
                  {msg.author.substring(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-xs ${msg.roleColor || 'text-white'}`}>{msg.author}</span>
                    {msg.isBot && (
                      <span className="px-1 py-0.2 bg-[#5865f2] text-white rounded text-[9px] font-bold font-mono">
                        APP
                      </span>
                    )}
                    <span className="text-[10px] text-[#949ba4] font-mono">{msg.timestamp}</span>
                  </div>

                  <div className="text-xs text-[#dbdee1] whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>

                  {/* Code block if present */}
                  {msg.codeBlock && (
                    <div className="bg-[#1e1f22] p-2.5 rounded-lg border border-[#2b2d31] font-mono text-[11px] text-cyan-300">
                      <div className="text-[9px] text-[#949ba4] mb-1 font-bold uppercase">{msg.codeBlock.language}</div>
                      <pre className="overflow-x-auto">{msg.codeBlock.code}</pre>
                    </div>
                  )}

                  {/* Reactions */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      {msg.reactions.map(rx => (
                        <button
                          key={rx.emoji}
                          onClick={() => handleToggleReaction(msg.id, rx.emoji)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border cursor-pointer transition-colors ${
                            rx.active
                              ? 'bg-[#5865f2]/20 border-[#5865f2] text-white font-bold'
                              : 'bg-[#2b2d31] border-[#35373c] text-[#b5bac1] hover:bg-[#35373c]'
                          }`}
                        >
                          <span>{rx.emoji}</span>
                          <span className="text-[10px] font-mono">{rx.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-[#949ba4]">
              <Hash className="w-10 h-10 mx-auto text-[#404249] mb-2" />
              <div className="font-bold text-white text-sm">Welcome to #{activeChannel.name}!</div>
              <div className="text-xs mt-1">This is the start of the #{activeChannel.name} channel.</div>
            </div>
          )}
        </div>

        {/* Message Input Form */}
        <div className="p-4 pt-1">
          <form onSubmit={handleSendMessage} className="bg-[#383a40] rounded-lg px-3 py-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setInputMessage(prev => prev + ' 🚀 ')}
              className="text-[#b5bac1] hover:text-white cursor-pointer"
              title="Add File or Attachment"
            >
              <Plus className="w-5 h-5 bg-[#4e5058] rounded-full p-0.5 text-[#313338]" />
            </button>

            <input
              type="text"
              placeholder={`Message #${activeChannel.name}`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-transparent text-xs text-[#dbdee1] placeholder-[#80848e] focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="text-[#5865f2] disabled:opacity-40 hover:text-white cursor-pointer p-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 4. Right Members List */}
      {showMemberList && (
        <div className="w-60 bg-[#2b2d31] border-l border-[#1f2023] p-3 space-y-4 shrink-0 select-none overflow-y-auto hidden lg:block">
          <div>
            <div className="text-[10px] font-bold text-[#949ba4] uppercase font-mono px-2 mb-1.5">
              Core Engineers — 2
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#35373c] cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-white text-xs">
                  DF
                </div>
                <div>
                  <div className="font-bold text-cyan-400 text-xs">DevForge Engineer</div>
                  <div className="text-[10px] text-[#949ba4]">Kernel 6.12 &amp; Mold</div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#35373c] cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white text-xs">
                  SM
                </div>
                <div>
                  <div className="font-bold text-purple-400 text-xs">ShaderMaster</div>
                  <div className="text-[10px] text-[#949ba4]">Vulkan Pipeline Lead</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-[#949ba4] uppercase font-mono px-2 mb-1.5">
              Online Members — 3
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#35373c] cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                  VR
                </div>
                <div>
                  <div className="font-bold text-emerald-300 text-xs">VulkanRacer</div>
                  <div className="text-[10px] text-[#949ba4]">Testing DualSense evdev</div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#35373c] cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                  LF
                </div>
                <div>
                  <div className="font-bold text-indigo-300 text-xs">Linus_Fan99</div>
                  <div className="text-[10px] text-[#949ba4]">Building with Mold</div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#35373c] cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                  DF
                </div>
                <div>
                  <div className="font-bold text-cyan-300 text-xs">devforge (You)</div>
                  <div className="text-[10px] text-[#23a55a]">Online</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
