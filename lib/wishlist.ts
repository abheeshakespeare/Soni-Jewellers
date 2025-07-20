import { createClient } from './supabase/client'
import type { Product } from './products'

export interface WishlistItem {
  id: number
  user_id: string
  product_id: number
  created_at: string
  product: Product
}

export async function getWishlist(): Promise<WishlistItem[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('wishlist')
    .select(`
      *,
      product:products(*, category:categories(id, name))
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching wishlist:', error)
    throw error
  }

  return data || []
}

export async function addToWishlist(productId: number): Promise<void> {
  const supabase = createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase
    .from('wishlist')
    .insert({
      user_id: user.id,
      product_id: productId
    })

  if (error) {
    console.error('Error adding to wishlist:', error)
    throw error
  }
}

export async function removeFromWishlist(productId: number): Promise<void> {
  const supabase = createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId)

  if (error) {
    console.error('Error removing from wishlist:', error)
    throw error
  }
}

export async function isInWishlist(productId: number): Promise<boolean> {
  const supabase = createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
    console.error('Error checking wishlist status:', error)
    return false
  }

  return !!data
}

export async function getWishlistCount(): Promise<number> {
  const supabase = createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { count, error } = await supabase
    .from('wishlist')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (error) {
    console.error('Error getting wishlist count:', error)
    return 0
  }

  return count || 0
} 