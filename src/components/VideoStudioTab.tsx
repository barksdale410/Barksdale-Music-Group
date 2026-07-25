import React, { useState, useEffect, useRef } from 'react';
import { Film, FileText, UserCheck, Video, Music, Image, Eye, RefreshCw, Lock, Unlock, Play, Pause, Download, Volume2, Sparkles, Sliders, Settings, Award, Tv, RotateCcw, Plus, Trash2, Globe } from 'lucide-react';
import { Actor, Screenplay } from '../types';
import { InfiniteScriptDesk } from './InfiniteScriptDesk';
import { CharacterConsistencyEngine } from './CharacterConsistencyEngine';
import { GoogleEarthScout } from './GoogleEarthScout';
import { CosmoVideoIntegration } from './CosmoVideoIntegration';

export const VideoStudioTab: React.FC = () => {
  // 7-step pipeline index: 0 = Script Desk, 1 = Casting, 2 = Blocking, 3 = Soundtrack, 4 = IMAX Grading, 5 = Preview, 6 = Export
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [xp, setXp] = useState<number>(300);

  // pre-written screenplays for 1970s noir crime thrillers
  const preWrittenScripts: Screenplay[] = [
    {
      id: 'script-1',
      title: 'The Wet Asphalt',
      category: '1970s Crime Noir',
      sceneDesc: 'Rain pours over a flashing yellow neon sign in a Brooklyn alleyway.',
      scriptText: 'MARLON: "The rain won\'t wash away what we did, Marilyn. It just covers up the tire tracks." MARILYN: "Listen to yourself. We got the cash. Barksdale wants his cut by midnight, or we are fish bait in the Hudson." MARLON: "Let him wait. He doesn\'t own this asphalt."',
      maxWords: 66,
      pacing: 'Slow Suspenseful Noir Pacing'
    },
    {
      id: 'script-2',
      title: 'Midnight Neon Hustle',
      category: 'Psych-Thriller',
      sceneDesc: 'Inside a dim basement filled with vinyl records and analog tape machines.',
      scriptText: 'AIKO: "The synth frequency has a pulse, Detective. It is matching the bank alarms." MARLON: "That is Barksdale\'s signal. He has been broadcasting code directly into the fm radio waves." AIKO: "Then the loop is already locked in."',
      maxWords: 66,
      pacing: 'Fast Paced Action Tempo'
    }
  ];

  const [activeScriptIdx, setActiveScriptIdx] = useState<number>(0);
  const [customScriptText, setCustomScriptText] = useState<string>(preWrittenScripts[0].scriptText);
  const [wordsCount, setWordsCount] = useState<number>(0);
  const [characterCues, setCharacterCues] = useState<string[]>([]);

  // Cast of actors
  const [actors, setActors] = useState<Actor[]>([
    { id: 'act-1', name: 'Marlon Vance', age: 39, ethnicity: 'Irish-American', vocalAccent: 'Brooklyn Drawl', hairstyle: 'Greasers Shag', wardrobe: '1970s Leather Jacket', styleLocked: true },
    { id: 'act-2', name: 'Marilyn Cooper', age: 28, ethnicity: 'African-American', vocalAccent: 'Seductive Velvet', hairstyle: 'Vintage Afro Blowout', wardrobe: 'Aviator Sunglasses', styleLocked: false },
    { id: 'act-3', name: 'Aiko Cyberpunk', age: 24, ethnicity: 'Japanese', vocalAccent: 'Tech Monotone', hairstyle: 'Neon Dyed Crop', wardrobe: 'Metallic Trench Coat', styleLocked: false }
  ]);
  const [editingActorId, setEditingActorId] = useState<string>('act-1');

  // Camera blocking
  const [cameraAngle, setCameraAngle] = useState<string>('Over-the-Shoulder');
  const [focalLength, setFocalLength] = useState<number>(50); // 18mm to 135mm
  const [lensAperture, setLensAperture] = useState<number>(2.8); // f/1.4 to f/16

  // Soundtrack stems levels
  const [dialogueVolume, setDialogueVolume] = useState<number>(85);
  const [scoreVolume, setScoreVolume] = useState<number>(75);
  const [sfxVolume, setSfxVolume] = useState<number>(60);
  const [isScoringPlaying, setIsScoringPlaying] = useState<boolean>(false);

  // Color grading presets
  const [colorGrade, setColorGrade] = useState<string>('Sundance 16mm Grainy');

  // Tape reel rotation angle state for soundtrack suite animation
  const [reelAngle, setReelAngle] = useState<number>(0);

  // --- TEXT-TO-VIDEO / B-ROLL STATES ---
  const [videoPrompt, setVideoPrompt] = useState<string>("A rainy street in Brooklyn with flashing neon yellow signs, reflections in wet asphalt");
  const [videoAspectRatio, setVideoAspectRatio] = useState<string>("16:9");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [videoGenerationProgress, setVideoGenerationProgress] = useState<number>(0);
  const [currentJobID, setCurrentJobID] = useState<string | null>(null);
  const [currentOpName, setCurrentOpName] = useState<string | null>(null);
  const [videoLoadingMsg, setVideoLoadingMsg] = useState<string>("Initializing Aigenio neural latent space...");
  
  // High fidelity project synchronization and custom generation state
  const [dawBpm, setDawBpm] = useState<number>(120);
  const [videoResolution, setVideoResolution] = useState<string>("720p");
  const [videoStyle, setVideoStyle] = useState<string>("1970s");
  const [beatSyncPulse, setBeatSyncPulse] = useState<boolean>(true);
  const [autoAssignSlot, setAutoAssignSlot] = useState<string>("auto");

  // Library of clips (pre-populated with 2 high fidelity assets)
  const [videoLibrary, setVideoLibrary] = useState<Array<{
    id: string;
    prompt: string;
    aspectRatio: string;
    videoUrl: string;
    status: 'DONE' | 'PENDING' | 'RUNNING' | 'FAILED';
  }>>([
    {
      id: "default_1",
      prompt: "Rain pouring on a flashing neon sign in a Brooklyn alleyway",
      aspectRatio: "16:9",
      videoUrl: "/api/video-download?jobID=default_1&operationName=default",
      status: "DONE"
    },
    {
      id: "default_2",
      prompt: "Headlights of a vintage 1970s car piercing through dense fog",
      aspectRatio: "16:9",
      videoUrl: "/api/video-download?jobID=default_2&operationName=default",
      status: "DONE"
    }
  ]);

  // Timeline Sync (15 seconds total)
  // 3 Slots of 5 seconds each: Slot 1 (0-5s), Slot 2 (5-10s), Slot 3 (10-15s)
  const [timelineSlots, setTimelineSlots] = useState<Record<number, string | null>>({
    1: "default_1", // Default first slot has Rain Neon
    2: "default_2", // Default second slot has Car Headlights
    3: null         // Default third slot is empty
  });

  const [timelineTime, setTimelineTime] = useState<number>(0);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState<boolean>(false);

  // Poll video status loop
  useEffect(() => {
    let pollInterval: any;
    if (isGeneratingVideo && currentJobID) {
      const messages = [
        "Analyzing text semantics with Veo-3.1...",
        "Structuring 1970s visual weight variables...",
        "Rendering film emulsion layers...",
        "Injecting Technicolor dye couplers...",
        "Aligning vintage zoom lens curvature...",
        "Syncing focal compression metadata..."
      ];

      pollInterval = setInterval(async () => {
        // Pick a random loading message to keep user reassured!
        setVideoLoadingMsg(messages[Math.floor(Math.random() * messages.length)]);

        try {
          const res = await fetch("/api/video-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobID: currentJobID, operationName: currentOpName })
          });

          const data = await res.json();
          if (data.status === "DONE" || data.done) {
            setIsGeneratingVideo(false);
            setVideoGenerationProgress(100);
            clearInterval(pollInterval);

            // Add the newly created asset to the library!
            const newAssetUrl = `/api/video-download?jobID=${currentJobID}&operationName=${currentOpName || "mock"}`;
            setVideoLibrary(prev => [
              ...prev,
              {
                id: currentJobID,
                prompt: videoPrompt,
                aspectRatio: videoAspectRatio,
                videoUrl: newAssetUrl,
                status: "DONE"
              }
            ]);

            // Automatically place it in the timeline slot based on preference!
            setTimelineSlots(prev => {
              if (autoAssignSlot === "slot1") return { ...prev, 1: currentJobID };
              if (autoAssignSlot === "slot2") return { ...prev, 2: currentJobID };
              if (autoAssignSlot === "slot3") return { ...prev, 3: currentJobID };
              
              // Otherwise, "auto" (find first empty, or fallback to Slot 1)
              if (!prev[1]) return { ...prev, 1: currentJobID };
              if (!prev[2]) return { ...prev, 2: currentJobID };
              if (!prev[3]) return { ...prev, 3: currentJobID };
              return { ...prev, 1: currentJobID }; // Fallback to Slot 1 if all full
            });

            setCurrentJobID(null);
            setCurrentOpName(null);
          } else {
            setVideoGenerationProgress(data.progress || 50);
          }
        } catch (err) {
          console.error("Polling failed:", err);
        }
      }, 2000);
    }

    return () => clearInterval(pollInterval);
  }, [isGeneratingVideo, currentJobID, currentOpName, videoPrompt, videoAspectRatio]);

  // Timeline ticking effect
  useEffect(() => {
    let tickInterval: any;
    if (isTimelinePlaying) {
      tickInterval = setInterval(() => {
        setTimelineTime(prev => {
          if (prev >= 15) {
            return 0; // Loop timeline
          }
          return Math.round((prev + 0.1) * 10) / 10;
        });
      }, 100);
    }
    return () => clearInterval(tickInterval);
  }, [isTimelinePlaying]);

  // Synchronization Bridge: Listen to DAW sequencer play state
  useEffect(() => {
    const handleSequencerPlay = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setIsTimelinePlaying(customEvent.detail.isPlaying);
        if (typeof customEvent.detail.bpm === 'number') {
          setDawBpm(customEvent.detail.bpm);
        }
        if (customEvent.detail.isPlaying) {
          if (timelineTime >= 15) {
            setTimelineTime(0);
          }
        }
      }
    };
    window.addEventListener('barksdale_sequencer_play', handleSequencerPlay);
    return () => {
      window.removeEventListener('barksdale_sequencer_play', handleSequencerPlay);
    };
  }, [timelineTime]);

  // Synchronization Bridge: Dispatch timeline play state back to DAW
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('barksdale_video_timeline_play', {
      detail: { isPlaying: isTimelinePlaying }
    }));
  }, [isTimelinePlaying]);

  // Spin tape reels when scoring is playing OR when timeline is playing
  useEffect(() => {
    let interval: any;
    if (isScoringPlaying || isTimelinePlaying) {
      interval = setInterval(() => {
        setReelAngle(prev => (prev + 12) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isScoringPlaying, isTimelinePlaying]);

  // Update words count and extract character cues automatically
  useEffect(() => {
    const words = customScriptText.trim().split(/\s+/).filter(w => w !== "");
    setWordsCount(words.length);

    // Regex extract word capitalized followed by colon
    const matches = customScriptText.match(/([A-Z]{3,12}):/g) || [];
    const uniqueCues = Array.from(new Set(matches.map(m => m.replace(':', ''))));
    setCharacterCues(uniqueCues);
  }, [customScriptText]);

  // --- TIMELINE SYNC FUNCTIONS ---
  const getCurrentVideoUrl = () => {
    let activeSlot = 1;
    if (timelineTime >= 5 && timelineTime < 10) {
      activeSlot = 2;
    } else if (timelineTime >= 10) {
      activeSlot = 3;
    }

    const assignedClipId = timelineSlots[activeSlot];
    if (!assignedClipId) return null;

    const clip = videoLibrary.find(c => c.id === assignedClipId);
    return clip ? clip.videoUrl : null;
  };

  const getCurrentVideoPrompt = () => {
    let activeSlot = 1;
    if (timelineTime >= 5 && timelineTime < 10) {
      activeSlot = 2;
    } else if (timelineTime >= 10) {
      activeSlot = 3;
    }

    const assignedClipId = timelineSlots[activeSlot];
    if (!assignedClipId) return "No B-roll assigned to this segment";

    const clip = videoLibrary.find(c => c.id === assignedClipId);
    return clip ? clip.prompt : "Default Clip";
  };

  const handleTriggerVideoGeneration = async () => {
    if (!videoPrompt.trim()) return;
    setIsGeneratingVideo(true);
    setVideoGenerationProgress(5);
    setVideoLoadingMsg("Initializing connection to Veo-3.1-lite models...");

    // Enrich prompt with selected cinematic style for maximum visual cohesion
    let enrichedPrompt = videoPrompt;
    if (videoStyle === "1970s") {
      enrichedPrompt += ", style of 1970s vintage cinema, heavy film grain, desaturated color palette, lens flare, nostalgic atmosphere";
    } else if (videoStyle === "noir") {
      enrichedPrompt += ", noir cinema style, heavy chiaroscuro shadows, high contrast black and white, smoky ambiance, dramatic lighting";
    } else if (videoStyle === "technicolor") {
      enrichedPrompt += ", vintage 1930s technicolor film emulsion style, rich saturated hues, soft glow, classic hollywood aesthetic";
    } else if (videoStyle === "cyberpunk") {
      enrichedPrompt += ", cyberpunk sci-fi style, vivid neon teal and pink glow, high tech low life, rain slicked surfaces, volumetric fog";
    }

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: enrichedPrompt,
          aspectRatio: videoAspectRatio,
          resolution: videoResolution
        })
      });

      const data = await response.json();
      if (data.success) {
        setCurrentJobID(data.jobID);
        setCurrentOpName(data.operationName);
        setVideoGenerationProgress(15);
      } else {
        setIsGeneratingVideo(false);
        alert("Downstream service error: " + (data.error || "Generation request refused."));
      }
    } catch (err: any) {
      console.error("Video gen failed:", err);
      setIsGeneratingVideo(false);
      alert("Network or pipeline communication error. Please try again.");
    }
  };

  // Handle screenplay writing with strict 66-word guardrail
  const handleScriptChange = (text: string) => {
    const words = text.trim().split(/\s+/).filter(w => w !== "");
    if (words.length <= 66) {
      setCustomScriptText(text);
    }
  };

  const handleUpdateActorField = (field: keyof Actor, value: any) => {
    setActors(prev => prev.map(act => {
      if (act.id === editingActorId) {
        if (act.styleLocked && field !== 'styleLocked') return act; // Block edits if locked
        return { ...act, [field]: value };
      }
      return act;
    }));
  };

  const handleExportMovieBundle = () => {
    const movieData = {
      script: {
        title: preWrittenScripts[activeScriptIdx].title,
        text: customScriptText,
        cues: characterCues
      },
      casting: actors,
      camera: {
        angle: cameraAngle,
        lens: `${focalLength}mm f/${lensAperture}`
      },
      audio: {
        dialogue: dialogueVolume,
        score: scoreVolume,
        sfx: sfxVolume
      },
      grading: colorGrade,
      distributor: "Barksdale Cinema Labs",
      timestamp: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(movieData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Barksdale_CinemaExport_${preWrittenScripts[activeScriptIdx].id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Color grade filters classes
  const getGradeFilterClass = () => {
    switch (colorGrade) {
      case 'Teal-and-Pink Cyber':
        return 'contrast-125 brightness-110 saturate-150 hue-rotate-[40deg] bg-cyan-950/20';
      case '1930s Technicolor':
        return 'contrast-150 saturate-200 sepia-[0.15] bg-red-950/10';
      case 'Prismatic Psychedelic warmth':
        return 'contrast-110 saturate-150 hue-rotate-[-30deg] bg-amber-950/20';
      case 'Sundance 16mm Grainy':
      default:
        return 'grayscale contrast-125 sepia-[0.25] bg-yellow-950/10';
    }
  };

  const currentActor = actors.find(a => a.id === editingActorId) || actors[0];

  // Dynamic beat synchronization calculations
  const beatDuration = 60 / dawBpm;
  const currentBeatFloat = timelineTime / beatDuration;
  const decimal = currentBeatFloat - Math.floor(currentBeatFloat);
  const isBeatTriggered = isTimelinePlaying && (decimal < 0.25 || decimal > 0.75);

  return (
    <div className="space-y-6 p-4 min-h-screen">
      {/* HEADER BAR */}
      <div className="comix-panel p-5 bg-[#121318] text-white">
        <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2 tracking-tight">
          <Film className="w-6 h-6 stroke-[2px] text-amber-500" />
          BARKSDALE CINEMA & MOVIE PIPELINE
        </h2>
        <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
          The industry's first vintage-driven 7-step film sandbox. Draft screenplays with reading speed calculations, cast vintage stylized actors, block cinematic lens distances, score stems, and color grade directly for distribution.
        </p>

        {/* 7-STEP TIMELINE TRACKER */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-1.5 mt-5 bg-black/60 p-2 rounded-xl border border-gray-900">
          {[
            { step: 0, label: '🎬 1. SCRIPT DESK' },
            { step: 1, label: '👤 2. ACTOR CAST' },
            { step: 2, label: '📹 3. BLOCKING' },
            { step: 3, label: '🎚️ 4. SOUNDTRACK' },
            { step: 4, label: '🎨 5. COLOR GRADE' },
            { step: 5, label: '👁️ 6. PREVIEW' },
            { step: 6, label: '📦 7. DISTRIBUTION' }
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setPipelineStep(item.step)}
              className={`py-2 text-[9.5px] font-bold uppercase rounded-lg transition-all border ${
                pipelineStep === item.step
                  ? 'bg-amber-500 text-black border-amber-600 shadow-sm'
                  : 'bg-black/40 text-gray-400 border-gray-800 hover:bg-gray-900 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* PIPELINE DESK STAGE */}
      <div className="comix-panel p-5 bg-[#121318] relative">
        <div className="absolute top-3 right-3 bg-black px-2 py-1 rounded text-[9.5px] font-mono text-gray-400 border border-gray-800 uppercase">
          Pipeline Mode • Step {pipelineStep + 1} of 7
        </div>

        {/* STEP 1: SCRIPT DESK */}
        {pipelineStep === 0 && (
          <div className="space-y-6">
            <InfiniteScriptDesk />
          </div>
        )}

        {/* STEP 2: ACTOR STUDIO */}
        {pipelineStep === 1 && (
          <div className="space-y-6">
            <CharacterConsistencyEngine />
          </div>
        )}

        {/* STEP 3: LOCATION SCOUTING & BLOCKING */}
        {pipelineStep === 2 && (
          <div className="space-y-6">
            <GoogleEarthScout />
          </div>
        )}


        {/* STEP 3: CAMERA BLOCKING */}
        {pipelineStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
              <Video className="w-4 h-4 text-amber-500" />
              Director's Camera Blocking & Lenses
            </h3>

            <p className="text-xs text-gray-400">
              Configure camera perspective matrices and focal compression values. Notice how focal depth changes distance compression.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Camera Configurations */}
              <div className="md:col-span-4 bg-black/40 border border-gray-900 rounded-xl p-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-gray-500 uppercase block">CAMERA ANGLE SELECTOR:</label>
                  <select
                    value={cameraAngle}
                    onChange={e => setCameraAngle(e.target.value)}
                    className="w-full bg-black border border-gray-850 rounded-lg p-2 text-xs text-white font-bold outline-none cursor-pointer"
                  >
                    <option value="Extreme Wide Shot">Extreme Wide Shot (EWS)</option>
                    <option value="Over-the-Shoulder">Over-the-Shoulder (OTS)</option>
                    <option value="Symmetrical Eye-Level">Symmetrical Eye-Level</option>
                    <option value="Extreme Close-up">Extreme Close-up (ECU)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-mono text-gray-500 uppercase block">FOCAL LENGTH:</label>
                    <span className="text-[10px] font-mono text-amber-500 font-bold">{focalLength}mm</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="135"
                    value={focalLength}
                    onChange={e => setFocalLength(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-gray-800 h-1.5 rounded-lg cursor-pointer"
                  />
                  <span className="text-[8px] font-mono text-gray-600 uppercase block">
                    {focalLength < 35 ? 'Wide-angle distortion' : focalLength > 85 ? 'Telephoto background compression' : 'Standard human eye view'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-mono text-gray-500 uppercase block">LENS APERTURE (DEPTH):</label>
                    <span className="text-[10px] font-mono text-amber-500 font-bold">f/{lensAperture}</span>
                  </div>
                  <select
                    value={lensAperture}
                    onChange={e => setLensAperture(parseFloat(e.target.value))}
                    className="w-full bg-black border border-gray-850 rounded-lg p-2 text-xs text-white font-bold outline-none cursor-pointer"
                  >
                    <option value="1.4">f/1.4 (Extreme shallow bokeh)</option>
                    <option value="2.8">f/2.8 (Soft background)</option>
                    <option value="5.6">f/5.6 (Sharp foreground)</option>
                    <option value="11">f/11 (Deep focus landscape)</option>
                  </select>
                </div>
              </div>

              {/* Wireframe Camera Blocking Visualizer */}
              <div className="md:col-span-8 bg-black border border-dashed border-gray-800 rounded-xl p-5 flex flex-col justify-center items-center h-52 text-center relative overflow-hidden">
                {/* SVG Camera blocking target simulation */}
                <svg className="w-24 h-24 stroke-amber-500/40 fill-none mb-3 stroke-[1.5]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" />
                  <line x1="50" y1="10" x2="50" y2="90" />
                  <line x1="10" y1="50" x2="90" y2="50" />
                  <rect x="25" y="25" width="50" height="50" strokeWidth="1" strokeDasharray="4" />
                </svg>

                <h4 className="text-xs font-bold text-white uppercase tracking-wider">{cameraAngle}</h4>
                <p className="text-[10px] font-mono text-gray-500 mt-1 uppercase">
                  Lens Formula: {focalLength}mm at f/{lensAperture} • Aspect Ratio: Cinema 2.39:1
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SOUNDTRACK SUITE */}
        {pipelineStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
              <Music className="w-4 h-4 text-amber-500" />
              Soundtrack Suite & Multi-track Stems
            </h3>

            <p className="text-xs text-gray-400">
              Align video blocks with custom stems. Trigger <strong>Scoring play</strong> to animate our spinning tape-reels and verify real-time level mixers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Level Sliders */}
              <div className="md:col-span-6 bg-black/40 border border-gray-900 rounded-xl p-4 space-y-4">
                {/* Dialogue */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white uppercase tracking-tight">Dialogue Track Level</span>
                    <span className="font-mono text-amber-500 font-bold">{dialogueVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={dialogueVolume}
                    onChange={e => setDialogueVolume(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-gray-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Score */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white uppercase tracking-tight">Orchestral Score Level</span>
                    <span className="font-mono text-amber-500 font-bold">{scoreVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scoreVolume}
                    onChange={e => setScoreVolume(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-gray-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* SFX */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white uppercase tracking-tight">Ambience & SFX Level</span>
                    <span className="font-mono text-amber-500 font-bold">{sfxVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sfxVolume}
                    onChange={e => setSfxVolume(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-gray-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Spinning Tape Reels */}
              <div className="md:col-span-6 bg-black border border-gray-900 rounded-xl p-5 flex flex-col justify-center items-center h-52 text-center relative overflow-hidden">
                <div className="flex gap-8 justify-center items-center mb-3">
                  {/* Left Tape Reel */}
                  <svg 
                    className="w-18 h-18 text-amber-500 fill-none stroke-[2]" 
                    viewBox="0 0 100 100"
                    style={{ transform: `rotate(${reelAngle}deg)` }}
                  >
                    <circle cx="50" cy="50" r="45" stroke="#1c1c24" strokeWidth="4" />
                    <circle cx="50" cy="50" r="12" stroke="white" strokeWidth="2" />
                    <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="3" />
                    <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="3" />
                    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" strokeDasharray="6" />
                  </svg>

                  {/* Right Tape Reel */}
                  <svg 
                    className="w-18 h-18 text-amber-500 fill-none stroke-[2]" 
                    viewBox="0 0 100 100"
                    style={{ transform: `rotate(${reelAngle}deg)` }}
                  >
                    <circle cx="50" cy="50" r="45" stroke="#1c1c24" strokeWidth="4" />
                    <circle cx="50" cy="50" r="12" stroke="white" strokeWidth="2" />
                    <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="3" />
                    <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="3" />
                    <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="1" strokeDasharray="4" />
                  </svg>
                </div>

                <button
                  onClick={() => setIsScoringPlaying(!isScoringPlaying)}
                  className="comix-btn px-4 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5 text-black bg-amber-500 border border-amber-600 rounded-lg shadow-md hover:brightness-110 transition-all"
                >
                  {isScoringPlaying ? 'Stop Tape Reel' : 'Engage Scoring Reel'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: COLOR GRADING */}
        {pipelineStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
              <Sliders className="w-4 h-4 text-amber-500" />
              IMAX Screening Room & Color Grading
            </h3>

            <p className="text-xs text-gray-400">
              Select dynamic aesthetic color presets that will apply to your video renders in the final distribution preview.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Sundance 16mm Grainy', desc: 'Warm desaturated gold grains.' },
                { name: 'Teal-and-Pink Cyber', desc: 'Vibrant neon futuristic tints.' },
                { name: '1930s Technicolor', desc: 'High saturation dyestuff emulation.' },
                { name: 'Prismatic Psychedelic warmth', desc: 'Trippy colorful analog glow.' }
              ].map(grade => (
                <div
                  key={grade.name}
                  onClick={() => setColorGrade(grade.name)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    colorGrade === grade.name
                      ? 'bg-black border-amber-500/60 shadow-md'
                      : 'bg-black/30 border-gray-850 hover:border-gray-800'
                  }`}
                >
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight mb-1">{grade.name}</h4>
                  <p className="text-[10px] text-gray-500 leading-normal">{grade.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: PREVIEW */}
        {pipelineStep === 5 && (
          <div className="space-y-6">
            <CosmoVideoIntegration />
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-900 pb-3 gap-3 pt-6 border-t">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
                  <Eye className="w-4 h-4 text-amber-500" />
                  AI B-Roll Gen & Multi-track Audio-Video Timeline Sync
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Design bespoke visual B-roll segments using Gemini Veo, then map and synchronize them precisely across our 15-second soundstage timeline.
                </p>
              </div>
              
              {/* STATUS INDICATOR OF SYNC */}
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">
                  Veo Active Sync: ON
                </span>
              </div>
            </div>

            {/* DUAL WORKSPACE GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN: THE MASTER MONITOR & RUNTIME TIMELINE (7-SPAN) */}
              <div className="xl:col-span-7 space-y-4">
                
                {/* 1. THE CINEMATIC MONITOR SCREEN */}
                <div className="bg-[#090a0d] border border-gray-850 rounded-xl overflow-hidden relative shadow-[0_12px_24px_rgba(0,0,0,0.8)]">
                  {/* Aspect Ratio Box (Cinema 16:9) */}
                  <div className={`relative w-full aspect-video transition-all duration-75 ${getGradeFilterClass()} ${
                    beatSyncPulse && isBeatTriggered 
                      ? 'shadow-[inset_0_0_30px_rgba(245,158,11,0.65)] scale-[1.005] border-amber-500/50' 
                      : 'shadow-none border-transparent'
                  }`}>
                    
                    {/* Active video or placeholder */}
                    {getCurrentVideoUrl() ? (
                      <video
                        key={getCurrentVideoUrl()!}
                        src={getCurrentVideoUrl()!}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#0d0e12] text-center p-4">
                        <Tv className="w-12 h-12 text-gray-700 mb-2 stroke-[1.5]" />
                        <span className="text-xs text-gray-400 font-mono font-bold uppercase tracking-wider">Empty B-Roll Segment Slot</span>
                        <p className="text-[10px] text-gray-500 mt-1 max-w-xs">
                          No visual assets assigned to this timeline segment. Generate a clip and slot it in!
                        </p>
                      </div>
                    )}

                    {/* Authentic static scanlines and noise overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1.5px,_transparent_1.5px)] bg-[size:3px_3px] opacity-60 pointer-events-none" />
                    
                    {/* Ambient burn vignettes */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_50%,_rgba(0,0,0,0.7))] pointer-events-none" />

                    {/* Active Segment HUD Indicator overlay */}
                    <div className="absolute top-3 left-3 bg-black/75 px-2 py-1 rounded text-[9px] font-mono text-gray-400 border border-gray-850 flex items-center gap-1.5 z-20">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                      LIVE FEED • {timelineTime >= 0 && timelineTime < 5 ? "SLOT 1" : timelineTime >= 5 && timelineTime < 10 ? "SLOT 2" : "SLOT 3"}
                    </div>

                    {/* Synced DAW BPM indicator */}
                    <div className="absolute top-3 right-3 bg-black/75 px-2 py-1 rounded text-[9px] font-mono text-amber-500 border border-gray-850 flex items-center gap-1.5 z-20">
                      <Music className={`w-2.5 h-2.5 ${isTimelinePlaying ? 'animate-bounce' : ''}`} />
                      <span>SYNC: {dawBpm} BPM</span>
                      <span className={`w-1.5 h-1.5 rounded-full bg-amber-500 ${isTimelinePlaying ? 'animate-ping' : ''}`} />
                    </div>

                    <div className="absolute bottom-3 right-3 bg-black/75 px-2 py-1 rounded text-[9px] font-mono text-gray-400 border border-gray-850 z-20">
                      FILTER: {colorGrade.toUpperCase()}
                    </div>
                  </div>

                  {/* UNDER-SCREEN CONTEXT PANEL */}
                  <div className="bg-[#121318] p-3 border-t border-gray-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="font-mono text-gray-400 truncate max-w-sm">
                      <span className="text-gray-500 font-bold uppercase">Prompt: </span>
                      <span className="italic text-gray-200">"{getCurrentVideoPrompt()}"</span>
                    </div>
                    <div className="shrink-0 flex items-center gap-3 text-[10px] font-mono text-gray-500 uppercase border-t sm:border-t-0 sm:border-l border-gray-850 pt-2 sm:pt-0 sm:pl-3">
                      <span>LENS: {focalLength}mm</span>
                      <span>ANGLE: {cameraAngle}</span>
                    </div>
                  </div>
                </div>

                {/* 2. MULTITRACK VISUAL SYNCHRONIZATION TIMELINE */}
                <div className="bg-[#0e0f14] border border-gray-850 rounded-xl p-4 space-y-3.5">
                  
                  {/* Master Playback controls */}
                  <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsTimelinePlaying(!isTimelinePlaying)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-all border ${
                          isTimelinePlaying 
                            ? 'bg-red-600 border-red-700 text-white shadow-lg shadow-red-600/10 animate-pulse' 
                            : 'bg-amber-500 border-amber-600 text-black shadow-lg shadow-amber-500/10 hover:brightness-110'
                        }`}
                      >
                        {isTimelinePlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-black" />}
                        {isTimelinePlaying ? 'Pause Sync' : 'Play Timeline'}
                      </button>

                      <button
                        onClick={() => {
                          setIsTimelinePlaying(false);
                          setTimelineTime(0);
                        }}
                        className="p-1.5 rounded-lg bg-black/40 text-gray-400 hover:text-white border border-gray-850 hover:bg-black transition-all"
                        title="Reset Timeline"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <span className="text-amber-500 font-bold">
                        {timelineTime.toFixed(2).padStart(5, '0')}s
                      </span>
                      <span className="text-gray-500"> / 15.00s</span>
                    </div>
                  </div>

                  {/* VISUAL MULTI-TRACK STAGE */}
                  <div className="space-y-2.5 relative">
                    
                    {/* Interactive Playhead Needle */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 transition-all duration-100 ease-linear pointer-events-none"
                      style={{ left: `${(timelineTime / 15) * 100}%` }}
                    >
                      <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-black flex items-center justify-center shadow-md">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    </div>

                    {/* Timeline Ruler numbers */}
                    <div className="flex justify-between text-[8px] font-mono text-gray-600 font-bold px-1.5 mb-1.5">
                      <span>0.0s (START)</span>
                      <span>5.0s</span>
                      <span>10.0s</span>
                      <span>15.0s (END)</span>
                    </div>

                    {/* TRACK 1: VIDEO B-ROLL CHANNEL */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 uppercase">
                        <span>🎬 VIDEO B-ROLL TRACK</span>
                        <span className="text-[8px] text-gray-600 font-bold">3x 5-second dynamic clips</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 bg-black/50 p-1 border border-gray-900 rounded-lg">
                        {[1, 2, 3].map(slotNum => {
                          const assignedId = timelineSlots[slotNum];
                          const clip = videoLibrary.find(c => c.id === assignedId);
                          const isActive = timelineTime >= (slotNum - 1) * 5 && timelineTime < slotNum * 5;

                          return (
                            <div 
                              key={slotNum}
                              className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all min-h-[56px] relative ${
                                isActive 
                                  ? 'bg-amber-950/25 border-amber-500/40 shadow-inner' 
                                  : 'bg-[#121318]/50 border-gray-850 hover:border-gray-800'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className={`text-[8px] font-mono font-bold ${isActive ? 'text-amber-500' : 'text-gray-500'}`}>
                                  Slot {slotNum} ({(slotNum - 1) * 5}s - {slotNum * 5}s)
                                </span>
                                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />}
                              </div>

                              {clip ? (
                                <div className="space-y-1">
                                  <span className="text-[9px] font-bold text-gray-200 truncate block uppercase leading-none">
                                    {clip.prompt.substring(0, 22)}...
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTimelineSlots(prev => ({ ...prev, [slotNum]: null }));
                                    }}
                                    className="text-[8px] font-mono text-red-400 hover:text-red-300 font-bold uppercase cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[9px] text-gray-600 italic block font-mono">
                                  Empty Slot
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* TRACK 2: DIALOGUE STEM TRACK */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 uppercase">
                        <span>💬 DIALOGUE STEM WAVE</span>
                        <span className="text-[8px] font-bold text-gray-600">Gain: {dialogueVolume}%</span>
                      </div>
                      <div className="bg-[#121318] p-2 border border-gray-900 rounded-lg h-9 flex items-center justify-between relative overflow-hidden">
                        {/* Simulated audio waveform peaks reacting to levels */}
                        <div className="flex items-end gap-0.5 w-full h-full">
                          {Array.from({ length: 48 }).map((_, i) => {
                            const amplitude = Math.sin(i * 0.4) * Math.cos(i * 0.1) * 0.5 + 0.5;
                            const height = Math.max(12, amplitude * 24 * (dialogueVolume / 100));
                            const isPassing = (timelineTime / 15) * 48 > i;
                            return (
                              <div
                                key={i}
                                className={`flex-1 rounded-sm transition-all duration-300 ${
                                  isPassing 
                                    ? 'bg-purple-500/80' 
                                    : 'bg-purple-950/30'
                                }`}
                                style={{ height: `${height}%` }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* TRACK 3: ORCHESTRAL SCORE TRACK */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 uppercase">
                        <span>🎵 ORCHESTRAL SCORE WAVE</span>
                        <span className="text-[8px] font-bold text-gray-600">Gain: {scoreVolume}%</span>
                      </div>
                      <div className="bg-[#121318] p-2 border border-gray-900 rounded-lg h-9 flex items-center justify-between relative overflow-hidden">
                        <div className="flex items-end gap-0.5 w-full h-full">
                          {Array.from({ length: 48 }).map((_, i) => {
                            const amplitude = Math.abs(Math.sin(i * 0.25) * Math.sin(i * 0.8)) * 0.6 + 0.4;
                            const height = Math.max(8, amplitude * 26 * (scoreVolume / 100));
                            const isPassing = (timelineTime / 15) * 48 > i;
                            return (
                              <div
                                key={i}
                                className={`flex-1 rounded-sm transition-all duration-300 ${
                                  isPassing 
                                    ? 'bg-amber-500/80' 
                                    : 'bg-amber-950/30'
                                }`}
                                style={{ height: `${height}%` }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* TRACK 4: AMBIENCE & SFX TRACK */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 uppercase">
                        <span>🍃 AMBIENCE & SFX WAVE</span>
                        <span className="text-[8px] font-bold text-gray-600">Gain: {sfxVolume}%</span>
                      </div>
                      <div className="bg-[#121318] p-2 border border-gray-900 rounded-lg h-9 flex items-center justify-between relative overflow-hidden">
                        <div className="flex items-end gap-0.5 w-full h-full">
                          {Array.from({ length: 48 }).map((_, i) => {
                            const amplitude = (Math.random() * 0.4 + 0.6) * Math.sin(i * 0.15);
                            const height = Math.max(10, Math.abs(amplitude) * 22 * (sfxVolume / 100));
                            const isPassing = (timelineTime / 15) * 48 > i;
                            return (
                              <div
                                key={i}
                                className={`flex-1 rounded-sm transition-all duration-300 ${
                                  isPassing 
                                    ? 'bg-teal-500/80' 
                                    : 'bg-teal-950/30'
                                }`}
                                style={{ height: `${height}%` }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: AI VEO-3.1 SYNTHESIZER DESK & CLIP LIBRARY (5-SPAN) */}
              <div className="xl:col-span-5 space-y-4">
                
                {/* 1. TEXT TO VIDEO PROMPT CONTROL PANEL */}
                <div className="bg-[#0e0f14] border border-gray-850 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-tight">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    Veo-3.1-Lite Video Synthesizer
                  </div>

                  <p className="text-[10px] text-gray-400 leading-normal">
                    Describe your desired visual asset below. The AI will synthesize 5 seconds of cinematic video that matches your target lens settings.
                  </p>

                  <div className="space-y-2">
                    <textarea
                      value={videoPrompt}
                      onChange={e => setVideoPrompt(e.target.value)}
                      placeholder="Describe the cinematic scene..."
                      className="w-full bg-black border border-gray-850 rounded-lg p-2.5 text-xs font-mono text-amber-100 outline-none focus:border-amber-500 leading-relaxed min-h-[76px]"
                    />

                    {/* Quick presets */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-gray-500 uppercase block font-bold">1970s Cinematic Scene Presets:</span>
                      <div className="flex flex-wrap gap-1">
                        {[
                          { emoji: "🌧️", label: "Brooklyn Rain", text: "A dark rainy street corner in 1970s Brooklyn with flashing yellow neon sign reflections" },
                          { emoji: "🏎️", label: "Fog Headlights", text: "Headlights of a vintage 1970s black sedan cutting through dense gray fog, slow motion panning" },
                          { emoji: "🎷", label: "Smoky Jazz Bar", text: "A smoky cabaret bar with deep violet spotlight illuminating a vintage microphone on a stand" },
                          { emoji: "🏙️", label: "Gloomy NYC", text: "Moody extreme wide shot of Chrysler Building shrouded in gloomy Manhattan storm clouds" }
                        ].map(preset => (
                          <button
                            key={preset.label}
                            onClick={() => setVideoPrompt(preset.text)}
                            className="bg-black/50 border border-gray-850 text-[9px] text-gray-400 hover:text-white px-2 py-0.5 rounded flex items-center gap-1 transition-all"
                          >
                            <span>{preset.emoji}</span>
                            <span>{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Advanced Synthesizer Parameter Settings */}
                    <div className="grid grid-cols-2 gap-2 bg-black/40 border border-gray-900 rounded-lg p-2.5 mt-2">
                      <div className="space-y-1 text-left">
                        <label className="text-[8px] font-mono font-bold text-gray-500 uppercase block">Cinematic Style Preset:</label>
                        <select
                          value={videoStyle}
                          onChange={e => setVideoStyle(e.target.value)}
                          className="w-full bg-black text-gray-300 border border-gray-850 rounded px-1.5 py-1 text-[9px] outline-none font-sans cursor-pointer focus:border-amber-500"
                        >
                          <option value="1970s">1970s Retro Film Grain</option>
                          <option value="noir">Noir High-Contrast B&W</option>
                          <option value="technicolor">Technicolor Classic Glow</option>
                          <option value="cyberpunk">Cyberpunk Vivid Neon</option>
                          <option value="none">Raw Rendering</option>
                        </select>
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[8px] font-mono font-bold text-gray-500 uppercase block">Target Timeline Slot:</label>
                        <select
                          value={autoAssignSlot}
                          onChange={e => setAutoAssignSlot(e.target.value)}
                          className="w-full bg-black text-gray-300 border border-gray-850 rounded px-1.5 py-1 text-[9px] outline-none font-sans cursor-pointer focus:border-amber-500"
                        >
                          <option value="auto">Auto (First Empty Segment)</option>
                          <option value="slot1">Force Slot 1 (0-5s)</option>
                          <option value="slot2">Force Slot 2 (5-10s)</option>
                          <option value="slot3">Force Slot 3 (10-15s)</option>
                        </select>
                      </div>

                      <div className="space-y-1 text-left col-span-2">
                        <label className="text-[8px] font-mono font-bold text-gray-500 uppercase block">Output Resolution:</label>
                        <select
                          value={videoResolution}
                          onChange={e => setVideoResolution(e.target.value)}
                          className="w-full bg-black text-gray-300 border border-gray-850 rounded px-1.5 py-1 text-[9px] outline-none font-sans cursor-pointer focus:border-amber-500"
                        >
                          <option value="720p">HD 720p (Fast)</option>
                          <option value="1080p">Full HD 1080p (HQ)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between border border-gray-900 bg-black/60 rounded px-2 py-1 mt-1 col-span-2">
                        <div className="flex flex-col text-left">
                          <span className="text-[9px] font-bold text-gray-300 uppercase leading-none">Beat-Pulse Synchronization</span>
                          <span className="text-[7px] text-gray-500 font-mono mt-0.5 uppercase">Monitor flashes to DAW BPM ({dawBpm} BPM)</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={beatSyncPulse}
                          onChange={e => setBeatSyncPulse(e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-gray-800 text-amber-500 bg-black outline-none focus:ring-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Aspect Ratio and Gen triggers */}
                    <div className="flex gap-2 items-center pt-2">
                      <div className="flex-1">
                        <select
                          value={videoAspectRatio}
                          onChange={e => setVideoAspectRatio(e.target.value)}
                          className="w-full bg-black border border-gray-850 rounded-lg p-2 text-[10px] text-white font-bold outline-none cursor-pointer"
                        >
                          <option value="16:9">Landscape 16:9</option>
                          <option value="9:16">Portrait 9:16</option>
                        </select>
                      </div>

                      <button
                        onClick={handleTriggerVideoGeneration}
                        disabled={isGeneratingVideo || !videoPrompt.trim()}
                        className="flex-1 bg-amber-500 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed border border-amber-600 text-black font-bold uppercase rounded-lg px-3 py-2 text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
                      >
                        {isGeneratingVideo ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Synthesizing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            Generate B-Roll
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ACTIVE GENERATION TRACKER PROGRESS BAR */}
                  {isGeneratingVideo && (
                    <div className="bg-black/60 border border-amber-950/50 rounded-lg p-3 space-y-2 mt-2">
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="text-amber-500 font-bold uppercase animate-pulse truncate max-w-[80%]">
                          {videoLoadingMsg}
                        </span>
                        <span className="text-amber-500 font-bold">{videoGenerationProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-950">
                        <div 
                          className="bg-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${videoGenerationProgress}%` }}
                        />
                      </div>
                      <span className="text-[8px] font-mono text-gray-500 block uppercase italic leading-tight">
                        Note: Neural visual render compilation takes approximately 10 to 15 seconds. Please do not close this dashboard.
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. CLIP GALLERY & ASSIGNMENT HUB */}
                <div className="bg-[#0e0f14] border border-gray-850 rounded-xl p-4 space-y-3 max-h-[300px] overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-gray-900 pb-2">
                    <span className="text-xs font-bold text-white uppercase tracking-tight">
                      Cinematic B-Roll Library
                    </span>
                    <span className="text-[9px] font-mono text-gray-500 bg-black/60 border border-gray-850 px-2 py-0.5 rounded">
                      {videoLibrary.length} clips available
                    </span>
                  </div>

                  <div className="space-y-2">
                    {videoLibrary.map(clip => (
                      <div 
                        key={clip.id}
                        className="bg-black/40 border border-gray-850 rounded-lg p-2.5 flex items-start gap-3 justify-between hover:border-gray-800 transition-all"
                      >
                        <div className="flex-1 space-y-1">
                          <p className="text-[10px] font-bold text-gray-200 line-clamp-2 leading-snug">
                            "{clip.prompt}"
                          </p>
                          <div className="flex items-center gap-1.5 text-[8px] font-mono text-gray-500 uppercase">
                            <span>ID: {clip.id.substring(0, 8)}</span>
                            <span>•</span>
                            <span>AR: {clip.aspectRatio}</span>
                          </div>
                        </div>

                        {/* Assign dropdown */}
                        <div className="shrink-0 flex flex-col items-end gap-1.5">
                          <label className="text-[8px] font-mono text-gray-600 uppercase font-bold block">Sync Slot:</label>
                          <select
                            onChange={e => {
                              const val = e.target.value;
                              if (val) {
                                setTimelineSlots(prev => ({
                                  ...prev,
                                  [parseInt(val)]: clip.id
                                }));
                              }
                            }}
                            defaultValue=""
                            className="bg-black text-[9px] font-bold text-amber-500 border border-gray-850 rounded px-1.5 py-1 outline-none cursor-pointer"
                          >
                            <option value="" disabled>Slot...</option>
                            <option value="1">Slot 1 (0-5s)</option>
                            <option value="2">Slot 2 (5-10s)</option>
                            <option value="3">Slot 3 (10-15s)</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* STEP 7: EXPORT / DISTRIBUTION */}
        {pipelineStep === 6 && (
          <div className="space-y-4 text-center py-6">
            <Award className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">
              Barksdale Cinema Export Center
            </h3>
            <p className="text-xs text-gray-400 max-w-lg mx-auto">
              Your movie pipeline bundle has finished calculating parameters. Download the full project state configuration file containing screenplays, cast attributes, lens indices, and master track ratios.
            </p>

            <button
              onClick={handleExportMovieBundle}
              className="comix-btn px-6 py-2.5 text-xs font-bold uppercase inline-flex items-center gap-2 text-black bg-amber-500 border border-amber-600 rounded-lg shadow-md hover:brightness-110 transition-all mt-3"
            >
              <Download className="w-4 h-4 text-black stroke-[2px]" />
              Export Movie Package Bundle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
