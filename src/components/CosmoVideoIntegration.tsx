import React, { useState } from 'react';
import { Film, Play, Sparkles, Video, Camera, Sliders, Check, RefreshCw, Eye, Download, Layers } from 'lucide-react';

interface CosmoVideoIntegrationProps {
  initialPrompt?: string;
}

export const CosmoVideoIntegration: React.FC<CosmoVideoIntegrationProps> = ({ initialPrompt = '' }) => {
  const [prompt, setPrompt] = useState<string>(
    initialPrompt || 'Anamorphic 35mm shot of Detective Slate walking through rain-slicked Brooklyn alley under flashing amber neon'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '21:9' | '1:1'>('16:9');
  const [fps, setFps] = useState<24 | 30 | 60>(24);
  const [cameraMotion, setCameraMotion] = useState<string>('Push-In Dolly');
  const [lightingStyle, setLightingStyle] = useState<string>('Cyberpunk Neon');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string>(
    'https://assets.mixkit.co/videos/preview/mixkit-rain-on-neon-sign-in-city-street-40015-large.mp4'
  );

  const handleGenerateCosmoVideo = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5 space-y-5 text-white shadow-2xl">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Film className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wide uppercase text-white">
                GOOGLE COSMO 3 & VEO 2 UNIVERSAL AUDITION GENERATOR
              </h3>
              <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded">
                2026 AI VIDEO ENGINE
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Next-gen Google Cosmo 3 text-to-video synthesis with motion vector steering and universal audition looping.
            </p>
          </div>
        </div>
      </div>

      {/* MAIN GENERATOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* PREVIEW AUDITION PLAYER */}
        <div className="lg:col-span-2 relative bg-black rounded-xl border border-gray-800 overflow-hidden flex flex-col justify-between h-80 sm:h-96">
          <video
            src={previewVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

          {/* TOP AUDITION OVERLAY */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
            <span className="text-[10px] font-mono bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-2.5 py-1 rounded-lg font-bold backdrop-blur-md">
              COSMO 3 AUDITION LOOP • {aspectRatio} • {fps}FPS
            </span>
            <span className="text-[10px] font-mono bg-black/70 text-amber-400 px-2 py-1 rounded border border-gray-800 font-bold">
              MOTION: {cameraMotion.toUpperCase()}
            </span>
          </div>

          {/* BOTTOM AUDITION OVERLAY */}
          <div className="absolute bottom-3 left-3 right-3 z-10 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-gray-800 flex justify-between items-center">
            <p className="text-xs text-gray-200 font-mono line-clamp-1 flex-1 pr-3">
              "{prompt}"
            </p>
            <a
              href={previewVideoUrl}
              download="cosmo3_video.mp4"
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 flex-shrink-0 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> DOWNLOAD 4K MP4
            </a>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="bg-[#151622] p-4 rounded-xl border border-gray-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" /> CAMERA & LIGHTING SPECS
            </div>

            {/* PROMPT INPUT */}
            <div>
              <label className="text-xs text-gray-400 font-mono block mb-1">Scene Prompt</label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={3}
                className="w-full bg-black/60 border border-gray-800 rounded-lg p-2.5 text-xs text-white placeholder-gray-500 focus:border-cyan-500 outline-none resize-none"
              />
            </div>

            {/* CAMERA MOTION VECTORS */}
            <div>
              <label className="text-xs text-gray-400 font-mono block mb-1">Camera Vector Motion</label>
              <select
                value={cameraMotion}
                onChange={e => setCameraMotion(e.target.value)}
                className="w-full bg-black/60 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500 outline-none"
              >
                <option value="Push-In Dolly">Push-In Dolly (Cinematic Focal Zoom)</option>
                <option value="Orbital Orbit">360° Orbital Orbit</option>
                <option value="Low-Angle Crane">Low-Angle Crane Sweep</option>
                <option value="FPV Drone Flythrough">FPV High-Speed Drone Flythrough</option>
                <option value="Handheld Wobble">Dynamic Handheld Action</option>
              </select>
            </div>

            {/* LIGHTING STYLE */}
            <div>
              <label className="text-xs text-gray-400 font-mono block mb-1">Lighting & Atmospheric Vibe</label>
              <select
                value={lightingStyle}
                onChange={e => setLightingStyle(e.target.value)}
                className="w-full bg-black/60 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500 outline-none"
              >
                <option value="Cyberpunk Neon">Cyberpunk Neon (Cyan & Magenta Rim)</option>
                <option value="Golden Hour">Golden Hour Sunburst & Flare</option>
                <option value="Chiaroscuro Noir">Chiaroscuro Noir High-Contrast Shadow</option>
                <option value="Studio Softbox">Clean Studio Softbox Diffusion</option>
              </select>
            </div>

            {/* ASPECT RATIO & FPS */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[10px] text-gray-400 font-mono block mb-1">Aspect Ratio</label>
                <div className="flex gap-1">
                  {(['16:9', '9:16', '21:9', '1:1'] as const).map(ar => (
                    <button
                      key={ar}
                      onClick={() => setAspectRatio(ar)}
                      className={`flex-1 py-1 rounded text-[10px] font-mono font-bold border transition-all ${
                        aspectRatio === ar
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'bg-black/40 border-gray-800 text-gray-400'
                      }`}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-mono block mb-1">Frame Rate</label>
                <div className="flex gap-1">
                  {([24, 30, 60] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFps(f)}
                      className={`flex-1 py-1 rounded text-[10px] font-mono font-bold border transition-all ${
                        fps === f
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'bg-black/40 border-gray-800 text-gray-400'
                      }`}
                    >
                      {f} FPS
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateCosmoVideo}
            disabled={isGenerating}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'SYNTHESIZING COSMO 3 VIDEO...' : 'GENERATE COSMO 3 VIDEO'}
          </button>
        </div>
      </div>
    </div>
  );
};
