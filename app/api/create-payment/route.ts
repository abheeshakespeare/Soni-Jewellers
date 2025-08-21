import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { generateOrderNumber } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const { items, userId, giftMessage, deliveryType, deliveryAddress, specialInstructions, productSizeDetails, aadhar, address } = await request.json()

    const supabase = createServerClient()

    // Fetch full product details for each item
    const fullItems = await Promise.all(items.map(async (item: any) => {
      const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", item.product.id)
        .single()
      return {
        ...item,
        product: product || item.product // fallback to cart product if fetch fails
      }
    }))

    // Calculate totals
    const subtotal = fullItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0)
    const advancePaid = subtotal * 0.25 // 25% advance
    const remaining = subtotal * 0.75 // 75% remaining

    // Create order in database
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        order_number: generateOrderNumber(),
        items: fullItems,
        subtotal,
        advance_paid: advancePaid,
        remaining,
        status: "pending",
        gift_message: giftMessage,
        delivery_type: deliveryType,
        delivery_address: deliveryAddress,
        special_instructions: specialInstructions,
        product_size_details: productSizeDetails,
        aadhar,
        address,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      order,
      message: "Order created successfully. Please proceed with payment at our store.",
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
