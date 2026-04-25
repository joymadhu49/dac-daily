"use client";

import { useEffect, useState } from "react";
import { fmtCountdown, secondsUntilUtcMidnight } from "@/lib/utils";
import { Timer } from "lucide-react";

export function DailyTimer() {
  const [s, setS] = useState(secondsUntilUtcMidnight());
  useEffect(() => {
    const t = setInterval(() => setS(secondsUntilUtcMidnight()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="chip-warn">
      <Timer className="h-3 w-3" />
      RESETS&nbsp;{fmtCountdown(s)}&nbsp;UTC
    </span>
  );
}
