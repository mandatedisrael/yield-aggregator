const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Get contract instances
  const mockUSDC = await ethers.getContractAt("MockERC20", "0x8e94F943eB2E45A1c614bA38b70fc6eD343cf09e");
  const usdcVault = await ethers.getContractAt("YieldVault", "0x32130D709DEC6d4B8B6D83c5bCa6Ba4F40F3af42");

  console.log("\n--- Debug Information ---");
  
  // Check token balances
  const usdcBalance = await mockUSDC.balanceOf(deployer.address);
  console.log("USDC balance:", ethers.formatUnits(usdcBalance, 18));
  
  const vaultUSDCBalance = await mockUSDC.balanceOf(await usdcVault.getAddress());
  console.log("Vault USDC balance:", ethers.formatUnits(vaultUSDCBalance, 18));
  
  // Check vault shares
  const vaultShares = await usdcVault.balanceOf(deployer.address);
  console.log("Vault shares:", ethers.formatUnits(vaultShares, 18));
  
  // Check total supply
  const totalShares = await usdcVault.totalSupply();
  console.log("Total shares:", ethers.formatUnits(totalShares, 18));
  
  // Check total assets
  const totalAssets = await usdcVault.totalAssets();
  console.log("Total assets:", ethers.formatUnits(totalAssets, 18));
  
  // Check conversion rates
  const sharesForAssets = await usdcVault.previewDeposit(ethers.parseUnits("1000", 18));
  console.log("Shares for 1000 assets:", ethers.formatUnits(sharesForAssets, 18));
  
  const assetsForShares = await usdcVault.previewRedeem(ethers.parseUnits("1000", 18));
  console.log("Assets for 1000 shares:", ethers.formatUnits(assetsForShares, 18));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 