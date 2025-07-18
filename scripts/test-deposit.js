const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Testing with account:", deployer.address);

  // Get contract instances with new addresses
  const mockUSDC = await ethers.getContractAt("MockERC20", "0xc56F448F8FB47ca73A70f72aA10ff64aa36199C6");
  const usdcVault = await ethers.getContractAt("YieldVault", "0xB34613bBDA8292FB1590d03Ed0142f7FE399F3dA");

  console.log("\n--- Testing USDC Vault ---");
  
  // Check balances
  const usdcBalance = await mockUSDC.balanceOf(deployer.address);
  console.log("USDC balance:", ethers.formatUnits(usdcBalance, 18));
  
  const vaultShares = await usdcVault.balanceOf(deployer.address);
  console.log("Vault shares:", ethers.formatUnits(vaultShares, 18));
  
  const totalAssets = await usdcVault.totalAssets();
  console.log("Total assets in vault:", ethers.formatUnits(totalAssets, 18));

  // Test deposit
  console.log("\n--- Testing Deposit ---");
  
  // Approve vault to spend 100 USDC tokens
  const approveTx = await mockUSDC.approve(await usdcVault.getAddress(), ethers.parseUnits("100", 18));
  await approveTx.wait();
  console.log("Approved vault to spend 100 USDC");

  // Deposit 100 USDC tokens
  const depositTx = await usdcVault.deposit(ethers.parseUnits("100", 18), deployer.address);
  await depositTx.wait();
  console.log("Deposited 100 USDC tokens");

  // Check new balances
  const newUsdcBalance = await mockUSDC.balanceOf(deployer.address);
  console.log("New USDC balance:", ethers.formatUnits(newUsdcBalance, 18));
  
  const newVaultShares = await usdcVault.balanceOf(deployer.address);
  console.log("New vault shares:", ethers.formatUnits(newVaultShares, 18));
  
  const newTotalAssets = await usdcVault.totalAssets();
  console.log("New total assets in vault:", ethers.formatUnits(newTotalAssets, 18));

  console.log("\n--- Test completed successfully! ---");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}); 