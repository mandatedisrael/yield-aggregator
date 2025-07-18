// const hre = require("hardhat");

// async function main() {
//   const [deployer] = await hre.ethers.getSigners();
//   console.log("Deploying contracts with account:", deployer.address);

//   // Deploy zpUSDC token contract
//   const ZpUSDC = await hre.ethers.getContractFactory("USDC");
//   console.log("USDC contract factory loaded");
//   const zpUSDC = await ZpUSDC.deploy();
//   console.log("USDC deployment transaction sent");
//   await zpUSDC.waitForDeployment();
//   const zpUSDCAddress = await zpUSDC.getAddress();
//   console.log("USDC deployed to:", zpUSDCAddress);

//   // Deploy Vault contract, passing the zpUSDC address as the asset
//   const Vault = await hre.ethers.getContractFactory("Vault");
//   console.log("Vault contract factory loaded");
//   const vault = await Vault.deploy(zpUSDCAddress);
//   console.log("Vault deployment transaction sent");
//   await vault.waitForDeployment();
//   const vaultAddress = await vault.getAddress();
//   console.log("Vault deployed to:", vaultAddress);

//   console.log("--- Deployment script finished ---");
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  try {
    // Deploy Mock USDC
    console.log("\n--- Deploying Mock USDC ---");
    const MockToken = await ethers.getContractFactory("MockERC20");
    const mockUSDC = await MockToken.deploy(
      "Mock USDC",
      "USDC",
      deployer.address, // initialAccount: deployer gets tokens
      ethers.parseUnits("1000000", 18) // initialBalance: 1M tokens
    );
    console.log("Mock USDC deployment transaction sent, waiting for confirmation...");
    await mockUSDC.waitForDeployment();
    const mockUSDCAddress = await mockUSDC.getAddress();
    console.log("Mock USDC deployed at:", mockUSDCAddress);

    // Mint additional tokens for testing
    console.log("Minting additional USDC tokens...");
    const mintTx = await mockUSDC.mint(deployer.address, ethers.parseUnits("1000", 18));
    await mintTx.wait();
    console.log("Additional USDC tokens minted successfully");

    // Deploy USDC Vault
    console.log("\n--- Deploying USDC Vault ---");
    const mockAavePool = "0x0000000000000000000000000000000000000000";
    const YieldVault = await ethers.getContractFactory("YieldVault");
    const usdcVault = await YieldVault.deploy(
      mockUSDCAddress,
      "ZeroPulse USDC",
      "zpUSDC",
      mockAavePool
    );
    console.log("USDC Vault deployment transaction sent, waiting for confirmation...");
    await usdcVault.waitForDeployment();
    const usdcVaultAddress = await usdcVault.getAddress();
    console.log("USDC Vault deployed at:", usdcVaultAddress);

    // Deploy Mock DAI and DAI Vault
    console.log("\n--- Deploying Mock DAI ---");
    const mockDAI = await MockToken.deploy(
      "Mock DAI",
      "DAI",
      deployer.address, // initialAccount: deployer gets tokens
      ethers.parseUnits("1000000", 18) // initialBalance: 1M tokens
    );
    console.log("Mock DAI deployment transaction sent, waiting for confirmation...");
    await mockDAI.waitForDeployment();
    const mockDAIAddress = await mockDAI.getAddress();
    console.log("Mock DAI deployed at:", mockDAIAddress);

    console.log("\n--- Deploying DAI Vault ---");
    const daiVault = await YieldVault.deploy(
      mockDAIAddress,
      "Vault DAI",
      "zpDAI",
      mockAavePool
    );
    console.log("DAI Vault deployment transaction sent, waiting for confirmation...");
    await daiVault.waitForDeployment();
    const daiVaultAddress = await daiVault.getAddress();
    console.log("DAI Vault deployed at:", daiVaultAddress);

    console.log("\n--- Deployment Summary ---");
    console.log("Mock USDC:", mockUSDCAddress);
    console.log("USDC Vault:", usdcVaultAddress);
    console.log("Mock DAI:", mockDAIAddress);
    console.log("DAI Vault:", daiVaultAddress);

  } catch (error) {
    console.error("Deployment failed with error:", error);
    if (error.transaction) {
      console.error("Transaction hash:", error.transaction.hash);
    }
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
