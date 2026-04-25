import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  const bal = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(bal), "DACC");

  const Points = await ethers.getContractFactory("ActivityPoints");
  const points = await Points.deploy(deployer.address);
  await points.waitForDeployment();
  const pointsAddr = await points.getAddress();
  console.log("ActivityPoints:", pointsAddr);

  const CheckIn = await ethers.getContractFactory("DailyCheckIn");
  const checkIn = await CheckIn.deploy(pointsAddr);
  await checkIn.waitForDeployment();
  const checkInAddr = await checkIn.getAddress();
  console.log("DailyCheckIn:", checkInAddr);

  const Jam = await ethers.getContractFactory("DailyJam");
  const jam = await Jam.deploy(pointsAddr);
  await jam.waitForDeployment();
  const jamAddr = await jam.getAddress();
  console.log("DailyJam:", jamAddr);

  const Tasks = await ethers.getContractFactory("DailyTasks");
  const tasks = await Tasks.deploy(pointsAddr);
  await tasks.waitForDeployment();
  const tasksAddr = await tasks.getAddress();
  console.log("DailyTasks:", tasksAddr);

  const Badge = await ethers.getContractFactory("DailyBadge");
  const badge = await Badge.deploy(pointsAddr);
  await badge.waitForDeployment();
  const badgeAddr = await badge.getAddress();
  console.log("DailyBadge:", badgeAddr);

  const Spin = await ethers.getContractFactory("SpinWheel");
  const spin = await Spin.deploy(pointsAddr);
  await spin.waitForDeployment();
  const spinAddr = await spin.getAddress();
  console.log("SpinWheel:", spinAddr);

  const Lb = await ethers.getContractFactory("Leaderboard");
  const lb = await Lb.deploy(pointsAddr, checkInAddr);
  await lb.waitForDeployment();
  const lbAddr = await lb.getAddress();
  console.log("Leaderboard:", lbAddr);

  for (const addr of [checkInAddr, jamAddr, tasksAddr, badgeAddr, spinAddr]) {
    const tx = await points.setMinter(addr, true);
    await tx.wait();
    console.log("setMinter →", addr);
  }

  const out = {
    chainId: 21894,
    network: "dacTestnet",
    contracts: {
      ActivityPoints: pointsAddr,
      DailyCheckIn: checkInAddr,
      DailyJam: jamAddr,
      DailyTasks: tasksAddr,
      DailyBadge: badgeAddr,
      SpinWheel: spinAddr,
      Leaderboard: lbAddr,
    },
  };

  const outPath = path.join(__dirname, "../deployments.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log("Saved", outPath);

  const webOut = path.join(__dirname, "../../web/lib/deployments.json");
  fs.mkdirSync(path.dirname(webOut), { recursive: true });
  fs.writeFileSync(webOut, JSON.stringify(out, null, 2));
  console.log("Saved", webOut);
}

main().catch((e) => { console.error(e); process.exit(1); });
