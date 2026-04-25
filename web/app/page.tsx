import Link from "next/link";
import { AddNetworkButton } from "@/components/AddNetworkButton";
import { Logo } from "@/components/Logo";
import { ArrowRight, Award, CheckCheck, Dice5, Send, Sparkles, Users } from "lucide-react";

const features = [
  { icon: CheckCheck, title: "DAILY CHECK-IN", desc: "One on-chain attestation per UTC day. Build streaks. Earn DACP." },
  { icon: Sparkles, title: "DAILY QUESTS", desc: "16 micro-tasks per day. Easy 10–20 transactions per user." },
  { icon: Send, title: "DAILY JAM", desc: "Send a daily 'gm' jam to friends. Capped per recipient/day." },
  { icon: Award, title: "BADGE MINT", desc: "Mint daily commemorative ERC721 badges. One per UTC day." },
  { icon: Dice5, title: "SPIN WHEEL", desc: "On-chain randomness. 2–50 DACP per daily spin." },
  { icon: Users, title: "LEADERBOARD", desc: "Climb the global rank. Streak + points + check-ins tracked." },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="card card-strip p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-paper bg-grid opacity-50 pointer-events-none" />
        <div className="relative max-w-3xl">
          <div className="chip-live mb-6">
            <span className="h-1.5 w-1.5 bg-dac-green animate-blink" />
            LIVE · CHAIN.21894 · DACC
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold uppercase tracking-tight leading-[1.05]">
            DAILY ON-CHAIN<br />
            <span className="text-dac-red">RITUALS</span> ON DAC<br />
            INCEPTION TESTNET.
          </h1>
          <p className="mt-6 max-w-xl text-sm text-ink/70 font-mono leading-relaxed">
            // CHECK-IN. SEND JAM. COMPLETE QUESTS. MINT BADGES. SPIN.<br />
            // BUILT NATIVELY ON DA CHAIN — A QUANTUM-RESISTANT NETWORK.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="btn-primary">
              OPEN DASHBOARD <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <AddNetworkButton />
          </div>
        </div>
      </section>

      <section>
        <div className="sys-label mb-3">FEATURES.GRID</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f) => (
            <div key={f.title} className="card p-5 hover:bg-paper-soft transition">
              <f.icon className="h-5 w-5 text-dac-red" />
              <div className="mt-3 text-sm font-bold uppercase tracking-tight">{f.title}</div>
              <p className="mt-2 text-xs text-ink/60 font-mono leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card card-strip p-8 sm:p-12 text-center">
        <Logo className="h-10 w-10 mx-auto mb-4" />
        <h3 className="text-2xl font-bold uppercase">START YOUR STREAK</h3>
        <p className="mt-2 text-xs text-ink/60 font-mono uppercase tracking-sys">
          CONNECT WALLET → SWITCH TO DAC TESTNET → CHECK-IN
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">BEGIN <ArrowRight className="h-3.5 w-3.5" /></Link>
          <Link href="/leaderboard" className="btn-ghost">VIEW LEADERBOARD</Link>
        </div>
      </section>
    </div>
  );
}
