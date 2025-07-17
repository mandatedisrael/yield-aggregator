# AI Yield Aggregator (ERC-4626 Vault)

A simple, smart, and automated yield aggregator built on the ERC-4626 standard. This project leverages AI-driven strategies to maximize returns for users by automatically managing deposits in a secure vault.

## 🚀 Features
- **ERC-4626 Vault:** Standardized, secure, and composable vault for yield strategies.
- **AI-Powered:** Uses AI logic (future scope) to optimize yield across DeFi protocols.
- **Easy Integration:** Plug-and-play contracts for any ERC-20 token (e.g., USDC).
- **Transparent:** Open-source, auditable smart contracts.

## 📦 Project Structure
```
contracts/      # Solidity smart contracts (USDC, Vault)
scripts/        # Deployment and interaction scripts
test/           # Test scripts
```

## 🛠️ Setup
1. **Clone the repo:**
   ```sh
   git clone <your-repo-url>
   cd ERC4626\ Vault
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Compile contracts:**
   ```sh
   npx hardhat compile
   ```

## 🚀 Deployment
Deploy contracts to your preferred network (e.g., Base Sepolia):
```sh
npx hardhat run scripts/deploy.js --network baseSepolia
```

## 💸 Deposit Example
Deposit tokens into the vault:
```sh
npx hardhat run scripts/deposit.js --network baseSepolia
```

## 🧪 Testing
Run tests with:
```sh
npx hardhat test
```

## 📖 Learn More
- [ERC-4626 Standard](https://eips.ethereum.org/EIPS/eip-4626)
- [Hardhat Documentation](https://hardhat.org/)

## 🤝 Contributing
Pull requests and issues are welcome!

## 📬 Contact
For questions or support, open an issue or contact the maintainer.
