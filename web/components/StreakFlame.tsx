import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakFlame({ streak }: { streak: number }) {
  const tier = streak >= 30 ? "epic" : streak >= 7 ? "hot" : "warm";
  const color =
    tier === "epic" ? "text-dac-red" : tier === "hot" ? "text-dac-orange" : "text-dac-yellow";
  return (
    <div className="flex items-center gap-2">
      <Flame className={cn("h-7 w-7", color)} fill="currentColor" />
      <div>
        <div className="text-2xl font-bold leading-none">{streak}</div>
        <div className="font-mono text-[9px] uppercase tracking-sys text-ink/50 mt-0.5">DAY STREAK</div>
      </div>
    </div>
  );
}
