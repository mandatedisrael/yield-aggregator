// Contract addresses from your deployment
export const CONTRACT_ADDRESSES = {
  mockUSDC: "0xc56F448F8FB47ca73A70f72aA10ff64aa36199C6",
  usdcVault: "0xB34613bBDA8292FB1590d03Ed0142f7FE399F3dA",
  mockDAI: "0x1A00D7F9C5dd2FA07366fFCad10FCcBc8f2Aca72",
  daiVault: "0xa01901D60066D2B3d151aA0be359eCb1fE828996"
}

// Network configuration
export const NETWORK_CONFIG = {
  chainId: "0x40d9", // 16601 in hex
  chainName: "0G Testnet",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18
  },
  rpcUrls: ["https://evmrpc-testnet.0g.ai"],
  blockExplorerUrls: ["https://testnet.0g.ai"]
} 