export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: "admin" | "customer"
          phone: string | null
          address: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: "admin" | "customer"
          phone?: string | null
          address?: any | null
        }
        Update: {
          name?: string | null
          role?: "admin" | "customer"
          phone?: string | null
          address?: any | null
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
        }
      }
      products: {
        Row: {
          id: number
          name: string
          description: string | null
          image_url: string
          metal_type: "gold" | "silver" | "other"
          carat: number | null
          weight_grams: number
          material_color: string | null
          size_description: string | null
          gender: "male" | "female" | "flexible" | "kids"
          category_id: number
          collection_type: string | null
          base_price: number | null
          final_price: number | null
          is_active: boolean
          is_featured: boolean
          stock_quantity: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          description?: string | null
          image_url: string
          metal_type: "gold" | "silver" | "other"
          carat?: number | null
          weight_grams: number
          material_color?: string | null
          size_description?: string | null
          gender: "male" | "female" | "flexible" | "kids"
          category_id: number
          collection_type?: string | null
          base_price?: number | null
          final_price?: number | null
          is_active?: boolean
          is_featured?: boolean
          stock_quantity?: number
          created_by?: string | null
          manual_price?: number | null
        }
        Update: {
          name?: string
          description?: string | null
          image_url?: string
          metal_type?: "gold" | "silver" | "other"
          carat?: number | null
          weight_grams?: number
          material_color?: string | null
          size_description?: string | null
          gender?: "male" | "female" | "flexible" | "kids"
          category_id?: number
          collection_type?: string | null
          base_price?: number | null
          final_price?: number | null
          is_active?: boolean
          is_featured?: boolean
          stock_quantity?: number
          updated_at?: string
          manual_price?: number | null
        }
      }
      metal_rates: {
        Row: {
          id: string
          type: "gold" | "silver"
          rate_per_gram: number
          date: string
          created_at: string
        }
        Insert: {
          type: "gold" | "silver"
          rate_per_gram: number
          date?: string
        }
        Update: {
          rate_per_gram?: number
          date?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          items: any
          subtotal: number
          advance_paid: number
          remaining: number
          status: "pending" | "confirmed" | "processing" | "ready" | "completed" | "cancelled"
          payment_id: string | null
          invoice_url: string | null
          gift_message: string | null
          delivery_type: "pickup" | "delivery"
          delivery_address: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          order_number: string
          items: any
          subtotal: number
          advance_paid: number
          remaining: number
          status?: "pending" | "confirmed" | "processing" | "ready" | "completed" | "cancelled"
          payment_id?: string | null
          invoice_url?: string | null
          gift_message?: string | null
          delivery_type?: "pickup" | "delivery"
          delivery_address?: any | null
        }
        Update: {
          status?: "pending" | "confirmed" | "processing" | "ready" | "completed" | "cancelled"
          payment_id?: string | null
          invoice_url?: string | null
          updated_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          product_id: string
        }
        Update: never
      }
    }
  }
}

export type Product = Database["public"]["Tables"]["products"]["Row"]
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type MetalRate = Database["public"]["Tables"]["metal_rates"]["Row"]
export type Order = Database["public"]["Tables"]["orders"]["Row"]
export type User = Database["public"]["Tables"]["users"]["Row"]
