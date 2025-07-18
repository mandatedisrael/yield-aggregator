import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { TrendingUp, ArrowUpDown, Coins, RefreshCw } from 'lucide-react'

const VaultCard = ({ 
  title, 
  symbol, 
  vaultSymbol, 
  tokenBalance, 
  vaultBalance, 
  tokenContract, 
  vaultContract, 
  account, 
  onSuccess,
  onNotification 
}) => {
  const [amount, setAmount] = useState('')
  const [action, setAction] = useState('deposit') // 'deposit' or 'withdraw'
  const [loading, setLoading] = useState(false)
  const [previewAmount, setPreviewAmount] = useState('0')
  const [currentBalances, setCurrentBalances] = useState({
    token: '0',
    vault: '0'
  })

  // Update balances when props change
  useEffect(() => {
    setCurrentBalances({
      token: tokenBalance || '0',
      vault: vaultBalance || '0'
    })
  }, [tokenBalance, vaultBalance])

  const handleAmountChange = async (value) => {
    setAmount(value)
    
    if (value && !isNaN(value) && parseFloat(value) > 0) {
      try {
        const amountWei = ethers.parseUnits(value, 18)
        
        if (action === 'deposit') {
          const shares = await vaultContract.previewDeposit(amountWei)
          setPreviewAmount(ethers.formatUnits(shares, 18))
        } else {
          const assets = await vaultContract.previewWithdraw(amountWei)
          setPreviewAmount(ethers.formatUnits(assets, 18))
        }
      } catch (error) {
        console.error('Error calculating preview:', error)
        setPreviewAmount('0')
      }
    } else {
      setPreviewAmount('0')
    }
  }

  const handleAction = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      onNotification('error', 'Invalid Amount', 'Please enter a valid amount')
      return
    }

    setLoading(true)
    try {
      const amountWei = ethers.parseUnits(amount, 18)

      if (action === 'deposit') {
        // Get vault address first
        const vaultAddress = await vaultContract.getAddress()
        
        // Check allowance with proper error handling
        let allowance
        try {
          allowance = await tokenContract.allowance(account, vaultAddress)
        } catch (error) {
          console.error('Allowance check failed:', error)
          allowance = ethers.parseUnits("0", 18)
        }
        
        if (allowance < amountWei) {
          onNotification('info', 'Approving Tokens', 'Please approve the transaction in your wallet')
          // Approve tokens
          const approveTx = await tokenContract.approve(vaultAddress, amountWei)
          await approveTx.wait()
        }

        // Deposit
        onNotification('info', 'Processing Deposit', 'Please confirm the deposit transaction')
        const depositTx = await vaultContract.deposit(amountWei, account)
        await depositTx.wait()
        
        onNotification('success', 'Deposit Successful', `Successfully deposited ${amount} ${symbol}`)
      } else {
        // Withdraw
        onNotification('info', 'Processing Withdrawal', 'Please confirm the withdrawal transaction')
        const withdrawTx = await vaultContract.withdraw(amountWei, account, account)
        await withdrawTx.wait()
        
        onNotification('success', 'Withdrawal Successful', `Successfully withdrawn ${amount} ${symbol}`)
      }

      setAmount('')
      setPreviewAmount('0')
      onSuccess()
      
    } catch (error) {
      console.error('Transaction failed:', error)
      onNotification('error', 'Transaction Failed', error.message || 'Transaction failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const maxAmount = action === 'deposit' ? currentBalances.token : currentBalances.vault

  const setMaxAmount = () => {
    const maxValue = parseFloat(maxAmount)
    if (maxValue > 0) {
      setAmount(maxAmount)
      handleAmountChange(maxAmount)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-blue-400" />
          <h3 className="card-title">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-success">{symbol}</span>
          <span className="badge badge-warning">{vaultSymbol}</span>
        </div>
      </div>

      <div className="grid grid-3 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{parseFloat(currentBalances.token).toFixed(2)}</div>
          <div className="text-sm text-gray-400">{symbol} Balance</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{parseFloat(currentBalances.vault).toFixed(2)}</div>
          <div className="text-sm text-gray-400">{vaultSymbol} Shares</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            <TrendingUp className="w-6 h-6 inline mr-1" />
            APY
          </div>
          <div className="text-sm text-gray-400">Coming Soon</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2 mb-4">
          <button
            className={`btn ${action === 'deposit' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setAction('deposit')}
          >
            Deposit
          </button>
          <button
            className={`btn ${action === 'withdraw' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setAction('withdraw')}
          >
            Withdraw
          </button>
        </div>

        <div className="input-group">
          <label className="input-label">
            Amount ({action === 'deposit' ? symbol : vaultSymbol})
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              className="input flex-1"
              placeholder="0.0"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              disabled={loading}
            />
            <button
              className="btn btn-secondary"
              onClick={setMaxAmount}
              disabled={loading || parseFloat(maxAmount) <= 0}
            >
              Max
            </button>
          </div>
        </div>

        {previewAmount !== '0' && (
          <div className="text-sm text-gray-400 mb-4">
            You will receive: {parseFloat(previewAmount).toFixed(6)} {action === 'deposit' ? vaultSymbol : symbol}
          </div>
        )}

        <button
          className="btn btn-primary w-full"
          onClick={handleAction}
          disabled={loading || !amount || parseFloat(amount) <= 0}
        >
          {loading ? (
            <>
              <div className="loading"></div>
              Processing...
            </>
          ) : (
            <>
              <ArrowUpDown className="w-4 h-4" />
              {action === 'deposit' ? 'Deposit' : 'Withdraw'} {symbol}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default VaultCard 