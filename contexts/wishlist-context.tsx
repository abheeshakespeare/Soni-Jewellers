"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getWishlistCount, addToWishlist, removeFromWishlist, isInWishlist } from '@/lib/wishlist'
import { toast } from 'sonner'

interface WishlistContextType {
  wishlistCount: number
  isInWishlist: (productId: number) => Promise<boolean>
  addToWishlist: (productId: number) => Promise<void>
  removeFromWishlist: (productId: number) => Promise<void>
  refreshWishlistCount: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistCount, setWishlistCount] = useState(0)

  const refreshWishlistCount = async () => {
    try {
      const count = await getWishlistCount()
      setWishlistCount(count)
    } catch (error) {
      console.error('Error refreshing wishlist count:', error)
    }
  }

  const handleAddToWishlist = async (productId: number) => {
    try {
      await addToWishlist(productId)
      await refreshWishlistCount()
      toast.success('Added to wishlist!')
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      if (error instanceof Error && error.message.includes('not authenticated')) {
        toast.error('Please sign in to add items to wishlist')
      } else {
        toast.error('Failed to add to wishlist')
      }
    }
  }

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      await removeFromWishlist(productId)
      await refreshWishlistCount()
      toast.success('Removed from wishlist')
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
    }
  }

  const checkIsInWishlist = async (productId: number) => {
    try {
      return await isInWishlist(productId)
    } catch (error) {
      console.error('Error checking wishlist status:', error)
      return false
    }
  }

  useEffect(() => {
    refreshWishlistCount()
  }, [])

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount,
        isInWishlist: checkIsInWishlist,
        addToWishlist: handleAddToWishlist,
        removeFromWishlist: handleRemoveFromWishlist,
        refreshWishlistCount
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
} 