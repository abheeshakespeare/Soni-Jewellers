"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useWishlist } from "@/contexts/wishlist-context"

interface WishlistButtonProps {
  productId: number
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const supabase = createClient()

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

  const handleWishlistToggle = async () => {
    setIsLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Please sign in to manage your wishlist.")
        return
      }

      if (isWishlisted) {
        await removeFromWishlist(productId)
        setIsWishlisted(false)
        toast.success("Removed from wishlist")
      } else {
        await addToWishlist(productId)
        setIsWishlisted(true)
        toast.success("Added to wishlist")
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      toast.error("Failed to update wishlist. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleWishlistToggle} 
      disabled={isLoading}
      variant="outline"
      size="lg"
      className="flex-1"
    >
      <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
      {isLoading ? "..." : isWishlisted ? "Wishlisted" : "Wishlist"}
    </Button>
  )
} 