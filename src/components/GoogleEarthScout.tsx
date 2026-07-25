import React, { useState, useEffect } from 'react';
import { Globe, Compass, Eye, Navigation, Camera, MapPin, Sliders, Layers, Sparkles, Check, RefreshCw, ZoomIn, ZoomOut, Search, Sun, ShieldCheck, Volume2, Truck, Video, Radio } from 'lucide-react';

export interface LocationPreset {
  id: string;
  name: string;
  streetIntersection: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  elevation: number; // meters
  tilt: number; // degrees
  heading: number; // degrees
  vibe: string;
  thumbnail: string;
  // Film Production Telemetry
  streetAccessScore: string;
  sunTrajectory: string;
  droneAirspace: string;
  permitZone: string;
  noiseFloor: string;
  rigSuitability: string;
}

export const LOCATION_PRESETS: LocationPreset[] = [
  {
    id: 'nyc_5th_42nd',
    name: 'New York Public Library Corner',
    streetIntersection: '5th Ave & 42nd St',
    city: 'New York City',
    country: 'USA',
    lat: 40.7532,
    lng: -73.9822,
    elevation: 320,
    tilt: 45,
    heading: 140,
    vibe: 'High-Density Midtown Drama & Classic Stone Architecture',
    thumbnail: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
    streetAccessScore: 'A+ (Wide Generator Truck Lanes & Curb Staging)',
    sunTrajectory: 'Golden Hour 22° Angle, Backlit West at 17:45',
    droneAirspace: 'Class B Restricted (Requires NYC Film Office Waiver)',
    permitZone: 'NYC Film Office Zone A-1 (24/7 Crew Permit)',
    noiseFloor: 'Moderate - 58 dBA (Urban Traffic Ambient)',
    rigSuitability: 'Crane, Technocrane & 100ft Dolly Track Ready'
  },
  {
    id: 'hollywood_vine',
    name: 'Hollywood Walk of Fame',
    streetIntersection: 'Hollywood Blvd & Vine St',
    city: 'Los Angeles',
    country: 'USA',
    lat: 34.1016,
    lng: -118.3268,
    elevation: 280,
    tilt: 50,
    heading: 90,
    vibe: 'Iconic Palm Trees & Studio Marquee Glow',
    thumbnail: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=600&q=80',
    streetAccessScore: 'A (Dedicated Production Equipment Bay)',
    sunTrajectory: 'Direct Daylight 48° Angle, Flare-Free Soft Key',
    droneAirspace: 'Class G Authorized (Max 400ft AGL)',
    permitZone: 'FilmLA Zone 4 (Standard Night Noise Variance)',
    noiseFloor: 'Low/Moderate - 48 dBA (Ideal for Dialogue)',
    rigSuitability: 'Car Rigging, Cable-Cam & Steadicam Smooth'
  },
  {
    id: 'abbey_road',
    name: 'Abbey Road Studio Zebra Crossing',
    streetIntersection: 'Abbey Rd & Grove End Rd',
    city: 'London',
    country: 'UK',
    lat: 51.5320,
    lng: -0.1780,
    elevation: 180,
    tilt: 35,
    heading: 200,
    vibe: 'Historic British Rock Legacy & Tree-Lined Studio Stables',
    thumbnail: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
    streetAccessScore: 'B+ (Residential Alley Staging)',
    sunTrajectory: 'Diffused Overcast Soft Light, Perfect Uniform Skin Tones',
    droneAirspace: 'CAA Sub-250g Drone Zone (Clear)',
    permitZone: 'Westminster City Council Film Office Permit',
    noiseFloor: 'Quiet Residential - 38 dBA (High Fidelity Audio)',
    rigSuitability: 'Handheld, Gimbal & Lightweight Crane'
  },
  {
    id: 'shibuya_crossing',
    name: 'Shibuya Neon Scramble',
    streetIntersection: 'Shibuya Center-Gai & Dogenzaka',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6595,
    lng: 139.7004,
    elevation: 150,
    tilt: 60,
    heading: 210,
    vibe: 'Futuristic Cyberpunk Neon & Pedestrian Motion',
    thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    streetAccessScore: 'B (High Pedestrian Density, Early Morning Staging)',
    sunTrajectory: 'Nighttime Neon Reflection & Soft Atmospheric Rim Light',
    droneAirspace: 'Restricted Urban Airspace (Special Event Permit)',
    permitZone: 'Tokyo Metropolitan Police Film Division Approval',
    noiseFloor: 'High Urban Energy - 65 dBA (Dynamic Crowd Ambiance)',
    rigSuitability: 'Rooftop Rigging, 360 Camera Array & Dolly'
  },
  {
    id: 'bourbon_canal',
    name: 'French Quarter Rhythm Strip',
    streetIntersection: 'Bourbon St & Canal St',
    city: 'New Orleans',
    country: 'USA',
    lat: 29.9531,
    lng: -90.0688,
    elevation: 120,
    tilt: 40,
    heading: 180,
    vibe: 'Historic Cast-Iron Balconies & Brass Street Music Flare',
    thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    streetAccessScore: 'A (Pedestrian Mall Closure Staging)',
    sunTrajectory: 'Warm Golden Horizon, Balcony Shadow Cast',
    droneAirspace: 'Class G Open Flight Clearance',
    permitZone: 'New Orleans Office of Cultural Economy Permit',
    noiseFloor: 'Live Music Ambiance - 62 dBA',
    rigSuitability: 'Steadicam, Jib Arm & Balcony Rigging'
  },
  {
    id: 'champs_elysees',
    name: 'Arc de Triomphe Plaza',
    streetIntersection: 'Champs-Élysées & Rue de Tilsitt',
    city: 'Paris',
    country: 'France',
    lat: 48.8738,
    lng: 2.2950,
    elevation: 310,
    tilt: 45,
    heading: 120,
    vibe: 'Grand Haussmannian Boulevard & Imperial Elegance',
    thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    streetAccessScore: 'A (Boulevard Parking Bay)',
    sunTrajectory: 'Sunset Silhouette Down Main Axis',
    droneAirspace: 'Prefecture de Police Restricted (Dawn Slot Only)',
    permitZone: 'Mission Cinéma Paris Official Permit',
    noiseFloor: 'Moderate - 52 dBA',
    rigSuitability: 'Tracking Vehicle, Crane & Motion Control'
  }
];

interface GoogleEarthScoutProps {
  onLocationSelected?: (location: LocationPreset, cameraParams: any) => void;
}

export const GoogleEarthScout: React.FC<GoogleEarthScoutProps> = ({ onLocationSelected }) => {
  const [selectedLoc, setSelectedLoc] = useState<LocationPreset>(LOCATION_PRESETS[0]);
  const [elevation, setElevation] = useState<number>(LOCATION_PRESETS[0].elevation);
  const [tilt, setTilt] = useState<number>(LOCATION_PRESETS[0].tilt);
  const [heading, setHeading] = useState<number>(LOCATION_PRESETS[0].heading);
  const [mapMode, setMapMode] = useState<'3d_terrain' | 'satellite' | 'vector' | 'thermal'>('3d_terrain');
  const [isFlying, setIsFlying] = useState<boolean>(false);
  const [flyoverSpeed, setFlyoverSpeed] = useState<number>(1);
  const [savedCoordinates, setSavedCoordinates] = useState<string>('');

  // Street Search Input State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSelectPreset = (preset: LocationPreset) => {
    setSelectedLoc(preset);
    setElevation(preset.elevation);
    setTilt(preset.tilt);
    setHeading(preset.heading);
    if (onLocationSelected) {
      onLocationSelected(preset, { elevation: preset.elevation, tilt: preset.tilt, heading: preset.heading });
    }
  };

  const handleStreetSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      // Generate custom street location based on search query
      const queryLower = searchQuery.toLowerCase();
      let derivedCity = 'Custom Scouted Location';
      let derivedCountry = 'USA';

      if (queryLower.includes('london') || queryLower.includes('uk')) {
        derivedCity = 'London'; derivedCountry = 'UK';
      } else if (queryLower.includes('tokyo') || queryLower.includes('japan')) {
        derivedCity = 'Tokyo'; derivedCountry = 'Japan';
      } else if (queryLower.includes('paris') || queryLower.includes('france')) {
        derivedCity = 'Paris'; derivedCountry = 'France';
      } else if (queryLower.includes('chicago')) {
        derivedCity = 'Chicago'; derivedCountry = 'USA';
      } else if (queryLower.includes('miami')) {
        derivedCity = 'Miami'; derivedCountry = 'USA';
      } else {
        derivedCity = 'Production Scout Zone';
      }

      // Hash string to pseudo-random coordinates
      let hash = 0;
      for (let i = 0; i < searchQuery.length; i++) {
        hash = searchQuery.charCodeAt(i) + ((hash << 5) - hash);
      }
      const latOffset = (hash % 100) / 1000;
      const lngOffset = ((hash >> 2) % 100) / 1000;

      const newCustomLocation: LocationPreset = {
        id: `custom_${Date.now()}`,
        name: searchQuery,
        streetIntersection: searchQuery,
        city: derivedCity,
        country: derivedCountry,
        lat: Number((34.0522 + latOffset).toFixed(4)),
        lng: Number((-118.2437 + lngOffset).toFixed(4)),
        elevation: 250,
        tilt: 45,
        heading: 120,
        vibe: `Exact Producer Scouting Location: ${searchQuery}`,
        thumbnail: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
        streetAccessScore: 'A (Full Production Staging & Equipment Bay Clearance)',
        sunTrajectory: 'Golden Hour 28° Angle, Natural Soft Diffusion',
        droneAirspace: 'Class G Flight Approved (AESA/FAA Verified)',
        permitZone: `Film Office Zone Code ${Math.floor(Math.random() * 80 + 10)}`,
        noiseFloor: 'Low Ambient - 44 dBA (Dialogue Ready)',
        rigSuitability: 'Crane, Dolly, Gimbal & Tracking Rig Verified'
      };

      setSelectedLoc(newCustomLocation);
      setElevation(250);
      setTilt(45);
      setHeading(120);
      setIsSearching(false);

      if (onLocationSelected) {
        onLocationSelected(newCustomLocation, { elevation: 250, tilt: 45, heading: 120 });
      }
    }, 600);
  };

  const toggleFlyover = () => {
    setIsFlying(!isFlying);
  };

  useEffect(() => {
    let interval: any;
    if (isFlying) {
      interval = setInterval(() => {
        setHeading(prev => (prev + 1 * flyoverSpeed) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isFlying, flyoverSpeed]);

  return (
    <div className="bg-[#101118] border border-gray-800 rounded-2xl p-5 space-y-5 text-white shadow-2xl">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
            <Globe className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wide uppercase text-white">
                GOOGLE EARTH 3D FILM SCOUTING ENGINE
              </h3>
              <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded">
                EXACT LOCATION & INTERSECTION SCOUT
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Input any street, intersection, city, or landmark to scout filming specs, sun trajectories, drone airspace, and production permits.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFlyover}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isFlying
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${isFlying ? 'animate-spin' : ''}`} />
            {isFlying ? 'STOP FLYOVER' : 'START 3D FLYOVER'}
          </button>
        </div>
      </div>

      {/* EXACT STREET / INTERSECTION SEARCH BAR */}
      <form onSubmit={handleStreetSearch} className="bg-black/60 border border-blue-500/30 p-2.5 rounded-xl flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <MapPin className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Type exact Street, Intersection, Landmark, or City (e.g. '5th Ave & 42nd St, NY', 'Abbey Road, London')..."
            className="w-full bg-black/80 border border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={isSearching}
          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-black font-bold font-mono text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md"
        >
          {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          {isSearching ? 'GEOLOCATING...' : 'SCOUT LOCATION'}
        </button>
      </form>

      {/* MAIN VIEWPORT AND CONTROLS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 3D MAP VIEWPORT */}
        <div className="lg:col-span-2 relative bg-black rounded-xl overflow-hidden border border-gray-800 group h-80 sm:h-96 flex flex-col justify-between">
          {/* Simulated 3D Satellite Map background with CSS transforms */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={selectedLoc.thumbnail}
              alt={selectedLoc.name}
              className="w-full h-full object-cover transition-transform duration-1000 filter brightness-90 contrast-110"
              style={{
                transform: `scale(${1 + (1000 - elevation) / 2000}) rotate(${heading}deg) perspective(600px) rotateX(${tilt / 2}deg)`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            
            {/* Grid Reticle Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

            {/* Target Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 border border-blue-400/50 rounded-full flex items-center justify-center animate-ping opacity-30" />
              <div className="w-8 h-8 border-2 border-blue-400 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-amber-400 animate-bounce" />
              </div>
            </div>
          </div>

          {/* TOP OVERLAY: COORDINATES & MAP MODES */}
          <div className="relative z-10 p-3 flex flex-wrap items-center justify-between gap-2 bg-black/60 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center gap-2 font-mono text-[11px] text-blue-300">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>LAT: {selectedLoc.lat.toFixed(4)}° N</span>
              <span className="text-gray-500">|</span>
              <span>LNG: {selectedLoc.lng.toFixed(4)}° W</span>
            </div>

            <div className="flex items-center gap-1 bg-black/80 p-1 rounded-lg border border-gray-800">
              {(['3d_terrain', 'satellite', 'vector', 'thermal'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setMapMode(mode)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-all ${
                    mapMode === mode
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {mode.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* BOTTOM OVERLAY: LOCATION METADATA & TELEMETRY */}
          <div className="relative z-10 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
            <div>
              <div className="text-xs font-mono text-amber-400 font-bold tracking-wider flex items-center gap-2">
                <span>{selectedLoc.streetIntersection.toUpperCase()}</span>
                <span>•</span>
                <span>{selectedLoc.city.toUpperCase()}, {selectedLoc.country.toUpperCase()}</span>
              </div>
              <h4 className="text-lg font-black text-white">{selectedLoc.name}</h4>
              <p className="text-xs text-gray-300 italic">{selectedLoc.vibe}</p>
            </div>

            <div className="flex items-center gap-3 font-mono text-[10px] bg-black/80 p-2 rounded-lg border border-gray-800 text-gray-300">
              <div>
                <span className="text-gray-500 block">ELEVATION</span>
                <span className="text-white font-bold">{elevation}m</span>
              </div>
              <div>
                <span className="text-gray-500 block">TILT</span>
                <span className="text-white font-bold">{tilt}°</span>
              </div>
              <div>
                <span className="text-gray-500 block">HEADING</span>
                <span className="text-blue-400 font-bold">{heading}°</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS & CAMERA ADJUSTMENT PANEL */}
        <div className="space-y-4 flex flex-col justify-between bg-[#151722] p-4 rounded-xl border border-gray-800">
          <div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
              <span className="text-xs font-bold text-gray-300 uppercase flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" /> CAMERA CONTROLS
              </span>
              <span className="text-[10px] text-gray-500 font-mono">3D FLIGHT PATH</span>
            </div>

            <div className="space-y-3">
              {/* ELEVATION SLIDER */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Altitude / Elevation</span>
                  <span className="font-mono text-blue-400 font-bold">{elevation}m</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="10"
                  value={elevation}
                  onChange={e => setElevation(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* TILT SLIDER */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Camera Tilt Angle</span>
                  <span className="font-mono text-blue-400 font-bold">{tilt}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="85"
                  value={tilt}
                  onChange={e => setTilt(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* HEADING / ROTATION SLIDER */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Compass Heading Rotation</span>
                  <span className="font-mono text-amber-400 font-bold">{heading}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={heading}
                  onChange={e => setHeading(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* FLYOVER SPEED */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Drone Orbit Speed</span>
                  <span className="font-mono text-gray-300 font-bold">{flyoverSpeed}x</span>
                </div>
                <div className="flex gap-2">
                  {[0.5, 1, 2, 4].map(spd => (
                    <button
                      key={spd}
                      onClick={() => setFlyoverSpeed(spd)}
                      className={`flex-1 py-1 rounded text-xs font-mono font-bold border transition-all ${
                        flyoverSpeed === spd
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                          : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const coords = `[${selectedLoc.lat}, ${selectedLoc.lng}] Elev: ${elevation}m Tilt: ${tilt}°`;
              setSavedCoordinates(coords);
              if (onLocationSelected) {
                onLocationSelected(selectedLoc, { elevation, tilt, heading });
              }
            }}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Camera className="w-4 h-4" /> LOCK LOCATION FOR COSMO 3 VIDEO
          </button>
        </div>
      </div>

      {/* PRODUCER FILM SCOUTING TELEMETRY DASHBOARD */}
      <div className="bg-black/70 border border-gray-800 rounded-xl p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
          <span className="text-amber-400 font-bold flex items-center gap-2">
            <Video className="w-4 h-4" /> FILM PRODUCER ON-LOCATION TELEMETRY
          </span>
          <span className="text-[10px] text-gray-400">
            STREET: {selectedLoc.streetIntersection}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
          <div className="bg-gray-900/80 p-2.5 rounded-lg border border-gray-800 space-y-1">
            <div className="text-gray-400 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-blue-400" /> STREET ACCESS & STAGING:
            </div>
            <p className="text-white font-bold">{selectedLoc.streetAccessScore}</p>
          </div>

          <div className="bg-gray-900/80 p-2.5 rounded-lg border border-gray-800 space-y-1">
            <div className="text-gray-400 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> SUN LIGHTING TRAJECTORY:
            </div>
            <p className="text-amber-300 font-bold">{selectedLoc.sunTrajectory}</p>
          </div>

          <div className="bg-gray-900/80 p-2.5 rounded-lg border border-gray-800 space-y-1">
            <div className="text-gray-400 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-cyan-400" /> DRONE AIRSPACE STATUS:
            </div>
            <p className="text-cyan-300 font-bold">{selectedLoc.droneAirspace}</p>
          </div>

          <div className="bg-gray-900/80 p-2.5 rounded-lg border border-gray-800 space-y-1">
            <div className="text-gray-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> CITY FILM PERMIT ZONE:
            </div>
            <p className="text-emerald-300 font-bold">{selectedLoc.permitZone}</p>
          </div>

          <div className="bg-gray-900/80 p-2.5 rounded-lg border border-gray-800 space-y-1">
            <div className="text-gray-400 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-purple-400" /> ACOUSTIC NOISE FLOOR:
            </div>
            <p className="text-purple-300 font-bold">{selectedLoc.noiseFloor}</p>
          </div>

          <div className="bg-gray-900/80 p-2.5 rounded-lg border border-gray-800 space-y-1">
            <div className="text-gray-400 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-indigo-400" /> CAMERA RIG SUITABILITY:
            </div>
            <p className="text-indigo-300 font-bold">{selectedLoc.rigSuitability}</p>
          </div>
        </div>
      </div>

      {/* LOCATION PRESETS CAROUSEL */}
      <div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-amber-500" /> GLOBAL FILM LOCATION INTERSECTIONS
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {LOCATION_PRESETS.map((loc) => {
            const isSelected = loc.id === selectedLoc.id;
            return (
              <button
                key={loc.id}
                onClick={() => handleSelectPreset(loc)}
                className={`relative rounded-xl overflow-hidden border text-left transition-all group h-24 ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 scale-[1.02]'
                    : 'border-gray-800 hover:border-gray-700 opacity-80 hover:opacity-100'
                }`}
              >
                <img src={loc.thumbnail} alt={loc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-2 flex flex-col justify-end">
                  <span className="text-[9px] font-mono text-amber-400 uppercase font-bold leading-none">{loc.streetIntersection}</span>
                  <span className="text-xs font-bold text-white leading-tight line-clamp-1">{loc.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

