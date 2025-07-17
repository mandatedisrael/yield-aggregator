const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  const mockToken = await ethers.getContractAt("USDC", "0x32130D709DEC6d4B8B6D83c5bCa6Ba4F40F3af42");
  const tokenVault = await ethers.getContractAt("Vault", "0x40dD237C6a74afcEb774aa8E0dFa51bedD386543");

  // Approve vault to spend 1000 tokens
  await mockToken.approve(tokenVault.target, ethers.parseEther("1000"));
  console.log("Approved vault to spend 1000 tokens");

  // Deposit 1000 tokens
  await tokenVault.deposit(ethers.parseEther("1000"), deployer.address);
  console.log("Deposited 1000 tokens");

  // Check vault share balance
  const balance = await tokenVault.balanceOf(deployer.address);
  console.log("Vault shares (vTKN):", ethers.formatEther(balance));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});