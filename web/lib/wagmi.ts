import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { dacTestnet } from "./chain";
import { http } from "viem";

export const wagmiConfig = getDefaultConfig({
  appName: "DAC Daily",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "DAC_DAILY_DEV",
  chains: [dacTestnet],
  transports: {
    [dacTestnet.id]: http("https://rpctest.dachain.tech"),
  },
  ssr: true,
});
