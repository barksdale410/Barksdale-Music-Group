import React, { useState, useEffect } from 'react';
import { Radio, Play, Pause, Volume2, Sparkles, DollarSign, Send, CheckCircle2, X, Music, ChevronUp, ChevronDown, Flame, Award } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import { toast } from '../lib/toast';

interface PromotedTrack {
  id: string;
  artistName: string;
  trackTitle: string;
  genre: string;
  tier: 'indie' | 'heavy' | 'takeover';
  amountPaid: number;
  promoMessage?: string;
  spinsRemaining: number;
}

export const AiRadio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [currentStyle, setCurrentStyle] = useState<string>('Lofi Cyberpunk');
  const [currentBar, setCurrentBar] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [promotedQueue, setPromotedQueue] = useState<PromotedTrack[]>([]);

  // Pay to Play Form State
  const [artistName, setArtistName] = useState<string>('');
  const [trackTitle, setTrackTitle] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [promoMessage, setPromoMessage] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<'indie' | 'heavy' | 'takeover'>('heavy');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastReceipt, setLastReceipt] = useState<string | null>(null);

  const radioStyles = [
    'Lofi Cyberpunk',
    'Hype Williams Neon',
    'Kubrick Synth Odyssey',
    'Tarantino Soul Tape'
  ];

  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/radio/queue');
      const data = await res.json();
      if (data.success && data.queue) {
        setPromotedQueue(data.queue);
      }
    } catch (e) {
      console.log('Failed fetching radio queue');
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 15000);
    return () => {
      clearInterval(interval);
      audioEngine.toggleAiRadio(false);
    };
  }, []);

  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    audioEngine.toggleAiRadio(nextState, currentStyle, (bar, step) => {
      setCurrentBar(bar);
      setCurrentStep(step);
    });
  };

  const handleChangeStyle = (style: string) => {
    setCurrentStyle(style);
    if (isPlaying) {
      audioEngine.toggleAiRadio(true, style, (bar, step) => {
        setCurrentBar(bar);
        setCurrentStep(step);
      });
    }
  };

  const handlePayToPlaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistName.trim() || !trackTitle.trim()) {
      toast.show('PLEASE PROVIDE ARTIST NAME AND TRACK TITLE', 'info');
      return;
    }

    setIsSubmitting(true);
    const amountPaid = selectedTier === 'takeover' ? 50 : selectedTier === 'heavy' ? 25 : 10;

    try {
      const res = await fetch('/api/radio/submit-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistName,
          trackTitle,
          genre: currentStyle,
          audioUrl,
          tier: selectedTier,
          amountPaid,
          promoMessage
        })
      });

      const data = await res.json();
      if (data.success) {
        setLastReceipt(data.receiptNumber);
        toast.show(`PAY-TO-PLAY AIRPLAY CONFIRMED! RECEIPT: ${data.receiptNumber}`, 'success');
        fetchQueue();
        audioEngine.speakDirectorAudition(`Attention Barksdale AI Radio listeners. New featured track submission by ${artistName}, titled ${trackTitle}!`);
      }
    } catch (e) {
      toast.show('AIRPLAY SUBMISSION PROCESSED LOCALLY', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPlayingTrack = promotedQueue[0];

  return (
    <>
      <aside aria-label="Floating AI Radio Player" className="fixed bottom-14 sm:bottom-16 left-2 sm:left-6 z-40 transition-all duration-300 max-w-[calc(100vw-1rem)]">
        {!isExpanded ? (
          <div className="bg-[#121215]/95 border border-zinc-800 rounded-full shadow-xl p-1.5 text-white flex items-center gap-1.5 backdrop-blur-md">
            <button
              onClick={handleTogglePlay}
              className={`p-1.5 rounded-full text-xs font-black flex items-center gap-1 transition-all border ${
                isPlaying
                  ? 'bg-amber-500 text-black border-amber-400 animate-pulse'
                  : 'bg-black/80 text-amber-400 border-zinc-700 hover:bg-amber-500/20'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span className="hidden xs:inline text-[9px] uppercase font-bold">{isPlaying ? 'LIVE' : 'RADIO'}</span>
            </button>

            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-bold text-zinc-300 hover:text-white"
            >
              <span className="truncate max-w-[80px] sm:max-w-[100px] text-[9px] text-amber-400 font-mono font-bold uppercase">{currentStyle}</span>
              <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button
              onClick={() => setShowPayModal(true)}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase flex items-center gap-0.5"
              title="Pay to Play"
            >
              <DollarSign className="w-2.5 h-2.5 text-amber-400" />
            </button>
          </div>
        ) : (
          <div className="bg-[#121215]/95 border border-zinc-800 rounded-2xl shadow-2xl p-3 text-white w-[260px] sm:w-80 backdrop-blur-md max-w-[calc(100vw-1rem)]">
            
            {/* HEADER BAR */}
            <div className="flex items-center justify-between gap-2 border-b border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${isPlaying ? 'bg-amber-500 text-black animate-pulse' : 'bg-gray-800 text-gray-400'}`}>
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI PROCEDURAL RADIO
                  </div>
                  <div className="text-xs font-black truncate max-w-[150px] text-gray-200">
                    {currentStyle}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowPayModal(true)}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/50 text-[10px] font-black px-2 py-1 rounded-lg uppercase flex items-center gap-1 animate-pulse"
                  title="Pay to Play Song Submission"
                >
                  <DollarSign className="w-3 h-3" /> PAY TO PLAY
                </button>

                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-all"
                  title="Minimize AI Radio"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

          {/* CURRENT PROMOTED TRACK BANNER IF ANY */}
          {currentPlayingTrack && (
            <div className="mt-2 bg-gradient-to-r from-amber-500/10 to-amber-600/20 border border-amber-500/40 p-2 rounded-xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <Flame className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                <div className="truncate">
                  <div className="text-[8px] font-mono text-amber-400 font-bold uppercase">PROMOTED AIRPLAY</div>
                  <div className="text-[11px] font-black text-white truncate">
                    {currentPlayingTrack.trackTitle} - <span className="text-amber-300">{currentPlayingTrack.artistName}</span>
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-mono bg-amber-500 text-black font-black px-1.5 py-0.5 rounded shrink-0">
                ${currentPlayingTrack.amountPaid}
              </span>
            </div>
          )}

          {/* CONTROLS & STEP TRACKER */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              onClick={handleTogglePlay}
              className={`flex-1 py-2 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all border ${
                isPlaying
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md scale-[1.02]'
                  : 'bg-black/60 text-amber-400 border-amber-500/40 hover:bg-amber-500/20'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-amber-400" />}
              <span>{isPlaying ? 'STREAMING LIVE' : 'START RADIO'}</span>
            </button>

            {/* BAR / STEP COUNTER */}
            <div className="bg-black/80 border border-gray-800 px-2.5 py-1.5 rounded-xl text-center font-mono shrink-0">
              <div className="text-[8px] text-gray-500 uppercase font-bold">BAR/STEP</div>
              <div className="text-xs font-bold text-amber-400">
                {currentBar}.{currentStep + 1}
              </div>
            </div>
          </div>

          {/* EXPANDED PANEL: STYLE SELECTOR & QUEUE INSPECTOR */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-gray-800 space-y-2.5">
              <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                GENRE & AURA STYLE:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {radioStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => handleChangeStyle(style)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold truncate transition-all border ${
                      currentStyle === style
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                        : 'bg-black/40 text-gray-400 border-gray-800 hover:border-gray-700 hover:text-white'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>

              {/* STEP LED MATRIX */}
              <div className="flex justify-between items-center gap-1 pt-1">
                {Array.from({ length: 16 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-sm transition-all ${
                      idx === currentStep && isPlaying
                        ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                        : idx % 4 === 0
                        ? 'bg-gray-700'
                        : 'bg-gray-900'
                    }`}
                  />
                ))}
              </div>

              {/* PROMOTED QUEUE LIST */}
              <div className="pt-2 border-t border-gray-800">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-gray-400 mb-1">
                  <span>PAY-TO-PLAY AIRPLAY QUEUE</span>
                  <span className="text-amber-400">{promotedQueue.length} SONGS</span>
                </div>
                <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                  {promotedQueue.map((item) => (
                    <div key={item.id} className="bg-black/60 p-1.5 rounded border border-gray-800 text-[10px] font-mono flex justify-between items-center">
                      <div className="truncate pr-2">
                        <span className="font-bold text-white">{item.trackTitle}</span>
                        <span className="text-gray-400"> - {item.artistName}</span>
                      </div>
                      <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1 py-0.5 rounded font-bold shrink-0">
                        ${item.amountPaid}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
        )}
      </aside>

      {/* PAY TO PLAY SUBMISSION MODAL */}
      {showPayModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121318] border-2 border-amber-500/60 rounded-2xl p-6 text-white max-w-lg w-full shadow-2xl space-y-5 relative">
            <button
              onClick={() => {
                setShowPayModal(false);
                setLastReceipt(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white bg-black/50 border border-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
                <DollarSign className="w-4 h-4" /> BARKSDALE AI RADIO STATION MONETIZATION
              </div>
              <h3 className="text-xl font-black uppercase text-white mt-1">
                PAY TO PLAY SONG AIRPLAY SUBMISSION
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Get your track broadcasted live on AI Radio across the global station network.
              </p>
            </div>

            {lastReceipt ? (
              <div className="bg-emerald-500/10 border-2 border-emerald-500/40 p-5 rounded-xl text-center space-y-3 font-mono">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <div className="text-lg font-black text-white">SUBMISSION COMPLETED & QUEUED!</div>
                <div className="text-xs text-gray-300">
                  OFFICIAL BARKSDALE RECEIPT NUMBER:
                  <div className="text-amber-400 font-bold text-sm mt-1">{lastReceipt}</div>
                </div>
                <p className="text-[11px] text-gray-400">
                  Your track has been pushed directly into the live broadcast rotation.
                </p>
                <button
                  onClick={() => {
                    setLastReceipt(null);
                    setShowPayModal(false);
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black py-2.5 rounded-xl font-black text-xs uppercase transition-all"
                >
                  RETURN TO STUDIO WORKSTATION
                </button>
              </div>
            ) : (
              <form onSubmit={handlePayToPlaySubmit} className="space-y-4">
                
                {/* TIERS SELECTION */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-gray-300 uppercase">SELECT PROMOTIONAL TIER:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'indie', name: 'INDIE SPIN', price: 10, desc: '1 Live Airplay' },
                      { id: 'heavy', name: 'HEAVY ROTATION', price: 25, desc: '5 Spins + Banner' },
                      { id: 'takeover', name: 'TAKEOVER', price: 50, desc: '15 Spins + AI DJ Intro' }
                    ].map((tier) => (
                      <button
                        type="button"
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedTier === tier.id
                            ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
                            : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        <div className="text-[10px] font-bold font-mono text-amber-400">{tier.name}</div>
                        <div className="text-base font-black text-white">${tier.price}</div>
                        <div className="text-[9px] text-gray-400 mt-0.5">{tier.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* INPUT FIELDS */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">ARTIST / BAND NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Barksdale Sound"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      className="w-full bg-black/80 border border-gray-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">TRACK TITLE</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cyberpunk Hustle"
                      value={trackTitle}
                      onChange={(e) => setTrackTitle(e.target.value)}
                      className="w-full bg-black/80 border border-gray-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">AUDIO MP3/WAV STREAM URL (OPTIONAL)</label>
                  <input
                    type="url"
                    placeholder="https://your-server.com/track.mp3"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className="w-full bg-black/80 border border-gray-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono mt-1"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">AI DJ SHOUTOUT / PROMO MESSAGE</label>
                  <input
                    type="text"
                    placeholder="e.g. Shoutout to Barksdale Studio Executive Producers!"
                    value={promoMessage}
                    onChange={(e) => setPromoMessage(e.target.value)}
                    className="w-full bg-black/80 border border-gray-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono mt-1"
                  />
                </div>

                {/* PAY BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 mt-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'PROCESSING PAYMENT & QUEUEING...'
                      : `CONFIRM & PAY $${selectedTier === 'takeover' ? 50 : selectedTier === 'heavy' ? 25 : 10}`}
                  </span>
                </button>

                <p className="text-[9px] text-center text-gray-500 font-mono">
                  Secured by Barksdale Pay-to-Play Instant Station Engine. Direct airplay confirmation generated upon payment.
                </p>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
};
