import { Header } from "@/components/Header";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  useGetSkillMatch, useGetLegendaryPairings, useGetCollabRooms, 
  useGetBattles, useGetMicroGigs, useGetDailyChallenge 
} from "@workspace/api-client-react";
import { Users, Swords, Briefcase, Calendar, Target, Award, Star } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

const TABS = [
  { id: 'match', label: 'Match', icon: Target },
  { id: 'rooms', label: 'Rooms', icon: Users },
  { id: 'battles', label: 'Battles', icon: Swords },
  { id: 'gigs', label: 'Gigs', icon: Briefcase },
  { id: 'daily', label: 'Daily', icon: Calendar },
];

export default function Collab() {
  const [activeTab, setActiveTab] = useState('match');
  
  // Queries
  const { data: matchData } = useGetSkillMatch();
  const { data: roomsData } = useGetCollabRooms();
  const { data: battlesData } = useGetBattles();
  const { data: gigsData } = useGetMicroGigs();
  const { data: dailyData } = useGetDailyChallenge();

  // Mock radar data if skill match is missing
  const radarData = [
    { subject: 'Drums', A: 80, fullMark: 100 },
    { subject: 'Bass', A: 65, fullMark: 100 },
    { subject: 'Keys', A: 45, fullMark: 100 },
    { subject: 'Sampling', A: 90, fullMark: 100 },
    { subject: 'Arrangement', A: 70, fullMark: 100 },
    { subject: 'Mixing', A: 60, fullMark: 100 },
    { subject: 'Melody', A: 50, fullMark: 100 },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header title="COLLAB" subtitle="The network is the label." />
      
      {/* Horizontal Scroll Tabs */}
      <div className="flex overflow-x-auto border-b border-border bg-card/50 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-shrink-0 px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors min-h-[44px]",
              activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'match' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm">Your Skill Map</h3>
                <button className="text-[10px] bg-primary text-primary-foreground px-2 py-1 rounded font-bold uppercase">Update Test</button>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#2a2a2a" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#999999', fontSize: 10 }} />
                    <Radar name="Skills" dataKey="A" stroke="#f0883e" fill="#f0883e" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm mb-3">Top Compatible Producers</h3>
              <div className="space-y-3">
                {matchData ? matchData.map((match, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg">
                      {match.producerName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{match.producerName}</h4>
                      <p className="text-xs text-primary font-medium">{match.compatibility}% Match</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Complements: {match.complementarySkills.join(', ')}</p>
                    </div>
                    <button className="bg-secondary text-foreground px-3 py-1.5 rounded text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors">
                      Connect
                    </button>
                  </div>
                )) : (
                  <div className="text-center py-6 text-sm text-muted-foreground bg-card rounded-xl border border-border">
                    Take the skills test to find matches.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="space-y-4">
            <button className="w-full bg-secondary border border-border border-dashed text-foreground font-bold py-3 rounded-xl min-h-[44px] hover:border-primary hover:text-primary transition-colors flex justify-center items-center gap-2">
              <Users size={16} /> Create Live Room
            </button>
            
            <div className="space-y-3">
              {roomsData?.map(room => (
                <div key={room.id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-base">{room.name}</h4>
                      <div className="flex gap-2 mt-1">
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                          room.type === 'public' ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                        )}>
                          {room.type}
                        </span>
                        {room.isLive && (
                          <span className="text-[10px] bg-destructive/20 text-destructive px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" /> Live
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-bold bg-background px-2 py-1 rounded">
                      {room.participants} / 6
                    </div>
                  </div>
                  
                  <div className="mt-3 bg-secondary/50 rounded-lg p-2 text-xs">
                    <span className="text-muted-foreground">Needed: </span>
                    <span className="font-medium text-foreground">
                      {room.roles.filter(r => !r.userId).map(r => r.role).join(', ') || 'None'}
                    </span>
                  </div>
                  
                  <button className="w-full mt-3 bg-primary text-primary-foreground font-bold py-2 rounded text-sm hover:brightness-110 min-h-[44px]">
                    Join Room
                  </button>
                </div>
              ))}
              {!roomsData?.length && (
                <div className="text-center py-10 text-muted-foreground">No active rooms right now.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'battles' && (
          <div className="space-y-4">
            <div className="bg-destructive/10 border border-destructive rounded-xl p-4 text-center">
              <Swords className="mx-auto text-destructive mb-2" size={24} />
              <h3 className="font-bold text-destructive mb-1">Enter the Arena</h3>
              <p className="text-xs text-destructive/80 mb-3">Challenge producers. Winner takes all.</p>
              <button className="bg-destructive text-destructive-foreground px-4 py-2 rounded font-bold text-sm min-h-[44px] w-full">
                Challenge Anyone
              </button>
            </div>

            <h3 className="font-bold text-sm mt-6 mb-3">Active Battles</h3>
            <div className="space-y-4">
              {battlesData?.map(battle => (
                <div key={battle.id} className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-primary font-bold mb-2 uppercase tracking-wider text-center border-b border-border/50 pb-2">
                    {battle.prompt}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-center flex-1">
                      <div className="font-bold text-sm truncate">{battle.challenger}</div>
                      <div className="text-xl font-black mt-1 text-muted-foreground">{battle.votesA}</div>
                      <button className="mt-2 w-full max-w-[80px] bg-secondary text-xs py-1 rounded hover:bg-primary transition-colors">Vote A</button>
                    </div>
                    <div className="font-black text-2xl text-muted-foreground px-2 italic">VS</div>
                    <div className="text-center flex-1">
                      <div className="font-bold text-sm truncate">{battle.opponent || "Waiting..."}</div>
                      <div className="text-xl font-black mt-1 text-muted-foreground">{battle.votesB}</div>
                      <button className="mt-2 w-full max-w-[80px] bg-secondary text-xs py-1 rounded hover:bg-primary transition-colors">Vote B</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gigs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-sm">Micro-Gig Marketplace</h3>
              <button className="text-[10px] text-primary uppercase font-bold">List a Session</button>
            </div>
            
            <div className="grid gap-3">
              {gigsData?.map(gig => (
                <div key={gig.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm leading-tight pr-2">{gig.title}</h4>
                    <div className="text-primary font-bold whitespace-nowrap bg-primary/10 px-2 py-0.5 rounded text-xs">
                      ${gig.pricePerQuarterHour} / 15m
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center text-warning">
                      <Star size={12} fill="currentColor" />
                      <span className="ml-1 font-bold">{gig.rating?.toFixed(1) || "New"}</span>
                    </div>
                    <span className="text-muted-foreground">• {gig.sellerName}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {gig.skills?.map(skill => (
                      <span key={skill} className="text-[9px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">{skill}</span>
                    ))}
                  </div>
                  <button className="w-full mt-2 bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground font-bold py-2 rounded text-sm transition-colors min-h-[44px]">
                    Book Session
                  </button>
                </div>
              ))}
              {!gigsData?.length && (
                <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                  No gigs available. Be the first to list one!
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'daily' && (
          <div className="space-y-4">
            <div className="bg-primary border border-primary text-primary-foreground rounded-xl p-6 text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <span className="text-xs font-black bg-black/20 px-2 py-1 rounded uppercase tracking-widest mb-3 inline-block">Daily Challenge</span>
                <h3 className="font-black text-xl leading-tight mb-2">"{dailyData?.prompt || "Make a beat in the style of Jazzy Jeff × The Alchemist"}"</h3>
                <div className="flex justify-center gap-3 text-xs font-mono bg-black/20 w-fit mx-auto px-3 py-1.5 rounded mt-3">
                  <span>{dailyData?.key || "C Min"}</span>
                  <span>|</span>
                  <span>{dailyData?.bpm || 85} BPM</span>
                </div>
                <div className="mt-4 text-xs font-medium">
                  {dailyData?.submissions || 0} Submissions today
                </div>
                <button className="w-full mt-4 bg-background text-foreground hover:text-primary font-black py-3 rounded-lg uppercase tracking-wide min-h-[44px] transition-colors">
                  Enter Challenge
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
