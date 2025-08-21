"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { CartManager } from "@/lib/cart"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/products"

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAddToCart = async () => {
    setIsLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Please sign in to add items to your cart.")
        router.push("/auth")
        return
      }

      const price = product.final_price || product.base_price || 0
      CartManager.addToCart(product, price)
      toast.success("Added to cart!")
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error("Failed to add to cart. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const isOutOfStock = product.stock_quantity <= 0

  return (
    <Button 
      onClick={handleAddToCart} 
      disabled={isLoading || isOutOfStock}
      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
      size="lg"
    >
      <ShoppingCart className="h-5 w-5 mr-2" />
      {isLoading ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
    </Button>
  )
} 