"use client";

import { useAccount, useReadContracts, useChainId } from "wagmi";
import { addresses, activityPointsAbi, dailyCheckInAbi, dailyBadgeAbi, spinWheelAbi, dailyJamAbi } from "@/lib/contracts";
import { StatCard } from "@/components/StatCard";
import { StreakFlame } from "@/components/StreakFlame";
import { DailyTimer } from "@/components/DailyTimer";
import { TxButton } from "@/components/TxButton";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { dacTestnet } from "@/lib/chain";
import { Award, CheckCheck, Coins, Dice5, Send, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const wrongChain = isConnected && chainId !== dacTestnet.id;

  const { data, refetch } = useReadContracts({
    allowFailure: true,
    contracts: address
      ? [
          { address: addresses.ActivityPoints, abi: activityPointsAbi, functionName: "balanceOf", args: [address] },
          { address: addresses.DailyCheckIn, abi: dailyCheckInAbi, functionName: "stats", args: [address] },
          { address: addresses.DailyCheckIn, abi: dailyCheckInAbi, functionName: "hasCheckedInToday", args: [address] },
          { address: addresses.DailyBadge, abi: dailyBadgeAbi, functionName: "lastMintDay", args: [address] },
          { address: addresses.DailyBadge, abi: dailyBadgeAbi, functionName: "currentDay" },
          { address: addresses.SpinWheel, abi: spinWheelAbi, functionName: "lastSpinDay", args: [address] },
          { address: addresses.SpinWheel, abi: spinWheelAbi, functionName: "totalWon", args: [address] },
          { address: addresses.DailyJam, abi: dailyJamAbi, functionName: "jamsSent", args: [address] },
          { address: addresses.DailyJam, abi: dailyJamAbi, functionName: "jamsReceived", args: [address] },
        ]
      : [],
  });

  const points = (data?.[0]?.result as bigint) ?? 0n;
  const stats = data?.[1]?.result as readonly [bigint, bigint, bigint, bigint] | undefined;
  const checkedIn = (data?.[2]?.result as boolean) ?? false;
  const lastMintDay = (data?.[3]?.result as bigint) ?? 0n;
  const currentDay = (data?.[4]?.result as bigint) ?? 0n;
  const lastSpinDay = (data?.[5]?.result as bigint) ?? 0n;
  const totalWon = (data?.[6]?.result as bigint) ?? 0n;
  const jamsSent = (data?.[7]?.result as bigint) ?? 0n;
  const jamsReceived = (data?.[8]?.result as bigint) ?? 0n;

  const streak = stats ? Number(stats[1]) : 0;
  const totalCheckIns = stats ? Number(stats[3]) : 0;
  const longest = stats ? Number(stats[2]) : 0;
  const canMintBadge = currentDay > lastMintDay;
  const canSpin = currentDay > lastSpinDay;

  if (!isConnected) {
    return (
      <div className="card card-strip p-12 text-center">
        <h2 className="text-2xl font-bold uppercase">CONNECT WALLET</h2>
        <p className="mt-2 text-xs font-mono uppercase tracking-sys text-ink/60">
          DAC DAILY READS &amp; WRITES TO CHAIN.21894 (DAC TESTNET)
        </p>
        <div className="mt-6 flex justify-center"><ConnectButton /></div>
      </div>
    );
  }

  if (wrongChain) {
    return (
      <div className="card card-strip p-12 text-center">
        <h2 className="text-2xl font-bold uppercase text-dac-red">WRONG NETWORK</h2>
        <p className="mt-2 text-xs font-mono uppercase tracking-sys text-ink/60">SWITCH TO DAC TESTNET</p>
        <div className="mt-6 flex justify-center"><ConnectButton /></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="sys-label">DASHBOARD.MAIN</div>
          <h1 className="mt-1 text-3xl font-bold uppercase">HELLO, OPERATOR</h1>
        </div>
        <DailyTimer />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="POINTS" value={points.toString()} hint="DACP EARNED" icon={<Coins className="h-4 w-4" />} strip />
        <StatCard label="STREAK" value={<StreakFlame streak={streak} />} hint={`LONGEST ${longest}`} />
        <StatCard label="CHECK-INS" value={totalCheckIns} hint="DAYS ON CHAIN" icon={<CheckCheck className="h-4 w-4" />} />
        <StatCard label="SPIN WON" value={totalWon.toString()} hint="DACP FROM SPIN" icon={<Sparkles className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="card card-strip p-6 lg:col-span-2">
          <div className="sys-label">TODAY.CHECKIN</div>
          <h2 className="mt-1 text-2xl font-bold uppercase">DAILY CHECK-IN</h2>
          <p className="mt-2 text-xs font-mono text-ink/60 leading-relaxed">
            // ONE ON-CHAIN TX PER UTC DAY. MAINTAINS STREAK. EARNS DACP.<br />
            // STREAK BONUS: +10 DACP AT 7 DAYS · +20 DACP AT 30 DAYS.
          </p>
          <div className="mt-5">
            {checkedIn ? (
              <button disabled className="btn-ghost">
                <CheckCheck className="h-4 w-4 text-dac-green" /> CHECKED IN TODAY
              </button>
            ) : (
              <TxButton
                abi={dailyCheckInAbi}
                address={addresses.DailyCheckIn}
                functionName="checkIn"
                successLabel="CHECKED IN"
                onSuccess={() => refetch()}
              >
                EXECUTE CHECK-IN
              </TxButton>
            )}
          </div>
        </div>

        <div className="card p-6">
          <div className="sys-label">NFT.BADGE</div>
          <h2 className="mt-1 text-xl font-bold uppercase">DAILY BADGE</h2>
          <p className="mt-2 text-xs font-mono text-ink/60">
            // MINT TODAY'S COMMEMORATIVE ERC721.
          </p>
          <div className="mt-5">
            {canMintBadge ? (
              <TxButton
                abi={dailyBadgeAbi}
                address={addresses.DailyBadge}
                functionName="mintDaily"
                successLabel="BADGE MINTED"
                onSuccess={() => refetch()}
              >
                <Award className="h-3.5 w-3.5" /> MINT BADGE
              </TxButton>
            ) : (
              <button disabled className="btn-ghost">MINTED TODAY</button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="card p-6">
          <div className="sys-label">LUCK.SPIN</div>
          <h2 className="mt-1 text-xl font-bold uppercase">SPIN WHEEL</h2>
          <p className="mt-2 text-xs font-mono text-ink/60">// 2–50 DACP / DAY. ON-CHAIN RNG.</p>
          <div className="mt-5">
            {canSpin ? (
              <TxButton
                abi={spinWheelAbi}
                address={addresses.SpinWheel}
                functionName="spin"
                successLabel="SPUN"
                onSuccess={() => refetch()}
              >
                <Dice5 className="h-3.5 w-3.5" /> SPIN
              </TxButton>
            ) : (
              <button disabled className="btn-ghost">SPUN TODAY</button>
            )}
          </div>
        </div>

        <Link href="/jam" className="card p-6 hover:bg-paper-soft transition group">
          <div className="sys-label">SOCIAL.JAM</div>
          <h2 className="mt-1 text-xl font-bold uppercase">SEND JAM</h2>
          <p className="mt-2 font-mono text-xs text-ink/60">
            SENT {jamsSent.toString()} · RECV {jamsReceived.toString()}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-sys text-dac-red group-hover:underline">
            <Send className="h-3.5 w-3.5" /> OPEN JAM
          </div>
        </Link>

        <Link href="/quests" className="card p-6 hover:bg-paper-soft transition group">
          <div className="sys-label">QUESTS.16</div>
          <h2 className="mt-1 text-xl font-bold uppercase">DAILY QUESTS</h2>
          <p className="mt-2 font-mono text-xs text-ink/60">// 16 MICRO-TASKS · 10–20 TX/DAY</p>
          <div className="mt-5 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-sys text-dac-red group-hover:underline">
            <Sparkles className="h-3.5 w-3.5" /> VIEW QUESTS
          </div>
        </Link>
      </div>
    </div>
  );
}
