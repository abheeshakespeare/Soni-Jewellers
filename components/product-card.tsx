"use client"

import { useState, memo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { CartManager } from "@/lib/cart"
import { Heart, ShoppingCart, Eye, Crown, Gem, Sparkles } from "lucide-react"
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
    <Card className="group bg-white/90 backdrop-blur-sm border-amber-200 hover:border-amber-300 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 transform hover:-translate-y-1 overflow-hidden">
      <div className="relative overflow-hidden">
        <Link href={`/products/${product.id}`}> 
          <div className="relative overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              width={300}
              height={300}
              className="w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out cursor-pointer"
              loading="lazy"
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={85}
              style={{ width: "100%", height: "auto" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Featured Badge */}
        {product.is_featured && (
          <div className="absolute top-3 left-3 z-20">
            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 shadow-lg shadow-amber-500/50 px-3 py-1 text-xs font-semibold">
              <Crown className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 z-20">
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-9 w-9 p-0 bg-white/90 backdrop-blur-sm border-amber-200 hover:bg-amber-50 hover:border-amber-300 shadow-lg transition-all duration-300 transform hover:scale-110" 
            onClick={handleWishlist}
          >
            <Heart className={`h-4 w-4 transition-all duration-300 ${isWishlisted ? "fill-red-500 text-red-500" : "text-amber-600"}`} />
          </Button>
          <Link href={`/products/${product.id}`}>
            <Button 
              size="sm" 
              variant="secondary" 
              className="h-9 w-9 p-0 bg-white/90 backdrop-blur-sm border-amber-200 hover:bg-amber-50 hover:border-amber-300 shadow-lg transition-all duration-300 transform hover:scale-110"
            >
              <Eye className="h-4 w-4 text-amber-600" />
            </Button>
          </Link>
        </div>

        {/* Collection Badge */}
        {product.collection_type && (
          <div className="absolute bottom-3 left-3 z-20">
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-amber-300 text-amber-700 font-medium text-xs">
              <Gem className="w-3 h-3 mr-1" />
              {product.collection_type}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Product Name */}
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-amber-800 transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Product Details */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"></div>
              <span className="text-amber-700 font-medium">
                {getMetalDisplayName(product.metal_type, product.carat, product.material_color)}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <Sparkles className="w-3 h-3" />
              <span className="font-medium">{product.weight_grams}g</span>
            </div>
          </div>

          {/* Price */}
          <div className="pt-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              {product.final_price ? formatPrice(product.final_price) : 'Price not set'}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={handleAddToCart} 
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-amber-500/40"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

export default memo(ProductCard)
