import { Header } from "@/components/Header";
import { useGetUserProfile, useGetUserBadges } from "@workspace/api-client-react";
import { useAppState } from "@/hooks/use-app-state";
import { Star, Award, Settings, LogOut, CheckCircle2, ChevronRight } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { data: profile, isLoading } = useGetUserProfile();
  const { data: badges } = useGetUserBadges();
  const { daw, setDaw } = useAppState();

  const DAWS = [
    "GarageBand iOS", "FL Studio", "FL Studio Mobile", "Logic Pro", 
    "Ableton", "BandLab", "Pro Tools", "Reason", "Cubase"
  ];

  // Map profile skills to radar data format
  const radarData = profile?.skills ? Object.entries(profile.skills)
    .filter(([k]) => ['drums', 'bass', 'keys', 'sampling', 'arrangement', 'mixing', 'melody'].includes(k))
    .map(([k, v]) => ({ subject: k.charAt(0).toUpperCase() + k.slice(1), A: v, fullMark: 100 }))
    : [];

  return (
    <div className="flex flex-col h-full">
      <Header title="PROFILE" />
      
      <div className="p-4 space-y-6">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-card rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-card rounded w-1/2" />
                <div className="h-4 bg-card rounded w-1/3" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-primary text-3xl font-bold">
                {profile?.username?.charAt(0) || "U"}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
                {profile?.tier || "Studio"}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{profile?.username || "Claude Beats"}</h2>
              <div className="flex items-center gap-1 mt-1 text-warning">
                <Star size={14} fill="currentColor" />
                <span className="text-sm font-bold text-foreground">{profile?.rating?.toFixed(1) || "5.0"}</span>
                <span className="text-xs text-muted-foreground ml-1">Rating</span>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
              <Settings size={20} />
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Beats", val: profile?.beatsCreated || 142 },
            { label: "Collabs", val: profile?.collabsCompleted || 38 },
            { label: "Battles", val: profile?.battlesWon || 12 }
          ].map(stat => (
            <div key={stat.label} className="bg-card border border-border rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-foreground">{stat.val}</div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Radar Chart */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-bold text-sm mb-2">Skill Profile</h3>
          {radarData.length > 0 ? (
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#2a2a2a" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#999999', fontSize: 10 }} />
                  <Radar name="Skills" dataKey="A" stroke="#f0883e" fill="#f0883e" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-lg">
              No skill data available
            </div>
          )}
        </div>

        {/* Badges */}
        <div>
          <h3 className="font-bold text-sm mb-3">Badges & Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {badges?.map(badge => (
              <div key={badge.id} className="bg-card border border-border px-3 py-2 rounded-lg flex items-center gap-2">
                <span className="text-xl">{badge.icon}</span>
                <div className="text-left">
                  <div className="text-xs font-bold text-foreground">{badge.name}</div>
                  <div className="text-[9px] text-muted-foreground">{badge.description}</div>
                </div>
              </div>
            ))}
            {!badges?.length && (
              <div className="w-full text-center py-4 bg-card rounded-lg border border-border text-xs text-muted-foreground">
                No badges yet. Start collaborating!
              </div>
            )}
          </div>
        </div>

        {/* Global Settings */}
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm">Primary DAW</div>
              <div className="text-xs text-muted-foreground mt-0.5">Affects naming and export formats</div>
            </div>
            <select 
              value={daw}
              onChange={(e) => setDaw(e.target.value)}
              className="bg-secondary text-sm px-3 py-2 rounded-lg border border-border min-h-[44px]"
            >
              {DAWS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm">Available for Gigs</div>
              <div className="text-xs text-muted-foreground mt-0.5">Show in marketplace</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked={profile?.isAvailableForGigs} />
              <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Upgrade Card */}
        <div className="bg-gradient-to-br from-[#2a2a2a] to-card border border-border rounded-xl p-5 relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h3 className="font-black text-lg text-foreground mb-1">PRO TIER</h3>
              <p className="text-xs text-muted-foreground">Unlock 100+ Premium Templates</p>
            </div>
            <div className="font-bold text-xl">$9.99<span className="text-xs text-muted-foreground">/mo</span></div>
          </div>
          <button className="w-full mt-4 bg-foreground text-background font-bold py-3 rounded-lg min-h-[44px] hover:bg-foreground/90 transition-colors">
            Upgrade Now
          </button>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-4 text-destructive font-bold text-sm">
          <LogOut size={16} /> Sign Out
        </button>

      </div>
    </div>
  );
}
