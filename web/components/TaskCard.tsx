"use client";

import { TxButton } from "./TxButton";
import { addresses, dailyTasksAbi } from "@/lib/contracts";
import { Check, Plus } from "lucide-react";

export function TaskCard({
  taskId, name, reward, completed, onDone,
}: {
  taskId: number; name: string; reward: number; completed: boolean; onDone?: () => void;
}) {
  return (
    <div className={`card p-4 flex flex-col gap-3 ${completed ? "bg-paper-soft" : ""}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-sys text-ink/50">
            TASK.{taskId.toString().padStart(2, "0")}
          </div>
          <div className="text-sm font-bold uppercase mt-1 leading-tight">{name}</div>
        </div>
        <div className="chip">
          <Plus className="h-2.5 w-2.5" />
          {reward} DACP
        </div>
      </div>
      {completed ? (
        <button disabled className="btn-ghost cursor-default">
          <Check className="h-3.5 w-3.5 text-dac-green" /> DONE
        </button>
      ) : (
        <TxButton
          abi={dailyTasksAbi}
          address={addresses.DailyTasks}
          functionName="completeTask"
          args={[taskId, ""]}
          successLabel={`+${reward} DACP`}
          onSuccess={onDone}
        >
          EXECUTE
        </TxButton>
      )}
    </div>
  );
}
