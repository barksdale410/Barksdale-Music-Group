import React, { useState, useEffect } from 'react';
import { useMidiStore } from '../store/midiStore';
import { 
  User, 
  Shield, 
  Star, 
  Award, 
  Settings, 
  ToggleLeft, 
  ToggleRight,
  Sliders, 
  Trash2, 
  Database, 
  Terminal, 
  Zap, 
  Activity, 
  AlertCircle, 
  ShieldCheck, 
  RotateCcw, 
  Plus, 
  RefreshCw, 
  Eye, 
  EyeOff 
} from 'lucide-react';

interface ProfileTabProps {
  currentDaw: string;
  onDawChange: (daw: string) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ currentDaw, onDawChange }) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTier, setActiveTier] = useState<'Free' | 'Pro' | 'Studio'>('Free');

  // Zustand Store integration
  const {
    mappings,
    midiDevices,
    midiStatus,
    lastMidiEvent,
    isLearning,
    learningType,
    isLoading,
    dbStatus,
    mongoLogs,
    initializeMidi,
    addMapping,
    deleteMapping,
    resetMappings,
    setLearning
  } = useMidiStore();

  const userId = "darnellbarksdale2@gmail.com";

  // Form states for manual mapping
  const [formSourceType, setFormSourceType] = useState<'cc' | 'note'>('cc');
  const [formSourceNumber, setFormSourceNumber] = useState<number>(1);
  const [formTargetType, setFormTargetType] = useState<'daw_param' | 'pad_trigger' | 'transport_control'>('daw_param');
  const [formTargetKey, setFormTargetKey] = useState<string>('mixLevels.keys');
  const [formTargetName, setFormTargetName] = useState<string>('Keys Volume Slider');
  const [showMongoDashboard, setShowMongoDashboard] = useState<boolean>(false);

  useEffect(() => {
    initializeMidi();
  }, [initializeMidi]);

  // Synchronize target names based on type
  useEffect(() => {
    if (formTargetType === 'daw_param') {
      const names: Record<string, string> = {
        'mixLevels.keys': 'Keys Volume Slider',
        'mixLevels.kick': 'Kick Volume Slider',
        'mixLevels.snare': 'Snare Volume Slider',
        'mixLevels.hat': 'Hi-Hat Volume Slider',
        'mixLevels.subBass': 'Sub Bass Volume Slider',
        'bpm': 'DAW Tempo (BPM)',
        'timeStretchFactor': 'Elastic Stretch Speed',
        'cc1_dynamics': 'Orchestral Dynamics (CC#1)',
        'cc11_expression': 'Orchestral Expression (CC#11)',
      };
      const defaultKey = formTargetKey.startsWith('mixLevels.') || ['bpm', 'timeStretchFactor', 'cc1_dynamics', 'cc11_expression'].includes(formTargetKey) ? formTargetKey : 'mixLevels.keys';
      setFormTargetKey(defaultKey);
      setFormTargetName(names[defaultKey] || 'Keys Volume Slider');
    } else if (formTargetType === 'pad_trigger') {
      const matches = formTargetKey.match(/pad\.(\d+)/);
      const idx = matches ? parseInt(matches[1]) : 0;
      setFormTargetKey(`pad.${idx}`);
      setFormTargetName(`MPC Drum Pad ${idx + 1}`);
    } else if (formTargetType === 'transport_control') {
      setFormTargetKey('transport.play');
      setFormTargetName('Play/Pause Toggle Transport');
    }
  }, [formTargetType]);

  const handleTargetKeyChange = (val: string) => {
    setFormTargetKey(val);
    if (formTargetType === 'daw_param') {
      const names: Record<string, string> = {
        'mixLevels.kick': 'Kick Volume Slider',
        'mixLevels.snare': 'Snare Volume Slider',
        'mixLevels.hat': 'Hi-Hat Volume Slider',
        'mixLevels.keys': 'Keys Volume Slider',
        'mixLevels.subBass': 'Sub Bass Volume Slider',
        'bpm': 'DAW Tempo (BPM)',
        'timeStretchFactor': 'Elastic Stretch Speed',
        'cc1_dynamics': 'Orchestral Dynamics (CC#1)',
        'cc11_expression': 'Orchestral Expression (CC#11)',
      };
      setFormTargetName(names[val] || 'Volume Fader');
    } else if (formTargetType === 'pad_trigger') {
      const padIdx = parseInt(val.split('.')[1]) || 0;
      setFormTargetName(`MPC Drum Pad ${padIdx + 1}`);
    } else {
      setFormTargetName('Play/Pause Toggle Transport');
    }
  };

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMapping({
      sourceType: formSourceType,
      sourceNumber: formSourceNumber,
      targetType: formTargetType,
      targetKey: formTargetKey,
      targetName: formTargetName
    });
  };

  const badges = [
    { name: "Drum Master", desc: "Completed Level 99 Hi-Hat precision rhythm test", icon: "🥁" },
    { name: "Mix Genius", desc: "Identified low-end mud in 15-Minute Daily Drill", icon: "🎛️" },
    { name: "Ear Legend", desc: "Achieved 10 correct answers in row on daily ear quiz", icon: "👂" }
  ];

  const daws = ["GarageBand iOS", "FL Studio Mobile", "FL Studio", "Logic Pro", "Ableton Live", "BandLab"];

  return (
    <div className="p-4 space-y-6" id="profile-tab-view">
      
      {/* 1. Header Card */}
      <div className="bmg-card flex gap-4 items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ca9a5a] to-[#e65c1a] flex items-center justify-center border border-[#333333] shrink-0 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-black text-white">Conductor_Keys</h3>
            <span className="bmg-badge bmg-badge-accent uppercase text-[8px] font-bold">Pro Creator</span>
          </div>
          <span className="text-[10px] text-[#666666] font-mono block mt-0.5">Rating: 4.95 ★ (32 completed jams)</span>
          <p className="text-xs text-[#999999] italic mt-1 leading-normal">"Every song is a universe. Studio session architect."</p>
        </div>
      </div>

      {/* 2. Global DAW Configuration */}
      <div className="bmg-card">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#999999] mb-3 flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-[#ca9a5a]" /> Primary DAW Workstation Mapping
        </h3>
        <p className="text-[11px] text-[#888888] mb-3">
          Select your active DAW. This dynamically maps stock instrument names in the Studio DAW tab to match your real workstation presets!
        </p>

        <div className="grid grid-cols-2 gap-2" id="daw-selector-grid">
          {daws.map(daw => (
            <button
              key={daw}
              onClick={() => onDawChange(daw)}
              className={`p-2.5 rounded-lg border text-left text-xs font-bold transition-all truncate ${
                currentDaw === daw 
                  ? "border-[#ca9a5a] bg-[#ca9a5a]/5 text-[#ca9a5a]" 
                  : "border-[#222222] bg-[#161616] text-[#999999] hover:bg-[#1a1a1a]"
              }`}
            >
              {daw}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MIDI CONTROLLER COUPLING WORKSTATION */}
      <div className="bmg-card border border-[#2a2a32] bg-[#141416]" id="midi-profile-manager-station">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222222] pb-4 mb-4">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4.5 h-4.5 text-[#ca9a5a]" /> MidiMappingManager Station
            </h3>
            <p className="text-[11px] text-[#8e8e93] mt-0.5">Configure, learn, and save custom physical MIDI CC & Note maps directly to MongoDB.</p>
          </div>

          <button
            onClick={() => setShowMongoDashboard(!showMongoDashboard)}
            className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all ${
              showMongoDashboard 
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-white"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MongoDB Query Log</span>
            {showMongoDashboard ? <Eye className="w-3 h-3 ml-0.5" /> : <EyeOff className="w-3 h-3 ml-0.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* Hardware status - Left 4 cols */}
          <div className="xl:col-span-4 space-y-4">
            <div className="p-3 rounded-lg bg-[#0c0c0e] border border-[#222222]">
              <span className="text-[9px] text-[#636366] uppercase font-bold tracking-wider block mb-2">Driver Connection</span>
              
              <div className="space-y-2">
                <div className="p-2.5 rounded-md bg-[#111113] border border-[#1d1d21] min-h-[46px] flex flex-col justify-center">
                  {midiStatus === 'unsupported' && (
                    <div className="flex items-center gap-1.5 text-[10px] text-yellow-500 font-mono">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Web MIDI unsupported in this browser frame</span>
                    </div>
                  )}
                  {midiStatus === 'initializing' && (
                    <span className="text-[10px] text-zinc-500 font-mono animate-pulse">Initializing hardware ports...</span>
                  )}
                  {midiStatus === 'denied' && (
                    <div className="flex items-center gap-1.5 text-[10px] text-red-500 font-mono">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>MIDI access request denied by browser</span>
                    </div>
                  )}
                  {midiStatus === 'granted' && midiDevices.length === 0 && (
                    <div className="text-[10px] text-zinc-500 font-mono italic leading-snug">
                      No hardware controller detected. Virtual driver active. (Press computer keys A-K to trigger fallback notes!)
                    </div>
                  )}
                  {midiStatus === 'granted' && midiDevices.length > 0 && (
                    <div className="space-y-1">
                      {midiDevices.map((dev, idx) => (
                        <div key={idx} className="text-[10.5px] text-[#32d74b] font-mono font-bold flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                          <span className="truncate">{dev}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[9px] text-[#636366] uppercase font-bold block mb-1">Live MIDI Stream Signal</span>
                  <div className="bg-zinc-950 p-2.5 text-[10px] font-mono text-[#a1a1a6] border border-zinc-900 rounded-md flex items-start gap-1.5 min-h-[58px]">
                    <Activity className="w-3.5 h-3.5 text-[#ca9a5a] shrink-0 animate-pulse mt-0.5" />
                    <span className="leading-normal break-all">{lastMidiEvent}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active mappings table - Middle 5 cols */}
          <div className="xl:col-span-5 space-y-3">
            <div className="p-3 rounded-lg bg-[#0c0c0e] border border-[#222222] min-h-[220px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-[#1d1d21] pb-2 mb-2.5">
                  <span className="text-[9px] uppercase font-bold text-white tracking-wider flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-[#ca9a5a]" /> Active Mappings Table
                  </span>
                  <span className="text-[8px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">
                    MongoDB: {mappings.length} docs
                  </span>
                </div>

                {isLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-[#ca9a5a] animate-spin" />
                    <span className="text-[10px] font-mono text-zinc-500">Querying cluster...</span>
                  </div>
                ) : mappings.length === 0 ? (
                  <div className="py-10 text-center text-zinc-500 text-[11px] italic">
                    No active mappings in MongoDB collection. Create one using the builder.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                    {mappings.map((mapping) => (
                      <div 
                        key={mapping._id} 
                        className="p-2 rounded bg-[#131316] border border-zinc-800/80 flex items-center justify-between gap-2.5 hover:border-zinc-700 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-mono font-bold ${
                            mapping.sourceType === 'cc' ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/40' : 'bg-purple-950/40 text-purple-400 border border-purple-900/40'
                          }`}>
                            {mapping.sourceType === 'cc' ? 'CC' : 'NT'}
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-white block truncate max-w-[120px] sm:max-w-[180px]">{mapping.targetName}</span>
                            <span className="text-[8px] font-mono text-zinc-500 block">
                              Address: <strong className="text-zinc-400">{mapping.sourceType === 'cc' ? 'CC#' : 'Note#'}{mapping.sourceNumber}</strong> | ID: {mapping._id.slice(-6)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteMapping(mapping._id, mapping.targetName)}
                          className="p-1 rounded hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Delete mapping from MongoDB"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-[9px] border-t border-[#1d1d21] pt-2 mt-2">
                <span className="text-zinc-500 italic">User: {userId.split('@')[0]}</span>
                <button
                  onClick={resetMappings}
                  className="text-zinc-500 hover:text-white flex items-center gap-0.5 transition-colors font-mono uppercase text-[8.5px] hover:underline"
                >
                  <RotateCcw className="w-3 h-3" /> Drop Collection
                </button>
              </div>
            </div>
          </div>

          {/* Form builder - Right 3 cols */}
          <div className="xl:col-span-3">
            <div className="p-3 rounded-lg bg-[#0c0c0e] border border-[#222222] h-full flex flex-col justify-between">
              <h4 className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-2.5 flex items-center gap-1 border-b border-[#1d1d21] pb-1.5">
                <Plus className="w-3.5 h-3.5 text-[#ca9a5a]" /> Binding Builder
              </h4>

              <form onSubmit={handleManualSave} className="space-y-3">
                {/* Type switch */}
                <div>
                  <span className="text-[8.5px] text-zinc-500 uppercase font-bold block mb-1">Source Trigger Type</span>
                  <div className="grid grid-cols-2 gap-1 bg-zinc-950 p-0.5 rounded border border-zinc-900">
                    <button
                      type="button"
                      onClick={() => {
                        setFormSourceType('cc');
                        if (formSourceNumber === 36 || formSourceNumber === 38) setFormSourceNumber(1);
                      }}
                      className={`py-0.5 rounded text-[8.5px] uppercase font-bold text-center transition-all ${
                        formSourceType === 'cc' ? "bg-[#ca9a5a] text-black" : "text-zinc-500"
                      }`}
                    >
                      Knob/Fader (CC)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormSourceType('note');
                        if (formSourceNumber === 1) setFormSourceNumber(36);
                      }}
                      className={`py-0.5 rounded text-[8.5px] uppercase font-bold text-center transition-all ${
                        formSourceType === 'note' ? "bg-[#ca9a5a] text-black" : "text-zinc-500"
                      }`}
                    >
                      Pad/Key (Note)
                    </button>
                  </div>
                </div>

                {/* Trigger Address / Learn */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[8.5px] text-zinc-500 uppercase font-bold block">Trigger Address</span>
                    <button
                      type="button"
                      onClick={() => {
                        // Toggle Learn for the selected target action in Zustand store!
                        setLearning(
                          !isLearning, 
                          formSourceType, 
                          formTargetType, 
                          formTargetKey, 
                          formTargetName
                        );
                      }}
                      className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold flex items-center gap-0.5 transition-all ${
                        isLearning
                          ? "bg-green-500 text-black animate-pulse font-black"
                          : "bg-zinc-800 text-white hover:bg-zinc-700"
                      }`}
                      title="Press hardware pad or turn knob to auto-detect trigger"
                    >
                      <Zap className="w-2.5 h-2.5" />
                      <span>{isLearning ? "Listening..." : "Learn"}</span>
                    </button>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="127"
                    value={formSourceNumber}
                    onChange={(e) => setFormSourceNumber(parseInt(e.target.value) || 0)}
                    className="w-full bg-zinc-950 text-[11px] font-mono border border-zinc-900 p-1.5 rounded text-white focus:outline-none focus:border-[#ca9a5a]"
                  />
                </div>

                {/* Target Type */}
                <div>
                  <span className="text-[8.5px] text-zinc-500 uppercase font-bold block mb-1">Target Action Category</span>
                  <select
                    value={formTargetType}
                    onChange={(e) => setFormTargetType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-900 p-1.5 rounded text-[11px] text-white outline-none"
                  >
                    <option value="daw_param">DAW Parameter Slider</option>
                    <option value="pad_trigger">MPC Drum Pad sound</option>
                    <option value="transport_control">Transport Control</option>
                  </select>
                </div>

                {/* Target Destination dropdown */}
                <div>
                  <span className="text-[8.5px] text-zinc-500 uppercase font-bold block mb-1">Target Action Destination</span>
                  
                  {formTargetType === 'daw_param' && (
                    <select
                      value={formTargetKey}
                      onChange={(e) => handleTargetKeyChange(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 p-1.5 rounded text-[11px] text-white outline-none"
                    >
                      <option value="mixLevels.keys">Keys (Rhodes) Volume</option>
                      <option value="mixLevels.kick">Kick (808) Volume</option>
                      <option value="mixLevels.snare">Snare Volume</option>
                      <option value="mixLevels.hat">Hi-Hat Volume</option>
                      <option value="mixLevels.subBass">Sub Bass Volume</option>
                      <option value="bpm">DAW Tempo (BPM)</option>
                      <option value="timeStretchFactor">Elastic Stretch Speed</option>
                      <option value="cc1_dynamics">BBC Dynamics CC#1</option>
                      <option value="cc11_expression">BBC Expression CC#11</option>
                    </select>
                  )}

                  {formTargetType === 'pad_trigger' && (
                    <select
                      value={formTargetKey}
                      onChange={(e) => handleTargetKeyChange(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 p-1.5 rounded text-[11px] text-white outline-none"
                    >
                      {Array.from({ length: 8 }).map((_, idx) => (
                        <option key={idx} value={`pad.${idx}`}>MPC Drum Pad {idx + 1}</option>
                      ))}
                    </select>
                  )}

                  {formTargetType === 'transport_control' && (
                    <select
                      value={formTargetKey}
                      onChange={(e) => handleTargetKeyChange(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 p-1.5 rounded text-[11px] text-white outline-none"
                      disabled
                    >
                      <option value="transport.play">Play/Pause Sequencer</option>
                    </select>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bmg-button py-2 text-[10.5px] font-bold uppercase flex items-center justify-center gap-1.5 shadow-[0_2px_4px_rgba(202,154,90,0.15)]"
                >
                  <Database className="w-3 h-3" />
                  <span>Save Map</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* MongoDB Sync Console */}
        {showMongoDashboard && (
          <div className="border-t border-green-500/20 bg-[#070709] p-3 rounded-lg mt-4 font-mono text-[9.5px] space-y-2 relative overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
            <div className="absolute top-0 right-0 p-2 flex gap-2 text-[8px]">
              <span className="flex items-center gap-1 text-green-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                ACTIVE CLUSTER CONNECTION
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-green-400">
              <Terminal className="w-3.5 h-3.5" />
              <span className="font-bold uppercase text-[10px]">MongoDB Query inspector</span>
            </div>

            <p className="text-[#a1a1a6] text-[9px] leading-tight">
              Live queries transacting on <code className="text-green-300">midi_mappings</code> collection. Configured fields are indexed by <code className="text-green-300">{"{ userId: 1, sourceType: 1 }"}</code> to support rapid controller lookups.
            </p>

            <div className="bg-black/45 rounded border border-zinc-900 p-2 h-44 overflow-y-auto space-y-2.5">
              {mongoLogs.map((log, idx) => (
                <div key={idx} className="border-b border-zinc-900/50 pb-2 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center text-zinc-500 text-[8.5px]">
                    <span className="text-green-500 font-bold">{log.operation}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                    <div className="bg-zinc-950 p-1 rounded border border-zinc-900">
                      <span className="text-[7.5px] font-bold text-zinc-600 block">Query Criteria</span>
                      <pre className="text-cyan-300 overflow-x-auto whitespace-pre-wrap">{log.query}</pre>
                    </div>
                    <div className="bg-zinc-950 p-1 rounded border border-zinc-900">
                      <span className="text-[7.5px] font-bold text-zinc-600 block">Cluster Response</span>
                      <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap">{log.response}</pre>
                    </div>
                  </div>
                </div>
              ))}
              {mongoLogs.length === 0 && (
                <span className="text-zinc-600 italic block">No active transactions in this session. Move a mapped fader, press a button, or click "Save Map" to initiate transactions.</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Session Availability Toggle */}
      <div className="bmg-card flex justify-between items-center">
        <div>
          <h3 className="text-xs font-bold uppercase text-white">Session Availability status</h3>
          <p className="text-[10px] text-[#666666] mt-0.5">Allow other producers to invite you into Live Collaborative rooms.</p>
        </div>
        <button
          onClick={() => setIsAvailable(!isAvailable)}
          className="text-[#ca9a5a]"
          aria-label={isAvailable ? "Set unavailable" : "Set available"}
        >
          {isAvailable ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-gray-600" />}
        </button>
      </div>

      {/* 5. Badges earned */}
      <div className="bmg-card">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#999999] mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#ca9a5a]" /> Badges Portfolio ({badges.length})
        </h3>
        <div className="space-y-2">
          {badges.map(b => (
            <div key={b.name} className="bg-[#141414] border border-[#222222] p-2.5 rounded-lg flex items-center gap-3">
              <span className="text-xl shrink-0">{b.icon}</span>
              <div>
                <h4 className="text-xs font-bold text-white">{b.name}</h4>
                <p className="text-[10px] text-[#888888] leading-tight mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Subscriptions upgrade tiers */}
      <div className="bmg-card">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#999999] mb-3">BMG Pro Upgrade Tiers</h3>
        
        <div className="grid grid-cols-3 gap-1.5 mb-4">
          {[
            { id: 'Free', label: 'Free', price: '$0/mo' },
            { id: 'Pro', label: 'Pro', price: '$9.99/mo' },
            { id: 'Studio', label: 'Studio', price: '$29.99/mo' }
          ].map(tier => (
            <button
              key={tier.id}
              onClick={() => setActiveTier(tier.id as any)}
              className={`p-2 rounded-lg border text-center transition-all ${
                activeTier === tier.id 
                  ? "border-[#ca9a5a] bg-[#ca9a5a]/5" 
                  : "border-[#222222] bg-[#161616]"
              }`}
            >
              <span className="block text-[10px] font-bold text-white uppercase">{tier.label}</span>
              <span className="text-[9px] font-mono text-[#888888] block mt-0.5">{tier.price}</span>
            </button>
          ))}
        </div>

        <div className="bg-[#0c0c0c] p-3 rounded-lg border border-[#222222] text-[10px] text-[#999999] space-y-1">
          {activeTier === 'Free' && "✓ 5 monthly high-quality MIDI stems, standard Circle of Fifths guides."}
          {activeTier === 'Pro' && "✓ Unlimited AI MIDI stem exports, unlocked 15-Minute Daily Drill ear test, live rooms."}
          {activeTier === 'Studio' && "✓ Full role-based collaboration, master WebRTC vocal rooms, zero-fee Micro Gigs."}
        </div>
      </div>
    </div>
  );
};
