"use client";

import { useAccount, useReadContracts } from "wagmi";
import { addresses, leaderboardAbi } from "@/lib/contracts";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { TxButton } from "@/components/TxButton";
import { shortAddr, explorerAddr } from "@/lib/utils";
import { Crown, Flame, Sparkles, Trophy } from "lucide-react";

type Entry = { user: `0x${string}`; points: bigint; streak: bigint; totalCheckIns: bigint };

export default function LeaderboardPage() {
  const { address, isConnected } = useAccount();

  const { data, refetch } = useReadContracts({
    contracts: [
      { address: addresses.Leaderboard, abi: leaderboardAbi, functionName: "totalRegistered" },
      { address: addresses.Leaderboard, abi: leaderboardAbi, functionName: "page", args: [0n, 100n] },
    ],
  });

  const total = (data?.[0]?.result as bigint) ?? 0n;
  const entriesRaw = (data?.[1]?.result as Entry[] | undefined) ?? [];
  const entries = [...entriesRaw].sort((a, b) => Number(b.points - a.points));

  const me = entries.findIndex((e) => e.user.toLowerCase() === address?.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="sys-label">LEADERBOARD.GLOBAL</div>
          <h1 className="mt-1 text-3xl font-bold uppercase">TOP STREAK & POINTS</h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-sys text-ink/50">
            REGISTERED: {total.toString()}
          </p>
        </div>
        {isConnected ? (
          <TxButton
            abi={leaderboardAbi}
            address={addresses.Leaderboard}
            functionName="register"
            successLabel="JOINED LEADERBOARD"
            onSuccess={() => refetch()}
          >
            JOIN LEADERBOARD
          </TxButton>
        ) : (
          <ConnectButton />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {entries.slice(0, 3).map((e, i) => {
          const Icon = [Crown, Trophy, Sparkles][i];
          const tone = ["text-dac-yellow", "text-dac-orange", "text-dac-blue"][i];
          return (
            <div key={e.user} className={`card ${i === 0 ? "card-strip" : ""} p-5`}>
              <div className={`flex items-center gap-2 ${tone}`}>
                <Icon className="h-5 w-5" fill="currentColor" />
                <span className="font-mono text-xs font-bold uppercase tracking-sys">RANK {i + 1}</span>
              </div>
              <div className="mt-3 font-mono text-xs">
                <a href={explorerAddr(e.user)} target="_blank" rel="noreferrer" className="underline">{shortAddr(e.user)}</a>
              </div>
              <div className="mt-3 text-3xl font-bold">{e.points.toString()} <span className="text-xs font-mono text-ink/60">DACP</span></div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-sys text-ink/60 flex items-center gap-1.5">
                <Flame className="h-3 w-3 text-dac-orange" fill="currentColor" /> {e.streak.toString()}D STREAK · {e.totalCheckIns.toString()} CHECK-INS
              </div>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-xs font-mono">
          <thead className="bg-paper-soft border-b-2 border-ink uppercase tracking-sys">
            <tr>
              <th className="text-left px-3 py-2 w-16">RANK</th>
              <th className="text-left px-3 py-2">PLAYER</th>
              <th className="text-right px-3 py-2">POINTS</th>
              <th className="text-right px-3 py-2">STREAK</th>
              <th className="text-right px-3 py-2">CHECK-INS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/20">
            {entries.map((e, i) => (
              <tr key={e.user} className={me === i ? "bg-dac-yellow/30" : "hover:bg-paper-soft"}>
                <td className="px-3 py-2 text-ink/60">#{i + 1}</td>
                <td className="px-3 py-2">
                  <a href={explorerAddr(e.user)} target="_blank" rel="noreferrer" className="underline">{shortAddr(e.user)}</a>
                  {me === i && <span className="ml-2 chip">YOU</span>}
                </td>
                <td className="px-3 py-2 text-right font-bold">{e.points.toString()}</td>
                <td className="px-3 py-2 text-right">{e.streak.toString()}</td>
                <td className="px-3 py-2 text-right">{e.totalCheckIns.toString()}</td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-10 text-center uppercase tracking-sys text-ink/50">// NO PLAYERS YET — BE THE FIRST.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
