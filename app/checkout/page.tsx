"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { CartManager, type CartItem } from "@/lib/cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import type { User } from "@supabase/supabase-js"
import OrderNoticeModal from "@/app/notice/page"

export default function CheckoutPage() {
  const [user, setUser] = useState<User | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isNoticeOpen, setIsNoticeOpen] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [deliveryType, setDeliveryType] = useState<"pickup" | "home">(CartManager.getDeliveryPreference().type)
  const [pincode, setPincode] = useState(CartManager.getDeliveryPreference().pincode || "")
  const [isDeliverable, setIsDeliverable] = useState<boolean | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    aadhar: "",
    address: "",
    specialInstructions: "",
    productSizeDetails: "",
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let isMounted = true
    const timeoutId = setTimeout(() => {
      if (isMounted) setIsAuthLoading(false)
    }, 5000)

    const getUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("auth.getSession error:", error)
        }

        const currentUser = session?.user || null
        if (!isMounted) return

        setUser(currentUser)
        if (currentUser) {
          setFormData((prev) => ({
            ...prev,
            email: currentUser.email || "",
            name: (currentUser as any).user_metadata?.name || "",
          }))
        }
      } catch (err) {
        console.error("Error getting session:", err)
      } finally {
        if (isMounted) setIsAuthLoading(false)
        clearTimeout(timeoutId)
      }
    }
    getUser()

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [supabase.auth])

  useEffect(() => {
    setCartItems(CartManager.getCart())
  }, [])

  const subtotal = CartManager.getCartTotal()
  const advanceAmount = subtotal * 0.25 // 25% advance
  const remainingAmount = subtotal * 0.75 // 75% remaining

  const allowedPincodes = new Set(["829206", "829207"]) 

  const handlePincodeChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "")
    setPincode(cleaned)
    if (cleaned.length === 6) {
      setIsDeliverable(allowedPincodes.has(cleaned))
    } else {
      setIsDeliverable(null)
    }
  }

  useEffect(() => {
    // initialize deliverable state based on stored pincode
    if (pincode && pincode.length === 6) {
      setIsDeliverable(allowedPincodes.has(pincode))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("Please sign in to place an order")
      router.push("/auth")
      return
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    if (deliveryType === "home") {
      if (pincode.length !== 6 || isDeliverable !== true) {
        toast.error("Please enter a valid deliverable pincode")
        return
      }
    }

    // NOTE: Online order booking/payment is not yet enabled.
    // The original implementation that creates an order and routes to the order details page
    // is kept below for future payment integration. For now, we simply show a notice modal.
    setIsNoticeOpen(true)

    /*
    setIsLoading(true)
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          userId: user.id,
          specialInstructions: formData.specialInstructions,
          productSizeDetails: formData.productSizeDetails,
          aadhar: formData.aadhar,
          address: formData.address,
          // Persist delivery choice for admin visibility
          delivery_type: deliveryType, // "pickup" | "home"
          delivery_address: deliveryType === "home" ? { pincode } : null,
          subtotal,
          advance_paid: advanceAmount,
          remaining: remainingAmount,
        }),
      })

      const result = await response.json()

      if (result.success) {
        CartManager.clearCart()
        toast.success("Order placed successfully!")
        router.push(`/orders/${result.order.id}`)
      } else {
        toast.error(result.error || "Failed to place order")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("An error occurred during checkout")
    } finally {
      setIsLoading(false)
    }
    */
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-800 mb-2">Loading...</h2>
          <p className="text-amber-600">Checking your session</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Please Sign In</h2>
          <p className="text-amber-600 mb-8">You need to be signed in to place an order.</p>
          <Button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-full font-medium shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-105" onClick={() => router.push("/auth")}>Sign In</Button>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Your Cart is Empty</h2>
          <p className="text-amber-600 mb-8">Add some items to your cart before checkout.</p>
          <Button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-full font-medium shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-105" onClick={() => router.push("/products")}>Continue Shopping</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">Checkout</h1>
          <div className="h-1 w-32 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full mb-6"></div>
          <p className="text-amber-600 text-lg font-light">Complete your details to place your order</p>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-amber-800">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-amber-800">Full Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-amber-800">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-amber-800">Phone Number *</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="aadhar" className="text-amber-800">Aadhar Number *</Label>
                  <Input id="aadhar" name="aadhar" value={formData.aadhar} onChange={handleInputChange} required maxLength={12} minLength={12} pattern="\d{12}" placeholder="12-digit Aadhar Number" />
                </div>
                <div>
                  <Label htmlFor="address" className="text-amber-800">Address *</Label>
                  <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} required rows={2} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-amber-800">Special Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  name="specialInstructions"
                  placeholder="Add any special instructions for your order..."
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows={3}
                />
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-amber-800">Product Size Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  name="productSizeDetails"
                  placeholder="Provide specific details about the size of the product (e.g., ring size, chain length, etc.)"
                  value={formData.productSizeDetails}
                  onChange={handleInputChange}
                  rows={2}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-amber-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Advance Payment (25%)</span>
                    <span className="text-yellow-600">{formatPrice(advanceAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Remaining at store (75%)</span>
                    <span>{formatPrice(remainingAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-amber-800">Delivery Option</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Selected:</span>{" "}
                    {deliveryType === "pickup" ? "Store Pickup (Free)" : `Home Delivery${pincode ? ` - Pincode: ${pincode}` : ""}`}
                  </div>
                  {deliveryType === "home" && (
                    <div className="space-y-2">
                      {isDeliverable === true && (
                        <div className="text-green-700 bg-green-50 border border-green-200 rounded p-2 text-sm">Deliverable to this address.</div>
                      )}
                      {isDeliverable === false && (
                        <div className="text-red-700 bg-red-50 border border-red-200 rounded p-2 text-sm">Not deliverable to this address.</div>
                      )}
                      {isDeliverable === null && pincode.length > 0 && (
                        <div className="text-gray-600 text-sm">Please enter a valid 6-digit pincode.</div>
                      )}
                      <div className="text-xs text-gray-500">Supported pincodes: 829206, 829207</div>
                    </div>
                  )}
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

            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-amber-800">Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Payment Process</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Pay 25% advance: {formatPrice(advanceAmount)}</li>
                    <li>• Remaining 75% payable at store pickup</li>
                    <li>• You will receive order confirmation via email</li>
                    <li>• Store will contact you for payment and pickup</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-yellow-600 hover:bg-yellow-700"
              disabled={
                isLoading || (deliveryType === "home" && (pincode.length !== 6 || isDeliverable !== true))
              }
            >
              {isLoading
                ? "Placing Order..."
                : deliveryType === "home" && (pincode.length !== 6 || isDeliverable !== true)
                  ? "Enter valid pincode for home delivery"
                  : `Place Order - ${formatPrice(advanceAmount)} Advance`}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By placing this order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </form>
      </div>
      <OrderNoticeModal open={isNoticeOpen} onClose={() => setIsNoticeOpen(false)} />
    </div>
  )
}
