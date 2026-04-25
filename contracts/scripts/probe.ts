import { ethers } from "hardhat";

async function main() {
  const [d] = await ethers.getSigners();
  console.log("from:", d.address);
  const fee = await ethers.provider.getFeeData();
  console.log("fee:", {
    gasPrice: fee.gasPrice?.toString(),
    maxFeePerGas: fee.maxFeePerGas?.toString(),
    maxPriorityFeePerGas: fee.maxPriorityFeePerGas?.toString(),
  });

  const Points = await ethers.getContractFactory("ActivityPoints");
  const dep = await Points.getDeployTransaction(d.address);
  const est = await ethers.provider.estimateGas({ ...dep, from: d.address });
  console.log("ActivityPoints estimateGas:", est.toString());

  // Try a tiny self-transfer at 1 gwei to see if RPC accepts low fees
  try {
    const tx = await d.sendTransaction({
      to: d.address, value: 0n, gasPrice: 1_000_000_000n, gasLimit: 21000n,
    });
    console.log("low-fee tx hash:", tx.hash);
    const r = await tx.wait(1);
    console.log("mined block:", r?.blockNumber);
  } catch (e: any) {
    console.log("low-fee failed:", e?.shortMessage ?? e?.message ?? e);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
