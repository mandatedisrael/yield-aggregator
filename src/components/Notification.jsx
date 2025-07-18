import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

const Notification = ({ 
  type = 'success', 
  title, 
  message, 
  isVisible, 
  onClose, 
  duration = 4000 
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-400" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/20 border-green-500/30'
      case 'error':
        return 'bg-red-900/20 border-red-500/30'
      case 'warning':
        return 'bg-yellow-900/20 border-yellow-500/30'
      default:
        return 'bg-green-900/20 border-green-500/30'
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className={`
          ${getBgColor()}
          border rounded-lg p-4 shadow-lg backdrop-blur-sm
          transform transition-all duration-300 ease-out
          ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white">
              {title}
            </h4>
            {message && (
              <p className="text-sm text-gray-300 mt-1">
                {message}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Notification 