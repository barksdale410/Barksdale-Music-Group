import React, { useState } from 'react';
import { Sliders, Radio, Check, RefreshCw, X, Zap, Cpu } from 'lucide-react';

interface MidiMapping {
  parameter: string;
  ccNumber: number;
  channel: number;
  assignedDevice: string;
}

export const MidiMapperModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [selectedController, setSelectedController] = useState<string>('Roli Seaboard Block');
  const [isLearning, setIsLearning] = useState<boolean>(false);
  const [learningParam, setLearningParam] = useState<string | null>(null);

  const [mappings, setMappings] = useState<MidiMapping[]>([
    { parameter: 'Master Output Volume', ccNumber: 7, channel: 1, assignedDevice: 'Roli Seaboard Block' },
    { parameter: 'Track 1 Filter Cutoff', ccNumber: 74, channel: 1, assignedDevice: 'Roli Seaboard Block' },
    { parameter: 'Reverb Wet/Dry Mix', ccNumber: 91, channel: 1, assignedDevice: 'Akai MPK Mini' },
    { parameter: '808 Pitch Bend', ccNumber: 1, channel: 1, assignedDevice: 'Roli Seaboard Block' },
    { parameter: 'Tempo BPM Speed', ccNumber: 11, channel: 1, assignedDevice: 'Arturia KeyStep Pro' }
  ]);

  if (!isOpen) return null;

  const handleMidiLearn = (param: string) => {
    setIsLearning(true);
    setLearningParam(param);
    setTimeout(() => {
      const randomCC = Math.floor(Math.random() * 120) + 1;
      setMappings(prev =>
        prev.map(m => (m.parameter === param ? { ...m, ccNumber: randomCC } : m))
      );
      setIsLearning(false);
      setLearningParam(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#12131a] border border-amber-500/40 rounded-2xl w-full max-w-2xl p-3.5 sm:p-6 space-y-3 sm:space-y-5 shadow-2xl text-white relative max-h-[90vh] overflow-y-auto">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg bg-black/40 border border-gray-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase text-white">
              HARDWARE MIDI CC CONTROLLER MAPPER
            </h3>
            <p className="text-xs text-gray-400">
              Map external MIDI hardware knobs, sliders, and MPE pitch expressions to DAW parameters.
            </p>
          </div>
        </div>

        {/* CONTROLLER PRESET SELECTOR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/50 p-3 rounded-xl border border-gray-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-gray-300">ACTIVE MIDI HARDWARE:</span>
          </div>

          <select
            value={selectedController}
            onChange={e => setSelectedController(e.target.value)}
            className="bg-black border border-gray-800 text-amber-300 text-xs font-mono font-bold px-3 py-1.5 rounded-lg outline-none focus:border-amber-500"
          >
            <option value="Roli Seaboard Block">Roli Seaboard Block (MPE 5D Touch)</option>
            <option value="Akai MPK Mini">Akai MPK Mini MK3</option>
            <option value="Arturia KeyStep Pro">Arturia KeyStep Pro 37</option>
            <option value="Novation Launchkey">Novation Launchkey 49</option>
            <option value="Native Instruments Komplete">NI Komplete Kontrol S88</option>
          </select>
        </div>

        {/* MAPPING TABLE */}
        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
          {mappings.map((map, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl bg-[#171822] border border-gray-800 text-xs font-mono"
            >
              <div>
                <div className="font-bold text-white">{map.parameter}</div>
                <div className="text-[10px] text-gray-400">{map.assignedDevice}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                  CC #{map.ccNumber} (CH {map.channel})
                </span>

                <button
                  onClick={() => handleMidiLearn(map.parameter)}
                  disabled={isLearning && learningParam === map.parameter}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold font-mono border transition-all ${
                    isLearning && learningParam === map.parameter
                      ? 'bg-amber-500 text-black border-amber-400 animate-pulse'
                      : 'bg-black/50 text-gray-300 border-gray-800 hover:border-amber-500'
                  }`}
                >
                  {isLearning && learningParam === map.parameter ? 'TURN KNOB NOW...' : 'MIDI LEARN'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-all shadow-md"
          >
            SAVE & CLOSE MIDI MAPPINGS
          </button>
        </div>
      </div>
    </div>
  );
};
