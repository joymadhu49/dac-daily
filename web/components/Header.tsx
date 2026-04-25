"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Logo } from "./Logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AddNetworkButton } from "./AddNetworkButton";

const nav = [
  { href: "/dashboard", label: "DASHBOARD" },
  { href: "/quests", label: "QUESTS" },
  { href: "/jam", label: "JAM" },
  { href: "/leaderboard", label: "LEADERBOARD" },
];

export function Header() {
  const path = usePathname();
  return (
    <header className="border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <div className="leading-none">
            <div className="text-base font-bold tracking-tight">
              DAC <span className="text-dac-red">DAILY</span>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-sys text-ink/50 mt-1">
              SYS://DAILY.ACTIVITY
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => {
            const active = path?.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-sys border-2 transition",
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-transparent text-ink/70 hover:border-ink hover:bg-paper-soft hover:text-ink",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <AddNetworkButton variant="compact" />
          <ConnectButton chainStatus="none" accountStatus="address" showBalance={false} />
        </div>
      </div>
    </header>
  );
}
