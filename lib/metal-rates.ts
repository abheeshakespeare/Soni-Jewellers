import { createClient } from './supabase/client'

export interface MetalRate {
  id: number
  metal_type: string
  rate_per_gram: number
  updated_at: string
  is_active: boolean
}

export async function getMetalRates(): Promise<MetalRate[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('metal_rates')
    .select('*')
    .eq('is_active', true)
    .order('metal_type')

  if (error) {
    console.error('Error fetching metal rates:', error)
    throw error
  }

  return data || []
}

export async function getMetalRateByType(metalType: string): Promise<number> {
  const rates = await getMetalRates()
  const rate = rates.find(r => r.metal_type === metalType)
  return rate?.rate_per_gram || 0
}

export async function calculateProductPrice(
  weight: number,
  metalType: string,
  customMakingCharges?: number,
  customWastageCharges?: number,
  includeGst: boolean = true
): Promise<{ basePrice: number; gstAmount: number; totalPrice: number }> {
  try {
    // Get metal rate
    const metalRate = await getMetalRateByType(metalType)
    
    // Get making costs
    const { getMakingCosts } = await import('./making-costs')
    const makingCosts = await getMakingCosts()
    const makingCost = makingCosts.find(c => c.metal_type === metalType)
    
    // Calculate base metal value
    const metalValue = weight * metalRate
    
    // Use custom charges if provided, otherwise use default making costs
    const makingCharge = customMakingCharges !== undefined 
      ? weight * customMakingCharges 
      : weight * (makingCost?.making_charge_per_gram || 0)
    
    const wastageCharge = customWastageCharges !== undefined 
      ? weight * customWastageCharges 
      : weight * (makingCost?.wastage_charge_per_gram || 0)
    
    // Calculate base price (metal value + making charges)
    const basePrice = metalValue + makingCharge + wastageCharge
    
    // Calculate GST if required
    let gstAmount = 0
    let totalPrice = basePrice
    
    if (includeGst) {
      const { getGstPercentage, calculateGstAmount } = await import('./gst')
      const gstPercentage = await getGstPercentage()
      gstAmount = calculateGstAmount(basePrice, gstPercentage)
      totalPrice = basePrice + gstAmount
    }
    
    return { basePrice, gstAmount, totalPrice }
  } catch (error) {
    console.error('Error calculating product price:', error)
    // Fallback calculation
    const basePrice = weight * 1000 // Placeholder rate
    const totalCharges = (customMakingCharges || 0) + (customWastageCharges || 0)
    const fallbackBasePrice = basePrice + totalCharges
    
    return { 
      basePrice: fallbackBasePrice, 
      gstAmount: 0, 
      totalPrice: fallbackBasePrice 
    }
  }
}

export function formatMetalRate(rate: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(rate)
}

export function getMetalDisplayName(metalType: string): string {
  switch (metalType) {
    case 'gold_22k': return 'Gold (22K)'
    case 'gold_18k': return 'Gold (18K)'
    case 'silver': return 'Silver'
    default: return metalType
  }
} 