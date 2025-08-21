import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentMethod } = await request.json()

    const supabase = createServerClient()

    // Update order status
    const { error } = await supabase
      .from("orders")
      .update({
        status: "confirmed",
        payment_id: `offline_${Date.now()}`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Order confirmed successfully!",
    })
  } catch (error) {
    console.error("Order confirmation error:", error)
    return NextResponse.json({ error: "Failed to confirm order" }, { status: 500 })
  }
}
