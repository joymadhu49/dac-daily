"use client";

import { useChainId, useSwitchChain, useAccount } from "wagmi";
import { dacTestnet } from "@/lib/chain";
import toast from "react-hot-toast";
import { Plug, ArrowRightLeft, CheckCircle2 } from "lucide-react";

type Variant = "primary" | "ghost" | "compact";

export function AddNetworkButton({ variant = "ghost" }: { variant?: Variant }) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const onDac = chainId === dacTestnet.id;

  async function addOrSwitch() {
    const eth = (window as any).ethereum;
    if (!eth) {
      toast.error("NO INJECTED WALLET DETECTED");
      return;
    }
    try {
      if (isConnected && !onDac) {
        try {
          await switchChainAsync({ chainId: dacTestnet.id });
          toast.success("SWITCHED TO DAC TESTNET");
          return;
        } catch {
          // fallback → add
        }
      }
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x" + dacTestnet.id.toString(16),
          chainName: dacTestnet.name,
          nativeCurrency: dacTestnet.nativeCurrency,
          rpcUrls: dacTestnet.rpcUrls.default.http,
          blockExplorerUrls: [dacTestnet.blockExplorers!.default.url],
        }],
      });
      try { await switchChainAsync({ chainId: dacTestnet.id }); } catch {}
      toast.success("DAC TESTNET ADDED");
    } catch (e: any) {
      toast.error(e?.shortMessage ?? e?.message ?? "ADD/SWITCH FAILED");
    }
  }

  if (variant === "compact") {
    if (isConnected && onDac) {
      return (
        <span className="chip-live">
          <CheckCircle2 className="h-3 w-3" /> DAC TESTNET
        </span>
      );
    }
    return (
      <button onClick={addOrSwitch} className="chip-warn hover:bg-dac-orange hover:text-paper transition">
        <Plug className="h-3 w-3" /> {isConnected ? "SWITCH TO DAC" : "ADD DAC TESTNET"}
      </button>
    );
  }

  const Cls = variant === "primary" ? "btn-primary" : "btn-ghost";
  return (
    <button onClick={addOrSwitch} className={Cls}>
      {isConnected && !onDac ? <ArrowRightLeft className="h-3.5 w-3.5" /> : <Plug className="h-3.5 w-3.5" />}
      {isConnected && !onDac ? "SWITCH TO DAC" : "ADD DAC TESTNET"}
    </button>
  );
}
