import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Wallet, TrendingUp, Coins, ArrowUpDown, RefreshCw } from 'lucide-react'
import VaultCard from './components/VaultCard'
import ConnectWallet from './components/ConnectWallet'
import Notification from './components/Notification'
import { CONTRACT_ADDRESSES } from './config'

function App() {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentNetwork, setCurrentNetwork] = useState(null)
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success',
    title: '',
    message: ''
  })

  // Contract instances
  const [contracts, setContracts] = useState({
    mockUSDC: null,
    usdcVault: null,
    mockDAI: null,
    daiVault: null
  })

  // Balances and state
  const [balances, setBalances] = useState({
    usdc: '0',
    usdcVault: '0',
    dai: '0',
    daiVault: '0'
  })

  useEffect(() => {
    checkConnection()
    
    // Listen for network changes
    if (typeof window.ethereum !== 'undefined') {
      const handleNetworkChange = async () => {
        console.log('Network changed, reconnecting...')
        if (isConnected) {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const network = await provider.getNetwork()
          setCurrentNetwork(network)
          console.log('New network:', network)
        }
      }
      
      window.ethereum.on('chainChanged', handleNetworkChange)
      
      return () => {
        window.ethereum.removeListener('chainChanged', handleNetworkChange)
      }
    }
  }, [isConnected])

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          await connectWallet()
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      showNotification('error', 'MetaMask Required', 'Please install MetaMask to use this app')
      return
    }

    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()

      setProvider(provider)
      setSigner(signer)
      setAccount(address)
      setIsConnected(true)
      setCurrentNetwork(network)

      // Initialize contracts
      await initializeContracts(signer)

      // Listen for account changes
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
          // User disconnected
          setAccount(null)
          setIsConnected(false)
          setProvider(null)
          setSigner(null)
          setCurrentNetwork(null)
          setContracts({})
          setBalances({ usdc: '0', usdcVault: '0', dai: '0', daiVault: '0' })
        } else {
          // Account changed
          const newSigner = await provider.getSigner()
          const newAddress = await newSigner.getAddress()
          setAccount(newAddress)
          setSigner(newSigner)
          await initializeContracts(newSigner)
        }
      })

      // Listen for network changes
      window.ethereum.on('chainChanged', async (chainId) => {
        const newNetwork = await provider.getNetwork()
        setCurrentNetwork(newNetwork)
        
        if (newNetwork.chainId !== 16601n) {
          showNotification('warning', 'Wrong Network', 'Please switch to 0G Testnet')
        }
      })

    } catch (error) {
      console.error('Error connecting wallet:', error)
      showNotification('error', 'Connection Failed', 'Failed to connect wallet. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const initializeContracts = async (signer) => {
    try {
      // MockERC20 ABI (simplified for basic functions)
      const mockERC20ABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function approve(address spender, uint256 amount) returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)",
        "function transfer(address to, uint256 amount) returns (bool)"
      ]

      // ERC4626 Vault ABI (simplified)
      const vaultABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function totalSupply() view returns (uint256)",
        "function totalAssets() view returns (uint256)",
        "function deposit(uint256 assets, address receiver) returns (uint256)",
        "function withdraw(uint256 assets, address receiver, address owner) returns (uint256)",
        "function previewDeposit(uint256 assets) view returns (uint256)",
        "function previewWithdraw(uint256 assets) view returns (uint256)"
      ]

      const mockUSDC = new ethers.Contract(CONTRACT_ADDRESSES.mockUSDC, mockERC20ABI, signer)
      const usdcVault = new ethers.Contract(CONTRACT_ADDRESSES.usdcVault, vaultABI, signer)
      const mockDAI = new ethers.Contract(CONTRACT_ADDRESSES.mockDAI, mockERC20ABI, signer)
      const daiVault = new ethers.Contract(CONTRACT_ADDRESSES.daiVault, vaultABI, signer)

      setContracts({
        mockUSDC,
        usdcVault,
        mockDAI,
        daiVault
      })

      // Load initial balances
      const userAddress = await signer.getAddress()
      await loadBalances(userAddress, mockUSDC, usdcVault, mockDAI, daiVault)

    } catch (error) {
      console.error('Error initializing contracts:', error)
    }
  }

  const loadBalances = async (userAddress, mockUSDC, usdcVault, mockDAI, daiVault) => {
    try {
      const [
        usdcBalance,
        usdcVaultBalance,
        daiBalance,
        daiVaultBalance
      ] = await Promise.all([
        mockUSDC.balanceOf(userAddress),
        usdcVault.balanceOf(userAddress),
        mockDAI.balanceOf(userAddress),
        daiVault.balanceOf(userAddress)
      ])

      const newBalances = {
        usdc: ethers.formatUnits(usdcBalance, 18),
        usdcVault: ethers.formatUnits(usdcVaultBalance, 18),
        dai: ethers.formatUnits(daiBalance, 18),
        daiVault: ethers.formatUnits(daiVaultBalance, 18)
      }

      setBalances(newBalances)
    } catch (error) {
      console.error('Error loading balances:', error)
    }
  }

  const refreshBalances = async () => {
    if (account && contracts.mockUSDC) {
      try {
        await loadBalances(
          account, 
          contracts.mockUSDC, 
          contracts.usdcVault, 
          contracts.mockDAI, 
          contracts.daiVault
        )
      } catch (error) {
        console.error('Error refreshing balances:', error)
      }
    }
  }

  const showNotification = (type, title, message) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message
    })
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }))
  }

  const switchTo0GTestnet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x40d9' }], // 16601 in hex
        });
        showNotification('success', 'Network Switched', 'Successfully connected to 0G Testnet');
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x40d9',
                  chainName: '0G Testnet',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: ['https://evmrpc-testnet.0g.ai'],
                  blockExplorerUrls: ['https://testnet.0g.ai'],
                },
              ],
            });
            showNotification('success', 'Network Added', 'Successfully added and connected to 0G Testnet');
          } catch (addError) {
            console.error('Error adding 0G Testnet:', addError);
            showNotification('error', 'Network Error', 'Failed to add 0G Testnet network');
          }
        } else {
          console.error('Error switching to 0G Testnet:', switchError);
          showNotification('error', 'Network Error', 'Failed to switch to 0G Testnet network');
        }
      }
    }
  }

  return (
    <div className="container">
      <header className="card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Coins className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">ERC4626 Vault</h1>
            </div>
            <span className="badge badge-success">0G Testnet</span>
            {isConnected && currentNetwork && currentNetwork.chainId !== 16601n && (
              <span className="badge badge-warning">Wrong Network</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {isConnected && currentNetwork && currentNetwork.chainId !== 16601n && (
              <button
                onClick={switchTo0GTestnet}
                className="btn btn-secondary"
                title="Switch to 0G Testnet"
              >
                <RefreshCw className="w-4 h-4" />
                Switch Network
              </button>
            )}
            <ConnectWallet 
              account={account}
              isConnected={isConnected}
              onConnect={connectWallet}
              loading={loading}
            />
          </div>
        </div>
      </header>

      {isConnected ? (
        <div className="grid grid-2">
          <VaultCard
            title="USDC Vault"
            symbol="USDC"
            vaultSymbol="zpUSDC"
            tokenBalance={balances.usdc}
            vaultBalance={balances.usdcVault}
            tokenContract={contracts.mockUSDC}
            vaultContract={contracts.usdcVault}
            account={account}
            onSuccess={refreshBalances}
            onNotification={showNotification}
          />
          
          <VaultCard
            title="DAI Vault"
            symbol="DAI"
            vaultSymbol="zpDAI"
            tokenBalance={balances.dai}
            vaultBalance={balances.daiVault}
            tokenContract={contracts.mockDAI}
            vaultContract={contracts.daiVault}
            account={account}
            onSuccess={refreshBalances}
            onNotification={showNotification}
          />
        </div>
      ) : (
        <div className="card text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h2 className="text-xl font-semibold mb-2">Welcome to ERC4626 Vault</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to start earning yield on your tokens
          </p>
          <button 
            className="btn btn-primary"
            onClick={connectWallet}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading"></div>
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </>
            )}
          </button>
        </div>
      )}

      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  )
}

export default App 