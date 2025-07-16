const hre = require("hardhat");
const { ethers } = hre;

// Compatibility for ethers v5 and v6
const parseEther = ethers.utils?.parseEther || ethers.parseEther;
const formatEther = ethers.utils?.formatEther || ethers.formatEther;

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const mockToken = await ethers.getContractAt("zpUSDC", "0x51846e77aD3Dfee71aEC438463b716Af8376684B");
  const tokenVault = await ethers.getContractAt("Vault", "0x0f84cD18bb80004cfd164247D985067a19942694");

  // Debug logs to check for null/undefined addresses
  console.log("deployerAddress:", deployerAddress);
  console.log("mockToken address:", mockToken.target || mockToken.address);
  console.log("tokenVault address:", tokenVault.target || tokenVault.address);

  if (!deployerAddress || !(mockToken.target || mockToken.address) || !(tokenVault.target || tokenVault.address)) {
    throw new Error("One or more contract addresses are null or undefined. Please check deployment and addresses.");
  }

  // Approve vault to spend 1000 tokens
  await mockToken.approve(tokenVault.target || tokenVault.address, parseEther("1000"));
  console.log("Approved vault to spend 1000 tokens");

  // Deposit 1000 tokens
  await tokenVault.deposit(parseEther("1000"), deployerAddress);
  console.log("Deposited 1000 tokens");

  // Check vault share balance
  const balance = await tokenVault.balanceOf(deployerAddress);
  console.log("Vault shares (vTKN):", formatEther(balance));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});