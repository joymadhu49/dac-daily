"use client";

import { useReadContracts } from "wagmi";
import { addresses, activityPointsAbi, dailyCheckInAbi, dailyBadgeAbi, dailyJamAbi, spinWheelAbi } from "@/lib/contracts";
import { StatCard } from "@/components/StatCard";
import { StreakFlame } from "@/components/StreakFlame";
import { explorerAddr, shortAddr } from "@/lib/utils";
import { Award, Coins, Flame, Send } from "lucide-react";
import { isAddress } from "viem";

export default function ProfilePage({ params }: { params: { address: string } }) {
  const addr = params.address as `0x${string}`;
  const valid = isAddress(addr);

  const { data } = useReadContracts({
    contracts: valid
      ? [
          { address: addresses.ActivityPoints, abi: activityPointsAbi, functionName: "balanceOf", args: [addr] },
          { address: addresses.DailyCheckIn, abi: dailyCheckInAbi, functionName: "stats", args: [addr] },
          { address: addresses.DailyBadge, abi: dailyBadgeAbi, functionName: "balanceOf", args: [addr] },
          { address: addresses.DailyJam, abi: dailyJamAbi, functionName: "jamsSent", args: [addr] },
          { address: addresses.DailyJam, abi: dailyJamAbi, functionName: "jamsReceived", args: [addr] },
          { address: addresses.SpinWheel, abi: spinWheelAbi, functionName: "totalWon", args: [addr] },
        ]
      : [],
  });

  if (!valid) return <div className="card p-10 text-center font-mono uppercase">// INVALID ADDRESS</div>;

  const points = (data?.[0]?.result as bigint) ?? 0n;
  const stats = data?.[1]?.result as readonly [bigint, bigint, bigint, bigint] | undefined;
  const badges = (data?.[2]?.result as bigint) ?? 0n;
  const jamsSent = (data?.[3]?.result as bigint) ?? 0n;
  const jamsRecv = (data?.[4]?.result as bigint) ?? 0n;
  const spinWon = (data?.[5]?.result as bigint) ?? 0n;
  const streak = stats ? Number(stats[1]) : 0;
  const longest = stats ? Number(stats[2]) : 0;
  const totalCheckIns = stats ? Number(stats[3]) : 0;

  return (
    <div className="space-y-6">
      <div>
        <div className="sys-label">PROFILE.PUBLIC</div>
        <h1 className="mt-1 font-mono text-2xl">
          <a href={explorerAddr(addr)} target="_blank" rel="noreferrer" className="underline hover:text-dac-red">
            {shortAddr(addr)}
          </a>
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="POINTS" value={points.toString()} icon={<Coins className="h-4 w-4" />} strip />
        <StatCard label="STREAK" value={<StreakFlame streak={streak} />} hint={`LONGEST ${longest}`} icon={<Flame className="h-4 w-4" />} />
        <StatCard label="BADGES" value={badges.toString()} hint="ERC721 MINTED" icon={<Award className="h-4 w-4" />} />
        <StatCard label="SPIN WON" value={spinWon.toString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card p-5">
          <div className="sys-label">CHECK-INS</div>
          <div className="text-2xl font-bold mt-2">{totalCheckIns}</div>
        </div>
        <div className="card p-5">
          <div className="sys-label">JAMS SENT</div>
          <div className="text-2xl font-bold mt-2 flex items-center gap-2">
            <Send className="h-5 w-5 text-dac-red" />{jamsSent.toString()}
          </div>
        </div>
        <div className="card p-5">
          <div className="sys-label">JAMS RECV</div>
          <div className="text-2xl font-bold mt-2">{jamsRecv.toString()}</div>
        </div>
      </div>
    </div>
  );
}
