"use client"

import { useState, useEffect } from 'react'
import { Heart, HeartOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWishlist } from '@/contexts/wishlist-context'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
}

export function WishlistButton({ 
  productId, 
  className,
  size = 'md',
  variant = 'ghost'
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const status = await isInWishlist(productId)
        setIsWishlisted(status)
      } catch (error) {
        console.error('Error checking wishlist status:', error)
      }
    }

    checkWishlistStatus()
  }, [productId, isInWishlist])

  const handleToggleWishlist = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      if (isWishlisted) {
        await removeFromWishlist(productId)
        setIsWishlisted(false)
      } else {
        await addToWishlist(productId)
        setIsWishlisted(true)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={cn(
        'transition-all duration-200 hover:scale-105',
        sizeClasses[size],
        isWishlisted && 'text-red-500 hover:text-red-600',
        className
      )}
    >
      {isWishlisted ? (
        <Heart className="h-4 w-4 fill-current" />
      ) : (
        <HeartOff className="h-4 w-4" />
      )}
    </Button>
  )
} 