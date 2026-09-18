import { ethers } from "hardhat";

async function main() {
  const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
  const contract = await Crowdfunding.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("Crowdfunding deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
