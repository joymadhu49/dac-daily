"use client";

import { useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { dacTestnet } from "@/lib/chain";
import toast from "react-hot-toast";
import { ReactNode, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { explorerTx } from "@/lib/utils";

type Props = {
  abi: any;
  address: `0x${string}`;
  functionName: string;
  args?: readonly unknown[];
  children: ReactNode;
  onSuccess?: (hash: `0x${string}`) => void;
  disabled?: boolean;
  className?: string;
  successLabel?: string;
};

export function TxButton({
  abi, address, functionName, args, children, onSuccess, disabled, className, successLabel,
}: Props) {
  const chainId = useChainId();
  const { writeContractAsync, data: hash, isPending, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess && hash) {
      toast.success(
        () => (
          <span className="font-mono text-[11px] uppercase tracking-sys">
            {successLabel ?? "TX CONFIRMED"} ·{" "}
            <a className="underline" href={explorerTx(hash)} target="_blank" rel="noreferrer">VIEW</a>
          </span>
        ),
        { duration: 5000 },
      );
      onSuccess?.(hash);
      reset();
    }
  }, [isSuccess, hash, successLabel, onSuccess, reset]);

  async function go() {
    if (chainId !== dacTestnet.id) {
      toast.error("SWITCH TO DAC TESTNET");
      return;
    }
    try {
      await writeContractAsync({ abi, address, functionName, args: (args ?? []) as any });
    } catch (e: any) {
      toast.error(e?.shortMessage ?? e?.message ?? "TX FAILED");
    }
  }

  const busy = isPending || confirming;
  return (
    <button onClick={go} disabled={disabled || busy} className={className ?? "btn-primary"}>
      {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {busy ? (isPending ? "CONFIRM IN WALLET…" : "CONFIRMING…") : children}
    </button>
  );
}
