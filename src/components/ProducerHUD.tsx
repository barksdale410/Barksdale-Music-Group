import React, { useState } from 'react';
import { Award, Zap, Target, Star, ChevronRight, ChevronDown, CheckCircle, ShieldCheck } from 'lucide-react';

interface ProducerHUDProps {
  xp: number;
  onXpGain?: (amount: number) => void;
}

export const ProducerHUD: React.FC<ProducerHUDProps> = ({ xp, onXpGain }) => {
  const [activeTab, setActiveTab] = useState<'quests' | 'milestones'>('quests');
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);

  // Rank calculation based on XP
  const level = Math.floor(xp / 200) + 1;
  const xpInLevel = xp % 200;
  const levelProgress = Math.min(100, Math.floor((xpInLevel / 200) * 100));

  const ranks = [
    'Audio Engineer',
    'Mixing Specialist',
    'Mastering Producer',
    'Auteur Film Director',
    'Executive Studio Lead'
  ];
  const currentRank = ranks[Math.min(level - 1, ranks.length - 1)];

  const quests = [
    { id: 'q1', title: 'Isolate Vocals & Drums in Demucs', xp: 50, done: true },
    { id: 'q2', title: 'Audition 1-Point Perspective Shot', xp: 75, done: false },
    { id: 'q3', title: 'Tweak Parametric EQ Curve', xp: 40, done: false },
    { id: 'q4', title: 'Export Master Stem Package', xp: 100, done: false }
  ];

  return (
    <div className="producer-hud bg-[#121215] border border-zinc-800/80 p-2 sm:p-4 rounded-xl shadow-xl mb-2 sm:mb-4 text-white font-sans relative overflow-hidden min-w-0 max-w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 sm:gap-4">
        
        {/* TOP / LEFT: RANK & XP PROGRESS BAR */}
        <div className="flex items-center gap-2.5 sm:gap-4 w-full md:w-auto min-w-0">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-inner">
            <Award className="w-4 h-4 sm:w-6 sm:h-6 text-amber-500 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="producer-hud-rank-title text-[11px] sm:text-xs font-black uppercase text-amber-500 tracking-wider truncate">
                LVL {level}: {currentRank}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <span className="producer-hud-xp-badge text-[9px] sm:text-xs font-mono text-gray-400 font-bold whitespace-nowrap">{xp} XP</span>
                <button
                  onClick={() => setIsMobileExpanded(!isMobileExpanded)}
                  className="md:hidden text-amber-400 bg-black/60 p-1 rounded border border-zinc-800 text-[9px] font-bold flex items-center gap-0.5"
                  title="Toggle HUD Details"
                >
                  {isMobileExpanded ? <ChevronDown className="w-3 h-3 rotate-180" /> : <ChevronRight className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-2 bg-black/60 rounded-full border border-gray-800 overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="hidden sm:flex justify-between items-center text-[9px] font-mono text-gray-500 mt-1">
              <span>{xpInLevel} / 200 XP</span>
              <span>Next Rank at {(level) * 200} XP</span>
            </div>
          </div>
        </div>

        {/* RIGHT: QUESTS & MILESTONES MINI PANELS (COLLAPSIBLE ON MOBILE) */}
        <div className={`flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-0.5 md:pb-0 scrollbar-none max-w-full ${isMobileExpanded ? 'flex' : 'hidden md:flex'}`}>
          <div className="producer-hud-card bg-black/50 border border-amber-500/20 rounded-lg p-1.5 sm:p-2.5 flex items-center gap-2 sm:gap-3 shrink-0 max-w-[220px] sm:max-w-none">
            <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="text-left min-w-0">
              <div className="text-[8px] sm:text-[10px] font-bold uppercase text-gray-400">ACTIVE QUEST</div>
              <div className="text-[10px] sm:text-xs font-bold text-white truncate max-w-[110px] sm:max-w-[180px]">
                {quests.find(q => !q.done)?.title || 'Quests Complete!'}
              </div>
            </div>
            <span className="text-[8px] sm:text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1 sm:px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
              +{quests.find(q => !q.done)?.xp || 50} XP
            </span>
          </div>

          <div className="producer-hud-card bg-black/50 border border-amber-500/20 rounded-lg p-1.5 sm:p-2.5 flex items-center gap-2 sm:gap-3 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="text-left min-w-0">
              <div className="text-[8px] sm:text-[10px] font-bold uppercase text-gray-400">AUTEUR STATUS</div>
              <div className="text-[10px] sm:text-xs font-bold text-amber-400 whitespace-nowrap">VERIFIED PRODUCER</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
