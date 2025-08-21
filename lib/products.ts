import { createClient } from './supabase/client'
import { calculateProductPrice } from './metal-rates'

export interface Product {
  id: number
  name: string
  description: string | null
  image_url: string
  metal_type: 'gold' | 'silver' | 'other'
  carat: number | null
  weight_grams: number
  material_color: string | null
  size_description: string | null
  gender: 'male' | 'female' | 'flexible' | 'kids'
  category_id: number
  collection_type: string | null
  base_price: number | null
  final_price: number | null
  is_active: boolean
  is_featured: boolean
  stock_quantity: number
  created_at: string
  updated_at: string
  category?: {
    id: number
    name: string
  }
}

export interface CreateProductData {
  name: string
  description?: string
  image_url: string
  metal_type: 'gold' | 'silver' | 'other'
  carat?: number
  weight_grams: number
  material_color?: string
  size_description?: string
  gender: 'male' | 'female' | 'flexible' | 'kids'
  category_id: number
  collection_type?: string
  manual_price?: number
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      // Return empty array instead of throwing to prevent page crashes
      return []
    }

    return data || []
  } catch (error) {
    console.error('Network error fetching products:', error)
    // Return empty array on network errors to prevent page crashes
    return []
  }
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all products for admin:', error)
    return []
  }

  return data || []
}

export async function getProductById(id: number): Promise<Product | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}

export async function createProduct(productData: CreateProductData): Promise<Product> {
  const supabase = createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Calculate prices
  let metalTypeForCalculation: string
  if (productData.metal_type === 'gold') {
    metalTypeForCalculation = `gold_${productData.carat}k`
  } else if (productData.metal_type === 'silver') {
    metalTypeForCalculation = 'silver'
  } else {
    // For 'other' metal types, we'll set base price to 0 and let admin set manual price
    metalTypeForCalculation = 'other'
  }

  let basePrice = 0
  let totalPrice = 0
  
  if (productData.metal_type !== 'other') {
    const priceCalculation = await calculateProductPrice(
      productData.weight_grams,
      metalTypeForCalculation
    )
    basePrice = priceCalculation.basePrice
    totalPrice = priceCalculation.totalPrice
  } else {
    // For 'other' metal types, use the manual price
    if (productData.manual_price && productData.manual_price > 0) {
      basePrice = productData.manual_price
      totalPrice = productData.manual_price
    } else {
      // If no manual price provided for 'other' type, set to 0
      basePrice = 0
      totalPrice = 0
    }
  }

  // Remove manual_price from insertData since it's not a database column
  const { manual_price, ...productDataWithoutManualPrice } = productData
  
  const insertData = {
    ...productDataWithoutManualPrice,
    base_price: basePrice,
    final_price: totalPrice,
    is_active: true,
    is_featured: false,
    stock_quantity: 1,
    created_by: user.id
  }

  console.log('Inserting product data:', JSON.stringify(insertData, null, 2))

  const { data, error } = await supabase
    .from('products')
    .insert(insertData)
    .select(`
      *,
      category:categories(id, name)
    `)
    .single()

  if (error) {
    console.error('Error creating product:', error)
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    console.error('Full error object:', JSON.stringify(error, null, 2))
    throw error
  }

  return data
}

export async function updateProduct(id: number, productData: Partial<CreateProductData>): Promise<Product> {
  const supabase = createClient()
  
  // Recalculate prices if weight or metal type changed
  let basePrice = null
  let finalPrice = null
  
  if (productData.weight_grams || productData.metal_type || productData.carat) {
    // Get existing product without active filter for updates
    const supabase = createClient()
    const { data: existingProduct } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      
    if (existingProduct) {
      const weight = productData.weight_grams || existingProduct.weight_grams
      const metalType = productData.metal_type || existingProduct.metal_type
      const carat = productData.carat || existingProduct.carat
      
      let metalTypeForCalculation: string
      if (metalType === 'gold') {
        metalTypeForCalculation = `gold_${carat}k`
      } else if (metalType === 'silver') {
        metalTypeForCalculation = 'silver'
      } else {
        // For 'other' metal types, we'll set base price to 0 and let admin set manual price
        metalTypeForCalculation = 'other'
      }

      if (metalType !== 'other') {
        const { basePrice: newBasePrice, gstAmount, totalPrice } = await calculateProductPrice(
          weight,
          metalTypeForCalculation
        )
        
        basePrice = newBasePrice
        finalPrice = totalPrice
      } else {
        // For 'other' metal types, use the manual price if provided
        const manualPrice = productData.manual_price || existingProduct.base_price || 0
        basePrice = manualPrice
        finalPrice = manualPrice
      }
    }
  }

  const updateData: any = { ...productData }
  if (basePrice !== null) updateData.base_price = basePrice
  if (finalPrice !== null) updateData.final_price = finalPrice

  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      category:categories(id, name)
    `)
    .single()

  if (error) {
    console.error('Error updating product:', error)
    throw error
  }

  return data
}

export async function deleteProduct(id: number): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    throw error
  }

  // Trigger revalidation of product pages
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: '/products' }),
    })
  } catch (revalidateError) {
    console.error('Error revalidating cache:', revalidateError)
  }
}

export async function toggleProductFeatured(id: number, isFeatured: boolean): Promise<Product> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .update({ is_featured: isFeatured })
    .eq('id', id)
    .select(`
      *,
      category:categories(id, name)
    `)
    .single()

  if (error) {
    console.error('Error toggling product featured status:', error)
    throw error
  }

  return data
}

export async function getRelatedProducts(categoryId: number, currentProductId: number, limit: number = 8): Promise<Product[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name)
    `)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', currentProductId)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching related products:', error)
    return []
  }

  // Double-check to ensure no inactive products are returned
  const activeProducts = (data || []).filter(product => product.is_active === true)
  
  console.log(`Found ${activeProducts.length} active related products out of ${data?.length || 0} total`)
  
  return activeProducts
}

export function getGenderDisplayName(gender: string): string {
  switch (gender) {
    case 'male': return 'Male'
    case 'female': return 'Female'
    case 'flexible': return 'Unisex'
    case 'kids': return 'Kids'
    default: return gender
  }
}

export function getMetalDisplayName(metalType: string, carat?: number, materialColor?: string): string {
  if (metalType === 'gold' && carat) {
    return `Gold (${carat}K)`
  }
  if (metalType === 'silver') {
    return 'Silver'
  }
  if (metalType === 'other') {
    return materialColor || 'Other Material'
  }
  return metalType.charAt(0).toUpperCase() + metalType.slice(1)
} 

/**
 * Batch update all product prices based on current metal rates and making costs.
 * Recalculates and updates base_price and final_price for all products except 'other' metal type.
 */
export async function batchUpdateAllProductPrices() {
  const supabase = createClient();
  // Fetch all products
  const { data: products, error } = await supabase
    .from('products')
    .select('*');
  if (error) {
    console.error('Error fetching products for batch update:', error);
    throw error;
  }
  if (!products) return;

  for (const product of products) {
    if (!product.is_active) continue;
    let metalTypeForCalculation;
    if (product.metal_type === 'gold') {
      metalTypeForCalculation = `gold_${product.carat}k`;
    } else if (product.metal_type === 'silver') {
      metalTypeForCalculation = 'silver';
    } else {
      // Skip 'other' metal types (manual price)
      continue;
    }
    try {
      const { basePrice, totalPrice } = await calculateProductPrice(
        product.weight_grams,
        metalTypeForCalculation
      );
      await supabase
        .from('products')
        .update({
          base_price: basePrice,
          final_price: totalPrice,
        })
        .eq('id', product.id);
    } catch (err) {
      console.error(`Failed to update price for product ${product.id}:`, err);
    }
  }
} 