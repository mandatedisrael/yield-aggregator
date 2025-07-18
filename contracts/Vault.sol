// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract YieldVault is ERC4626 {
    address public immutable AAVE_POOL;
    
    using Math for uint256;
    using SafeERC20 for IERC20;

    constructor(
        IERC20 _asset,
        string memory _name,
        string memory _symbol,
        address _aavePool
        ) 
    ERC4626(_asset) 
    ERC20(_name, _symbol) 
    {
        AAVE_POOL = _aavePool;
    }

    /**
     * @dev Returns the total amount of the underlying asset that is "managed" by this vault.
     */
    function totalAssets() public view virtual override returns (uint256) {
        return IERC20(asset()).balanceOf(address(this));
    }

    /**
     * @dev Internal conversion function (from assets to shares) with support for rounding direction.
     */
    function _convertToShares(uint256 assets, Math.Rounding rounding) internal view virtual override returns (uint256 shares) {
        uint256 supply = totalSupply();
        if (supply == 0) {
            shares = assets;
        } else {
            shares = assets.mulDiv(supply, totalAssets(), rounding);
        }
    }

    /**
     * @dev Internal conversion function (from shares to assets) with support for rounding direction.
     */
    function _convertToAssets(uint256 shares, Math.Rounding rounding) internal view virtual override returns (uint256 assets) {
        uint256 supply = totalSupply();
        if (supply == 0) {
            assets = shares;
        } else {
            assets = shares.mulDiv(totalAssets(), supply, rounding);
        }
    }

    /**
     * @dev Deposit/mint common workflow.
     */
    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal virtual override {
        // Transfer assets from caller to vault
        IERC20(asset()).safeTransferFrom(caller, address(this), assets);
        // Mint shares to receiver
        _mint(receiver, shares);

        emit Deposit(caller, receiver, assets, shares);
    }

    /**
     * @dev Withdraw/redeem common workflow.
     */
    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal virtual override {
        if (caller != owner) {
            _spendAllowance(owner, caller, shares);
        }

        // Burn shares from owner
        _burn(owner, shares);
        // Transfer assets to receiver
        IERC20(asset()).safeTransfer(receiver, assets);

        emit Withdraw(caller, receiver, owner, assets, shares);
    }
}