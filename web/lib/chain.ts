import { defineChain } from "viem";

export const dacTestnet = defineChain({
  id: 21894,
  name: "DAC Testnet",
  nativeCurrency: { name: "DACC", symbol: "DACC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpctest.dachain.tech"] },
    public: { http: ["https://rpctest.dachain.tech"] },
  },
  blockExplorers: {
    default: { name: "DAC Explorer", url: "https://exptest.dachain.tech" },
  },
  testnet: true,
});
