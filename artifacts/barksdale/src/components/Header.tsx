import { useAppState } from "@/hooks/use-app-state";

const DAWS = [
  "GarageBand iOS", "FL Studio", "FL Studio Mobile", "Logic Pro", 
  "Ableton", "BandLab", "Pro Tools", "Reason", "Cubase"
];

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { daw, setDaw } = useAppState();
  
  return (
    <header className="px-4 py-3 border-b border-border bg-card/50 sticky top-0 z-30 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <select 
          value={daw} 
          onChange={(e) => setDaw(e.target.value)}
          className="bg-secondary text-xs text-foreground px-2 py-1.5 rounded border border-border appearance-none min-w-[100px]"
        >
          {DAWS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </header>
  );
}
