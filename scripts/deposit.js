const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Get contract instances with correct addresses and names
  const mockUSDC = await ethers.getContractAt("MockERC20", "0x8e94F943eB2E45A1c614bA38b70fc6eD343cf09e");
  const usdcVault = await ethers.getContractAt("YieldVault", "0x32130D709DEC6d4B8B6D83c5bCa6Ba4F40F3af42");
  const mockDAI = await ethers.getContractAt("MockERC20", "0x40dD237C6a74afcEb774aa8E0dFa51bedD386543");
  const daiVault = await ethers.getContractAt("YieldVault", "0xb85521a9Aafb8c69d149899A3c31D6ea8AC956d4");

  console.log("\n--- USDC Operations ---");
  
  // Check USDC balance first
  const usdcBalance = await mockUSDC.balanceOf(deployer.address);
  console.log("USDC balance:", ethers.formatUnits(usdcBalance, 18));

  // Approve vault to spend 1000 USDC tokens
  const usdcVaultAddress = await usdcVault.getAddress();
  const approveUSDC = await mockUSDC.approve(usdcVaultAddress, ethers.parseUnits("1000", 18));
  await approveUSDC.wait();
  console.log("Approved USDC vault to spend 1000 tokens");

  // Deposit 1000 USDC tokens
  const depositUSDC = await usdcVault.deposit(ethers.parseUnits("1000", 18), deployer.address);
  await depositUSDC.wait();
  console.log("Deposited 1000 USDC tokens");

  // Check vault share balance
  const zpUSDCBalance = await usdcVault.balanceOf(deployer.address);
  console.log("USDC Vault shares (zpUSDC):", ethers.formatUnits(zpUSDCBalance, 18));

  console.log("\n--- DAI Operations ---");

  // Check DAI balance first
  const daiBalance = await mockDAI.balanceOf(deployer.address);
  console.log("DAI balance:", ethers.formatUnits(daiBalance, 18));

  // Approve vault to spend 1000 DAI tokens
  const daiVaultAddress = await daiVault.getAddress();
  const approveDAI = await mockDAI.approve(daiVaultAddress, ethers.parseUnits("1000", 18));
  await approveDAI.wait();
  console.log("Approved DAI vault to spend 1000 tokens");

  // Deposit 1000 DAI tokens
  const depositDAI = await daiVault.deposit(ethers.parseUnits("1000", 18), deployer.address);
  await depositDAI.wait();
  console.log("Deposited 1000 DAI tokens");

  // Check vault share balance
  const zpDAIBalance = await daiVault.balanceOf(deployer.address);
  console.log("DAI Vault shares (zpDAI):", ethers.formatUnits(zpDAIBalance, 18));

  console.log("\n--- Summary ---");
  console.log("USDC Vault shares:", ethers.formatUnits(zpUSDCBalance, 18));
  console.log("DAI Vault shares:", ethers.formatUnits(zpDAIBalance, 18));
  
  // Check final token balances
  const finalUSDCBalance = await mockUSDC.balanceOf(deployer.address);
  const finalDAIBalance = await mockDAI.balanceOf(deployer.address);
  console.log("Final USDC balance:", ethers.formatUnits(finalUSDCBalance, 18));
  console.log("Final DAI balance:", ethers.formatUnits(finalDAIBalance, 18));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});