import React, { useState } from 'react';
import { Users, X, Link, Copy, Check, MessageSquare, Send, Sparkles, Wifi, Shield, Radio, Volume2 } from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  role: string;
  color: string;
  online: boolean;
  activeTrack: string;
}

interface AudioComment {
  id: string;
  author: string;
  timestamp: string;
  timecode: string;
  text: string;
}

export const ProjectCollaborationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [roomCode, setRoomCode] = useState('LYRIA-STUDIO-70S-9841');
  const [copied, setCopied] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [timecode, setTimecode] = useState('00:01:24');

  const [collaborators] = useState<Collaborator[]>([
    { id: '1', name: 'Darnell B.', role: 'Host / Producer', color: 'bg-amber-500', online: true, activeTrack: 'Master Mix' },
    { id: '2', name: 'Elena R.', role: 'Arranger & Synthesists', color: 'bg-cyan-500', online: true, activeTrack: 'Synth Lead Stem' },
    { id: '3', name: 'Marcus K.', role: 'Mixing & Mastering Eng', color: 'bg-purple-500', online: true, activeTrack: 'Effect Rack DSP' },
    { id: '4', name: 'Sarah L.', role: 'Executive Film Director', color: 'bg-emerald-500', online: false, activeTrack: 'Cosmo Video Timeline' }
  ]);

  const [comments, setComments] = useState<AudioComment[]>([
    { id: 'c1', author: 'Elena R.', timestamp: '10:42 AM', timecode: '00:00:18', text: 'Boost the 1970s tube saturation on the bass line right before the chorus drop.' },
    { id: 'c2', author: 'Marcus K.', timestamp: '11:15 AM', timecode: '00:01:05', text: 'Master peak limited to -0.3 dB. Spotify loudness looks perfectly balanced at -14 LUFS.' }
  ]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`https://ais-dev-ecwf7ffzxmlde2xepftiui-426854461331.us-west1.run.app/join/${roomCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        author: 'Darnell B. (You)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timecode,
        text: newComment
      }
    ]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#12131c] border border-amber-500/40 rounded-2xl w-full max-w-3xl p-3.5 sm:p-6 space-y-3 sm:space-y-5 shadow-2xl text-white relative max-h-[90vh] flex flex-col">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg bg-black/40 border border-gray-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Users className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              REAL-TIME STUDIO COLLABORATION DESK
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                <Wifi className="w-3 h-3 animate-pulse" /> WEBSOCKET LIVE SYNC
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Co-produce, mix, and comment on session audio stems with remote artists and sound engineers.
            </p>
          </div>
        </div>

        {/* INVITE & LINK BAR */}
        <div className="bg-black/50 border border-gray-800 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-gray-300">
            <Radio className="w-4 h-4 text-amber-400" />
            <span>Active Room Session:</span>
            <span className="text-amber-300 font-bold bg-black px-2 py-1 rounded border border-gray-800">{roomCode}</span>
          </div>

          <button
            onClick={handleCopyCode}
            className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
          >
            {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
            {copied ? 'LINK COPIED TO CLIPBOARD' : 'COPY SESSION INVITE LINK'}
          </button>
        </div>

        {/* GRID LAYOUT: ACTIVE MEMBERS & TIMED COMMENTS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 overflow-hidden">
          {/* MEMBERS SIDEBAR */}
          <div className="md:col-span-5 bg-black/40 border border-gray-850 p-4 rounded-xl flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" /> ONLINE PRODUCERS ({collaborators.filter(c => c.online).length})
            </h4>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {collaborators.map(c => (
                <div key={c.id} className="p-2.5 rounded-xl bg-black/60 border border-gray-900 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full ${c.color} text-black font-bold flex items-center justify-center text-xs shadow-md`}>
                        {c.name[0]}
                      </div>
                      <div
                        className={`w-2.5 h-2.5 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-black ${
                          c.online ? 'bg-emerald-500' : 'bg-gray-600'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {c.name}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">{c.role}</div>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono text-amber-400 bg-amber-950/40 border border-amber-900 px-2 py-0.5 rounded">
                    {c.activeTrack}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TIMELINE AUDIO COMMENTS */}
          <div className="md:col-span-7 bg-black/40 border border-gray-850 p-4 rounded-xl flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" /> TIMED AUDIO REVIEWS & NOTES
            </h4>

            {/* COMMENTS STREAM */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar max-h-[220px]">
              {comments.map(cm => (
                <div key={cm.id} className="p-3 bg-black/60 border border-gray-900 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between items-center font-mono text-[10px]">
                    <span className="text-amber-300 font-bold">{cm.author}</span>
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                        @{cm.timecode}
                      </span>
                      <span className="text-gray-500">{cm.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-xs">{cm.text}</p>
                </div>
              ))}
            </div>

            {/* ADD COMMENT FORM */}
            <form onSubmit={handlePostComment} className="pt-2 border-t border-gray-850 flex items-center gap-2">
              <input
                type="text"
                value={timecode}
                onChange={e => setTimecode(e.target.value)}
                placeholder="00:01:24"
                className="w-20 bg-black border border-gray-800 rounded-xl p-2 text-xs font-mono text-amber-300 outline-none text-center"
              />
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add timestamped note or mixing review..."
                className="flex-1 bg-black border border-gray-800 rounded-xl p-2 text-xs text-white placeholder-gray-500 outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="p-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
