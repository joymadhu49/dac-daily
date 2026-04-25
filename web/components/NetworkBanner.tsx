"use client";

import { useAccount, useChainId } from "wagmi";
import { dacTestnet } from "@/lib/chain";
import { AddNetworkButton } from "./AddNetworkButton";
import { AlertTriangle } from "lucide-react";

export function NetworkBanner() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  if (!isConnected) return null;
  if (chainId === dacTestnet.id) return null;

  return (
    <div className="border-b-2 border-ink bg-dac-orange text-paper">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-sys font-bold">
          <AlertTriangle className="h-4 w-4" />
          WRONG NETWORK · SWITCH TO DAC TESTNET (CHAIN 21894) TO USE DAC DAILY
        </div>
        <AddNetworkButton variant="ghost" />
      </div>
    </div>
  );
}
