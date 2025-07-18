const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Checking balances for account:", deployer.address);

  // Get contract instances
  const mockUSDC = await ethers.getContractAt("MockERC20", "0xc56F448F8FB47ca73A70f72aA10ff64aa36199C6");
  const usdcVault = await ethers.getContractAt("YieldVault", "0xB34613bBDA8292FB1590d03Ed0142f7FE399F3dA");
  const mockDAI = await ethers.getContractAt("MockERC20", "0x1A00D7F9C5dd2FA07366fFCad10FCcBc8f2Aca72");
  const daiVault = await ethers.getContractAt("YieldVault", "0xa01901D60066D2B3d151aA0be359eCb1fE828996");

  console.log("\n=== Current Balances ===");
  
  // USDC balances
  const usdcBalance = await mockUSDC.balanceOf(deployer.address);
  const usdcVaultShares = await usdcVault.balanceOf(deployer.address);
  const usdcVaultAssets = await usdcVault.totalAssets();
  
  console.log("USDC Balance:", ethers.formatUnits(usdcBalance, 18));
  console.log("USDC Vault Shares:", ethers.formatUnits(usdcVaultShares, 18));
  console.log("USDC Vault Total Assets:", ethers.formatUnits(usdcVaultAssets, 18));
  
  // DAI balances
  const daiBalance = await mockDAI.balanceOf(deployer.address);
  const daiVaultShares = await daiVault.balanceOf(deployer.address);
  const daiVaultAssets = await daiVault.totalAssets();
  
  console.log("\nDAI Balance:", ethers.formatUnits(daiBalance, 18));
  console.log("DAI Vault Shares:", ethers.formatUnits(daiVaultShares, 18));
  console.log("DAI Vault Total Assets:", ethers.formatUnits(daiVaultAssets, 18));
  
  console.log("\n=== Contract Addresses ===");
  console.log("Mock USDC:", await mockUSDC.getAddress());
  console.log("USDC Vault:", await usdcVault.getAddress());
  console.log("Mock DAI:", await mockDAI.getAddress());
  console.log("DAI Vault:", await daiVault.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}); 