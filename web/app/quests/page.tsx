"use client";

import { useAccount, useReadContracts } from "wagmi";
import { addresses, dailyTasksAbi } from "@/lib/contracts";
import { TaskCard } from "@/components/TaskCard";
import { DailyTimer } from "@/components/DailyTimer";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const TASK_COUNT = 16;

export default function QuestsPage() {
  const { address, isConnected } = useAccount();

  const namesAndRewards = useReadContracts({
    contracts: Array.from({ length: TASK_COUNT }).flatMap((_, i) => [
      { address: addresses.DailyTasks, abi: dailyTasksAbi, functionName: "taskName", args: [i] } as const,
      { address: addresses.DailyTasks, abi: dailyTasksAbi, functionName: "taskReward", args: [i] } as const,
    ]),
  });

  const bitmapQ = useReadContracts({
    contracts: address
      ? [{ address: addresses.DailyTasks, abi: dailyTasksAbi, functionName: "todayBitmap", args: [address] }]
      : [],
  });
  const bitmap = (bitmapQ.data?.[0]?.result as number) ?? 0;

  if (!isConnected) {
    return (
      <div className="card card-strip p-12 text-center">
        <h2 className="text-2xl font-bold uppercase">CONNECT TO VIEW QUESTS</h2>
        <div className="mt-6 flex justify-center"><ConnectButton /></div>
      </div>
    );
  }

  const completedCount = Array.from({ length: TASK_COUNT }).filter((_, i) => ((bitmap >> i) & 1) === 1).length;
  const pct = (completedCount / TASK_COUNT) * 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="sys-label">QUESTS.DAILY</div>
          <h1 className="mt-1 text-3xl font-bold uppercase">
            {completedCount.toString().padStart(2, "0")}/{TASK_COUNT}{" "}
            <span className="text-ink/40 font-mono text-base">COMPLETED</span>
          </h1>
        </div>
        <DailyTimer />
      </div>

      <div className="card p-3">
        <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-sys mb-2">
          <span>PROGRESS</span><span>{pct.toFixed(0)}%</span>
        </div>
        <div className="h-3 bg-paper-soft border border-ink overflow-hidden">
          <div className="h-full bg-dac-yellow border-r-2 border-ink transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array.from({ length: TASK_COUNT }).map((_, i) => {
          const name = namesAndRewards.data?.[i * 2]?.result as string | undefined;
          const reward = namesAndRewards.data?.[i * 2 + 1]?.result as number | undefined;
          const completed = ((bitmap >> i) & 1) === 1;
          return (
            <TaskCard
              key={i}
              taskId={i}
              name={name ?? `TASK ${i}`}
              reward={Number(reward ?? 0)}
              completed={completed}
              onDone={() => bitmapQ.refetch()}
            />
          );
        })}
      </div>
    </div>
  );
}
