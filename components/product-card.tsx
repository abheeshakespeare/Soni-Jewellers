"use client"

import { useState, memo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { CartManager } from "@/lib/cart"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import { toast } from "sonner"
import { useWishlist } from "@/contexts/wishlist-context"
import type { Product } from "@/lib/products"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const status = await isInWishlist(product.id)
        setIsWishlisted(status)
      } catch (error) {
        console.error('Error checking wishlist status:', error)
      }
    }

    checkWishlistStatus()
  }, [product.id, isInWishlist])

  const handleAddToCart = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error("Please sign in to add items to your cart.")
      router.push("/auth")
      return
    }
    const price = product.final_price || product.base_price || 0
    CartManager.addToCart(product, price)
    toast.success("Added to cart!")
  }

  const handleWishlist = async () => {
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id)
        setIsWishlisted(false)
      } else {
        await addToWishlist(product.id)
        setIsWishlisted(true)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const imageUrl = imageError || !product.image_url 
    ? "/placeholder.jpg" 
    : product.image_url

  const getMetalDisplayName = (metalType: string, carat?: number | null, materialColor?: string | null) => {
    if (metalType === 'gold' && carat) {
      return `Gold ${carat}K`
    }
    if (metalType === 'silver') {
      return 'Silver'
    }
    if (metalType === 'other') {
      return materialColor || 'Other Material'
    }
    return metalType.charAt(0).toUpperCase() + metalType.slice(1)
  }

  const getGenderDisplayName = (gender: string) => {
    switch (gender) {
      case 'male': return 'Male'
      case 'female': return 'Female'
      case 'flexible': return 'Unisex'
      case 'kids': return 'Kids'
      default: return gender
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden">
        <Link href={`/products/${product.id}`}> 
          <Image
            src={imageUrl}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            loading="lazy"
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={75}
          />
        </Link>

        {product.is_featured && <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">Featured</Badge>}

        <div className="absolute top-2 right-2 flex flex-col space-y-2 z-10">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0" onClick={handleWishlist}>
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Link href={`/products/${product.id}`}>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>
            {getMetalDisplayName(product.metal_type, product.carat, product.material_color)}
          </span>
          <span>{product.weight_grams}g</span>
        </div>

        <div className="text-2xl font-bold text-yellow-600">
          {product.final_price ? formatPrice(product.final_price) : 'Price not set'}
        </div>

        {product.collection_type && (
          <Badge variant="outline" className="mt-2">
            {product.collection_type}
          </Badge>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full bg-yellow-600 hover:bg-yellow-700">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

export default memo(ProductCard)
