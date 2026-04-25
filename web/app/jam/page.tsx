"use client";

import { useAccount, useChainId, useWatchContractEvent, useReadContracts } from "wagmi";
import { addresses, dailyJamAbi } from "@/lib/contracts";
import { dacTestnet } from "@/lib/chain";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { isAddress } from "viem";
import { TxButton } from "@/components/TxButton";
import { Send, Plus } from "lucide-react";
import { shortAddr, explorerAddr } from "@/lib/utils";

type JamEvent = { from: `0x${string}`; to: `0x${string}`; note: string; day: bigint };

export default function JamPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [to, setTo] = useState("");
  const [note, setNote] = useState("gm");
  const [recent, setRecent] = useState<JamEvent[]>([]);

  useWatchContractEvent({
    address: addresses.DailyJam,
    abi: dailyJamAbi,
    eventName: "JamSent",
    onLogs(logs) {
      const next = logs.map((l) => l.args as JamEvent).filter(Boolean);
      setRecent((prev) => [...next, ...prev].slice(0, 12));
    },
  });

  const { data: counts } = useReadContracts({
    contracts: address
      ? [
          { address: addresses.DailyJam, abi: dailyJamAbi, functionName: "jamsSent", args: [address] },
          { address: addresses.DailyJam, abi: dailyJamAbi, functionName: "jamsReceived", args: [address] },
        ]
      : [],
  });
  const sent = (counts?.[0]?.result as bigint) ?? 0n;
  const received = (counts?.[1]?.result as bigint) ?? 0n;

  if (!isConnected) {
    return (
      <div className="card card-strip p-12 text-center">
        <h2 className="text-2xl font-bold uppercase">CONNECT TO SEND JAM</h2>
        <div className="mt-6 flex justify-center"><ConnectButton /></div>
      </div>
    );
  }

  const validAddr = isAddress(to);
  const validNote = note.length > 0 && note.length <= 140;
  const ready = validAddr && validNote && chainId === dacTestnet.id;

  return (
    <div className="space-y-6">
      <div>
        <div className="sys-label">SOCIAL.JAM</div>
        <h1 className="mt-1 text-3xl font-bold uppercase">DAILY JAM — SAY <span className="text-dac-red">GM</span> ON-CHAIN</h1>
        <p className="mt-2 max-w-xl text-xs font-mono text-ink/60 leading-relaxed">
          // ONE JAM PER RECIPIENT PER UTC DAY. NOTE ≤ 140 CHARS. +5 DACP EACH.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="card card-strip p-6 lg:col-span-2 space-y-4">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-sys text-ink/60">RECIPIENT</span>
            <input
              value={to} onChange={(e) => setTo(e.target.value)}
              placeholder="0x..."
              className="input-sys mt-1.5"
            />
            {to && !validAddr && <span className="block mt-1 font-mono text-[10px] uppercase tracking-sys text-dac-red">INVALID ADDRESS</span>}
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-sys text-ink/60">NOTE ({note.length}/140)</span>
            <input
              value={note} onChange={(e) => setNote(e.target.value.slice(0, 140))}
              placeholder="gm"
              className="input-sys mt-1.5"
            />
          </label>
          <div className="pt-2">
            <TxButton
              disabled={!ready}
              abi={dailyJamAbi}
              address={addresses.DailyJam}
              functionName="sendJam"
              args={[validAddr ? (to as `0x${string}`) : "0x0000000000000000000000000000000000000000", note]}
              successLabel={`JAM → ${shortAddr(to)}`}
              onSuccess={() => setNote("gm")}
            >
              <Send className="h-3.5 w-3.5" /> SEND JAM
            </TxButton>
          </div>
        </div>

        <div className="card p-6">
          <div className="sys-label">JAM.STATS</div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="border-2 border-ink p-3">
              <div className="text-2xl font-bold">{sent.toString()}</div>
              <div className="font-mono text-[10px] uppercase tracking-sys text-ink/60 mt-1">SENT</div>
            </div>
            <div className="border-2 border-ink p-3">
              <div className="text-2xl font-bold">{received.toString()}</div>
              <div className="font-mono text-[10px] uppercase tracking-sys text-ink/60 mt-1">RECV</div>
            </div>
          </div>
          <div className="mt-3 chip">
            <Plus className="h-2.5 w-2.5 text-dac-orange" /> 5 DACP / JAM
          </div>
        </div>
      </div>

      <section>
        <div className="sys-label mb-3">FEED.LIVE</div>
        <div className="card divide-y-2 divide-ink">
          {recent.length === 0 && (
            <div className="p-6 font-mono text-xs uppercase tracking-sys text-ink/50">
              // WAITING FOR FRESH JAMS… SEND ONE ABOVE.
            </div>
          )}
          {recent.map((j, i) => (
            <div key={i} className="p-3 flex items-center justify-between gap-3 hover:bg-paper-soft">
              <div className="font-mono text-xs">
                <a className="text-ink underline" href={explorerAddr(j.from)} target="_blank" rel="noreferrer">{shortAddr(j.from)}</a>
                <span className="text-ink/40"> → </span>
                <a className="text-dac-red underline" href={explorerAddr(j.to)} target="_blank" rel="noreferrer">{shortAddr(j.to)}</a>
                <span className="text-ink/70 ml-2">"{j.note}"</span>
              </div>
              <div className="chip">DAY {j.day?.toString()}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
