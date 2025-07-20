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
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 min-h-screen w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full overflow-x-auto">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4 min-w-0">
          {cartItems.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.product.image_url || "/placeholder.jpg"}
                    alt={item.product.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm">{item.product.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">
                        {getMetalDisplayName(item.product.metal_type, item.product.carat, item.product.material_color)}
                      </span>
                      <span className="text-sm text-gray-500">{item.product.weight_grams}g</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-lg">{formatPrice(item.price * item.quantity)}</div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-600 hover:text-red-700"
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
        <div className="space-y-6 min-w-0">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Advance Payment (25%)</span>
                  <span className="text-yellow-600">{formatPrice(advanceAmount)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Remaining at store</span>
                  <span>{formatPrice(remainingAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Option</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked
                    readOnly
                  />
                  <span>Store Pickup (Free)</span>
                </label>
                <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-gray-700">
                  <b>Store Address:</b><br/>
                  Soni Jewellers and Navratna Bhandar,<br/>
                  Opp. V-Mart,<br/>
                  Main Road,<br/>
                  Latehar,Jharkhand,829206,<br/>
                  India<br/>
                  Phone: +91-9263879884
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/checkout">
            <Button size="lg" className="w-full bg-yellow-600 hover:bg-yellow-700">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 