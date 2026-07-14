import { Link, useLocation } from "wouter";
import { Sliders, Search, Library, BookOpen, Cpu, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "studio", path: "/", icon: Sliders, label: "Studio" },
  { id: "templates", path: "/templates", icon: Search, label: "Templates" },
  { id: "library", path: "/library", icon: Library, label: "Library" },
  { id: "learn", path: "/learn", icon: BookOpen, label: "Learn" },
  { id: "engines", path: "/engines", icon: Cpu, label: "Engines" },
  { id: "collab", path: "/collab", icon: Users, label: "Collab" },
  { id: "profile", path: "/profile", icon: User, label: "Profile" },
];

export function TabBar() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-card border-t border-border z-50 flex items-center justify-between px-2 pb-safe max-w-[480px] mx-auto">
      {TABS.map((tab) => {
        const isActive = location === tab.path;
        return (
          <Link key={tab.id} href={tab.path} className="flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px]">
            <tab.icon 
              size={20} 
              className={cn(
                "transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )} 
            />
            <span 
              className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
