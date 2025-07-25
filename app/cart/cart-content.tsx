"use client"

import { useState, useEffect } from "react"
import { CartManager, type CartItem } from "@/lib/cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { formatPrice } from "@/lib/utils"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

export default function CartContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [productSizeDetails, setProductSizeDetails] = useState("")
  // Only one delivery type
  const deliveryType = "pickup"

  useEffect(() => {
    const updateCart = () => {
      setCartItems(CartManager.getCart())
    }

    updateCart()
    window.addEventListener("cart-updated", updateCart)
    return () => window.removeEventListener("cart-updated", updateCart)
  }, [])

  const updateQuantity = (productId: number, quantity: number) => {
    CartManager.updateQuantity(productId, quantity)
  }

  const removeItem = (productId: number) => {
    CartManager.removeFromCart(productId)
    toast.success("Item removed from cart")
  }

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

  const subtotal = CartManager.getCartTotal()
  const advanceAmount = subtotal * 0.25 // 25% advance
  const remainingAmount = subtotal * 0.75 // 75% remaining

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some beautiful jewellery to get started!</p>
          <Link href="/products">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.product.id} className="overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                {/* Mobile Layout */}
                <div className="block sm:hidden space-y-4">
                  <div className="flex items-start space-x-3">
                    <Image
                      src={item.product.image_url || "/placeholder.jpg"}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base leading-tight">{item.product.name}</h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.product.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {getMetalDisplayName(item.product.metal_type, item.product.carat, item.product.material_color)}
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded">{item.product.weight_grams}g</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="font-semibold text-lg text-yellow-600">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center space-x-4">
                  <Image
                    src={item.product.image_url || "/placeholder.jpg"}
                    alt={item.product.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.product.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {getMetalDisplayName(item.product.metal_type, item.product.carat, item.product.material_color)}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.product.weight_grams}g</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="h-9 w-9 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="h-9 w-9 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-semibold text-lg text-yellow-600 mb-2">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-lg">Advance Payment (25%)</span>
                  <span className="font-bold text-lg text-yellow-600">{formatPrice(advanceAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining at store (75%)</span>
                  <span className="text-gray-600">{formatPrice(remainingAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Delivery Option</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked
                    readOnly
                    className="w-4 h-4 text-yellow-600"
                  />
                  <span className="font-medium">Store Pickup (Free)</span>
                </label>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 text-sm">
                  <div className="font-semibold text-amber-800 mb-2">📍 Store Address:</div>
                  <div className="text-gray-700 leading-relaxed">
                    <strong>Soni Jewellers and Navratna Bhandar</strong><br/>
                    Opp. V-Mart, Main Road<br/>
                    Latehar, Jharkhand 829206<br/>
                    India<br/>
                    <div className="flex items-center mt-2 text-amber-800">
                      <span className="font-medium">📞 +91-9263879884</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/checkout" className="block">
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Proceed to Checkout →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}