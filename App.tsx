import React, { useState, useEffect } from 'react';
import { Film, Music, Cpu, Brain, Award, Zap, Sparkles, Folder, Radio, Download, CloudCheck, CheckCircle2, HelpCircle, Sun, Moon, Keyboard, Users, Undo, Redo, Disc, Sliders, Activity, Scissors, Camera } from 'lucide-react';
import { barksdaleSynth } from './src/utils/audioUtils';

// Modular High-Fidelity Components
import { StudioTab } from './src/components/StudioTab';
import { RoliInteractiveLab } from './src/components/RoliInteractiveLab';
import { VideoStudioTab } from './src/components/VideoStudioTab';
import { BakshiInnovationHub } from './src/components/BakshiInnovationHub';
import { GenreThemeSelector } from './src/components/GenreThemeSelector';
import { ProjectBrowserModal, SavedProject } from './src/components/ProjectBrowserModal';
import { MidiMapperModal } from './src/components/MidiMapperModal';
import { ExportModal } from './src/components/ExportModal';
import { ProjectCollaborationModal } from './src/components/ProjectCollaborationModal';
import { ShortcutsGuideModal } from './src/components/ShortcutsGuideModal';
import { SampleBrowserModal } from './src/components/SampleBrowserModal';
import { VisualEqMeter } from './src/components/VisualEqMeter';
import { ChordProgressionExporter } from './src/components/ChordProgressionExporter';
import { AudioWaveformView } from './src/components/AudioWaveformView';
import { StudioHotkeyMapModal } from './src/components/StudioHotkeyMapModal';
import { BarksdaleWelcomeTour } from './src/components/BarksdaleWelcomeTour';
import { ToastContainer } from './src/components/ToastContainer';
import { GoogleEarthScout } from './src/components/GoogleEarthScout';

// Newly Injected Architectural Engines & Components
import { AiRadio } from './src/components/AiRadio';
import { StemSplitter } from './src/components/StemSplitter';
import { DirectorStudio } from './src/components/DirectorStudio';
import { SoundtrackSuite } from './src/components/SoundtrackSuite';
import { ProducerRoster } from './src/components/ProducerRoster';
import { toast } from './src/lib/toast';

type TabType = 'daw' | 'producers' | 'stems' | 'directors' | 'cinema' | 'soundtrack' | 'roli' | 'scout' | 'innovation';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('daw');
  const [opMode, setOpMode] = useState<'ai' | 'expert'>(() => {
    return (localStorage.getItem('barksdale_op_mode') as 'ai' | 'expert') || 'ai';
  });

  // Dark Mode / High-Contrast Onyx Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('barksdale_dark_mode') !== 'false';
  });

  // Modal States
  const [isProjectBrowserOpen, setIsProjectBrowserOpen] = useState<boolean>(false);
  const [isMidiMapperOpen, setIsMidiMapperOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isCollabOpen, setIsCollabOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isHotkeyMapOpen, setIsHotkeyMapOpen] = useState<boolean>(false);
  const [isWelcomeTourOpen, setIsWelcomeTourOpen] = useState<boolean>(() => {
    return !localStorage.getItem('barksdale_tour_completed');
  });
  const [isSampleBrowserOpen, setIsSampleBrowserOpen] = useState<boolean>(false);
  const [autoSaveTime, setAutoSaveTime] = useState<string>('Just now');

  // Undo / Redo History Counter
  const [historyIndex, setHistoryIndex] = useState<number>(3);
  const [historyTotal, setHistoryTotal] = useState<number>(5);

  // Auto-save interval simulator & local storage backup
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setAutoSaveTime(timeStr);

      // Auto Backup State to LocalStorage
      const backupState = {
        timestamp: now.toISOString(),
        activeTab,
        opMode
      };
      localStorage.setItem('barksdale_auto_backup', JSON.stringify(backupState));
      toast.show(`AUTO-BACKUP SUCCESSFUL [${timeStr}]`, 'success', 2000);
    }, 30000);
    return () => clearInterval(interval);
  }, [activeTab, opMode]);

  // Stop sequencer on tab switches only if leaving the production workspace tabs
  useEffect(() => {
    if (activeTab !== 'daw' && activeTab !== 'cinema') {
      barksdaleSynth.stopBeatSequencer();
    }
  }, [activeTab]);

  const toggleOpMode = (mode: 'ai' | 'expert') => {
    setOpMode(mode);
    localStorage.setItem('barksdale_op_mode', mode);
    window.dispatchEvent(new CustomEvent('barksdale_op_mode_change', { detail: { mode } }));
  };

  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem('barksdale_dark_mode', String(nextMode));
    toast.show(nextMode ? 'HIGH-CONTRAST DARK ONYX THEME ACTIVE' : 'MATTE CHARCOAL STUDIO THEME ACTIVE', 'info');
  };

  const handleLoadProject = (proj: SavedProject) => {
    toast.show(`LOADED PROJECT: "${proj.title}"`, 'success');
  };

  const handleHotkeyTriggerAction = (actionId: string) => {
    if (actionId === 'toggle_play') {
      barksdaleSynth.toggleBeatSequencer(95, () => {});
    } else if (actionId === 'open_chords' || actionId === 'open_eq') {
      setActiveTab('daw');
    } else if (actionId === 'open_samples') {
      setIsSampleBrowserOpen(true);
    }
  };

  return (
    <div
      className={`w-full max-w-7xl mx-auto px-2 sm:px-4 py-1.5 sm:py-4 min-h-screen min-h-dvh flex flex-col justify-between overflow-x-hidden transition-colors duration-300 ${
        isDarkMode ? 'bg-[#060608] text-white' : 'bg-[#10121a] text-gray-100'
      }`}
      id="comix-app-root"
    >
      {/* GLOBAL TOAST NOTIFICATIONS */}
      <ToastContainer />

      {/* WELCOME TOUR MODAL */}
      <BarksdaleWelcomeTour
        isOpen={isWelcomeTourOpen}
        onClose={() => {
          setIsWelcomeTourOpen(false);
          localStorage.setItem('barksdale_tour_completed', 'true');
        }}
        onNavigateTab={(tabId) => {
          if (['daw', 'roli', 'cinema', 'scout', 'innovation'].includes(tabId)) {
            setActiveTab(tabId as TabType);
          }
        }}
      />

      {/* STUDIO HOTKEY MAP MODAL */}
      <StudioHotkeyMapModal
        isOpen={isHotkeyMapOpen}
        onClose={() => setIsHotkeyMapOpen(false)}
        onTriggerAction={handleHotkeyTriggerAction}
      />

      {/* PREMIUM AUDIO-VISUAL WORKSTATION HEADER */}
      <header className="studio-panel bg-[#121215] p-2 sm:p-3 relative overflow-hidden mb-2 sm:mb-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2 sm:gap-3 shadow-2xl border border-zinc-800/80 rounded-xl min-w-0 max-w-full">
        {/* Subtle glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none" />

        <div className="relative z-10 space-y-0.5 shrink-0 max-w-full">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <h1 className="text-xs sm:text-base md:text-xl font-black text-amber-500 uppercase tracking-tight font-sans flex items-center gap-1.5 truncate">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
              <span>AIGENIO AUDIO & VIDEO SUITE</span>
            </h1>

            {/* REAL-TIME AUTO-SAVE BACKUP BADGE */}
            <span
              onClick={() => toast.show(`LOCAL AUTO-BACKUP ACTIVE: ${autoSaveTime}`, 'info')}
              className="cursor-pointer text-[8px] sm:text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 sm:px-2 py-0.5 rounded-full font-bold flex items-center gap-1 hover:bg-emerald-500/20 transition-all shrink-0"
              title="Click to check backup status"
            >
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
              AUTO-SAVED {autoSaveTime}
            </span>
          </div>

          <div className="flex flex-col space-y-0.5">
            <span className="text-[9px] sm:text-[11px] font-medium text-zinc-400 tracking-wide font-mono truncate">
              Ultra-High-Performance Audio & Video Suite
            </span>
          </div>
        </div>

        {/* CONTROLS: ORGANIZED IN VISUALLY DISTINCT HARDWARE GROUPS */}
        <div className="flex items-center gap-1.5 sm:gap-2 relative z-10 w-full lg:w-auto overflow-x-auto scrollbar-none py-0.5 min-w-0 max-w-full">
          {/* GROUP 1: QUICK UTILITIES */}
          <div className="flex items-center gap-1 bg-black/60 p-1 border border-zinc-800/80 rounded-lg shrink-0">
            <button
              onClick={() => setIsWelcomeTourOpen(true)}
              className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-semibold transition-all shadow-sm"
              title="Open Interactive Welcome Tour"
            >
              <HelpCircle className="w-3 h-3" />
              <span className="hidden xs:inline">TOUR</span>
            </button>

            <button
              onClick={() => setIsHotkeyMapOpen(true)}
              className="flex items-center gap-1 bg-[#18181b] hover:bg-[#27272a] border border-zinc-800 hover:border-amber-500/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-semibold text-zinc-200 transition-all shadow-sm"
              title="Studio Hotkey Map"
            >
              <Keyboard className="w-3 h-3 text-amber-400" />
              <span className="hidden xs:inline">KEYS</span>
            </button>

            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1 bg-[#18181b] hover:bg-[#27272a] border border-zinc-800 hover:border-amber-500/50 p-1 rounded text-[10px] sm:text-[11px] font-semibold text-amber-400 transition-all shadow-sm"
              title={isDarkMode ? 'Switch to High-Contrast Theme' : 'Switch to Onyx Dark Theme'}
            >
              {isDarkMode ? <Moon className="w-3 h-3 text-amber-400" /> : <Sun className="w-3 h-3 text-amber-400" />}
            </button>

            <div className="flex items-center bg-black/60 p-0.5 border border-zinc-800 rounded">
              <button
                onClick={() => {
                  if (historyIndex > 0) {
                    setHistoryIndex(prev => prev - 1);
                    toast.show('UNDO ACTION EXECUTED', 'info');
                  }
                }}
                disabled={historyIndex <= 0}
                className={`p-1 rounded transition-all ${
                  historyIndex > 0 ? 'text-amber-400 hover:text-white' : 'text-zinc-600 cursor-not-allowed'
                }`}
                title="Undo Action (Ctrl+Z)"
              >
                <Undo className="w-3 h-3" />
              </button>
              <span className="text-[8px] font-mono text-zinc-500 px-0.5">{historyIndex}/{historyTotal}</span>
              <button
                onClick={() => {
                  if (historyIndex < historyTotal) {
                    setHistoryIndex(prev => prev + 1);
                    toast.show('REDO ACTION EXECUTED', 'info');
                  }
                }}
                disabled={historyIndex >= historyTotal}
                className={`p-1 rounded transition-all ${
                  historyIndex < historyTotal ? 'text-amber-400 hover:text-white' : 'text-zinc-600 cursor-not-allowed'
                }`}
                title="Redo Action (Ctrl+Y)"
              >
                <Redo className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* GROUP 2: WORKSPACE DESKS */}
          <div className="flex items-center gap-1 bg-black/60 p-1 border border-zinc-800/80 rounded-lg shrink-0">
            <button
              onClick={() => setIsSampleBrowserOpen(true)}
              className="flex items-center gap-1 bg-[#18181b] hover:bg-[#27272a] border border-zinc-800 hover:border-amber-500/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-semibold text-zinc-200 transition-all shadow-sm"
              title="Open Multi-Genre Sample Browser"
            >
              <Disc className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">SAMPLES</span>
            </button>

            <button
              onClick={() => setIsCollabOpen(true)}
              className="flex items-center gap-1 bg-[#18181b] hover:bg-[#27272a] border border-zinc-800 hover:border-amber-500/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-semibold text-zinc-200 transition-all shadow-sm"
              title="Live Collaboration Desk"
            >
              <Users className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">COLLAB</span>
            </button>

            <button
              onClick={() => setIsProjectBrowserOpen(true)}
              className="flex items-center gap-1 bg-[#18181b] hover:bg-[#27272a] border border-zinc-800 hover:border-amber-500/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-semibold text-zinc-200 transition-all shadow-sm"
              title="Open Project Browser"
            >
              <Folder className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">PROJECTS</span>
            </button>

            <button
              onClick={() => setIsMidiMapperOpen(true)}
              className="flex items-center gap-1 bg-[#18181b] hover:bg-[#27272a] border border-zinc-800 hover:border-amber-500/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-semibold text-zinc-200 transition-all shadow-sm"
              title="MIDI CC Controller Mapper"
            >
              <Radio className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">MIDI CC</span>
            </button>

            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-black px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-black transition-all shadow-md"
              title="Export Master Stems & Video"
            >
              <Download className="w-3 h-3" />
              <span>EXPORT</span>
            </button>
          </div>

          {/* GROUP 3: SYSTEM MODE & XP */}
          <div className="flex items-center gap-1 bg-black/60 p-1 border border-zinc-800/80 rounded-lg shrink-0">
            <GenreThemeSelector compact={true} />

            <div className="flex items-center bg-black/60 p-0.5 border border-zinc-800 rounded-lg">
              <button
                onClick={() => toggleOpMode('ai')}
                className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase transition-all ${
                  opMode === 'ai'
                    ? 'bg-amber-500 text-black font-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>AI</span>
              </button>
              <button
                onClick={() => toggleOpMode('expert')}
                className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase transition-all ${
                  opMode === 'expert'
                    ? 'bg-amber-500 text-black font-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sliders className="w-2.5 h-2.5" />
                <span>EXPERT</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* FLOATING AI RADIO PLAYER */}
      <AiRadio />

      {/* CORE MODULAR SYSTEM MOUNTS */}
      <main className="flex-1 flex-grow pb-28 sm:pb-24 space-y-4 sm:space-y-6 min-w-0 max-w-full overflow-x-hidden relative z-10">
        {activeTab === 'daw' && (
          <div className="space-y-4 sm:space-y-6 min-w-0 max-w-full">
            <StudioTab />
            {/* INJECTED HIGH-FIDELITY AUDIO DSP TOOLS */}
            <VisualEqMeter />
            <ChordProgressionExporter />
            <AudioWaveformView />
          </div>
        )}
        {activeTab === 'producers' && <ProducerRoster />}
        {activeTab === 'stems' && <StemSplitter />}
        {activeTab === 'directors' && <DirectorStudio />}
        {activeTab === 'cinema' && <VideoStudioTab />}
        {activeTab === 'soundtrack' && <SoundtrackSuite />}
        {activeTab === 'roli' && <RoliInteractiveLab />}
        {activeTab === 'scout' && <GoogleEarthScout />}
        {activeTab === 'innovation' && <BakshiInnovationHub />}
      </main>

      {/* MODAL MOUNTS */}
      <ProjectBrowserModal
        isOpen={isProjectBrowserOpen}
        onClose={() => setIsProjectBrowserOpen(false)}
        onLoadProject={handleLoadProject}
      />

      <MidiMapperModal
        isOpen={isMidiMapperOpen}
        onClose={() => setIsMidiMapperOpen(false)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <ProjectCollaborationModal
        isOpen={isCollabOpen}
        onClose={() => setIsCollabOpen(false)}
      />

      <ShortcutsGuideModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <SampleBrowserModal
        isOpen={isSampleBrowserOpen}
        onClose={() => setIsSampleBrowserOpen(false)}
      />

      {/* SLEEK PROFESSIONAL FIXED ANCHORED BOTTOM TAB BAR FOR MOBILE & WEB */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#121215]/98 backdrop-blur-xl border-t border-zinc-800/80 px-2 py-1.5 sm:px-4 sm:py-2 flex justify-start sm:justify-center items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
        {[
          { id: 'daw', label: 'DAW Studio', icon: Cpu },
          { id: 'stems', label: 'Demucs Stems', icon: Scissors },
          { id: 'roli', label: 'Synth Lab', icon: Music },
          { id: 'cinema', label: 'NLE Video', icon: Film },
          { id: 'directors', label: 'Director Suite', icon: Camera },
          { id: 'innovation', label: 'Neural AI', icon: Brain },
          { id: 'scout', label: '3D Scout', icon: Activity },
          { id: 'soundtrack', label: 'Mastering EQ', icon: Sliders },
          { id: 'producers', label: 'Producers', icon: Award }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabType);
              }}
              className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-semibold tracking-tight transition-all border shrink-0 ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'bg-black/50 text-zinc-400 border-zinc-800/60 hover:border-zinc-700 hover:text-white'
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2px] text-amber-400' : 'stroke-[1.5px]'}`} />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </footer>
    </div>
  );
};

export default App;
