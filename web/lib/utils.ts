import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortAddr(a?: string) {
  if (!a) return "";
  return a.slice(0, 6) + "…" + a.slice(-4);
}

export function explorerTx(hash: string) {
  return `https://exptest.dachain.tech/tx/${hash}`;
}

export function explorerAddr(addr: string) {
  return `https://exptest.dachain.tech/address/${addr}`;
}

export function secondsUntilUtcMidnight(): number {
  const now = new Date();
  const next = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0
  ));
  return Math.floor((next.getTime() - now.getTime()) / 1000);
}

export function fmtCountdown(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}
