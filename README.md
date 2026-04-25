# DAC Daily

Daily activity dApp on **DA Chain Testnet** (chain `21894`, currency `DACC`, RPC `https://rpctest.dachain.tech`, explorer `https://exptest.dachain.tech`).

Users check in daily, send Daily Jam, complete 16 quests, mint daily badge NFTs, spin a luck wheel, and climb a leaderboard. Designed so an active user racks up **10–20 transactions per day**.

```
.
├── contracts/   # Hardhat + Solidity 0.8.24 (OpenZeppelin)
└── web/         # Next.js 14 + wagmi v2 + RainbowKit + Tailwind
```

## Stack
- **Smart contracts:** Solidity 0.8.24, Hardhat, OpenZeppelin (AccessControl, ERC721)
- **Frontend:** Next.js 14 App Router, TypeScript, TailwindCSS, framer-motion, lucide-react
- **Web3:** wagmi v2, viem, RainbowKit (custom dark/quantum theme), TanStack Query, react-hot-toast

## Contracts

| Contract        | Purpose |
|-----------------|---------|
| `ActivityPoints`| ERC20-like non-transfer points (`DACP`). Awarded by other contracts via `MINTER_ROLE`. |
| `DailyCheckIn`  | One check-in per UTC day. Tracks streak, longest, totalCheckIns. Bonus DACP for 7+ / 30+ day streaks. |
| `DailyJam`      | Send daily greeting to another address (1 per recipient/day, 140-char note). |
| `DailyTasks`    | 16 daily micro-tasks tracked via uint32 bitmap per `(user, day)`. |
| `DailyBadge`    | ERC721 — one badge mintable per UTC day. |
| `SpinWheel`     | Random 2–50 DACP per UTC day, on-chain randomness from `prevrandao`. |
| `Leaderboard`   | Read aggregator + opt-in registry. Returns paginated entries with points/streak/check-ins. |

## Quick start

### 1. Deploy contracts

```bash
cd contracts
cp .env.example .env   # add PRIVATE_KEY of a funded DACC testnet wallet
npm install
npx hardhat compile
npm run deploy         # deploys all 7 contracts to DAC Testnet
```

`deploy.ts` writes deployed addresses to:
- `contracts/deployments.json`
- `web/lib/deployments.json`  ← consumed by frontend automatically

### 2. Run frontend

```bash
cd web
cp .env.example .env.local   # optional WalletConnect projectId
npm install
npm run dev                  # http://localhost:3000
```

## Pages

| Route | What |
|-------|------|
| `/` | Landing — hero, "Add DAC Testnet" button, feature grid |
| `/dashboard` | Streak, points, check-in, badge mint, spin wheel, jam shortcut |
| `/quests` | 16 daily quest cards w/ live progress bar + bitmap |
| `/jam` | Send daily Jam, live event feed of jams across the network |
| `/leaderboard` | Top 100 by DACP points, with podium + table |
| `/profile/[address]` | Public profile of any wallet |

## Theme
Dark quantum theme matching DAC Inception's cosmic feel:
- Background: `#07060f` (deep void)
- Brand gradient: indigo `#6366f1` → violet `#8b5cf6` → cyan `#06b6d4`
- Glow shadows + radial halos on cards
- Inter / JetBrains Mono fonts

## How it hits 10–20 tx/day
1. Daily check-in (1)
2. Daily badge mint (1)
3. Daily spin (1)
4. Send 2–3 Jams to friends (2–3)
5. Complete 10–15 of the 16 quests (10–15)
6. Leaderboard registration (1, one-time)

→ **15–22 transactions** per active user per day.

## Notes
- Day boundary uses UTC (`block.timestamp / 1 days`). All check-ins / jams / mints / spins reset at 00:00 UTC.
- Spin randomness uses `block.prevrandao` — fine for testnet, NOT for mainnet rewards. Replace with VRF or commit-reveal for prod.
- Activity Points are non-transferable on purpose (no `transfer` function) — they're a reputation score, not a token.
