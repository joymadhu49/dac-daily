import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { NetworkBanner } from "@/components/NetworkBanner";

export const metadata: Metadata = {
  title: "DAC DAILY — sys://daily.activity",
  description:
    "Daily on-chain rituals on DAC Inception Testnet. Check-in, jam, quests, badges, spin.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="tape-bar" />
          <div className="min-h-screen flex flex-col">
            <Header />
            <NetworkBanner />
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 animate-fade-in">
              {children}
            </main>
            <footer className="border-t-2 border-ink py-4">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between text-[10px] uppercase tracking-sys font-mono text-ink/60">
                <span>DAC DAILY · v0.1.0</span>
                <span>SYS://CHAIN.21894 · DACC</span>
                <span>DAC LABS © 2026</span>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
