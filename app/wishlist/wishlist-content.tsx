"use client"

import { useEffect, useState } from 'react'
import { getWishlist, removeFromWishlist } from '@/lib/wishlist'
import ProductCard from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { WishlistItem } from '@/lib/wishlist'

export function WishlistContent() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadWishlist()
  }, [])

  const loadWishlist = async () => {
    try {
      const items = await getWishlist()
      setWishlistItems(items)
    } catch (error) {
      console.error('Error loading wishlist:', error)
      toast.error('Failed to load wishlist')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      await removeFromWishlist(productId)
      setWishlistItems(prev => prev.filter(item => item.product_id !== productId))
      toast.success('Removed from wishlist')
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
    }
  }

  const handleAddToCart = (product: WishlistItem['product']) => {
    // This would integrate with your cart system
    toast.success('Added to cart!')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
        <p className="text-gray-600 mb-6">Start adding your favorite jewelry items to your wishlist!</p>
        <Button onClick={() => router.push('/products')}>
          Browse Products
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="group relative">
            <ProductCard product={item.product} />
            
            {/* Wishlist actions overlay */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={() => handleAddToCart(item.product)}
              >
                <ShoppingBag className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8 bg-red-500 hover:bg-red-600"
                onClick={() => handleRemoveFromWishlist(item.product_id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 