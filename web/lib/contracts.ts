import deployments from "./deployments.json";

export const addresses = deployments.contracts as Record<string, `0x${string}`>;

export const activityPointsAbi = [
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "u", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
] as const;

export const dailyCheckInAbi = [
  {
    type: "function", name: "stats", stateMutability: "view",
    inputs: [{ name: "u", type: "address" }],
    outputs: [
      { name: "lastCheckInDay", type: "uint64" },
      { name: "streak", type: "uint64" },
      { name: "longestStreak", type: "uint64" },
      { name: "totalCheckIns", type: "uint64" },
    ],
  },
  { type: "function", name: "hasCheckedInToday", stateMutability: "view", inputs: [{ name: "u", type: "address" }], outputs: [{ type: "bool" }] },
  { type: "function", name: "currentDay", stateMutability: "view", inputs: [], outputs: [{ type: "uint64" }] },
  { type: "function", name: "checkIn", stateMutability: "nonpayable", inputs: [], outputs: [] },
  {
    type: "event", name: "CheckedIn",
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "day", type: "uint64" },
      { indexed: false, name: "streak", type: "uint64" },
      { indexed: false, name: "totalCheckIns", type: "uint64" },
    ],
  },
] as const;

export const dailyJamAbi = [
  { type: "function", name: "sendJam", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "note", type: "string" }], outputs: [] },
  { type: "function", name: "jamsSent", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "jamsReceived", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "lastJamDay", stateMutability: "view", inputs: [{ type: "address" }, { type: "address" }], outputs: [{ type: "uint64" }] },
  {
    type: "event", name: "JamSent",
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "day", type: "uint64" },
      { indexed: false, name: "note", type: "string" },
    ],
  },
] as const;

export const dailyTasksAbi = [
  { type: "function", name: "TASK_COUNT", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "taskName", stateMutability: "view", inputs: [{ type: "uint8" }], outputs: [{ type: "string" }] },
  { type: "function", name: "taskReward", stateMutability: "view", inputs: [{ type: "uint8" }], outputs: [{ type: "uint16" }] },
  { type: "function", name: "todayBitmap", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint32" }] },
  { type: "function", name: "completeTask", stateMutability: "nonpayable", inputs: [{ name: "taskId", type: "uint8" }, { name: "payload", type: "string" }], outputs: [] },
] as const;

export const dailyBadgeAbi = [
  { type: "function", name: "mintDaily", stateMutability: "nonpayable", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "lastMintDay", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint64" }] },
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "currentDay", stateMutability: "view", inputs: [], outputs: [{ type: "uint64" }] },
] as const;

export const spinWheelAbi = [
  { type: "function", name: "spin", stateMutability: "nonpayable", inputs: [], outputs: [{ type: "uint256" }, { type: "uint8" }] },
  { type: "function", name: "lastSpinDay", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint64" }] },
  { type: "function", name: "totalWon", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  {
    type: "event", name: "Spun",
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "day", type: "uint64" },
      { indexed: false, name: "reward", type: "uint256" },
      { indexed: false, name: "segment", type: "uint8" },
    ],
  },
] as const;

export const leaderboardAbi = [
  { type: "function", name: "register", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "totalRegistered", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    type: "function", name: "page", stateMutability: "view",
    inputs: [{ name: "start", type: "uint256" }, { name: "size", type: "uint256" }],
    outputs: [{
      type: "tuple[]",
      components: [
        { name: "user", type: "address" },
        { name: "points", type: "uint256" },
        { name: "streak", type: "uint64" },
        { name: "totalCheckIns", type: "uint64" },
      ],
    }],
  },
] as const;
