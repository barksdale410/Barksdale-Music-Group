import React, { useState } from 'react';
import { Award, Music, Cpu, Disc, Sparkles, Play, CheckCircle2, Sliders, Zap, Volume2, ShieldCheck } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import { toast } from '../lib/toast';

export interface ProducerMaster {
  id: string;
  name: string;
  moniker: string;
  era: string;
  signatureSound: string;
  bpmDefault: number;
  keyDefault: string;
  waveformType: 'sine' | 'square' | 'sawtooth' | 'triangle';
  equipment: string[];
  signatureHits: string[];
  beatFormula: string;
  quote: string;
  badge: string;
  color: string;
}

export const ProducerRoster: React.FC = () => {
  const producers: ProducerMaster[] = [
    {
      id: 'dre',
      name: 'Dr. Dre',
      moniker: 'The Architect of G-Funk & West Coast Hip-Hop',
      era: '1990s - Present',
      signatureSound: 'High-Pitched G-Funk Portamento Sine Whistles, Punchy Live Basslines & Hard Snares',
      bpmDefault: 95,
      keyDefault: 'C Minor',
      waveformType: 'sine',
      equipment: ['MPC 3000', 'Minimoog Model D', 'SSL 4000 Console'],
      signatureHits: ['Nuthin’ but a ’G’ Thang', 'Still D.R.E.', 'In Da Club'],
      beatFormula: 'Heavy 808 Kick on 1 & 3 + Portamento Sine Glide + Real Bass Guitar Double',
      quote: 'If you’re not putting your absolute soul into every snare hit, you’re in the wrong business.',
      badge: '🎧',
      color: '#f59e0b'
    },
    {
      id: 'quincy',
      name: 'Quincy Jones',
      moniker: 'Maestro of Multi-Genre Symphony & Thriller',
      era: '1950s - Present',
      signatureSound: 'Orchestral Brass Horn Stabs, Precision Frequency Separation & Lush Polyphony',
      bpmDefault: 118,
      keyDefault: 'F# Minor',
      waveformType: 'sawtooth',
      equipment: ['Rhodes Mark I', 'Bösendorfer Imperial', 'Neve 8078'],
      signatureHits: ['Thriller', 'Billie Jean', 'Fly Me to the Moon'],
      beatFormula: 'Dynamic Horn Stabs + Funk Bassline Groove + Crystal Clear Polyphonic Balance',
      quote: 'Music is the only thing on earth that can bind people together without fear.',
      badge: '🎺',
      color: '#10b981'
    },
    {
      id: 'dilla',
      name: 'J Dilla',
      moniker: 'Godfather of Neo-Soul Unquantized Swing',
      era: '1990s - 2006',
      signatureSound: 'Off-Grid Unquantized Snare Swing, Dusty Vinyl Chops & Warm Sub Bass',
      bpmDefault: 88,
      keyDefault: 'E♭ Major',
      waveformType: 'sine',
      equipment: ['Akai MPC 3000 (No Quantize)', 'E-mu SP-1200', 'Fender Rhodes'],
      signatureHits: ['Runnin’ (Pharcyde)', 'Donuts', 'Lightworks'],
      beatFormula: 'Turn off Quantization + Offset Snare 15ms late + Vinyl Dust Crackle Layer',
      quote: 'Don’t worry about what the machine says. Feel the pocket in your heartbeat.',
      badge: '🍩',
      color: '#ec4899'
    },
    {
      id: 'metro',
      name: 'Metro Boomin',
      moniker: 'Modern Dark Trap & Cinematic Soundtrack Auteur',
      era: '2010s - Present',
      signatureSound: 'Minor Scale Glockenspiel Bells, Sliding 808 Subs & Orchestral Brass Drops',
      bpmDefault: 140,
      keyDefault: 'C# Minor',
      waveformType: 'square',
      equipment: ['FL Studio', 'Moog Sub 37', 'Custom 808 Sample Bank'],
      signatureHits: ['Bad and Boujee', 'Mask Off', 'Spider-Man Across the Spider-Verse'],
      beatFormula: '140 BPM Fast Hi-Hat Rolls + Minor Scale Bell Arpeggio + Heavy 808 Slide',
      quote: 'If Metro don’t trust you, I’m gon’ shoot you.',
      badge: '🕷️',
      color: '#ef4444'
    },
    {
      id: 'rubin',
      name: 'Rick Rubin',
      moniker: 'The Minimalist Stripped-Back Reducer',
      era: '1980s - Present',
      signatureSound: 'Ultra-Raw Stripped-Back Drums, Heavy Guitar Distortion & Zero Reverb Clutter',
      bpmDefault: 92,
      keyDefault: 'A Minor',
      waveformType: 'square',
      equipment: ['TR-808', 'Neve 1073 Preamp', 'Bare Acoustic Studio Floor'],
      signatureHits: ['Walk This Way', '99 Problems', 'Hurt (Johnny Cash)'],
      beatFormula: 'Strip away every instrument except Kick, Snare & Distorted Riff + Maximum Punch',
      quote: 'My job is not to add things. My job is to strip away everything that isn’t essential.',
      badge: '🧔',
      color: '#3b82f6'
    },
    {
      id: 'timbaland',
      name: 'Timbaland',
      moniker: 'Rhythmic Syncopation & Human Beatbox Pioneer',
      era: '1990s - Present',
      signatureSound: 'Staccato Vocal Mouth Percussion, Syncopated Middle-Eastern Strings & Pitch Bends',
      bpmDefault: 105,
      keyDefault: 'G Minor',
      waveformType: 'sawtooth',
      equipment: ['Ensoniq ASR-10', 'E-mu Virtuoso 2000', 'Pro Tools'],
      signatureHits: ['Cry Me a River', 'Pony', 'Get Ur Freak On'],
      beatFormula: 'Layer Mouth Beatbox clicks + Off-Beat Arabic String Stabs + Dynamic Pitch Envelope',
      quote: 'I make sounds that don’t exist in nature until I press the key.',
      badge: '🥁',
      color: '#8b5cf6'
    },
    {
      id: 'pharrell',
      name: 'Pharrell Williams / The Neptunes',
      moniker: 'Minimalist Funk & 4-Count Intro Kings',
      era: '1990s - Present',
      signatureSound: 'Iconic 4-Count Staccato Intro, Clavinet Synths & Minimalist Organic Claps',
      bpmDefault: 100,
      keyDefault: 'D Minor',
      waveformType: 'sawtooth',
      equipment: ['Korg Triton', 'MicroKorg', 'Logic Pro'],
      signatureHits: ['Happy', 'Rock Your Body', 'Drop It Like It’s Hot'],
      beatFormula: 'Loop 4-beat intro chop + Tight Acoustic Clap + Clavinet Funk Bassline',
      quote: 'Inspiration comes from being open to the frequency of the universe.',
      badge: '🖖',
      color: '#06b6d4'
    },
    {
      id: 'kanye',
      name: 'Kanye West',
      moniker: 'Chipmunk Soul & Stadium Avant-Garde',
      era: '2000s - Present',
      signatureSound: 'Speed-Pitched Vintage Soul Chops, Gospel Choirs & Aggressive Distortion',
      bpmDefault: 86,
      keyDefault: 'B♭ Minor',
      waveformType: 'sine',
      equipment: ['Ensoniq ASR-10', 'MPC 2000XL', 'E-mu SP-1200'],
      signatureHits: ['Through the Wire', 'Stronger', 'Ultralight Beam'],
      beatFormula: 'Pitch Vintage Soul Sample up 5 semitones + Gospel Vocal Stack + Heavy Drums',
      quote: 'We’re not making songs, we’re building sonic monuments.',
      badge: '🐻',
      color: '#f59e0b'
    },
    {
      id: 'mike_dean',
      name: 'Mike Dean',
      moniker: 'Synth God & Stadium Distortion Maestro',
      era: '1990s - Present',
      signatureSound: 'Epic Monophonic Moog Synth Solos, Distorted Electric Guitars & Stadium Reverb',
      bpmDefault: 130,
      keyDefault: 'D Minor',
      waveformType: 'sawtooth',
      equipment: ['Moog One', 'Roland Jupiter-8', 'Eventide H9000'],
      signatureHits: ['Sicko Mode', 'Devil in a New Dress', 'Highest in the Room'],
      beatFormula: 'Glide Moog Sawtooth Lead with 2s Reverb Tail + Distorted Guitar Polyphony',
      quote: 'Turn the synths up until the speakers start breathing fire.',
      badge: '🎹',
      color: '#a855f7'
    },
    {
      id: 'forty',
      name: 'Noah "40" Shebib',
      moniker: 'Architect of Toronto Underwater Ambient R&B',
      era: '2000s - Present',
      signatureSound: 'Low-Pass Filtered Ambient Keyboards, Underwater Atmosphere & Crisp Snare',
      bpmDefault: 75,
      keyDefault: 'G♭ Major',
      waveformType: 'triangle',
      equipment: ['Pro Tools', 'SSL G-Series Bus Compressor', 'Low-Pass Filter Envelopes'],
      signatureHits: ['Marvins Room', 'Hotline Bling', 'God’s Plan'],
      beatFormula: 'Apply 800Hz Low-Pass Filter to Rhodes Keys + Sub Bass + Isolated Sharp Snare',
      quote: 'I take away the top frequencies so the emotion of the artist can sit on top.',
      badge: '🌊',
      color: '#38bdf8'
    }
  ];

  const [selectedProducer, setSelectedProducer] = useState<ProducerMaster>(producers[0]);
  const [isPlayingAudition, setIsPlayingAudition] = useState<boolean>(false);

  const handleSelectProducer = (prod: ProducerMaster) => {
    setSelectedProducer(prod);
    toast.show(`PRODUCER PRESET LOADED: ${prod.name.toUpperCase()}`, 'info');
  };

  const handleAuditionSonicSignature = (prod: ProducerMaster) => {
    toast.show(`AUDITIONING SONIC SIGNATURE FOR ${prod.name.toUpperCase()}...`, 'info');
    setIsPlayingAudition(true);
    
    // Play sound audition via audioEngine
    audioEngine.ensureInitialized();
    audioEngine.toggleAiRadio(true, prod.signatureSound, () => {});

    setTimeout(() => {
      audioEngine.toggleAiRadio(false);
      setIsPlayingAudition(false);
    }, 4000);
  };

  return (
    <div className="bg-[#121318] border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] p-6 text-white space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-400 text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-md border border-amber-500/30 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> LEGENDARY PRODUCERS & SOUND ARCHITECTS
            </span>
            <span className="text-xs font-mono text-gray-400">{producers.length} MASTER PRODUCERS</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1.5 uppercase tracking-wide">
            BARKSDALE PRODUCER ROSTER & SONIC PRESET ENGINE
          </h2>
        </div>

        <button
          onClick={() => handleAuditionSonicSignature(selectedProducer)}
          className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 transition-all shadow-md"
        >
          <Volume2 className={`w-4 h-4 ${isPlayingAudition ? 'animate-bounce' : ''}`} />
          <span>{isPlayingAudition ? 'AUDITIONING PRESET...' : 'AUDITION SONIC SIGNATURE'}</span>
        </button>
      </div>

      {/* PRODUCER CAROUSEL SELECTOR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {producers.map((prod) => {
          const isSelected = selectedProducer.id === prod.id;
          return (
            <button
              key={prod.id}
              onClick={() => handleSelectProducer(prod)}
              className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center ${
                isSelected
                  ? 'bg-amber-500 text-black border-amber-400 shadow-lg scale-105 font-black'
                  : 'bg-[#171821] border-gray-800 hover:border-amber-500/50 text-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{prod.badge}</div>
              <div className="text-xs font-black truncate w-full uppercase">{prod.name}</div>
              <div className={`text-[9px] font-mono mt-0.5 truncate w-full ${isSelected ? 'text-black/80 font-bold' : 'text-amber-400'}`}>
                {prod.bpmDefault} BPM | {prod.keyDefault}
              </div>
            </button>
          );
        })}
      </div>

      {/* DETAILED PRODUCER INSPECTOR & PRESET SPECS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLS: PRODUCER BIOGRAPHY & BEAT FORMULA */}
        <div className="lg:col-span-2 space-y-5 bg-[#171821] border-2 border-black rounded-xl p-5 shadow-[2px_2px_0px_0px_#000]">
          
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedProducer.badge}</span>
              <div>
                <h3 className="text-base font-black text-white uppercase font-mono">{selectedProducer.name}</h3>
                <div className="text-[10px] font-mono text-amber-400 font-bold">{selectedProducer.moniker}</div>
              </div>
            </div>
            <span className="text-xs font-mono text-gray-400 font-bold bg-black/60 px-3 py-1 rounded-lg border border-gray-800">
              ERA: {selectedProducer.era}
            </span>
          </div>

          <blockquote className="text-xs font-mono text-gray-300 italic bg-black/40 p-3 rounded-lg border border-gray-850">
            "{selectedProducer.quote}"
          </blockquote>

          {/* BEAT FORMULA & SONIC SPECIFICATIONS */}
          <div className="space-y-3">
            <div className="bg-black/60 p-3.5 rounded-xl border border-gray-800 space-y-1.5 font-mono">
              <div className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> SIGNATURE BEAT FORMULA & RECIPE
              </div>
              <div className="text-xs text-white font-bold leading-relaxed">{selectedProducer.beatFormula}</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
              <div className="bg-black/40 p-3 rounded-lg border border-gray-850">
                <div className="text-[9px] text-gray-400 uppercase font-bold">DEFAULT TEMPO</div>
                <div className="text-sm font-black text-amber-400 mt-0.5">{selectedProducer.bpmDefault} BPM</div>
              </div>

              <div className="bg-black/40 p-3 rounded-lg border border-gray-850">
                <div className="text-[9px] text-gray-400 uppercase font-bold">KEY SIGNATURE</div>
                <div className="text-sm font-black text-emerald-400 mt-0.5">{selectedProducer.keyDefault}</div>
              </div>

              <div className="bg-black/40 p-3 rounded-lg border border-gray-850">
                <div className="text-[9px] text-gray-400 uppercase font-bold">OSCILLATOR WAVE</div>
                <div className="text-sm font-black text-blue-400 mt-0.5 uppercase">{selectedProducer.waveformType}</div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COL: HARDWARE GEAR & SIGNATURE DISCOGRAPHY */}
        <div className="bg-[#171821] border-2 border-black rounded-xl p-5 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between space-y-4">
          <div className="space-y-4 font-mono">
            
            <div>
              <div className="text-xs font-black uppercase text-amber-400 border-b border-gray-800 pb-2 mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> HARDWARE & GEAR SETUP
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedProducer.equipment.map((eq, idx) => (
                  <span key={idx} className="text-[10px] bg-black/80 text-gray-300 border border-gray-800 px-2.5 py-1 rounded-md font-bold">
                    {eq}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-black uppercase text-amber-400 border-b border-gray-800 pb-2 mb-2 flex items-center gap-1.5">
                <Disc className="w-3.5 h-3.5" /> SIGNATURE DISCOGRAPHY
              </div>
              <ul className="space-y-1.5">
                {selectedProducer.signatureHits.map((hit, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{hit}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <button
            onClick={() => {
              toast.show(`APPLIED ${selectedProducer.name.toUpperCase()} CONFIGURATION TO DAW SESSION!`, 'success');
              handleAuditionSonicSignature(selectedProducer);
            }}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-black text-xs uppercase transition-all shadow-md flex items-center justify-center gap-2 font-mono"
          >
            <Sliders className="w-4 h-4 fill-black" />
            <span>LOAD PRESET INTO DAW SESSION</span>
          </button>
        </div>

      </div>

    </div>
  );
};
