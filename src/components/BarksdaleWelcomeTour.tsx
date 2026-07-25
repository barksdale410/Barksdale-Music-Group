import React, { useState } from 'react';
import { Sparkles, Music, Globe, Video, Sliders, Shield, ArrowRight, ArrowLeft, Check, X, Disc, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WelcomeTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tabId: string) => void;
}

export const BarksdaleWelcomeTour: React.FC<WelcomeTourProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const [step, setStep] = useState<number>(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'WELCOME TO BARKSDALE MUSIC GROUP',
      subtitle: 'Universal Production Studio, Physical AI Hub & Film Scouting Engine',
      badge: 'PRO TOUR 2026',
      icon: <Sparkles className="w-8 h-8 text-amber-400" />,
      content: 'Every creator is a label. Every song is a universe. Every video is a world. Explore our browser-based workstation equipped with real-time audio DSP, multitrack DAW, 3D physical AI, and 3D geospatial scouting.',
      actionTab: 'studio',
      highlight: 'Aigenio DAW & Multitrack Recording Engine'
    },
    {
      title: 'AIGENIO DAW & MULTITRACK ENGINE',
      subtitle: '16-Step MPC Sequencer, 5D ROLI Touch, Audio EQ & Mastering',
      badge: 'AUDIO DSP',
      icon: <Music className="w-8 h-8 text-cyan-400" />,
      content: 'Compose beats with micro-timing swing offset, 12-bit SP-1200 crunch emulation, parametric visual EQ meters, chord progression exporters, and 24-bit WAV stem exports.',
      actionTab: 'studio',
      highlight: '16-Step Drum Pads, Waveform Scrubber & EQ'
    },
    {
      title: 'A-Z MULTI-GENRE SAMPLE ENCYCLOPEDIA',
      subtitle: 'Over 600+ Studio Quality One-Shots, Drum Loops & Stem Packs',
      badge: 'SAMPLE VAULT',
      icon: <Disc className="w-8 h-8 text-emerald-400" />,
      content: 'Browse curated sample packs across 1970s Crime Soul, Underground Hip Hop, Tokyo Cyberpunk Synth, Neo-Soul, Drill, Reggae Riddims, and Cinematic Scores with instant auditioning.',
      actionTab: 'library',
      highlight: 'Full Frequency Spectrum & Stem Extraction'
    },
    {
      title: 'NVIDIA COSMOS 3 PHYSICAL AI SANDBOX',
      subtitle: 'Real-Time Physics Simulation & Predictive World Model',
      badge: 'PHYSICAL AI',
      icon: <Sliders className="w-8 h-8 text-purple-400" />,
      content: 'Simulate Newtonian physical dynamics with gravity vectors (0-20 m/s²), material elasticity, volumetric fog density, and 3D camera flight trajectories directly inside canvas renders.',
      actionTab: 'cosmos',
      highlight: 'Physics Engine & Material Matrix'
    },
    {
      title: 'GOOGLE EARTH 3D FILM SCOUTING ENGINE',
      subtitle: 'Exact Street, Intersection & Film Telemetry Scout',
      badge: 'GEOSPATIAL 3D',
      icon: <Globe className="w-8 h-8 text-amber-400" />,
      content: 'Search any exact street intersection or landmark to scout filming telemetry: sun trajectory, drone airspace regulations, city permit zones, acoustic noise floor, and camera rig clearance.',
      actionTab: 'scout',
      highlight: 'Intersection Search & Film Telemetry'
    },
    {
      title: 'PROJECT AUTO-BACKUP & PRO HOTKEYS',
      subtitle: 'Zero Data Loss Engine & Hit Key Keyboard Triggers',
      badge: 'STUDIO SAFE',
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
      content: 'Your projects auto-save to local persistence every 30 seconds. Use physical hotkeys (Space for Play, R for Record, C for Chords, E for EQ) to control your studio at lighting speed.',
      actionTab: 'studio',
      highlight: 'Auto-Backup Status & Hotkey Map'
    }
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (currentStep.actionTab && onNavigateTab) {
      onNavigateTab(currentStep.actionTab);
    }

    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      // Trigger celebrate confetti on finish
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4">
      <div className="bg-[#0f1018] border border-amber-500/40 rounded-2xl sm:rounded-3xl max-w-xl w-full p-4 sm:p-6 space-y-4 sm:space-y-6 text-white shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-xl bg-gray-900 border border-gray-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP PROGRESS DOTS */}
        <div className="flex items-center justify-between text-xs font-mono border-b border-gray-800 pb-3">
          <span className="text-amber-400 font-bold tracking-wider">{currentStep.badge}</span>
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step ? 'w-6 bg-amber-400' : i < step ? 'w-2 bg-emerald-500' : 'w-2 bg-gray-800'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-400">STEP {step + 1} / {steps.length}</span>
        </div>

        {/* MAIN STEP CONTENT */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
              {currentStep.icon}
            </div>
            <div>
              <h2 className="text-lg font-black text-white">{currentStep.title}</h2>
              <p className="text-xs text-amber-300/80 font-mono mt-0.5">{currentStep.subtitle}</p>
            </div>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed font-sans bg-black/60 p-4 rounded-2xl border border-gray-850">
            {currentStep.content}
          </p>

          <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center gap-2 text-xs font-mono text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Key Highlight: <strong>{currentStep.highlight}</strong></span>
          </div>
        </div>

        {/* FOOTER NAV CONTROLS */}
        <div className="pt-2 border-t border-gray-800 flex items-center justify-between font-mono text-xs">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className={`px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
              step === 0
                ? 'opacity-30 border-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-black/60 border-gray-800 text-gray-300 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> PREVIOUS
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            {step === steps.length - 1 ? (
              <>
                <Check className="w-4 h-4" /> LAUNCH BARKSDALE STUDIO
              </>
            ) : (
              <>
                NEXT STEP <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
