import React, { useState } from 'react';
import { UserCheck, Lock, Sparkles, Shield, Camera, Sliders, RefreshCw, Copy, Check, Eye } from 'lucide-react';

export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  seed: number;
  promptEmbed: string;
  wardrobe: string;
  lightingStyle: string;
  voicePitch: number; // Hz
  avatarUrl: string;
  isLocked: boolean;
}

export const INITIAL_CHARACTERS: CharacterProfile[] = [
  {
    id: 'char_slate',
    name: 'Detective Slate',
    role: 'Lead Protagonist / Brooding Detective',
    seed: 94820194,
    promptEmbed: 'sharp jawline, dark wool trenchcoat, tired eyes, 1970s film grain, anamorphic 35mm',
    wardrobe: 'Dark Charcoal Wool Coat & Silver Tie',
    lightingStyle: 'Chiaroscuro High-Contrast Key Light',
    voicePitch: 110,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isLocked: true
  },
  {
    id: 'char_elena',
    name: 'Elena Rostova',
    role: 'Cryptographer & Double Agent',
    seed: 18273645,
    promptEmbed: 'emerald silk dress, severe bob haircut, piercing amber eyes, neon reflections, sharp focus',
    wardrobe: 'Emerald Silk Dress & Trench',
    lightingStyle: 'Cyan & Magenta Neon Rim Glow',
    voicePitch: 220,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isLocked: true
  },
  {
    id: 'char_jax',
    name: 'Jax Cooper',
    role: 'Underground Synth Producer / Hacker',
    seed: 55493012,
    promptEmbed: 'cybernetic visor, leather jacket, dreadlocks, holographic terminal glow',
    wardrobe: 'Custom Cyber Leather & Headphones',
    lightingStyle: 'Pulsing Blue Terminal Matrix Backlight',
    voicePitch: 145,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    isLocked: false
  }
];

export const CharacterConsistencyEngine: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterProfile[]>(INITIAL_CHARACTERS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newCharName, setNewCharName] = useState<string>('');
  const [newCharRole, setNewCharRole] = useState<string>('');

  const toggleLock = (id: string) => {
    setCharacters(prev =>
      prev.map(c => (c.id === id ? { ...c, isLocked: !c.isLocked } : c))
    );
  };

  const generateNewSeed = (id: string) => {
    const freshSeed = Math.floor(Math.random() * 90000000) + 10000000;
    setCharacters(prev =>
      prev.map(c => (c.id === id ? { ...c, seed: freshSeed } : c))
    );
  };

  const copyPromptEmbed = (id: string, embed: string) => {
    navigator.clipboard.writeText(embed);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddCharacter = () => {
    if (!newCharName.trim()) return;
    const newChar: CharacterProfile = {
      id: `char_${Date.now()}`,
      name: newCharName,
      role: newCharRole || 'Supporting Cast',
      seed: Math.floor(Math.random() * 90000000) + 10000000,
      promptEmbed: `${newCharName.toLowerCase()}, highly detailed cinematic portrait, photorealistic 8k, consistent facial structure`,
      wardrobe: 'Custom Production Outfit',
      lightingStyle: 'Cinematic Studio Softbox',
      voicePitch: 160,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      isLocked: true
    };
    setCharacters([...characters, newChar]);
    setNewCharName('');
    setNewCharRole('');
  };

  return (
    <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5 space-y-5 text-white shadow-2xl">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
            <UserCheck className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wide uppercase text-white">
                CHARACTER CONSISTENCY & SEED IDENTITY ENGINE
              </h3>
              <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/40 px-2 py-0.5 rounded">
                FACE SEED LOCK
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Lock visual face seeds, wardrobe parameters, and prompt embeddings to maintain strict character continuity across video scenes.
            </p>
          </div>
        </div>
      </div>

      {/* CHARACTER CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {characters.map(char => (
          <div
            key={char.id}
            className={`p-4 rounded-xl border transition-all space-y-3 bg-[#161722] ${
              char.isLocked
                ? 'border-purple-500/50 shadow-lg shadow-purple-500/10'
                : 'border-gray-800'
            }`}
          >
            {/* AVATAR HEADER */}
            <div className="flex items-start gap-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-purple-500/40 flex-shrink-0">
                <img src={char.avatarUrl} alt={char.name} className="w-full h-full object-cover" />
                {char.isLocked && (
                  <div className="absolute top-1 right-1 bg-purple-600 p-0.5 rounded-full text-white shadow">
                    <Lock className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-black text-white">{char.name}</h4>
                  <button
                    onClick={() => toggleLock(char.id)}
                    className={`p-1 rounded text-xs font-mono font-bold transition-all ${
                      char.isLocked
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {char.isLocked ? 'LOCKED' : 'UNLOCKED'}
                  </button>
                </div>
                <p className="text-[10px] text-amber-400 font-mono">{char.role}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-mono text-gray-400">SEED: {char.seed}</span>
                  <button
                    onClick={() => generateNewSeed(char.id)}
                    className="p-0.5 text-gray-400 hover:text-white"
                    title="Generate New Identity Seed"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* WARDROBE & LIGHTING METADATA */}
            <div className="space-y-1.5 text-[10px] font-mono bg-black/50 p-2.5 rounded-lg border border-gray-850">
              <div className="text-gray-300">
                <span className="text-gray-500">Wardrobe: </span>
                <span>{char.wardrobe}</span>
              </div>
              <div className="text-gray-300">
                <span className="text-gray-500">Lighting: </span>
                <span>{char.lightingStyle}</span>
              </div>
              <div className="text-gray-300">
                <span className="text-gray-500">Voice Formant: </span>
                <span className="text-purple-400">{char.voicePitch} Hz Pitch</span>
              </div>
            </div>

            {/* PROMPT EMBEDDING COPY BUTTON */}
            <button
              onClick={() => copyPromptEmbed(char.id, char.promptEmbed)}
              className="w-full py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all"
            >
              {copiedId === char.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> COPIED EMBED PROMPT
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> COPY SEED EMBED CODE
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* QUICK ADD CHARACTER BAR */}
      <div className="bg-[#181926] p-3 rounded-xl border border-gray-800 flex flex-col sm:flex-row gap-2 items-center">
        <input
          type="text"
          placeholder="New Character Name..."
          value={newCharName}
          onChange={e => setNewCharName(e.target.value)}
          className="bg-black/60 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 w-full sm:w-1/3 focus:border-purple-500 outline-none"
        />
        <input
          type="text"
          placeholder="Role / Aesthetic Description..."
          value={newCharRole}
          onChange={e => setNewCharRole(e.target.value)}
          className="bg-black/60 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 w-full sm:flex-1 focus:border-purple-500 outline-none"
        />
        <button
          onClick={handleAddCharacter}
          className="w-full sm:w-auto px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" /> LOCK NEW CHARACTER
        </button>
      </div>
    </div>
  );
};
