import React, { useState } from 'react';
import { Sliders, Volume2, Power, Sparkles, RefreshCw, Zap, Disc, Waves, Activity } from 'lucide-react';

interface EffectModule {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  wet: number;
  params: { [key: string]: number };
}

export const AudioEffectRack: React.FC = () => {
  const [activePreset, setActivePreset] = useState<string>('vintage_70s');

  const [effects, setEffects] = useState<EffectModule[]>([
    {
      id: 'eq',
      name: '5-Band Parametric Vintage EQ',
      category: 'Tone & Equalization',
      enabled: true,
      wet: 100,
      params: { SubBass: 3, LowMid: -1, Mid: 2, HighMid: 4, Air: 5 }
    },
    {
      id: 'comp',
      name: 'VCA Optical Studio Compressor',
      category: 'Dynamic Control',
      enabled: true,
      wet: 85,
      params: { Threshold: -18, Ratio: 4, Attack: 25, Release: 150, MakeupGain: 3.5 }
    },
    {
      id: 'saturator',
      name: 'Analog Tube Saturation & Tape Drive',
      category: 'Harmonics & Warmth',
      enabled: true,
      wet: 60,
      params: { Drive: 45, TapeWarmth: 70, Biasing: 12, SaturationCurve: 2 }
    },
    {
      id: 'delay',
      name: 'BBD Stereo Tape Delay',
      category: 'Time & Space',
      enabled: false,
      wet: 40,
      params: { DelayTime: 375, Feedback: 48, HighCut: 2400, WowFlutter: 18 }
    },
    {
      id: 'reverb',
      name: 'Chamber Algorithmic Reverb',
      category: 'Acoustics',
      enabled: true,
      wet: 35,
      params: { DecayTime: 2.8, PreDelay: 20, Dampening: 55, Diffusion: 80 }
    },
    {
      id: 'limiter',
      name: 'Precision Master Peak Limiter',
      category: 'Mastering',
      enabled: true,
      wet: 100,
      params: { Ceiling: -0.3, Threshold: -3.5, Release: 80, Lookahead: 5 }
    }
  ]);

  const toggleEffect = (id: string) => {
    setEffects(prev => prev.map(fx => fx.id === id ? { ...fx, enabled: !fx.enabled } : fx));
  };

  const updateWet = (id: string, val: number) => {
    setEffects(prev => prev.map(fx => fx.id === id ? { ...fx, wet: val } : fx));
  };

  const updateParam = (id: string, paramKey: string, val: number) => {
    setEffects(prev => prev.map(fx => {
      if (fx.id === id) {
        return { ...fx, params: { ...fx.params, [paramKey]: val } };
      }
      return fx;
    }));
  };

  const presets: { [key: string]: string } = {
    vintage_70s: '1970s Warm Analog Tape & Tube Console',
    modern_pop: 'Crisp Modern Vocal & Punchy Drum Mix',
    cinematic_space: 'Wide Orchestral Ambient Reverb & Tape',
    lofi_vinyl: 'Subtle Crackle, High Cut & Tape Wow/Flutter',
    clean_master: 'Pristine Dynamic Limiting & Subtle Air'
  };

  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    if (presetKey === 'vintage_70s') {
      setEffects(prev => prev.map(fx => {
        if (fx.id === 'saturator') return { ...fx, enabled: true, wet: 75, params: { Drive: 60, TapeWarmth: 85, Biasing: 15, SaturationCurve: 3 } };
        if (fx.id === 'eq') return { ...fx, enabled: true, params: { SubBass: 4, LowMid: 1, Mid: -2, HighMid: 3, Air: 2 } };
        return fx;
      }));
    } else if (presetKey === 'cinematic_space') {
      setEffects(prev => prev.map(fx => {
        if (fx.id === 'reverb') return { ...fx, enabled: true, wet: 65, params: { DecayTime: 4.5, PreDelay: 45, Dampening: 30, Diffusion: 95 } };
        if (fx.id === 'delay') return { ...fx, enabled: true, wet: 50, params: { DelayTime: 500, Feedback: 60, HighCut: 1800, WowFlutter: 10 } };
        return fx;
      }));
    } else if (presetKey === 'lofi_vinyl') {
      setEffects(prev => prev.map(fx => {
        if (fx.id === 'saturator') return { ...fx, enabled: true, wet: 90, params: { Drive: 80, TapeWarmth: 95, Biasing: 30, SaturationCurve: 4 } };
        if (fx.id === 'eq') return { ...fx, enabled: true, params: { SubBass: 0, LowMid: 4, Mid: 1, HighMid: -5, Air: -8 } };
        return fx;
      }));
    }
  };

  return (
    <div className="bg-[#0e0f15] border border-amber-500/30 rounded-2xl p-5 space-y-5 text-white shadow-2xl">
      {/* RACK HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-800 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              STUDIO ANALOG AUDIO EFFECT RACK
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                REAL-TIME WEBAUDIO DSP
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Chain 6 professional analog-modeled DSP effect modules for mastering, mix coloring, and vintage warmth.
            </p>
          </div>
        </div>

        {/* PRESET SELECTOR */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono text-gray-400 uppercase hidden md:inline">Preset:</span>
          <select
            value={activePreset}
            onChange={e => applyPreset(e.target.value)}
            className="bg-black border border-gray-800 text-xs font-mono text-amber-300 rounded-lg p-2 outline-none focus:border-amber-500 cursor-pointer"
          >
            {Object.entries(presets).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RACK GRID OF MODULES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {effects.map((fx) => (
          <div
            key={fx.id}
            className={`p-4 rounded-xl border transition-all space-y-3 relative overflow-hidden ${
              fx.enabled
                ? 'bg-gradient-to-b from-black/80 to-[#14151f] border-gray-700 shadow-lg'
                : 'bg-black/40 border-gray-850 opacity-60'
            }`}
          >
            {/* TOP BAR OF MODULE */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleEffect(fx.id)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    fx.enabled
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                      : 'bg-gray-850 text-gray-500 border-gray-800 hover:text-white'
                  }`}
                  title={fx.enabled ? 'Bypass Effect' : 'Enable Effect'}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{fx.name}</h4>
                  <span className="text-[9px] font-mono text-gray-500 uppercase">{fx.category}</span>
                </div>
              </div>

              {/* WET/DRY MIX KNOB SIMULATION */}
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-gray-400">MIX:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fx.wet}
                  onChange={e => updateWet(fx.id, Number(e.target.value))}
                  disabled={!fx.enabled}
                  className="w-14 accent-amber-500 cursor-pointer h-1.5 bg-gray-800 rounded-lg"
                />
                <span className="text-[10px] font-mono text-amber-300 w-7 text-right">{fx.wet}%</span>
              </div>
            </div>

            {/* PARAMETERS SLIDERS */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
              {Object.entries(fx.params).map(([paramKey, value]) => (
                <div key={paramKey} className="space-y-1 bg-black/40 p-2 rounded-lg border border-gray-900">
                  <div className="flex justify-between text-[9px] text-gray-400 uppercase">
                    <span className="truncate">{paramKey}</span>
                    <span className="text-amber-300 font-bold">{value}</span>
                  </div>
                  <input
                    type="range"
                    min={paramKey.includes('Time') ? 10 : paramKey.includes('Cut') ? 100 : -20}
                    max={paramKey.includes('Time') ? 1000 : paramKey.includes('Cut') ? 20000 : 100}
                    value={value}
                    onChange={e => updateParam(fx.id, paramKey, Number(e.target.value))}
                    disabled={!fx.enabled}
                    className="w-full accent-amber-500 cursor-pointer h-1 bg-gray-800 rounded"
                  />
                </div>
              ))}
            </div>

            {/* FREQUENCY SPECTRUM MINI GRAPH FOR EQ OR VISUALIZER */}
            {fx.id === 'eq' && (
              <div className="flex items-end gap-1 h-8 bg-black/60 p-1 rounded border border-gray-900 justify-between">
                {[20, 45, 75, 90, 60, 40, 65, 80, 50, 30].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-amber-500/80 rounded-t"
                    style={{ height: `${fx.enabled ? h : 10}%`, transition: 'height 0.2s' }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
