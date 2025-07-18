const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Debugging with account:", deployer.address);

  // Get contract instances with current addresses
  const mockUSDC = await ethers.getContractAt("MockERC20", "0xc56F448F8FB47ca73A70f72aA10ff64aa36199C6");
  const usdcVault = await ethers.getContractAt("YieldVault", "0xB34613bBDA8292FB1590d03Ed0142f7FE399F3dA");

  console.log("\n--- Contract Addresses ---");
  console.log("Mock USDC:", await mockUSDC.getAddress());
  console.log("USDC Vault:", await usdcVault.getAddress());

  console.log("\n--- Testing Allowance ---");
  
  try {
    // Test allowance call
    const allowance = await mockUSDC.allowance(deployer.address, await usdcVault.getAddress());
    console.log("Current allowance:", ethers.formatUnits(allowance, 18));
  } catch (error) {
    console.error("Allowance call failed:", error.message);
  }

  try {
    // Test balance call
    const balance = await mockUSDC.balanceOf(deployer.address);
    console.log("USDC balance:", ethers.formatUnits(balance, 18));
  } catch (error) {
    console.error("Balance call failed:", error.message);
  }

  try {
    // Test vault balance
    const vaultBalance = await usdcVault.balanceOf(deployer.address);
    console.log("Vault shares:", ethers.formatUnits(vaultBalance, 18));
  } catch (error) {
    console.error("Vault balance call failed:", error.message);
  }

  console.log("\n--- Testing Approval ---");
  
  try {
    // Try to approve
    const approveTx = await mockUSDC.approve(await usdcVault.getAddress(), ethers.parseUnits("100", 18));
    console.log("Approval transaction sent:", approveTx.hash);
    await approveTx.wait();
    console.log("Approval successful!");
    
    // Check allowance again
    const newAllowance = await mockUSDC.allowance(deployer.address, await usdcVault.getAddress());
    console.log("New allowance:", ethers.formatUnits(newAllowance, 18));
  } catch (error) {
    console.error("Approval failed:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}); 