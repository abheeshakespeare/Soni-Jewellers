import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { ShoppingBag, Gem, Crown, Eye } from "lucide-react"

export default async function OrdersPage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Please Sign In</h2>
          <p className="text-amber-600 mb-8">You need to be signed in to view your orders.</p>
          <Link href="/auth">
            <Button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-full font-medium shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-105">Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "ready":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center">
              <Gem className="w-16 h-16 text-amber-500" />
            </div>
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-amber-800 mb-4">No Orders Yet</h2>
          <p className="text-amber-600 mb-8 text-lg">You haven't placed any orders yet. Start your jewelry collection journey with us!</p>
          <Link href="/products">
            <Button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-full font-medium shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-105">
              <Gem className="w-5 h-5 mr-2" />
              Explore Jewelry
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-amber-800 mb-3">My Orders</h1>
          <p className="text-amber-600 text-lg">View your jewellery purchase history and track current orders</p>
        </div>
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
              <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-amber-800 font-semibold">Order #{order.order_number}</CardTitle>
                    <CardDescription className="text-amber-600 text-sm">Placed on {new Date(order.created_at).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} border font-medium`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {/* Show all ordered products */}
                {order.items && Array.isArray(order.items) && order.items.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-4">
                      {order.items.map((item: any, idx: number) => (
                        <Link 
                          key={idx} 
                          href={`/products/${item.product?.id}`}
                          className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded p-2 min-w-[180px] hover:bg-amber-100 hover:border-amber-200 transition-all duration-200 cursor-pointer group"
                        >
                          <img
                            src={item.product?.image_url || item.product?.image_urls?.[0] || "/placeholder.svg?height=40&width=40"}
                            alt={item.product?.name || "Product"}
                            width={40}
                            height={40}
                            className="rounded object-cover border group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-amber-800 text-sm group-hover:text-amber-900 transition-colors duration-200">
                              {item.product?.name || "Product"}
                            </div>
                            <div className="text-xs text-gray-600">Qty: {item.quantity}</div>
                          </div>
                          <Eye className="h-4 w-4 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <span className="text-amber-600 text-sm block mb-1">Total</span>
                    <p className="font-bold text-amber-800 text-lg">{formatPrice(order.subtotal)}</p>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <span className="text-amber-600 text-sm block mb-1">Paid</span>
                    <p className="font-bold text-green-600 text-lg">{formatPrice(order.advance_paid)}</p>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <span className="text-amber-600 text-sm block mb-1">Remaining</span>
                    <p className="font-bold text-orange-600 text-lg">{formatPrice(order.remaining)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 items-center mt-2">
                  <div className="text-amber-600">
                    <span className="capitalize font-medium">{order.delivery_type}</span>
                    {order.items && (
                      <span className="ml-3 text-sm">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-500 text-xs">Order ID: {order.id}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
