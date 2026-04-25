import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: { enabled: true, runs: 1 },
      viaIR: true,
      evmVersion: "london",
    },
  },
  networks: {
    dacTestnet: {
      url: "https://rpctest.dachain.tech",
      chainId: 21894,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: 5_000_000_000,
    },
  },
};

export default config;
