import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { Package, Truck, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface OrderPageProps {
  params: {
    id: string
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const supabase = createServerClient()

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      users (
        name,
        email
      )
    `)
    .eq("id", params.id)
    .single()

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-8">The order you're looking for doesn't exist.</p>
          <Link href="/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case "processing":
        return <Package className="h-5 w-5 text-orange-500" />
      case "ready":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-orange-100 text-orange-800"
      case "ready":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Order Information */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-800 mb-2">Order Details</h1>
        <div className="flex flex-wrap gap-4 items-center text-sm text-gray-700 mb-2">
          <span className="font-semibold">Order #:</span> <span>{order.order_number}</span>
          <span className="font-semibold ml-4">Date:</span> <span>{new Date(order.created_at).toLocaleDateString()}</span>
          <span className="font-semibold ml-4">Status:</span>
          <Badge className={getStatusColor(order.status)}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Ordered Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(order.items && Array.isArray(order.items) && order.items.length > 0) ? (
                  order.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4 py-4 border-b last:border-b-0">
                      <Image
                        src={item.product?.image_url || item.product?.image_urls?.[0] || "/placeholder.svg?height=80&width=80"}
                        alt={item.product?.name || "Product"}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-800">{item.product?.name || "Product"}</h4>
                        <p className="text-gray-600 text-sm mb-1">{item.product?.description || "No description"}</p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span>{item.product?.metal_type} {item.product?.purity || item.product?.carat || ""}</span>
                          <span>{item.product?.weight || item.product?.weight_grams || "-"}g</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">No items found for this order.</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Delivery Type:</span>
                  <p className="font-medium capitalize">{order.delivery_type}</p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <p className="font-medium capitalize">{order.status}</p>
                </div>
                <div>
                  <span className="text-gray-600">Order Date:</span>
                  <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Order Number:</span>
                  <p className="font-medium">{order.order_number}</p>
                </div>
              </div>
              {order.special_instructions && (
                <div>
                  <span className="text-gray-600">Special Instructions:</span>
                  <p className="mt-1 p-3 bg-gray-50 rounded italic">{order.special_instructions}</p>
                </div>
              )}
              {order.product_size_details && (
                <div>
                  <span className="text-gray-600">Product Size Details:</span>
                  <p className="mt-1 p-3 bg-gray-50 rounded italic">{order.product_size_details}</p>
                </div>
              )}
              {order.gift_message && (
                <div>
                  <span className="text-gray-600">Gift Message:</span>
                  <p className="mt-1 p-3 bg-gray-50 rounded italic">"{order.gift_message}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Customer Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Advance Paid (25%)</span>
                  <span className="text-green-600">{formatPrice(order.advance_paid)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Remaining at store</span>
                  <span>{formatPrice(order.remaining)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-gray-600">Name:</span>
                <p className="font-medium">{order.users?.name}</p>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <p className="font-medium">{order.users?.email}</p>
              </div>
              {order.phone && (
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{order.phone}</p>
                </div>
              )}
              {order.aadhar && (
                <div>
                  <span className="text-gray-600">Aadhar Number:</span>
                  <p className="font-medium">{order.aadhar}</p>
                </div>
              )}
              {order.address && (
                <div>
                  <span className="text-gray-600">Address:</span>
                  <p className="font-medium">{order.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Link href="/orders">
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </Link>
            <Link href="/products">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
