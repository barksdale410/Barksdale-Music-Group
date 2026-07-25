import React, { useState } from 'react';
import { 
  Search, Brain, Cpu, Award, Star, Flame, Code, BookOpen, Layers, DollarSign, 
  Play, CheckCircle, Smile, Skull, Zap, Activity, HelpCircle, GitBranch, 
  Sliders, Film, Music, Check, ArrowRight, Sparkles, MessageSquare 
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { CONFIG } from '../config';
import { InnovationBlueprint, Message } from '../types';
import { ENCYCLOPEDIA_ENTRIES, QUIZZES, EncyclopediaEntry } from '../data/encyclopediaData';

export const BakshiInnovationHub: React.FC = () => {
  // Hub Master Tabs
  const [activeHubTab, setActiveHubTab] = useState<'blueprints' | 'encyclopedia' | 'graph' | 'quizzes'>('encyclopedia');

  // Original Blueprints State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [persona, setPersona] = useState<'beatnik' | 'pigeon' | 'vinyl'>('beatnik');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'producer', text: "Dig it, cat! I'm the Aigenio Beatnik. Lay some cosmic audio queries on me, and I'll spin you some heavy gold wisdom.", persona: 'beatnik' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Encyclopedia States
  const [selectedEncyclopediaId, setSelectedEncyclopediaId] = useState<string>('quincy-jones');
  const [encyclopediaSearch, setEncyclopediaSearch] = useState('');
  const [encyclopediaRoleFilter, setEncyclopediaRoleFilter] = useState<string>('all');

  // Quiz States
  const [quizTier, setQuizTier] = useState<'beginner' | 'intermediate' | 'professional'>('beginner');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState<string>('');

  // Global XP & Gamification
  const [xp, setXp] = useState(580);
  const [completedTasks, setCompletedTasks] = useState<string[]>(['task-1']);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(['pioneer', 'theory_ace']);

  // 20 Leap Ahead Blueprints data
  const blueprints: InnovationBlueprint[] = [
    {
      id: 'bp-1',
      title: 'Multitaper Spectral Resonator',
      category: 'shader',
      description: 'Calculates high-order discrete prolate spheroidal sequences (DPSS) to perform artifact-free phase alignment.',
      logic: 'Map DFT outputs to logarithmic bin spacing for ear-natural frequency perception.',
      monetization: 'Enterprise VST/AU filter plugin distribution at $199.',
      mathFormula: 'S_xx(f) = 1/K sum_{k=0}^{K-1} |sum_{t=1}^N h_{t,k} x_t e^{-i 2pi f t}|^2'
    },
    {
      id: 'bp-2',
      title: 'MPE Y-Axis Slide Multiplier',
      category: 'ux',
      description: 'Maps the relative vertical glide coordinates on a ROLI touchwave to non-linear lowpass filter sweep coefficients.',
      logic: 'Continuous tracking using pointer coords mapped to bilinear filter coefficients.',
      monetization: 'In-app synthesizer expansion packs ($4.99 each).',
      mathFormula: 'H(z) = (b_0 + b_1 z^{-1} + b_2 z^{-2}) / (1 + a_1 z^{-1} + a_2 z^{-2})'
    },
    {
      id: 'bp-3',
      title: 'WebAudio Ribbon Tube Modulator',
      category: 'developer',
      description: 'Simulates dual-triode vintage pre-amplifier clipping with 4x oversampling to prevent digital aliasing.',
      logic: 'Use Cubic wave-shaping distortion curve mapped with custom BiquadFilterNode pipelines.',
      monetization: 'Developer library license (NPM private registry @ $49/mo).',
      mathFormula: 'f(x) = x - (1/3) * x^3 + alpha * sin(pi * x)'
    },
    {
      id: 'bp-4',
      title: 'Decentralized Audio Royalties',
      category: 'monetization',
      description: 'Smart contracts that distribute streaming revenue to stems composers instantly upon play count verification.',
      logic: 'Immutable digital ledger tracking compositions metadata mapped with cryptographic keys.',
      monetization: '2.5% protocol micro-fee on every stream payout.',
      mathFormula: 'R_composer = P_stream * S_percentage * (1 - micro_fee)'
    },
    {
      id: 'bp-5',
      title: 'Anharmonic Sub-harmonic Exciter',
      category: 'shader',
      description: 'Generates non-integer low-end overtones to beef up kick drums without overloading digital headroom limits.',
      logic: 'Half-wave rectifier with bandpass feedback loops tracking core fundamental transient frequencies.',
      monetization: 'Mastering suite addon modules ($19.99).',
      mathFormula: 'y(t) = x(t) + beta * sin(omega_0 * t / 2) * e^{-gamma t}'
    },
    {
      id: 'bp-6',
      title: 'Binaural 3D Headphone Spacer',
      category: 'ux',
      description: 'Applies Head-Related Transfer Functions (HRTF) to place stems into virtual spherical coordinates.',
      logic: 'Convolve stereo signals with dynamic impulse responses tracking drag-and-drop spatial nodes.',
      monetization: 'Binaural panning expansion pack ($14.99).',
      mathFormula: 'S_L(t) = h_L(theta, phi) * s(t), S_R(t) = h_R(theta, phi) * s(t)'
    },
    {
      id: 'bp-7',
      title: 'Analog Tape Jitter Modulator',
      category: 'developer',
      description: 'Injects low-frequency wow and high-frequency flutter based on vintage tape machine capstan degradation.',
      logic: 'LFO-driven dynamic delay lines with random walk micro-deviations.',
      monetization: 'Included in Free Tier to hook creators into Aigenio subscription model.',
      mathFormula: 'Delay(t) = Delay_0 + A_wow * sin(2pi f_w t) + A_flutter * noise(t)'
    },
    {
      id: 'bp-8',
      title: '66-Word script pacing engine',
      category: 'ux',
      description: 'Enforces maximum script reading time by calculating vocal velocity and screenwriting layout ratios.',
      logic: 'Regex-based word counter linked to cinematic frame ticking sequences.',
      monetization: 'Cinema tier subscription ($25/mo) for screenplay pacing tools.',
      mathFormula: 'T_duration = (W_count / WPM_vocal) + C_actionCount * 2.5'
    },
    {
      id: 'bp-9',
      title: '16mm Film Grain Shader',
      category: 'shader',
      description: 'Generates pseudo-random dynamic silver-halide particles overlaying video blocks in real time.',
      logic: 'WebGL fragment shader mapping high-frequency noise using coordinate-offset sine hashes.',
      monetization: 'Export in ultra-fidelity 4K requires Pro license.',
      mathFormula: 'Grain = fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453)'
    },
    {
      id: 'bp-10',
      title: 'Focal Length Perspective Mapper',
      category: 'ux',
      description: 'Adjusts camera blocking background scale to simulate cinematic lens compression.',
      logic: 'Dynamic scale transformations mapped to slider focal ranges (e.g. 24mm to 135mm).',
      monetization: 'Cinema Director upgrade package ($39 one-time).',
      mathFormula: 'Scale_bg = F_length / 50.0 * (1.0 - z_distance)'
    },
    {
      id: 'bp-11',
      title: 'MIDI Loop Sync Bridge',
      category: 'developer',
      description: 'Exposes clean WebMIDI clocks to lock external hardware drum machines directly to web sequencers.',
      logic: 'Send 24 MIDI clock ticks per quarter note via requestAnimationFrame.',
      monetization: 'Pro MIDI integration tier ($9/mo).',
      mathFormula: 'Tick_interval = 60000 / (BPM * 24)'
    },
    {
      id: 'bp-12',
      title: 'Pigeon-Logic Mix Limiter',
      category: 'developer',
      description: 'A witty brickwall limiter that refuses to clip, outputting crispy Brooklyn-approved grit.',
      logic: 'Lookahead feedback compressor with infinite compression ratios at peak limit.',
      monetization: 'Part of the Aigenio Elite Production Suite.',
      mathFormula: 'Output = sign(x) * (1 - e^{-|x/limit|})'
    },
    {
      id: 'bp-13',
      title: 'Sub-Bass Mono Summation',
      category: 'developer',
      description: 'Sums all audio frequencies below 120Hz to center phase correlation on professional club systems.',
      logic: 'Split signal with Linkwitz-Riley crossover, merge low band, keep high band stereo.',
      monetization: 'Free open source utility contributing to Aigenio ecosystem goodwill.',
      mathFormula: 'Low_Mono = (Low_L + Low_R) / 2'
    },
    {
      id: 'bp-14',
      title: '1930s Technicolor Filter',
      category: 'shader',
      description: 'Divides red, green, and blue color channels into discrete sub-exposures and merges them with analog glow.',
      logic: 'Color matrix convolution mapping primary dyes into classic dye-transfer simulations.',
      monetization: 'Technicolor grading expansion ($9.99).',
      mathFormula: 'R\' = R*0.393 + G*0.769 + B*0.189, G\' = R*0.349 + G*0.686 + B*0.168'
    },
    {
      id: 'bp-15',
      title: 'Bilinear Screen-Door Halftone',
      category: 'shader',
      description: 'Applies vintage comic book ink dots that scale with brightness on the active rendering pipeline.',
      logic: 'Calculate coordinate luminance and multiply with high-frequency sine-wave screens.',
      monetization: 'Classic Comix Export Style addon ($12.99).',
      mathFormula: 'InkDots = step(Luminance, sin(x * frequency) * cos(y * frequency))'
    },
    {
      id: 'bp-16',
      title: 'Pitch-Locked Time Stretcher',
      category: 'developer',
      description: 'Performs Phase Vocoder window overlap-add calculation to scale duration without altering scale pitches.',
      logic: 'FFT phase tracking, re-calculating phase advancement for shifted hop sizes.',
      monetization: 'Elite Producer Suite license ($299).',
      mathFormula: 'Phase_adv = omega_0 * Hop_size + Phase_diff'
    },
    {
      id: 'bp-17',
      title: 'Dorian Jazz Chord Generator',
      category: 'ux',
      description: 'Generates modal jazz chord progressions featuring rich minor 9th and 11th intervals.',
      logic: 'Mathematical scale step intervals transposed dynamically to selected key.',
      monetization: 'Subscription chord libraries ($3/mo).',
      mathFormula: 'Scale_degrees = [0, 2, 3, 5, 7, 9, 10]'
    },
    {
      id: 'bp-18',
      title: 'Dynamic Style Lock Casting',
      category: 'ux',
      description: 'Maintains character consistency across frames by locking seed values in character generation pipelines.',
      logic: 'Consistent seed caching and embedding preservation via session variables.',
      monetization: 'Director Production Pro tier ($49/mo).',
      mathFormula: 'Seed_locked = Hash(Actor_id + Wardrobe_id + Age)'
    },
    {
      id: 'bp-19',
      title: 'Teal & Pink Cyber Grading',
      category: 'shader',
      description: 'Anamorphic color mapping emphasizing deep neon teals and vibrant chromatic magenta highlights.',
      logic: 'Look-up tables (LUTs) compressing midtones to cold teals and warm pinks.',
      monetization: 'Cinematic grading expansion ($9.99).',
      mathFormula: 'Color_mapped = LUT(rgb_input)'
    },
    {
      id: 'bp-20',
      title: 'Vinyl Purist Audio Warmer',
      category: 'developer',
      description: 'Generates microscopic dust pops and light tonearm resonance tracking playback speeds.',
      logic: 'Stochastic impulse generation triggered randomly mapped with physical turntable specs.',
      monetization: 'Audiophile Retro upgrade pack ($19.99).',
      mathFormula: 'Pop_trigger = random() < P_dust ? Impulse() : 0.0'
    }
  ];

  // Original Chat Logic
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userText = inputValue;
    setInputValue('');

    const newMsg: Message = { id: String(Date.now()), sender: 'user', text: userText };
    setMessages(prev => [...prev, newMsg]);
    setIsGenerating(true);

    try {
      let systemInstruction = "";
      if (persona === 'beatnik') {
        systemInstruction = "You are the 'Aigenio Beatnik Producer'. You talk in vintage 1970s Greenwich Village beatnik slang. Use words like 'cat', 'daddy-o', 'dig it', 'groovy', 'heavy', 'vibe', 'session'. Keep responses poetic, highly musical, short, and very witty.";
      } else if (persona === 'pigeon') {
        systemInstruction = "You are the 'Brooklyn Alley Pigeon'. You are a street-smart, fast-talking pigeon from Brooklyn. You love breadcrumbs, hate vinyl records that aren't scratchy, and give witty mixing advice like an old school studio manager. Use Brooklyn phrases like 'Fuhgeddaboudit', 'Ay, I\'m walkin\' here!', 'caw-caw', 'Listen pal'.";
      } else {
        systemInstruction = "You are the 'Vinyl Purist Dinosaur'. You are extremely obsessed with analog warmth and hate modern digital systems, but you are forced to give advice in this digital suite. Talk about 1971 recording tape, tube saturation, shellac records, and how anything digital lacks 'soul'. Be cranky but highly informative.";
      }

      const apiKey = process.env.API_KEY || '';
      let replyText = "";
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: CONFIG.TEXT_MODEL,
          contents: `${systemInstruction}\n\nUser asks: "${userText}"`,
        });
        replyText = response.text || "Dig it, cat, my antennas are fuzzy right now. Hit me again.";
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        if (persona === 'beatnik') {
          const beatnikQuotes = [
            "Heavy, cat, heavy! That soundwave is floating like incense in a smoky club. Dig this: you gotta let the low-end breathe. Let that sub-bass groove, daddy-o!",
            "Whoa, that's a wild frequency! It's like poetry on a canvas, man. Crank the space depth, close your eyes, and just feel the cosmos rotate.",
            "That query is cool as jazz on a rainy Tuesday. Let's patch that oscillator right into your soul, cat. Keep it funky, keep it groovy."
          ];
          replyText = beatnikQuotes[Math.floor(Math.random() * beatnikQuotes.length)];
        } else if (persona === 'pigeon') {
          const pigeonQuotes = [
            "Ay! Fuhgeddaboudit! You call that a mix? Needs more breadcrumbs! Caw-caw! Seriously, back off the high gain, pal, it's making my feathers jitter!",
            "Listen pal, I'm walkin' here! But since you asked nicely, let me tell you: sum that bass to mono! You don't want your sub-bass fluttering around like a rookie sparrow!",
            "Caw! Look at this, classic Brooklyn style: saturate that master track until it sounds like a subway train screeching past Coney Island. Beautiful!"
          ];
          replyText = pigeonQuotes[Math.floor(Math.random() * pigeonQuotes.length)];
        } else {
          const vinylQuotes = [
            "Hmph. In 1971, we didn't have these shiny buttons. We had heavy iron, 2-inch tape, and real sweat. This digital stuff lacks soul! Sum everything to tape and turn up the wow-and-wobble, or why even bother?",
            "Digital headroom? Ha! Real warmth comes from overload, kid! Drive those vacuum tubes until they glow like Christmas lights. That's how we did it on real shellac!",
            "That query lacks tape saturation. Everything sounds too clean nowadays, like a sterile hospital. Go grab some dirt, sum it to a physical tape reel, and enjoy the delicious analogue crackle!"
          ];
          replyText = vinylQuotes[Math.floor(Math.random() * vinylQuotes.length)];
        }
      }

      setMessages(prev => [...prev, {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: replyText,
        persona: persona
      }]);

      setXp(prev => prev + 25);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: "My cosmic transmitters got sum-blocked, cat. Let's re-align the antennas.",
        persona: persona
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Blueprints filter logic
  const filteredBlueprints = blueprints.filter(bp => {
    const matchesSearch = bp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          bp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bp.logic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || bp.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Encyclopedia filter logic
  const filteredEncyclopedia = ENCYCLOPEDIA_ENTRIES.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(encyclopediaSearch.toLowerCase()) ||
                          entry.biography.toLowerCase().includes(encyclopediaSearch.toLowerCase()) ||
                          entry.signatureTechniques.some(t => t.toLowerCase().includes(encyclopediaSearch.toLowerCase())) ||
                          entry.gearUsed.some(g => g.toLowerCase().includes(encyclopediaSearch.toLowerCase()));
    const matchesRole = encyclopediaRoleFilter === 'all' || entry.role === encyclopediaRoleFilter;
    return matchesSearch && matchesRole;
  });

  const activeProfile = ENCYCLOPEDIA_ENTRIES.find(e => e.id === selectedEncyclopediaId) || ENCYCLOPEDIA_ENTRIES[0];

  // Quiz progression logic
  const handleAnswerSelect = (option: string) => {
    if (selectedQuizAnswer !== null) return; // Only 1 select permitted per turn
    setSelectedQuizAnswer(option);
    const questions = QUIZZES[quizTier];
    const currentQ = questions[currentQuestionIndex];
    
    if (option === currentQ.correct) {
      setQuizScore(prev => prev + 1);
      setQuizFeedback("🎯 Excellent! Correct. " + currentQ.explanation);
      setXp(prev => prev + 50);
      if (!unlockedBadges.includes('theory_ace')) {
        setUnlockedBadges(prev => [...prev, 'theory_ace']);
      }
    } else {
      setQuizFeedback("❌ Incorrect. " + currentQ.explanation);
    }
  };

  const handleNextQuizQuestion = () => {
    const questions = QUIZZES[quizTier];
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedQuizAnswer(null);
      setQuizFeedback('');
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = (tier: 'beginner' | 'intermediate' | 'professional') => {
    setQuizTier(tier);
    setCurrentQuestionIndex(0);
    setSelectedQuizAnswer(null);
    setQuizScore(0);
    setQuizCompleted(false);
    setQuizFeedback('');
  };

  return (
    <div className="space-y-6 p-4 min-h-screen">
      {/* HUB HEADER */}
      <div className="comix-panel p-5 bg-[#121217] text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
              <Brain className="w-6 h-6 stroke-[2px] text-amber-500 animate-pulse" />
              AIGENIO CREATIVE ACADEMY & ENCYCLOPEDIA
            </h2>
            <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
              Explore the master algorithms of legendary music producers, composers, cinematic filmmakers, and sound design visionaries. Unlock elite theory badges via Academy Quizzes and inspect spatial relational connection networks.
            </p>
          </div>

          {/* ACADEMY COUNTERS */}
          <div className="flex items-center gap-3 bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5">
            <div className="text-right">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Master Library</span>
              <span className="text-xs font-mono font-black text-amber-500 uppercase">Interactive Encyclopedia</span>
            </div>
          </div>
        </div>

        {/* HUB SECTIONS TAB BUTTONS */}
        <div className="flex flex-wrap gap-2 mt-5 pt-3 border-t border-gray-850">
          <button
            onClick={() => setActiveHubTab('encyclopedia')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 border ${
              activeHubTab === 'encyclopedia'
                ? 'bg-amber-500 text-black border-amber-500 font-black'
                : 'bg-black/40 border-gray-850 text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            📚 Creative Encyclopedia
          </button>
          <button
            onClick={() => setActiveHubTab('graph')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 border ${
              activeHubTab === 'graph'
                ? 'bg-amber-500 text-black border-amber-500 font-black'
                : 'bg-black/40 border-gray-850 text-gray-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            🕸️ Influence Connections
          </button>
          <button
            onClick={() => setActiveHubTab('quizzes')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 border ${
              activeHubTab === 'quizzes'
                ? 'bg-amber-500 text-black border-amber-500 font-black'
                : 'bg-black/40 border-gray-850 text-gray-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            🎓 Academy Quizzes
          </button>
          <button
            onClick={() => setActiveHubTab('blueprints')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 border ${
              activeHubTab === 'blueprints'
                ? 'bg-amber-500 text-black border-amber-500 font-black'
                : 'bg-black/40 border-gray-850 text-gray-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            🛠️ Tech Specs & Chat
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE HUB TAB content */}
      {activeHubTab === 'encyclopedia' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SIDEBAR BROWSER (4-span) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="comix-panel p-4 bg-[#121318] space-y-4">
              <span className="text-[10px] font-mono text-amber-500 uppercase font-bold tracking-widest block">
                Search Encyclopedia
              </span>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Filter name, gear, techniques..."
                  value={encyclopediaSearch}
                  onChange={e => setEncyclopediaSearch(e.target.value)}
                  className="w-full bg-black border border-gray-850 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500 font-semibold"
                />

                <select
                  value={encyclopediaRoleFilter}
                  onChange={e => setEncyclopediaRoleFilter(e.target.value)}
                  className="w-full bg-black border border-gray-850 rounded-lg p-2 text-xs text-gray-400 font-bold outline-none cursor-pointer"
                >
                  <option value="all">All Specialties</option>
                  <option value="producer">Music Producers</option>
                  <option value="composer">Score Composers</option>
                  <option value="songwriter">Songwriters</option>
                  <option value="engineer">Mixing Engineers</option>
                  <option value="director">Film Directors</option>
                </select>
              </div>

              {/* FILTERED LIST */}
              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredEncyclopedia.map(entry => {
                  const isActive = entry.id === selectedEncyclopediaId;
                  return (
                    <button
                      key={entry.id}
                      onClick={() => setSelectedEncyclopediaId(entry.id)}
                      className={`w-full p-2.5 rounded-lg border text-left transition-all block ${
                        isActive
                          ? 'bg-amber-500 text-black border-amber-500 font-black'
                          : 'bg-black/45 border-gray-900 text-gray-400 hover:text-white hover:border-gray-800'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs uppercase font-bold truncate">{entry.name}</span>
                        <span className="text-[8px] font-mono uppercase bg-black/20 px-1 py-0.5 rounded ml-2">
                          {entry.role}
                        </span>
                      </div>
                      <span className="text-[9px] block opacity-70 mt-0.5 font-mono">
                        {entry.yearsActive}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MASTER DETAILS VIEW (8-span) */}
          <div className="lg:col-span-8">
            <div className="comix-panel p-6 bg-[#121318] space-y-6">
              
              {/* Profile Top Row */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-gray-850 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-amber-500 uppercase font-black bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
                      {activeProfile.role}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">Active: {activeProfile.yearsActive}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase mt-1 tracking-tight">{activeProfile.name}</h3>
                  {activeProfile.aliases.length > 0 && (
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">
                      Aliases: {activeProfile.aliases.join(', ')}
                    </p>
                  )}
                </div>

                <div className="bg-black/40 border border-gray-900 p-2 rounded-lg text-right text-[10px] font-mono">
                  <span className="text-gray-500 block">EDUCATION FOCUS</span>
                  <span className="text-amber-500 uppercase font-bold">100% Comprehensive</span>
                </div>
              </div>

              {/* Biography Section */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Biography</h4>
                <p className="text-xs text-gray-300 leading-relaxed font-medium">
                  {activeProfile.biography}
                </p>
              </div>

              {/* Signature Techniques (Cards) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Signature Creative Techniques</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeProfile.signatureTechniques.map((tech, idx) => (
                    <div key={idx} className="bg-black/55 border border-gray-950 p-3.5 rounded-xl flex items-start gap-2.5 hover:border-amber-500/35 transition-all">
                      <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] text-gray-200 font-bold leading-normal block">
                          {tech}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hardware Gear Stack */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Analog Hardware & Tools Stack</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeProfile.gearUsed.map((gear, idx) => (
                    <span key={idx} className="text-[10px] font-mono bg-black text-gray-300 border border-gray-900 rounded-lg px-2.5 py-1 uppercase font-bold">
                      🛠️ {gear}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Connections Map */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-850">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">DIRECT INFLUENCES</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProfile.influences.map((inf, idx) => {
                      const linked = ENCYCLOPEDIA_ENTRIES.find(e => e.name.toLowerCase() === inf.toLowerCase());
                      return (
                        <button
                          key={idx}
                          onClick={() => linked && setSelectedEncyclopediaId(linked.id)}
                          disabled={!linked}
                          className={`text-[10px] font-mono px-2.5 py-1 rounded border uppercase ${
                            linked 
                              ? 'bg-[#181825] hover:bg-[#ca9a5a]/20 text-white border-amber-500/25 cursor-pointer font-bold' 
                              : 'bg-black text-gray-500 border-gray-950 cursor-default'
                          }`}
                        >
                          {inf} {linked && '➜'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">INFLUENCED CREATORS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProfile.influenced.map((inf, idx) => {
                      const linked = ENCYCLOPEDIA_ENTRIES.find(e => e.name.toLowerCase() === inf.toLowerCase());
                      return (
                        <button
                          key={idx}
                          onClick={() => linked && setSelectedEncyclopediaId(linked.id)}
                          disabled={!linked}
                          className={`text-[10px] font-mono px-2.5 py-1 rounded border uppercase ${
                            linked 
                              ? 'bg-[#181825] hover:bg-[#ca9a5a]/20 text-white border-amber-500/25 cursor-pointer font-bold' 
                              : 'bg-black text-gray-500 border-gray-950 cursor-default'
                          }`}
                        >
                          {inf} {linked && '➜'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Key Works Table */}
              <div className="space-y-2 pt-3 border-t border-gray-850">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Key Historical Works</h4>
                <div className="bg-black/60 border border-gray-950 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="bg-black text-gray-500 uppercase text-[9px] border-b border-gray-950">
                        <th className="p-3">Title of Work</th>
                        <th className="p-3">Role</th>
                        <th className="p-3 text-right">Year</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-950 text-gray-300">
                      {activeProfile.keyWorks.map((work, idx) => (
                        <tr key={idx} className="hover:bg-black/30">
                          <td className="p-3 font-bold text-white uppercase">{work.title}</td>
                          <td className="p-3 text-amber-500 font-semibold">{work.roleInWork}</td>
                          <td className="p-3 text-right font-black">{work.year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recommended Education Focus Banner */}
              <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/25 p-4 rounded-xl flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono text-amber-500 uppercase font-black block">
                    MAESTRO STUDY NOTES
                  </span>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed font-semibold">
                    {activeProfile.educationalFocus}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {activeHubTab === 'graph' && (
        <div className="comix-panel p-6 bg-[#121318] space-y-6 min-h-[600px] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase mb-2 flex items-center gap-1.5 tracking-wide">
              <GitBranch className="w-4.5 h-4.5 text-amber-500" />
              SPATIAL RELATIONSHIP & INFLUENCE CONNECTIONS GRAPH
            </h3>
            <p className="text-xs text-gray-400 max-w-3xl leading-relaxed">
              Explore the historical spiderweb of artistic inspiration. Tap any node card to load their full biography and tech blueprints instantly. Notice how Quincy Jones ties to Michael Jackson, Spielberg ties to Hitchcock and Christopher Nolan, or Max Martin ties to Taylor Swift!
            </p>
          </div>

          {/* Active Graph Canvas Simulation */}
          <div className="bg-black/80 border border-gray-950 rounded-xl p-6 relative flex flex-wrap gap-6 items-center justify-center min-h-[380px] overflow-hidden">
            
            {/* Visual connecting grid paths */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10 pointer-events-none">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border border-amber-500 border-dashed" />
              ))}
            </div>

            {/* Render interactive nodes */}
            {ENCYCLOPEDIA_ENTRIES.map((node, idx) => {
              const colors = {
                producer: 'border-amber-500 bg-amber-500/10 text-amber-100',
                composer: 'border-cyan-500 bg-cyan-500/10 text-cyan-100',
                songwriter: 'border-pink-500 bg-pink-500/10 text-pink-100',
                engineer: 'border-emerald-500 bg-emerald-500/10 text-emerald-100',
                director: 'border-purple-500 bg-purple-500/10 text-purple-100'
              };

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    setSelectedEncyclopediaId(node.id);
                    setActiveHubTab('encyclopedia');
                  }}
                  className={`border rounded-xl p-3.5 w-[185px] cursor-pointer hover:scale-105 hover:border-white transition-all z-10 shadow-lg ${colors[node.role]}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-mono uppercase font-extrabold tracking-wider">{node.role}</span>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </div>
                  <h4 className="text-xs font-black uppercase truncate">{node.name}</h4>
                  <p className="text-[9px] font-mono opacity-80 mt-1 truncate">
                    Influenced: {node.influenced[0]}
                  </p>
                  
                  {/* Jump button */}
                  <span className="text-[8.5px] font-mono text-amber-500 mt-2 block font-extrabold uppercase">
                    Inspect Profile ➜
                  </span>
                </div>
              );
            })}

            {/* Dynamic Connection lines annotation */}
            <div className="absolute bottom-3 left-3 bg-black/75 px-3 py-1.5 rounded-lg border border-gray-900 text-[9.5px] font-mono uppercase text-gray-500">
              ⚡ CLICK ANY CARD TO TELEPORT TO DEEP-DIVE ENCYCLOPEDIA STUDY SHEETS
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/60 p-4 rounded-xl text-center">
            <div>
              <span className="text-xs font-black text-amber-500 block uppercase font-mono">1950s - 1970s</span>
              <span className="text-[9px] text-gray-500 uppercase">Golden Big-Band & Early Synthesizers</span>
            </div>
            <div>
              <span className="text-xs font-black text-amber-500 block uppercase font-mono">1980s - 1990s</span>
              <span className="text-[9px] text-gray-500 uppercase">Stereophonic Boom & Swung Sampler Grooves</span>
            </div>
            <div>
              <span className="text-xs font-black text-amber-500 block uppercase font-mono">2000s - 2010s</span>
              <span className="text-[9px] text-gray-500 uppercase">Melodic Pop Math & Hybrid Film Orchestration</span>
            </div>
            <div>
              <span className="text-xs font-black text-amber-500 block uppercase font-mono">2020s - Present</span>
              <span className="text-[9px] text-gray-500 uppercase">Immersive Dolby Atmos & Spatial Media pipelines</span>
            </div>
          </div>
        </div>
      )}

      {activeHubTab === 'quizzes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* QUIZ MODULE (7-span) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="comix-panel p-5 bg-[#121318] min-h-[500px] flex flex-col justify-between">
              
              {/* Quiz Header & Tier Selectors */}
              <div>
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-850">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    <Award className="w-4 h-4 text-amber-500 animate-pulse" />
                    ACADEMY CERTIFICATION TRAINING TIER:
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  {['beginner', 'intermediate', 'professional'].map(tier => (
                    <button
                      key={tier}
                      onClick={() => resetQuiz(tier as any)}
                      className={`p-2 rounded-lg border text-[11px] font-bold uppercase transition-all ${
                        quizTier === tier
                          ? 'bg-amber-500 text-black border-amber-500 font-black'
                          : 'bg-black/40 border-gray-900 text-gray-400 hover:text-white'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>

                {/* ACTIVE QUESTIONS CARD */}
                {!quizCompleted ? (
                  <div className="space-y-4 bg-black/40 border border-gray-950 p-5 rounded-xl">
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase font-black">
                      <span>QUESTION {currentQuestionIndex + 1} OF {QUIZZES[quizTier].length}</span>
                      <span className="text-amber-500 font-bold">{quizTier.toUpperCase()} LEVEL</span>
                    </div>

                    <h4 className="text-sm font-bold text-white uppercase leading-snug">
                      {QUIZZES[quizTier][currentQuestionIndex].question}
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2 pt-2">
                      {QUIZZES[quizTier][currentQuestionIndex].options.map((opt, idx) => {
                        const isSelected = selectedQuizAnswer === opt;
                        const isCorrect = opt === QUIZZES[quizTier][currentQuestionIndex].correct;
                        
                        let optionStyle = "bg-black/60 border-gray-900 text-gray-300 hover:border-amber-500/40";
                        if (selectedQuizAnswer !== null) {
                          if (isSelected) {
                            optionStyle = isCorrect 
                              ? "bg-emerald-950 border-emerald-500 text-emerald-400 font-bold"
                              : "bg-red-950 border-red-500 text-red-400 font-bold";
                          } else if (isCorrect) {
                            optionStyle = "bg-emerald-950/40 border-emerald-900 text-emerald-500";
                          } else {
                            optionStyle = "bg-black/30 border-gray-950 text-gray-600 cursor-not-allowed";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswerSelect(opt)}
                            disabled={selectedQuizAnswer !== null}
                            className={`w-full p-3 rounded-lg border text-left text-xs transition-all flex items-start gap-2.5 ${optionStyle}`}
                          >
                            <span className="font-mono text-gray-500">{idx + 1}.</span>
                            <span className="font-semibold leading-normal">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Interactive Explanation Box */}
                    {quizFeedback && (
                      <div className="p-4 rounded-xl text-xs bg-black/60 border border-amber-950/55 leading-relaxed text-gray-300 mt-4">
                        {quizFeedback}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-4 bg-black/40 border border-gray-950 p-6 rounded-xl">
                    <Award className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
                    <h4 className="text-base font-black text-white uppercase">QUIZ CERTIFICATION COMPLETE!</h4>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                      You scored <strong className="text-amber-500 font-black">{quizScore} / {QUIZZES[quizTier].length}</strong> on the {quizTier} test block, gaining valuable XP toward your production credentials.
                    </p>
                    <button
                      onClick={() => resetQuiz(quizTier)}
                      className="bg-amber-500 hover:bg-amber-600 text-black font-black px-6 py-2.5 rounded-lg text-xs uppercase shadow-md"
                    >
                      Retake Test Block
                    </button>
                  </div>
                )}
              </div>

              {/* NEXT QUESTION CONTROL */}
              {!quizCompleted && selectedQuizAnswer !== null && (
                <button
                  onClick={handleNextQuizQuestion}
                  className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-black py-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <span>{currentQuestionIndex + 1 === QUIZZES[quizTier].length ? 'Finish Quiz' : 'Next Question'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

            </div>
          </div>

          {/* PRINTABLE WORKOUT ROUTINES (5-span) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="comix-panel p-5 bg-[#121318] space-y-5">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-1.5 tracking-wide">
                <Sliders className="w-4.5 h-4.5 text-amber-500" />
                STUDIO WORKOUT DRILLS
              </h3>
              
              <p className="text-xs text-gray-400 leading-relaxed">
                Unlock daily workout regimens to sharpen your acoustic ears and master film production blocking choreography.
              </p>

              {/* Workout 1 */}
              <div className="bg-black/55 border border-gray-950 p-4 rounded-xl space-y-2">
                <span className="text-[8px] font-mono text-amber-500 font-black uppercase bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 rounded-md">
                  Audio Engineering Drill
                </span>
                <h4 className="text-xs font-bold text-white uppercase">The 10-Min Pink-Noise EQ Sweep</h4>
                <p className="text-[11px] text-gray-400 leading-normal font-medium">
                  Load a simple pink noise stem. Setup a narrow-band parametric filter and sweep from 20Hz to 20,000Hz to memorize key resonance and acoustic room nodes.
                </p>
                <div className="text-[10px] font-mono text-gray-500 uppercase">
                  Benefit: Memorize precise harmonic intervals.
                </div>
              </div>

              {/* Workout 2 */}
              <div className="bg-black/55 border border-gray-950 p-4 rounded-xl space-y-2">
                <span className="text-[8px] font-mono text-purple-500 font-black uppercase bg-purple-500/15 border border-purple-500/25 px-2 py-0.5 rounded-md">
                  Cinema Filmmaking Drill
                </span>
                <h4 className="text-xs font-bold text-white uppercase">The Multi-Subject Deep Blocking Choreography</h4>
                <p className="text-[11px] text-gray-400 leading-normal font-medium">
                  Using a single stationary focal length camera (50mm), block three moving actor nodes. Maintain eye-line continuity and frame focal overlaps without changing angles or editing cuts.
                </p>
                <div className="text-[10px] font-mono text-gray-500 uppercase">
                  Benefit: Master deep perspective focal balance.
                </div>
              </div>

              {/* Badge showcase */}
              <div className="bg-black/30 border border-gray-900 p-3.5 rounded-xl space-y-2">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">
                  ACADEMY MERIT BADGES ({unlockedBadges.length})
                </span>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  {unlockedBadges.includes('pioneer') && (
                    <div className="bg-[#181825] border border-amber-500/25 p-2 rounded flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-white uppercase font-bold truncate">Pioneer</span>
                    </div>
                  )}
                  {unlockedBadges.includes('theory_ace') && (
                    <div className="bg-[#181825] border border-amber-500/25 p-2 rounded flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-white uppercase font-bold truncate">Theory Ace</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {activeHubTab === 'blueprints' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: MULTI-PERSONA AI CHATBOT (5-span) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="comix-panel p-5 bg-[#121318] h-[660px] flex flex-col justify-between">
              
              {/* Chatbot Header */}
              <div>
                <h3 className="text-sm font-bold text-white uppercase mb-2 flex items-center gap-1.5 tracking-wide">
                  <MessageSquare className="w-4.5 h-4.5 text-amber-500" />
                  Aigenio Persona AI Chatbot
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Toggle character modules to query vintage mixing guidelines, street-smart pigeon logic, or cassette saturation principles.
                </p>
              </div>

              {/* Persona Selectors */}
              <div className="grid grid-cols-3 gap-2 my-4">
                {[
                  { id: 'beatnik', label: '70s Beatnik', icon: '🕶️' },
                  { id: 'pigeon', label: 'Brooklyn Pigeon', icon: '🐦' },
                  { id: 'vinyl', label: 'Vinyl Purist', icon: '🦖' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPersona(p.id as any);
                      const initialText = 
                        p.id === 'beatnik' ? "Dig it, cat! I'm the Aigenio Beatnik. Lay some cosmic audio queries on me, and I'll spin you some heavy gold wisdom." :
                        p.id === 'pigeon' ? "Listen pal! Fuhgeddaboudit! I'm the Brooklyn Alley Pigeon. Caw! Hit me with mix questions and don't skimp on breadcrumbs!" :
                        "Hmph. Vinyl Purist Dinosaur here. Modern digital audio is a sterile wasteland. Ask me how to salvage some actual analog soul.";
                      setMessages([{ id: String(Date.now()), sender: 'producer', text: initialText, persona: p.id as any }]);
                    }}
                    className={`p-2 rounded-lg border text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1 ${
                      persona === p.id
                        ? 'bg-amber-500 text-black border-amber-500 font-black'
                        : 'bg-black/40 border-gray-900 text-gray-400 hover:text-white hover:border-gray-800'
                    }`}
                  >
                    <span className="text-base">{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>

              {/* Messages Display */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3 bg-black/40 p-3 rounded-lg border border-gray-900">
                {messages.map(msg => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <span className="text-[8px] font-mono text-gray-500 mb-0.5 uppercase">
                        {isUser ? 'Composer' : `${msg.persona?.toUpperCase() || persona.toUpperCase()} PRODUCER`}
                      </span>
                      <div className={`p-2.5 rounded-lg text-xs leading-relaxed max-w-[85%] border ${
                        isUser 
                          ? 'bg-[#181825] border-gray-800 text-white rounded-tr-none' 
                          : 'bg-amber-950/20 border-amber-900 text-amber-100 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                {isGenerating && (
                  <div className="text-[10px] font-mono text-gray-500 animate-pulse uppercase">
                    ⚡ Tuning analog frequencies...
                  </div>
                )}
              </div>

              {/* Input Bar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Query the ${persona}...`}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-black border border-gray-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500 font-semibold"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-lg text-xs border border-amber-600 shadow-sm transition-all uppercase"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SEARCHABLE BLUEPRINTS BENTO-GRID (7-span) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="comix-panel p-5 bg-[#121318] min-h-[660px] flex flex-col">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5 uppercase tracking-wide">
                <Cpu className="w-4.5 h-4.5 text-amber-500" />
                20 LEAP AHEAD TECH BLUEPRINTS
              </h3>

              {/* SEARCH & FILTERS */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-4">
                <div className="md:col-span-7 relative">
                  <input
                    type="text"
                    placeholder="Search blueprint title, logic, equations..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-black border border-gray-850 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:border-amber-500 outline-none font-semibold"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
                </div>
                <div className="md:col-span-5">
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full bg-black border border-gray-850 rounded-lg p-2 text-xs text-gray-400 font-bold outline-none cursor-pointer"
                  >
                    <option value="all">All Specs</option>
                    <option value="shader">Shaders & Math</option>
                    <option value="developer">Core DSP & Node.js</option>
                    <option value="ux">UX & Controls</option>
                    <option value="monetization">Monetization</option>
                  </select>
                </div>
              </div>

              {/* BENTO GRID */}
              <div className="flex-1 overflow-y-auto max-h-[500px] grid grid-cols-1 md:grid-cols-2 gap-3 pr-2">
                {filteredBlueprints.length === 0 ? (
                  <div className="col-span-2 text-center text-gray-500 py-12 italic text-xs font-mono uppercase">
                    No specs matched your search frequency.
                  </div>
                ) : (
                  filteredBlueprints.map(bp => (
                    <div key={bp.id} className="bg-black/30 border border-gray-900 rounded-xl p-4 flex flex-col justify-between relative group hover:border-amber-500/50 transition-colors">
                      {/* Category Stamp */}
                      <div className="absolute top-2 right-2 bg-black px-1.5 py-0.5 border border-gray-800 rounded text-[7.5px] font-mono text-gray-500 uppercase">
                        {bp.category}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-tight mb-1">{bp.title}</h4>
                        <p className="text-[10px] text-gray-400 leading-normal mb-3">{bp.description}</p>
                      </div>

                      <div className="space-y-2 pt-2.5 border-t border-gray-900">
                        {/* Logic */}
                        <div className="text-[9.5px] leading-tight">
                          <strong className="text-gray-500 uppercase font-mono block">Logic:</strong>
                          <span className="text-gray-300 font-medium">{bp.logic}</span>
                        </div>

                        {/* Formula */}
                        {bp.mathFormula && (
                          <div className="bg-black/50 p-1.5 rounded text-[9px] font-mono text-amber-500 select-all overflow-x-auto border border-gray-950 whitespace-nowrap">
                            {bp.mathFormula}
                          </div>
                        )}

                        {/* Monetization */}
                        <div className="text-[9.5px] leading-tight pt-1">
                          <strong className="text-gray-500 uppercase font-mono block">Monetization:</strong>
                          <span className="text-amber-500 font-semibold">{bp.monetization}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
