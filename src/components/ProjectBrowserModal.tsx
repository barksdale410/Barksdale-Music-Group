import React, { useState } from 'react';
import { Folder, Search, Sparkles, Plus, Trash2, Copy, Check, Clock, Cloud, Music, X } from 'lucide-react';

export interface SavedProject {
  id: string;
  title: string;
  genre: string;
  genreThemeId: string;
  bpm: number;
  keySig: string;
  trackCount: number;
  lastSaved: string;
  cloudSynced: boolean;
}

export const INITIAL_PROJECTS: SavedProject[] = [
  {
    id: 'proj_1',
    title: 'Waterfront Syndicate (Film Score)',
    genre: 'Cinematic / Noir',
    genreThemeId: 'cinematic',
    bpm: 85,
    keySig: 'C Minor',
    trackCount: 12,
    lastSaved: '2 mins ago',
    cloudSynced: true
  },
  {
    id: 'proj_2',
    title: 'Chroma Horizon (Cyber Trap)',
    genre: 'Hip Hop & Trap',
    genreThemeId: 'hiphop',
    bpm: 140,
    keySig: 'F# Minor',
    trackCount: 8,
    lastSaved: '1 hour ago',
    cloudSynced: true
  },
  {
    id: 'proj_3',
    title: 'Tokyo Neon Crossing (Synthwave)',
    genre: 'Electronic & Synthwave',
    genreThemeId: 'electronic',
    bpm: 128,
    keySig: 'A Minor',
    trackCount: 16,
    lastSaved: 'Yesterday',
    cloudSynced: true
  },
  {
    id: 'proj_4',
    title: 'Velvet Lounge Neo-Soul',
    genre: 'Jazz & Neo-Soul',
    genreThemeId: 'jazz',
    bpm: 92,
    keySig: 'E♭ Major',
    trackCount: 6,
    lastSaved: '3 days ago',
    cloudSynced: true
  }
];

interface ProjectBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadProject: (proj: SavedProject) => void;
}

export const ProjectBrowserModal: React.FC<ProjectBrowserModalProps> = ({
  isOpen,
  onClose,
  onLoadProject
}) => {
  const [projects, setProjects] = useState<SavedProject[]>(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGenreFilter, setActiveGenreFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = activeGenreFilter === 'all' || p.genreThemeId === activeGenreFilter;
    return matchesSearch && matchesGenre;
  });

  const handleDuplicate = (proj: SavedProject) => {
    const dup: SavedProject = {
      ...proj,
      id: `proj_${Date.now()}`,
      title: `${proj.title} (Copy)`,
      lastSaved: 'Just now',
      cloudSynced: true
    };
    setProjects([dup, ...projects]);
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleCreateNew = () => {
    const newProj: SavedProject = {
      id: `proj_${Date.now()}`,
      title: 'Untitled Production Studio Project',
      genre: 'Hip Hop & Trap',
      genreThemeId: 'hiphop',
      bpm: 120,
      keySig: 'C Major',
      trackCount: 4,
      lastSaved: 'Just now',
      cloudSynced: true
    };
    setProjects([newProj, ...projects]);
    onLoadProject(newProj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#12131a] border border-amber-500/40 rounded-2xl w-full max-w-3xl p-3.5 sm:p-6 space-y-3 sm:space-y-5 shadow-2xl text-white relative max-h-[90vh] overflow-y-auto">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg bg-black/40 border border-gray-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Folder className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide uppercase text-white">
                BARKSDALE CLOUD PROJECT BROWSER
              </h3>
              <p className="text-xs text-gray-400">
                Load, duplicate, and manage your universal multi-genre production projects.
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:from-amber-400 hover:to-amber-500 transition-all"
          >
            <Plus className="w-4 h-4" /> NEW PROJECT
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1">
            {['all', 'hiphop', 'electronic', 'cinematic', 'jazz', 'rock'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveGenreFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase border transition-all flex-shrink-0 ${
                  activeGenreFilter === filter
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* PROJECT LIST */}
        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
          {filteredProjects.map(proj => (
            <div
              key={proj.id}
              className="p-4 rounded-xl bg-[#171822] border border-gray-800 hover:border-amber-500/50 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                  <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                    {proj.genre}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400 mt-1">
                  <span>BPM: <strong className="text-white">{proj.bpm}</strong></span>
                  <span>KEY: <strong className="text-white">{proj.keySig}</strong></span>
                  <span>STEMS: <strong className="text-white">{proj.trackCount}</strong></span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Cloud className="w-3 h-3" /> CLOUD SYNCED
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleDuplicate(proj)}
                  className="p-2 bg-black/40 hover:bg-gray-800 text-gray-300 rounded-lg border border-gray-800"
                  title="Duplicate Project"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="p-2 bg-black/40 hover:bg-red-500/20 text-red-400 rounded-lg border border-gray-800"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    onLoadProject(proj);
                    onClose();
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  LOAD PROJECT
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
