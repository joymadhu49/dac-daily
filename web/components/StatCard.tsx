import { ReactNode } from "react";

export function StatCard({
  label, value, hint, icon, strip,
}: {
  label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode; strip?: boolean;
}) {
  return (
    <div className={`stat-block ${strip ? "card-strip" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-sys text-ink/60">{label}</div>
        {icon && <div className="text-ink/50">{icon}</div>}
      </div>
      <div className="mt-2 text-2xl font-bold text-ink">{value}</div>
      {hint && <div className="mt-1 font-mono text-[10px] uppercase tracking-sys text-ink/50">{hint}</div>}
    </div>
  );
}
