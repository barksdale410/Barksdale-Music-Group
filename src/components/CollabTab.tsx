import React, { useState, useEffect } from 'react';
import { Users, Shield, Zap, Award, Play, Pause, Send, MessageSquare, Plus, DollarSign, Star, Compass, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { LEGENDARY_PAIRINGS, PRODUCER_LIBRARIES } from '../data/musicData';
import { barksdaleSynth } from '../utils/audioUtils';

export const CollabTab: React.FC = () => {
  const [activeSubSection, setActiveSubSection] = useState<'skills' | 'rooms' | 'pairings' | 'battles' | 'gigs'>('skills');

  // --- 1. SKILLS TEST & RADAR CHART STATES ---
  const [skillsScore, setSkillsScore] = useState<Record<string, number>>({
    Drums: 40, Bass: 30, Keys: 50, Sampling: 35, Arrangement: 45, Mixing: 20, Melody: 45
  });
  const [hasTakenTest, setHasTakenTest] = useState(false);
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [testStep, setTestStep] = useState(0);
  const [tempScores, setTempScores] = useState<Record<string, number>>({
    Drums: 0, Bass: 0, Keys: 0, Sampling: 0, Arrangement: 0, Mixing: 0, Melody: 0
  });

  const testQuestions = [
    { skill: "Drums", q: "How do you achieve a natural pocket swing on a hip-hop hi-hat row?", options: ["Quantize to absolute 16th grid", "Shift alternate hats 5-15ms late off-grid", "Boost 10kHz frequencies by 12dB"], scores: [20, 80, 10] },
    { skill: "Bass", q: "What is the industry standard practice to prevent an 808 sub bass from clashing with the kick drum?", options: ["Boost kick at 30Hz", "Sidechain compress the bass triggered by the kick", "Increase sub bass volume to max"], scores: [10, 90, 20] },
    { skill: "Keys", q: "Which chord extension creates a vintage, soulful neo-soul atmosphere?", options: ["Power triad (root-fifth)", "Minor 9th chord", "Augmented major triad"], scores: [20, 95, 30] },
    { skill: "Mixing", q: "What frequency range is usually referred to as the 'mud' region in a vocal or piano track?", options: ["200Hz - 500Hz", "10kHz - 15kHz", "30Hz - 60Hz"], scores: [85, 20, 15] }
  ];

  const handleTestAnswer = (scoreAward: number) => {
    const currentSkill = testQuestions[testStep].skill;
    setTempScores(prev => ({ ...prev, [currentSkill]: scoreAward }));

    if (testStep < testQuestions.length - 1) {
      setTestStep(prev => prev + 1);
    } else {
      // Calculate final
      setSkillsScore({
        Drums: tempScores.Drums || 60,
        Bass: tempScores.Bass || 50,
        Keys: tempScores.Keys || 85,
        Sampling: 75,
        Arrangement: 70,
        Mixing: scoreAward,
        Melody: 80
      });
      setIsTakingTest(false);
      setHasTakenTest(true);
    }
  };

  // SVG Radar chart calculation coordinates
  const getRadarCoordinates = () => {
    const skills = ['Drums', 'Bass', 'Keys', 'Sampling', 'Arrangement', 'Mixing', 'Melody'];
    const center = 100;
    const rMax = 70;
    
    const points = skills.map((skill, index) => {
      const score = skillsScore[skill] || 40;
      const angle = (Math.PI * 2 / 7) * index - Math.PI / 2;
      const r = (score / 100) * rMax;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    });
    
    return points.join(' ');
  };

  const getMatchedProducer = () => {
    // If weak on mixing, matches with a Mix Genius.
    if (skillsScore.Mixing < 40) {
      return { name: "The Alchemist (Level 99 Mixing)", complementarity: "Excellent pairing for gritty basement stems" };
    }
    return { name: "J Dilla (Level 99 Unquantized Swing)", complementarity: "Excellent pairing for organic, dusty Rhodes chords" };
  };

  // --- 2. LIVE SESSION ROOM STATES ---
  const [createdRooms, setCreatedRooms] = useState<any[]>([
    { id: "room_1", name: "Griselda Gritty Sessions", host: "Conductor_Keys", role: "Keys", participantsCount: 3, roomType: "Public" }
  ]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'Drummer' | 'Keys' | 'Bassist'>('Keys');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: "DillaMPC", text: "Yo, the kick needs slightly more swing on step 4.", time: "12:04" },
    { sender: "System", text: "Conductor_Keys joined as Keys Master.", time: "12:05" }
  ]);
  const [isRecording, setIsRecording] = useState(false);

  // Simulated virtual cursor coordinates for live collaboration
  const [virtualCursors, setVirtualCursors] = useState<any[]>([
    { name: "DillaMPC", x: 120, y: 150, color: "#ca9a5a" },
    { name: "AlchemistVibe", x: 240, y: 310, color: "#4caf50" }
  ]);

  useEffect(() => {
    let timer: any;
    if (activeRoomId) {
      // Simulate cursor jittering representing other live users editing drum steps!
      timer = setInterval(() => {
        setVirtualCursors(prev => prev.map(c => ({
          ...c,
          x: Math.max(20, Math.min(380, c.x + (Math.random() * 40 - 20))),
          y: Math.max(50, Math.min(400, c.y + (Math.random() * 40 - 20)))
        })));
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [activeRoomId]);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoom = {
      id: `room_${Date.now()}`,
      name: "Downtown Dusty Loop Room",
      host: "Me",
      role: selectedRole,
      participantsCount: 1,
      roomType: "Public"
    };
    setCreatedRooms([newRoom, ...createdRooms]);
    setActiveRoomId(newRoom.id);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      sender: "Me",
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');

    // Simulate auto response from collaborative peer in 1 second!
    setTimeout(() => {
      const responseMsg = {
        sender: "DillaMPC",
        text: "That sounds crisp! Double the velocity on that Rhodes chord now.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, responseMsg]);
    }, 1200);
  };

  // --- 3. LEGENDARY PAIRINGS JUKEBOX ---
  const [playingPairId, setPlayingPairId] = useState<string | null>(null);
  const handlePlayPairingBeat = (pair: any) => {
    if (playingPairId === pair.id) {
      barksdaleSynth.stopBeatSequencer();
      setPlayingPairId(null);
    } else {
      barksdaleSynth.stopBeatSequencer();
      setPlayingPairId(pair.id);
      
      const fakeDrums = {
        kick:  [true,  false, false, true,  true,  false, false, false],
        snare: [false, false, true,  false, false, false, true,  false],
        hat:   [true,  true,  true,  true,  true,  true,  true,  true],
        clap:  [false, false, false, false, false, false, false, false]
      };
      barksdaleSynth.startBeatSequencer(pair.signatureBpm, fakeDrums, pair.progression, () => {});
    }
  };

  // --- 4. BATTLE MODE STATES ---
  const [battleCountdown, setBattleCountdown] = useState(599); // 10 minutes
  const [votesMe, setVotesMe] = useState(48);
  const [votesThem, setVotesThem] = useState(52);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    let timer: any;
    if (activeSubSection === 'battles') {
      timer = setInterval(() => {
        setBattleCountdown(prev => (prev > 0 ? prev - 1 : 0));
        // Simulate fluctuating live votes
        setVotesMe(prev => Math.max(30, Math.min(70, prev + (Math.random() * 4 - 2))));
        setVotesThem(prev => Math.max(30, Math.min(70, prev + (Math.random() * 4 - 2))));
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [activeSubSection]);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // --- 5. MICRO GIG PAYMENTS STATES ---
  const [paymentGig, setPaymentGig] = useState<any | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const gigs = [
    { id: "gig_1", title: "Need Dusty Cello Loop arranged for Vinyl project", budget: 15, client: "Griselda_Records", duration: "30m" },
    { id: "gig_2", title: "Need Sub Bass level mix engineer tuneup", budget: 30, client: "Metro_Cousin", duration: "1h" }
  ];

  const handleSimulatePayment = () => {
    setTimeout(() => {
      setPaymentSuccess(true);
      // add to local beats or system
    }, 1500);
  };

  return (
    <div className="p-4" id="collab-tab-view">
      <div className="mb-4">
        <h2 className="text-base font-bold text-white mb-1 uppercase tracking-wide">Producer Collab Engine</h2>
        <p className="text-xs text-[#999999]">Coordinate stems, battles, and skills with other legendary creators globally.</p>
      </div>

      {/* Collaboration Categories Menu */}
      <div className="flex gap-1 overflow-x-auto pb-3 mb-4 scrollbar-hide border-b border-[#222222]">
        {[
          { id: 'skills', label: 'Skills Test' },
          { id: 'rooms', label: 'Live Rooms' },
          { id: 'pairings', label: 'Pairings Jukebox' },
          { id: 'battles', label: 'Beat Battles' },
          { id: 'gigs', label: 'Micro Gigs' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubSection(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase shrink-0 transition-all ${
              activeSubSection === tab.id 
                ? "bg-[#ca9a5a] text-white" 
                : "bg-[#111111] text-[#999999] border border-[#222222] hover:bg-[#181818]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- SECTION A: PRODUCER SKILLS TEST & RADAR CHART --- */}
      {activeSubSection === 'skills' && (
        <div id="skills-section" className="space-y-4">
          <div className="bmg-card relative overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#999999] mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#ca9a5a]" /> Producer Skill Profiler
            </h3>

            {/* Simulated interactive Radar Chart */}
            <div className="flex justify-center items-center mb-4">
              <div className="relative w-48 h-48 bg-[#0a0a0a] rounded-full border border-[#222222] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {/* Outer ring */}
                  <circle cx="100" cy="100" r="70" stroke="#222222" strokeWidth="1" fill="none" />
                  <circle cx="100" cy="100" r="35" stroke="#181818" strokeWidth="1" fill="none" />
                  
                  {/* Axis lines */}
                  {Array.from({ length: 7 }).map((_, i) => {
                    const angle = (Math.PI * 2 / 7) * i - Math.PI / 2;
                    return (
                      <line 
                        key={i}
                        x1="100" y1="100"
                        x2={100 + 70 * Math.cos(angle)} y2={100 + 70 * Math.sin(angle)}
                        stroke="#222222" strokeWidth="1"
                      />
                    );
                  })}

                  {/* Skills radar polygon map */}
                  <polygon 
                    points={getRadarCoordinates()}
                    fill="rgba(240, 136, 62, 0.25)"
                    stroke="#ca9a5a"
                    strokeWidth="2"
                  />
                  
                  {/* Axis Labels */}
                  {['Drums', 'Bass', 'Keys', 'Sample', 'Arrange', 'Mix', 'Melody'].map((label, idx) => {
                    const angle = (Math.PI * 2 / 7) * idx - Math.PI / 2;
                    const x = 100 + 82 * Math.cos(angle);
                    const y = 100 + 82 * Math.sin(angle);
                    return (
                      <text 
                        key={idx}
                        x={x} y={y}
                        fill="#666666"
                        fontSize="8"
                        fontWeight="900"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        className="font-mono"
                      >
                        {label}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Take Test Panel */}
            {!hasTakenTest && !isTakingTest && (
              <div className="text-center py-2">
                <p className="text-xs text-[#999999] mb-3">Your level profiles are currently set to default. Take the 2-minute test to map your skills!</p>
                <button
                  onClick={() => {
                    setIsTakingTest(true);
                    setTestStep(0);
                  }}
                  className="bmg-button text-xs font-bold w-full"
                >
                  Take Skills Test
                </button>
              </div>
            )}

            {/* Active Test Questions */}
            {isTakingTest && (
              <div className="bg-[#111111] p-3 rounded-lg border border-[#2a2a2a] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-[#ca9a5a]">Question {testStep + 1} of {testQuestions.length}</span>
                  <span className="text-[10px] text-white font-mono">{testQuestions[testStep].skill}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{testQuestions[testStep].q}</h4>
                <div className="space-y-2">
                  {testQuestions[testStep].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleTestAnswer(testQuestions[testStep].scores[oIdx])}
                      className="w-full bg-[#1c1c1c] hover:bg-[#252525] border border-[#222222] text-left p-3 rounded-xl text-xs text-white"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Test Results Matches */}
            {hasTakenTest && (
              <div className="space-y-3">
                <div className="bg-[#4caf50]/10 border border-[#4caf50]/30 p-2.5 rounded-lg flex gap-2">
                  <CheckCircle className="w-4 h-4 text-[#4caf50] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[10px] font-bold text-[#4caf50] uppercase">Complementary matchmaking verified</h5>
                    <p className="text-[10px] text-[#999999]">We found complementary producer matches to balance your skill weaknesses.</p>
                  </div>
                </div>

                <div className="bg-[#1c1c1c] p-3 rounded-xl border border-[#222222]">
                  <span className="text-[9px] uppercase font-bold text-[#666666] block">Matched legend partner</span>
                  <h4 className="text-xs font-bold text-white mt-0.5">{getMatchedProducer().name}</h4>
                  <p className="text-[10px] text-[#888888] mt-1">{getMatchedProducer().complementarity}</p>
                </div>

                <button
                  onClick={() => {
                    setHasTakenTest(false);
                    setIsTakingTest(true);
                    setTestStep(0);
                  }}
                  className="bmg-button-secondary text-xs w-full py-2 min-h-[36px]"
                >
                  Retake Skills Test
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SECTION B: LIVE COLLABORATIVE ROOMS --- */}
      {activeSubSection === 'rooms' && (
        <div id="rooms-section" className="space-y-4">
          {!activeRoomId ? (
            <div className="space-y-4">
              {/* Form to create room */}
              <div className="bmg-card">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#999999] mb-3">Create Live Collaborative Room</h3>
                <form onSubmit={handleCreateRoom} className="space-y-3">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-[#666666] block mb-1">Session Role Lock</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as any)}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] p-2.5 rounded text-xs text-white font-bold"
                    >
                      <option value="Keys">Keys Player (Unlocked: Key Pads only)</option>
                      <option value="Drummer">Drum Programmer (Unlocked: Drum Sequencer only)</option>
                      <option value="Bassist">Bass Synth Sub (Unlocked: Sub levels only)</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bmg-button text-xs">
                    Spawn Live Room
                  </button>
                </form>
              </div>

              {/* List of active rooms */}
              <div className="bmg-card">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#999999] mb-3">Join Existing Rooms</h3>
                <div className="space-y-2">
                  {createdRooms.map(room => (
                    <div key={room.id} className="bg-[#141414] border border-[#222222] p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{room.name}</h4>
                        <span className="text-[9px] font-mono text-[#666666]">Host: {room.host} | Active: {room.participantsCount} online</span>
                      </div>
                      <button
                        onClick={() => setActiveRoomId(room.id)}
                        className="bmg-button py-1.5 px-3 min-h-[34px] text-[10px]"
                      >
                        Join Room
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ACTIVE LIVE ROOM COLLABORATIVE DAW */
            <div className="bmg-card relative border-[#ca9a5a]/50 overflow-hidden" id="active-session-canvas">
              {/* Virtual Cursor overlays */}
              {virtualCursors.map(cur => (
                <div 
                  key={cur.name}
                  className="absolute pointer-events-none transition-all duration-300 z-30"
                  style={{ left: `${cur.x}px`, top: `${cur.y}px` }}
                >
                  <div className="w-3 h-3 rounded-full opacity-70" style={{ backgroundColor: cur.color, boxShadow: `0 0 8px ${cur.color}` }} />
                  <span className="absolute left-4 top-0 bg-[#1e1e1e] border border-[#222222] text-[8px] px-1 py-0.5 rounded text-white font-bold font-mono">
                    {cur.name}
                  </span>
                </div>
              ))}

              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="bmg-badge bmg-badge-success uppercase text-[8px] font-bold">● LIVE WEBRTC LINK</span>
                  <h3 className="text-xs font-bold text-white mt-1">Room: downtown_dusty_loop_room</h3>
                </div>
                <button
                  onClick={() => setActiveRoomId(null)}
                  className="text-red-500 hover:text-red-400 text-xs font-bold"
                >
                  Disconnect ✕
                </button>
              </div>

              {/* Role-Based Instrument Locking Warning */}
              <div className="bg-[#ca9a5a]/10 border border-[#ca9a5a]/20 p-2.5 rounded-lg mb-4 text-[10px] text-[#999999]">
                <strong>Your Role:</strong> {selectedRole} Lock. Only {selectedRole === 'Keys' ? "Keys synth" : selectedRole === 'Drummer' ? "drum grid steps" : "bass levels"} are editable by you. Other instruments are auto-locked.
              </div>

              {/* Simulated Live Audio Waves from active mic */}
              <div className="flex items-center justify-between bg-[#111111] p-2.5 rounded-lg border border-[#222222] mb-4">
                <span className="text-[9px] uppercase font-bold text-[#666666]">Active Peer Voice: DillaMPC</span>
                <div className="bmg-wave-indicator">
                  <div className="bmg-wave-bar" />
                  <div className="bmg-wave-bar" />
                  <div className="bmg-wave-bar" />
                  <div className="bmg-wave-bar" />
                </div>
              </div>

              {/* Collaborative CHAT PANEL */}
              <div className="bg-[#0c0c0c] border border-[#222222] p-3 rounded-lg space-y-2 max-h-40 overflow-y-auto mb-3 text-[11px]">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <span className={`font-bold ${msg.sender === 'Me' ? 'text-[#ca9a5a]' : msg.sender === 'System' ? 'text-[#4caf50]' : 'text-[var(--bmg-accent-primary)]'}`}>
                        {msg.sender}
                      </span>
                      <span className="text-[8px] text-[#555555]">{msg.time}</span>
                    </div>
                    <p className="text-[#999999] mt-0.5">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Send */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                  placeholder="Type message to room..."
                  className="flex-1 bg-[#161616] border border-[#222222] p-2 rounded text-xs text-white"
                />
                <button
                  onClick={handleSendMessage}
                  className="bmg-button px-3 min-h-[34px] text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Record and merge indicators */}
              <div className="mt-4 pt-3 border-t border-[#222222] flex gap-2">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    isRecording ? "bg-red-600 border-red-500 text-white" : "bg-[#161616] border-[#222222] text-[#999999]"
                  }`}
                >
                  {isRecording ? "● Recording Jam Session..." : "Record Session"}
                </button>
                <button
                  onClick={() => alert("Master STEM file merged successfully. Download under Profile portfolio.")}
                  className="bmg-button py-1.5 min-h-[34px] text-xs font-bold"
                >
                  Merge Master STEM
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- SECTION C: LEGENDARY PAIRINGS JUKEBOX --- */}
      {activeSubSection === 'pairings' && (
        <div id="pairings-section" className="space-y-4">
          <div className="bmg-card">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#999999] mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#ca9a5a]" /> Legendary Producer Pairings
            </h3>
            <p className="text-[11px] text-[#888888] mb-3">
              Load classic configurations, explore signature collaborative blueprints, and play their joint synthesizers.
            </p>

            <div className="space-y-3">
              {LEGENDARY_PAIRINGS.map(pair => (
                <div key={pair.id} className="bg-[#141414] border border-[#222222] p-3 rounded-xl flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{pair.names}</h4>
                      <span className="text-[9px] font-mono text-[#ca9a5a]">{pair.signatureStyle}</span>
                    </div>
                    <span className="text-[10px] text-[#666666] font-mono">{pair.signatureBpm} BPM</span>
                  </div>

                  <p className="text-[11px] text-[#999999] leading-relaxed mb-3 bg-[#0a0a0a] p-2 rounded border border-[#222222]">
                    {pair.bio}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePlayPairingBeat(pair)}
                      className={`flex-1 bmg-button-secondary py-2 min-h-[36px] text-xs font-bold gap-1.5 ${
                        playingPairId === pair.id ? "border-red-600/50 text-red-500" : ""
                      }`}
                    >
                      {playingPairId === pair.id ? (
                        <>Stop Signature Beat</>
                      ) : (
                        <><Play className="w-3.5 h-3.5 fill-current" /> Play Joint Sound</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SECTION D: BEAT BATTLES LOBBY --- */}
      {activeSubSection === 'battles' && (
        <div id="battles-section" className="space-y-4">
          <div className="bmg-card border-red-600/20 bg-[#160d0d]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Live 10-Minute Beat Battle Arena
              </h3>
              <span className="text-xs font-mono font-bold text-white bg-red-600/10 px-2 py-0.5 rounded border border-red-500/20">
                Timer: {formatCountdown(battleCountdown)}
              </span>
            </div>

            <p className="text-[11px] text-[#888888] mb-4">
              Both producers are challenged with the exact same soul vocal slice. Community votes update in real time!
            </p>

            {/* Battle Voting layout visual progress bars */}
            <div className="space-y-3 bg-[#0a0a0a] p-3 rounded-lg border border-[#222222]">
              <div>
                <div className="flex justify-between text-xs font-bold text-white mb-1">
                  <span>Producer: Conductor_Keys (YOU)</span>
                  <span className="text-[#ca9a5a]">{votesMe.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-[#1e1e1e] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#ca9a5a] h-full transition-all duration-300" style={{ width: `${votesMe}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-white mb-1">
                  <span>Challenger: Atlanta_Drum_God</span>
                  <span className="text-[var(--bmg-accent-primary)]">{votesThem.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-[#1e1e1e] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[var(--bmg-accent-primary)] h-full transition-all duration-300" style={{ width: `${votesThem}%` }} />
                </div>
              </div>
            </div>

            {/* Voting Action trigger */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  if (!hasVoted) {
                    setVotesMe(prev => prev + 5);
                    setHasVoted(true);
                  }
                }}
                disabled={hasVoted}
                className="flex-1 bmg-button text-xs"
              >
                {hasVoted ? "Vote Cast Registered ✔" : "Boost My Beat (+1 Vote)"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SECTION E: MICRO GIG MARKETPLACE --- */}
      {activeSubSection === 'gigs' && (
        <div id="gigs-section" className="space-y-4">
          <div className="bmg-card">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#999999] mb-3">Micro-Gig Session Marketplace</h3>
            <p className="text-[11px] text-[#888888] mb-3">Complete freelance arrangement tasks for other labels to earn simulated credit points.</p>

            <div className="space-y-3">
              {gigs.map(gig => (
                <div key={gig.id} className="bg-[#141414] border border-[#222222] p-3 rounded-xl flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xs font-bold text-white">{gig.title}</h4>
                      <span className="text-[9px] text-[#666666] font-mono">Client: {gig.client} | Duration: {gig.duration}</span>
                    </div>
                    <span className="text-xs font-bold text-[#4caf50]">${gig.budget} credit</span>
                  </div>

                  <button
                    onClick={() => {
                      setPaymentGig(gig);
                      setPaymentSuccess(false);
                    }}
                    className="bmg-button py-1.5 min-h-[34px] text-xs font-bold w-full"
                  >
                    Apply & Setup Payment Escrow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Payment popup simulator */}
          {paymentGig && (
            <div className="bmg-card bmg-card-active animate-in fade-in duration-200">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-bold text-[#ca9a5a] uppercase tracking-wider">BMG Secure Payment Escrow</h4>
                <button onClick={() => setPaymentGig(null)} className="text-[#555555] text-xs">Close ✕</button>
              </div>

              {paymentSuccess ? (
                <div className="text-center py-4 space-y-2">
                  <CheckCircle className="w-10 h-10 text-[#4caf50] mx-auto animate-bounce" />
                  <h4 className="text-xs font-bold text-white">Escrow Payment Verified!</h4>
                  <p className="text-[10px] text-[#999999]">Funds of ${paymentGig.budget} are locked in smart contract until stem delivery.</p>
                </div>
              ) : (
                <div className="space-y-3 text-xs text-[#999999]">
                  <p>Client **{paymentGig.client}** has initiated an escrow agreement for **${paymentGig.budget}**.</p>
                  <button
                    onClick={handleSimulatePayment}
                    className="w-full bmg-button text-xs font-bold"
                  >
                    Simulate Stripe Card Lock
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
