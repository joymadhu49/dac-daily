"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { Toaster } from "react-hot-toast";
import { wagmiConfig } from "@/lib/wagmi";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={qc}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: "#0a1628",
            accentColorForeground: "#f5c842",
            borderRadius: "none",
            fontStack: "system",
            overlayBlur: "small",
          })}
          modalSize="compact"
          showRecentTransactions
        >
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#f7f1de",
                color: "#0a1628",
                border: "2px solid #0a1628",
                borderRadius: 0,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 12,
                fontWeight: 600,
              },
            }}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
