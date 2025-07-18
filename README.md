# Yieldoooor 🚀

A modern DeFi yield aggregation platform built on ERC4626 vaults, providing users with seamless yield farming opportunities on the 0G Testnet.

## ✨ Features

- **ERC4626 Vault Integration**: Standard-compliant vault contracts for optimal yield strategies
- **Modern React Frontend**: Clean, dark-themed UI with smooth animations
- **Wallet Integration**: MetaMask support with automatic network detection
- **Real-time Updates**: Live balance tracking and transaction feedback
- **Network Management**: Built-in support for 0G Testnet with automatic switching

## 🏗️ Architecture

### Smart Contracts
- `MockToken.sol`: ERC20 token implementation for testing
- `Vault.sol`: ERC4626-compliant vault with deposit/withdraw functionality

### Frontend
- **React 18** with **Vite** for fast development
- **Ethers.js v6** for blockchain interaction
- **Lucide React** for beautiful icons
- **Custom notification system** with elegant animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet
- 0G Testnet configured in MetaMask

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yieldoooor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Deploy contracts** (if needed)
   ```bash
   npx hardhat run scripts/deploy.js --network 0g-testnet
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Network Setup
The application is configured for **0G Testnet** (Chain ID: 16601). The frontend will automatically prompt users to switch networks if needed.

### Contract Addresses
Update `src/config.js` with your deployed contract addresses:

```javascript
export const CONTRACT_ADDRESSES = {
  mockUSDC: "0x...",
  usdcVault: "0x...",
  mockDAI: "0x...",
  daiVault: "0x..."
}
```

## 💡 Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Switch Network**: If prompted, switch to 0G Testnet
3. **Deposit Tokens**: Enter amount and click "Deposit" to earn yield
4. **Withdraw**: Click "Withdraw" to redeem your tokens and earned yield
5. **Track Performance**: Monitor your vault shares and token balances in real-time

## 🎨 UI Features

- **Dark Theme**: Modern, eye-friendly interface
- **Smooth Animations**: Elegant transitions and loading states
- **Real-time Feedback**: Custom notifications for all user actions
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🔒 Security

- **ERC4626 Standard**: Implements industry-standard vault interface
- **SafeERC20**: Protected token transfers and approvals
- **Input Validation**: Comprehensive error handling and user feedback

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ for the DeFi community**
