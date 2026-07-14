import { ReactNode } from "react";
import { TabBar } from "@/components/TabBar";
import { MiniPlayer } from "@/components/MiniPlayer";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground flex justify-center">
      <div className="w-full max-w-[480px] relative flex flex-col min-h-[100dvh] border-x border-border shadow-2xl bg-background">
        <div className="flex-1 pb-[110px] overflow-y-auto overflow-x-hidden">
          {children}
        </div>
        <MiniPlayer />
        <TabBar />
      </div>
    </div>
  );
}
