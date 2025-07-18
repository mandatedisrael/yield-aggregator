import React from 'react'
import { Wallet, LogOut, Copy, Check } from 'lucide-react'
import { useState } from 'react'

const ConnectWallet = ({ account, isConnected, onConnect, loading }) => {
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const disconnect = () => {
    window.location.reload()
  }

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
          <Wallet className="w-4 h-4 text-blue-400" />
          <span className="text-white text-sm font-medium">
            {formatAddress(account)}
          </span>
          <button
            onClick={copyAddress}
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        <button
          onClick={disconnect}
          className="btn btn-secondary"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <button
      className="btn btn-primary"
      onClick={onConnect}
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
  )
}

export default ConnectWallet 