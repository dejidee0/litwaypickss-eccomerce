import React, { useState, useEffect } from 'react'
import { ShoppingBag, X } from 'lucide-react'

const mockPurchases = [
  {
    id: '1',
    customerName: 'Sarah M.',
    productName: 'Wireless Bluetooth Headphones',
    location: 'Monrovia',
    timeAgo: '2 minutes ago',
  },
  {
    id: '2',
    customerName: 'John D.',
    productName: 'Cotton Summer Dress',
    location: 'Paynesville',
    timeAgo: '5 minutes ago',
  },
  {
    id: '3',
    customerName: 'Maria K.',
    productName: 'Smart Fitness Watch',
    location: 'Gbarnga',
    timeAgo: '8 minutes ago',
  },
  {
    id: '4',
    customerName: 'David T.',
    productName: 'Premium Backpack',
    location: 'Buchanan',
    timeAgo: '12 minutes ago',
  },
]

export default function RecentPurchases() {
  const [currentPurchase, setCurrentPurchase] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [purchaseIndex, setPurchaseIndex] = useState(0)

  useEffect(() => {
    const showPurchase = () => {
      setCurrentPurchase(mockPurchases[purchaseIndex])
      setIsVisible(true)

      // Hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false)
      }, 4000)

      // Move to next purchase
      setPurchaseIndex((prev) => (prev + 1) % mockPurchases.length)
    }

    // Show first purchase after 3 seconds
    const initialTimer = setTimeout(showPurchase, 3000)

    // Then show every 8 seconds
    const interval = setInterval(showPurchase, 8000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [purchaseIndex])

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!currentPurchase || !isVisible) return null

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm">
      <div className={`card shadow-lg border-0 bg-white transition-all duration-500 transform ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}>
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
              <ShoppingBag className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  New purchase! 🎉
                </p>
                <button
                  onClick={handleClose}
                  className="h-6 w-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="text-sm text-gray-600 truncate">
                <span className="font-medium">{currentPurchase.customerName}</span> from{' '}
                <span className="font-medium">{currentPurchase.location}</span> just bought{' '}
                <span className="text-primary-600">{currentPurchase.productName}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {currentPurchase.timeAgo}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}