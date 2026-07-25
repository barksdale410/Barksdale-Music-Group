import React, { useState } from 'react';
import { Film, Camera, Sparkles, Volume2, BookOpen, Aperture, CheckCircle, Search, Filter, Layers } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import { toast } from '../lib/toast';

export interface DirectorProfile {
  id: string;
  name: string;
  letter: string;
  category: 'auteur' | 'music_video' | 'scifi' | 'noir' | 'anime' | 'classic';
  signature: string;
  cameraAngles: string[];
  lensDefaults: { focalLength: number; aperture: number };
  colorGrade: string;
  quote: string;
  avatar: string;
}

export const DirectorStudio: React.FC = () => {
  const directorsAtoZ: DirectorProfile[] = [
    // A
    {
      id: 'hitchcock',
      name: 'Alfred Hitchcock',
      letter: 'A',
      category: 'classic',
      signature: 'Vertigo Dolly Zoom, MacGuffin Framing & Suspense Cuts',
      cameraAngles: ['Dolly Zoom (Vertigo Effect)', 'Overhead Spiral Staircase', 'Extreme High-Angle Shadow Shot'],
      lensDefaults: { focalLength: 50, aperture: 2.8 },
      colorGrade: 'Technicolor Suspense Contrast',
      quote: 'There is no terror in the bang, only in the anticipation of it.',
      avatar: '🔪'
    },
    {
      id: 'kurosawa',
      name: 'Akira Kurosawa',
      letter: 'A',
      category: 'classic',
      signature: 'Weather Motion, Dynamic Group Geometry & Telephoto Compression',
      cameraAngles: ['Telephoto Rain Tracking Shot', 'Three-Character Triangle Geometry', 'Low-Angle Samurai Standoff'],
      lensDefaults: { focalLength: 85, aperture: 4.0 },
      colorGrade: 'High Contrast Monochromatic Silver',
      quote: 'To be an artist means never to avert one’s eyes.',
      avatar: '⚔️'
    },
    {
      id: 'duvernay',
      name: 'Ava DuVernay',
      letter: 'A',
      category: 'auteur',
      signature: 'Intimate Character Close-ups & Historical Natural Light',
      cameraAngles: ['Slow Push-in Eyeline Close-up', 'Profile Tracking March', 'Soft Halo Backlit Portrait'],
      lensDefaults: { focalLength: 35, aperture: 1.8 },
      colorGrade: 'Warm Golden Naturalism',
      quote: 'If your dream is only about you, it’s too small.',
      avatar: '✊'
    },

    // B
    {
      id: 'bong',
      name: 'Bong Joon-ho',
      letter: 'B',
      category: 'auteur',
      signature: 'Vertical Architectural Framing & Sudden Tonal Shifts',
      cameraAngles: ['Subterranean Stairs Tracking Shot', 'Extreme Low-Angle Table POV', 'Whip Pan Reaction'],
      lensDefaults: { focalLength: 32, aperture: 2.0 },
      colorGrade: 'Cool Wet Slate & Warm Emerald Interiors',
      quote: 'Once you overcome the 1-inch tall barrier of subtitles, you will be introduced to so many more amazing films.',
      avatar: '🍑'
    },
    {
      id: 'luhrmann',
      name: 'Baz Luhrmann',
      letter: 'B',
      category: 'music_video',
      signature: 'Hyper-kinetic Montage, Glittering Flares & Opera Zoom',
      cameraAngles: ['Crash Zoom Spiral', 'Confetti Whirlpool Overhead', 'Fast Whip-Pan Stage Orbit'],
      lensDefaults: { focalLength: 24, aperture: 1.4 },
      colorGrade: 'Ultra-Saturated Royal Gold & Magenta',
      quote: 'Excess is not enough!',
      avatar: '✨'
    },

    // C
    {
      id: 'nolan',
      name: 'Christopher Nolan',
      letter: 'C',
      category: 'scifi',
      signature: '70mm IMAX Anamorphic, Rotating Gravity & Photochemical Practical FX',
      cameraAngles: ['70mm IMAX Anamorphic Master', 'Handheld Cockpit Vibrations', 'Rotating Gravity Horizon'],
      lensDefaults: { focalLength: 65, aperture: 2.8 },
      colorGrade: 'Rich Anamorphic 70mm Photochemical',
      quote: 'An audience wants to feel that the storyteller is taking them somewhere real.',
      avatar: '⏳'
    },
    {
      id: 'coen',
      name: 'Coen Brothers',
      letter: 'C',
      category: 'noir',
      signature: 'Wide Angle Distorted Close-ups & Deadpan Desert Horizons',
      cameraAngles: ['Wide-Angle Low-Angle Facing Shot', 'Creeping Corridor Tracking', 'Desolate Static Wide'],
      lensDefaults: { focalLength: 21, aperture: 2.8 },
      colorGrade: 'Dusty Ochre & Bleached Neon',
      quote: 'There are no bad ideas, only bad executions.',
      avatar: '🎳'
    },

    // D
    {
      id: 'fincher',
      name: 'David Fincher',
      letter: 'D',
      category: 'noir',
      signature: 'Sub-Millimeter Motion Control Tracking, Green-Yellow Shadows & Low-Light Precision',
      cameraAngles: ['Robotic Smooth Pan', 'Doorlock Keyhole POV Tracking', 'Extreme Low-Angle Floor Glide'],
      lensDefaults: { focalLength: 27, aperture: 1.8 },
      colorGrade: 'Desaturated Green-Yellow Cyber Shadow',
      quote: 'I like films that scar. The thing I like about Jaws is I’ve never gone swimming in the ocean again.',
      avatar: '🔦'
    },
    {
      id: 'villeneuve',
      name: 'Denis Villeneuve',
      letter: 'D',
      category: 'scifi',
      signature: 'Monolithic Brutalism, Volumetric Dust & Massive Scale Contrast',
      cameraAngles: ['Extreme Long Shot Scale Contrast', 'Atmospheric Flyover Drone', 'Silhouetted Dune Horizon'],
      lensDefaults: { focalLength: 85, aperture: 4.0 },
      colorGrade: 'Monochromatic Sand & Obsidian Haze',
      quote: 'Filmmaking is about creating an immersive world through space and silence.',
      avatar: '🏜️'
    },
    {
      id: 'lynch',
      name: 'David Lynch',
      letter: 'D',
      category: 'auteur',
      signature: 'Surreal Red Room Curtains, Industrial Noise & Slow Stare',
      cameraAngles: ['Creeping Corner Zoom', 'Extreme Slow Push-in Face', 'Overhead Red Curtain Orbit'],
      lensDefaults: { focalLength: 40, aperture: 1.4 },
      colorGrade: 'Deep Red Velvet & Saturated Night',
      quote: 'Keep your eye on the donut, not the hole.',
      avatar: '☕'
    },

    // E
    {
      id: 'wright',
      name: 'Edgar Wright',
      letter: 'E',
      category: 'music_video',
      signature: 'Rhythmic Beat-Matched Editing, Snap Zooms & Diegetic Sound Transitions',
      cameraAngles: ['Snap Zoom to Object', 'Whip Pan Montage Sequence', 'Steadicam Street Walk Rhythm'],
      lensDefaults: { focalLength: 28, aperture: 2.0 },
      colorGrade: 'Vibrant Comic Book High Contrast',
      quote: 'If you can cut to the beat of the music, you can make magic.',
      avatar: '🎧'
    },

    // F
    {
      id: 'fgarygray',
      name: 'F. Gary Gray',
      letter: 'F',
      category: 'music_video',
      signature: 'High-Octane Street Heists, Hood Realism & Dynamic Low-Riders',
      cameraAngles: ['Low-Angle Hydraulic Bounce POV', 'Car Chase Nose-Cam', 'Sweeping Hood Drone'],
      lensDefaults: { focalLength: 24, aperture: 2.0 },
      colorGrade: 'Warm LA Sunset & Metallic Chrome',
      quote: 'Bring authentic energy and real street culture to every frame.',
      avatar: '🚗'
    },
    {
      id: 'coppola',
      name: 'Francis Ford Coppola',
      letter: 'F',
      category: 'classic',
      signature: 'Chiaroscuro Shadows, Opera Cross-Cutting & Grand Architecture',
      cameraAngles: ['Top-Lit Godfather Shadows', 'Cross-Cut Montage Wide', 'Floating Venetian Gondola POV'],
      lensDefaults: { focalLength: 40, aperture: 1.4 },
      colorGrade: 'Deep Golden Amber Shadows',
      quote: 'Art depends on luck and talent.',
      avatar: '🍷'
    },

    // G
    {
      id: 'gerwig',
      name: 'Greta Gerwig',
      letter: 'G',
      category: 'auteur',
      signature: 'Vibrant Magenta Symmetry, Playful Stage Sets & Empathetic Close-ups',
      cameraAngles: ['Dollhouse Centered Master', 'Symmetrical Tracking Shot', 'Warm Reaction Close-Up'],
      lensDefaults: { focalLength: 35, aperture: 2.0 },
      colorGrade: 'Saturated Magenta & Pastel Sunrise',
      quote: 'I want to make movies that make people feel alive.',
      avatar: '🎀'
    },
    {
      id: 'del_toro',
      name: 'Guillermo del Toro',
      letter: 'G',
      category: 'anime',
      signature: 'Gothic Mechanical Clockwork, Emerald Monsters & Warm Amber Light',
      cameraAngles: ['Clockwork Gear Tracking POV', 'Low-Angle Creature Reveal', 'Gothic Window Silhouette'],
      lensDefaults: { focalLength: 28, aperture: 1.8 },
      colorGrade: 'Emerald Green & Warm Amber Gothic',
      quote: 'Monsters are the patron saints of our blissful imperfections.',
      avatar: '👹'
    },

    // H
    {
      id: 'hype',
      name: 'Hype Williams',
      letter: 'H',
      category: 'music_video',
      signature: '15mm Ultra-Wide Fisheye & Cyber Neon Reflections',
      cameraAngles: ['Extreme Low Angle Fisheye', 'Tracking Dolly in Wind Tunnel', 'Dynamic Orbit Shot'],
      lensDefaults: { focalLength: 15, aperture: 1.4 },
      colorGrade: 'High Saturation Cyber Neon',
      quote: 'Making music videos isn’t making movies, it’s building a whole visual language.',
      avatar: '🕶️'
    },
    {
      id: 'miyazaki',
      name: 'Hayao Miyazaki',
      letter: 'H',
      category: 'anime',
      signature: 'Lush Painterly Cloudscapes, Flying Sequences & Gentle Quiet Moments (Ma)',
      cameraAngles: ['Soaring Aerial Cloud Sweep', 'Gentle Wind In Grass Static Wide', 'Eye-Level Creature Encounter'],
      lensDefaults: { focalLength: 35, aperture: 2.8 },
      colorGrade: 'Lush Hand-Painted Cerulean & Forest Green',
      quote: 'Yet, even in the midst of hatred and carnage, life is still worth living.',
      avatar: '🐉'
    },

    // J
    {
      id: 'peele',
      name: 'Jordan Peele',
      letter: 'J',
      category: 'noir',
      signature: 'The Sunken Place Teary Eye Close-Up & Uncanny Sky Intrusions',
      cameraAngles: ['Sunken Place Floating Reverse POV', 'Extreme Wide Sky Intrusive Threat', 'Symmetrical Doorway Shadow'],
      lensDefaults: { focalLength: 40, aperture: 1.8 },
      colorGrade: 'Deep Midnight Blue & Eerie Golden Glow',
      quote: 'The best horror movies are based on real human trauma.',
      avatar: '👁️'
    },
    {
      id: 'carpenter',
      name: 'John Carpenter',
      letter: 'J',
      category: 'noir',
      signature: '2.35:1 Panavision Anamorphic, Steadicam Stalking & Heavy Synth Bass',
      cameraAngles: ['2.35:1 Anamorphic Stalking POV', 'Steadicam Suburban Night Walk', 'Silhouetted Doorway Threat'],
      lensDefaults: { focalLength: 35, aperture: 2.0 },
      colorGrade: 'Cold Synthetic Blue & Blood Red Flares',
      quote: 'In France, I’m an auteur; in Germany, a filmmaker; in Britain, a genre director; in the USA, a bum.',
      avatar: '🎃'
    },

    // K
    {
      id: 'kubrick',
      name: 'Stanley Kubrick',
      letter: 'K',
      category: 'classic',
      signature: 'One-Point Perspective, Perfect Symmetry & Slow Creeping Zoom',
      cameraAngles: ['One-Point Perspective Center', 'Slow Creeping Zoom In', 'Tracking Hotel Corridor'],
      lensDefaults: { focalLength: 35, aperture: 2.8 },
      colorGrade: 'Sterile Monochromatic & Vivid Red Accents',
      quote: 'If it can be written, or thought, it can be filmed.',
      avatar: '📐'
    },
    {
      id: 'otomo',
      name: 'Katsuhiro Otomo',
      letter: 'K',
      category: 'anime',
      signature: 'Cyberpunk Neo-Tokyo Explosions, Tail Light Trails & Biomechanical Decay',
      cameraAngles: ['Low-Angle Motorcycle Tail Light Streak', 'Crater Edge Scale View', 'Biomechanical Mutation Zoom'],
      lensDefaults: { focalLength: 18, aperture: 1.4 },
      colorGrade: 'Neo-Tokyo Crimson & Laser Cyan',
      quote: 'The city is a living organism waiting for its awakening.',
      avatar: '🏍️'
    },

    // L
    {
      id: 'lee',
      name: 'Spike Lee',
      letter: 'L',
      category: 'auteur',
      signature: 'Signature Double-Dolly Character Glide, High Contrast Heatwave & Dutch Angles',
      cameraAngles: ['Double-Dolly Floating Character Glide', 'Dutch Tilt Low Angle', 'Direct Address Mirror Speech'],
      lensDefaults: { focalLength: 28, aperture: 1.8 },
      colorGrade: 'Saturated Orange Brooklyn Heatwave',
      quote: 'Wake up! Fight the power and capture the truth.',
      avatar: '📢'
    },
    {
      id: 'besson',
      name: 'Luc Besson',
      letter: 'L',
      category: 'scifi',
      signature: 'Hyper-Stylized Futurology, Cyber Taxi Chases & Vibrant Neon Costumes',
      cameraAngles: ['Vertical Sky Taxi Pursuit', 'Fast Tracking Weapon Draw', 'Wide Futuristic Metropolis View'],
      lensDefaults: { focalLength: 24, aperture: 1.8 },
      colorGrade: 'High Saturation Yellow & Electric Blue',
      quote: 'Cinema is about dreams that come alive in 24 frames per second.',
      avatar: '🚖'
    },

    // M
    {
      id: 'scorsese',
      name: 'Martin Scorsese',
      letter: 'M',
      category: 'auteur',
      signature: 'Fast Freeze-Frames, Steadicam Copacabana Long Takes & Rapid Tracking Cuts',
      cameraAngles: ['Steadicam Copacabana Entrance Take', 'Freeze Frame Narrator Cut', 'Fast Crash Zoom Reaction'],
      lensDefaults: { focalLength: 35, aperture: 2.0 },
      colorGrade: 'Vibrant Saturated Neon & Crimson Red',
      quote: 'Cinema is a matter of what’s in the frame and what’s out.',
      avatar: '🎬'
    },
    {
      id: 'shyamalan',
      name: 'M. Night Shyamalan',
      letter: 'M',
      category: 'noir',
      signature: 'Reflection POV, Extended Static Unbroken Master & Twist Ending Setup',
      cameraAngles: ['Mirror/Glass Reflection Close-Up', 'Unbroken Doorway Master', 'Low-Angle Discovery Tilt'],
      lensDefaults: { focalLength: 40, aperture: 2.5 },
      colorGrade: 'Subdued Cold Muted Tones',
      quote: 'The twist is only good if the journey before it was meaningful.',
      avatar: '🌀'
    },

    // P
    {
      id: 'pta',
      name: 'Paul Thomas Anderson',
      letter: 'P',
      category: 'auteur',
      signature: 'Whip-Pan Dialogue Swings, Long Steadicam Tracking & Vintage 35mm Grain',
      cameraAngles: ['Whip-Pan Rapid Dialogue Swivel', 'Long Steadicam Pool Party', 'Extreme Close-Up Intense Gaze'],
      lensDefaults: { focalLength: 50, aperture: 1.8 },
      colorGrade: 'Rich 35mm Photochemical Warm Grain',
      quote: 'You just have to keep moving forward and let the story guide the lens.',
      avatar: '📼'
    },

    // Q
    {
      id: 'tarantino',
      name: 'Quentin Tarantino',
      letter: 'Q',
      category: 'noir',
      signature: 'Trunk Shots, Extreme Close-up Eyes & 35mm Kodachrome Blood Flares',
      cameraAngles: ['Trunk Shot Looking Up', 'Extreme Close-Up Eyes (Spaghetti Western)', 'Crash Zoom Reaction'],
      lensDefaults: { focalLength: 50, aperture: 2.0 },
      colorGrade: 'Vibrant Warm 70s Kodachrome',
      quote: 'I don’t go to film school, I go to the movies.',
      avatar: '🩸'
    },

    // R
    {
      id: 'scott',
      name: 'Ridley Scott',
      letter: 'R',
      category: 'scifi',
      signature: 'Atmospheric Smoke, Volumetric Searchlights & Cyberpunk Industrial Rain',
      cameraAngles: ['Volumetric Searchlight Sweep', 'Industrial Alleyway Rain Static Wide', 'Close-Up Helmet Reflection'],
      lensDefaults: { focalLength: 85, aperture: 2.8 },
      colorGrade: 'Cyberpunk Cyan Smoke & Neon Orange',
      quote: 'Filmmaking is 80% casting and 20% getting out of the way.',
      avatar: '🏙️'
    },

    // S
    {
      id: 'spielberg',
      name: 'Steven Spielberg',
      letter: 'S',
      category: 'classic',
      signature: 'The Spielberg Face Wonder Glow, Over-the-Shoulder Tracking & Flashlight Beams',
      cameraAngles: ['Spielberg Face Awe Slow Push-In', 'Flashlight Beam Fog Piercing', 'Multi-Layer Foreground Master'],
      lensDefaults: { focalLength: 28, aperture: 2.0 },
      colorGrade: 'Warm Golden Nostalgia & Lens Flares',
      quote: 'Every time I go to a movie, it’s magic, no matter what the movie’s about.',
      avatar: '🦖'
    },

    // T
    {
      id: 'burton',
      name: 'Tim Burton',
      letter: 'T',
      category: 'anime',
      signature: 'Expressionist Gothic Spiral Hill, Pale Characters & Striped Geometry',
      cameraAngles: ['Spiral Hill Moon Silhouette', 'Gothic Castle Low Angle', 'Distorted Eye Close-Up'],
      lensDefaults: { focalLength: 24, aperture: 2.8 },
      colorGrade: 'Monochromatic Gothic & Deep Violet',
      quote: 'One person’s craziness is another person’s reality.',
      avatar: '🦇'
    },

    // W
    {
      id: 'anderson',
      name: 'Wes Anderson',
      letter: 'W',
      category: 'auteur',
      signature: 'Obsessive Symmetrical Planar Framing, Pastel Palette & Flat Whip-Pans',
      cameraAngles: ['Planar Centered 90-Degree Whip-Pan', 'Overhead Flat Lay Inspection', 'Pastel Symmetrical Master'],
      lensDefaults: { focalLength: 40, aperture: 4.0 },
      colorGrade: 'Pastel Yellow, Coral & Mint Green',
      quote: 'That’s the kind of movie I like to make—one where every detail has a reason.',
      avatar: '🏨'
    },
    {
      id: 'wongkarwai',
      name: 'Wong Kar-wai',
      letter: 'W',
      category: 'music_video',
      signature: 'Step-Printed Slow Motion, Neon Smear & Intimate Alleyway Reflections',
      cameraAngles: ['Step-Printed Motion Smear Sweep', 'Narrow Alleyway Neon Reflection', 'Framed Through Raindrop Glass'],
      lensDefaults: { focalLength: 50, aperture: 1.2 },
      colorGrade: 'Saturated Emerald & Amber Hong Kong Glow',
      quote: 'To love someone is to accept that you will eventually be hurt.',
      avatar: '🍜'
    },

    // Z
    {
      id: 'snyder',
      name: 'Zack Snyder',
      letter: 'Z',
      category: 'scifi',
      signature: 'Speed-Ramping Slow Motion to Fast Zoom, De-saturated Desaturation & High Contrast Muscle Geometry',
      cameraAngles: ['Speed-Ramping Impact Slow-Mo', 'Desaturated High-Contrast Low-Angle', 'Dynamic Cape Flow Tracking'],
      lensDefaults: { focalLength: 50, aperture: 1.4 },
      colorGrade: 'High Contrast Desaturated Steel Blue',
      quote: 'I like things that are big and visceral.',
      avatar: '⚡'
    }
  ];

  const alphabet = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  const [selectedDirector, setSelectedDirector] = useState<DirectorProfile>(directorsAtoZ[14]); // Hype Williams
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [focalLength, setFocalLength] = useState<number>(selectedDirector.lensDefaults.focalLength);
  const [aperture, setAperture] = useState<number>(selectedDirector.lensDefaults.aperture);
  const [scenePrompt, setScenePrompt] = useState<string>('Rain pouring on a flashing neon sign in a Brooklyn alleyway at midnight');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [scriptResult, setScriptResult] = useState<any>(null);
  const [showEncyclopedia, setShowEncyclopedia] = useState<boolean>(false);

  const filteredDirectors = directorsAtoZ.filter((dir) => {
    const matchesLetter = selectedLetter === 'ALL' || dir.letter === selectedLetter;
    const matchesCat = selectedCategory === 'ALL' || dir.category === selectedCategory;
    const matchesSearch =
      dir.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dir.signature.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dir.colorGrade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLetter && matchesCat && matchesSearch;
  });

  const handleSelectDirector = (dir: DirectorProfile) => {
    setSelectedDirector(dir);
    setFocalLength(dir.lensDefaults.focalLength);
    setAperture(dir.lensDefaults.aperture);
    toast.show(`A-Z AUTEUR DIRECTOR SELECTED: ${dir.name.toUpperCase()}`, 'info');
  };

  const handleGenerateScriptBreakdown = async () => {
    if (!scenePrompt.trim()) return;
    setIsGenerating(true);
    toast.show(`DISPATCHING SCRIPT SUPERVISOR TO GEMINI AI...`, 'info');

    try {
      const res = await fetch('/api/gemini/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: scenePrompt,
          director: selectedDirector.name,
          genre: selectedDirector.colorGrade
        })
      });

      const data = await res.json();
      if (data.success) {
        setScriptResult(data);
        toast.show('AUTEUR SHOT BREAKDOWN GENERATED!', 'success');
      }
    } catch (e) {
      toast.show('SCRIPT GENERATION FALLBACK ACTIVATED', 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVoiceAudition = (text: string) => {
    toast.show(`DIRECTOR VOICE AUDITION: "${selectedDirector.name}"`, 'info');
    audioEngine.speakDirectorAudition(text);
  };

  return (
    <div className="bg-[#121318] border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] p-6 text-white space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-400 text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-md border border-amber-500/30 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" /> A-Z AUTEUR DIRECTORS ROSTER
            </span>
            <span className="text-xs font-mono text-gray-400">{directorsAtoZ.length} LEGENDARY DIRECTORS</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1.5 uppercase tracking-wide">
            A-Z DIRECTOR STUDIO & VIEWFINDER TRANSFORMER
          </h2>
        </div>

        <button
          onClick={() => setShowEncyclopedia(!showEncyclopedia)}
          className="bg-black/60 border border-amber-500/40 text-amber-400 px-4 py-2 rounded-xl text-xs font-extrabold uppercase flex items-center gap-2 hover:bg-amber-500/20 transition-all"
        >
          <BookOpen className="w-4 h-4" />
          <span>{showEncyclopedia ? 'HIDE ENCYCLOPEDIA' : 'FILM ENCYCLOPEDIA'}</span>
        </button>
      </div>

      {/* FILTER CONTROLS: A-Z JUMP BAR & CATEGORY SELECTOR */}
      <div className="space-y-3 bg-[#171821] p-4 rounded-xl border border-gray-800">
        
        {/* SEARCH & CATEGORY ROW */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* SEARCH INPUT */}
          <div className="flex items-center gap-2 bg-black/80 border border-gray-800 px-3 py-2 rounded-xl w-full md:w-72">
            <Search className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="text"
              placeholder="Search Director A-Z..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs font-mono text-white focus:outline-none w-full"
            />
          </div>

          {/* CATEGORY PILLS */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: 'ALL GENRES' },
              { id: 'auteur', label: 'AUTEUR' },
              { id: 'music_video', label: 'MUSIC VIDEO / NEON' },
              { id: 'scifi', label: 'SCI-FI & ACTION' },
              { id: 'noir', label: 'NOIR & THRILLER' },
              { id: 'anime', label: 'ANIME & FANTASY' },
              { id: 'classic', label: 'CLASSIC CINEMA' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all shrink-0 border ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-black/50 text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* A-Z ALPHABET JUMP BUTTONS */}
        <div className="flex items-center gap-1 overflow-x-auto pt-1 pb-1">
          {alphabet.map((char) => (
            <button
              key={char}
              onClick={() => setSelectedLetter(char)}
              className={`w-7 h-7 shrink-0 rounded-lg text-xs font-mono font-black transition-all border ${
                selectedLetter === char
                  ? 'bg-amber-500 text-black border-amber-400 scale-110 shadow'
                  : 'bg-black/60 text-gray-400 border-gray-800 hover:text-white'
              }`}
            >
              {char}
            </button>
          ))}
        </div>

      </div>

      {/* DIRECTORS CAROUSEL GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-64 overflow-y-auto pr-1">
        {filteredDirectors.map((dir) => {
          const isSelected = selectedDirector.id === dir.id;
          return (
            <button
              key={dir.id}
              onClick={() => handleSelectDirector(dir)}
              className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center ${
                isSelected
                  ? 'bg-amber-500 text-black border-amber-400 shadow-lg scale-105 font-black'
                  : 'bg-[#171821] border-gray-800 hover:border-amber-500/50 text-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{dir.avatar}</div>
              <div className="text-xs font-black truncate w-full uppercase">{dir.name}</div>
              <div className={`text-[8px] font-mono mt-0.5 truncate w-full ${isSelected ? 'text-black/80 font-bold' : 'text-amber-400'}`}>
                [{dir.letter}] {dir.signature.split('&')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* SELECTED DIRECTOR VIEWFINDER TRANSFORMER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLS: VIEWFINDER CONTROLS & AI SCENE TRANSFORMER */}
        <div className="lg:col-span-2 space-y-5 bg-[#171821] border-2 border-black rounded-xl p-5 shadow-[2px_2px_0px_0px_#000]">
          
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <Aperture className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-black uppercase font-mono">
                {selectedDirector.name} Viewfinder & Lens Simulation
              </span>
            </div>
            <button
              onClick={() => handleVoiceAudition(selectedDirector.quote)}
              className="text-[10px] font-mono text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded border border-amber-500/30 flex items-center gap-1 font-bold"
            >
              <Volume2 className="w-3 h-3" /> AUDITION VOICE
            </button>
          </div>

          <p className="text-xs font-mono text-gray-300 italic bg-black/40 p-3 rounded-lg border border-gray-850">
            "{selectedDirector.quote}"
          </p>

          {/* LENS FOCAL LENGTH & APERTURE SLIDERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/60 p-4 rounded-xl border border-gray-800">
            <div>
              <div className="flex justify-between items-center text-xs font-mono font-bold mb-1.5 text-amber-400">
                <span>FOCAL LENGTH</span>
                <span>{focalLength}mm Lens</span>
              </div>
              <input
                type="range"
                min="15"
                max="135"
                step="5"
                value={focalLength}
                onChange={(e) => setFocalLength(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[8px] font-mono text-gray-500 mt-1">
                <span>15mm (Ultra Wide)</span>
                <span>50mm (Standard)</span>
                <span>135mm (Telephoto)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-mono font-bold mb-1.5 text-amber-400">
                <span>APERTURE (DEPTH OF FIELD)</span>
                <span>f/{aperture}</span>
              </div>
              <input
                type="range"
                min="1.2"
                max="11"
                step="0.2"
                value={aperture}
                onChange={(e) => setAperture(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[8px] font-mono text-gray-500 mt-1">
                <span>f/1.2 (Shallow Bokeh)</span>
                <span>f/4.0 (Medium)</span>
                <span>f/11 (Deep Focus)</span>
              </div>
            </div>
          </div>

          {/* RAW SCENE IDEA INPUT */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-300 font-mono block">
              INPUT RAW SCENE IDEA FOR GEMINI DIRECTORIAL BREAKDOWN:
            </label>
            <textarea
              rows={2}
              value={scenePrompt}
              onChange={(e) => setScenePrompt(e.target.value)}
              className="w-full bg-black/80 border border-gray-800 rounded-xl p-3 text-sm font-bold text-white focus:outline-none focus:border-amber-500 font-mono"
            />
            <button
              onClick={handleGenerateScriptBreakdown}
              disabled={isGenerating}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>{isGenerating ? 'TRANSFORMING SCENE WITH GEMINI AI...' : `GENERATE ${selectedDirector.name.toUpperCase()} SHOT BREAKDOWN`}</span>
            </button>
          </div>

        </div>

        {/* RIGHT COL: GENERATED SHOT BREAKDOWN OR DIRECTORIAL SPECS */}
        <div className="bg-[#171821] border-2 border-black rounded-xl p-5 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="text-xs font-black uppercase text-amber-400 font-mono border-b border-gray-800 pb-2 mb-3 flex items-center gap-2">
              <Film className="w-4 h-4" />
              <span>{scriptResult ? scriptResult.title : `${selectedDirector.name} Directorial Specs`}</span>
            </div>

            {scriptResult ? (
              <div className="space-y-3">
                <div className="bg-black/60 p-3 rounded-lg border border-gray-850">
                  <div className="text-[10px] font-mono text-amber-500 font-bold uppercase">DIRECTOR NOTES</div>
                  <div className="text-xs font-mono text-gray-200 mt-1">{scriptResult.directorNotes}</div>
                </div>

                <div className="text-[10px] font-mono text-amber-500 font-bold uppercase mt-2">AUTEUR SHOT LIST:</div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {scriptResult.shotBreakdown?.map((shot: any, idx: number) => (
                    <div key={idx} className="bg-black/80 p-2.5 rounded-lg border border-gray-800 text-xs font-mono space-y-1">
                      <div className="flex justify-between font-bold text-amber-400">
                        <span>SHOT #{shot.shotNumber}: {shot.cameraAngle}</span>
                        <span>{shot.focalLength}</span>
                      </div>
                      <div className="text-gray-300 text-[11px]">{shot.actionDescription}</div>
                      <div className="text-[9px] text-emerald-400 bg-emerald-500/10 p-1 rounded font-bold">
                        VEO PROMPT: {shot.veoPrompt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs font-mono text-gray-300">
                <div className="bg-black/40 p-3 rounded-lg border border-gray-850">
                  <div className="text-[10px] font-bold text-amber-400 uppercase">SIGNATURE VISUAL STYLE</div>
                  <div className="mt-1 font-bold text-white">{selectedDirector.signature}</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">KEY CAMERA ANGLES</div>
                  <ul className="mt-1.5 space-y-1">
                    {selectedDirector.cameraAngles.map((angle, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-300">
                        <CheckCircle className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>{angle}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-black/40 p-3 rounded-lg border border-gray-850">
                  <div className="text-[10px] font-bold text-amber-400 uppercase">COLOR GRADE PROFILE</div>
                  <div className="mt-1 font-bold text-white">{selectedDirector.colorGrade}</div>
                </div>
              </div>
            )}
          </div>

          {scriptResult && (
            <button
              onClick={() => {
                if (scriptResult?.directorNotes) {
                  handleVoiceAudition(scriptResult.directorNotes);
                }
              }}
              className="mt-4 w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all font-mono"
            >
              <Volume2 className="w-4 h-4" />
              <span>AUDITION SCRIPT READ</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
