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
  customMakingPercent?: number,
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
    // Use custom percentage if provided, otherwise use default making cost
    const makingPercent = customMakingPercent !== undefined 
      ? customMakingPercent 
      : (makingCost?.making_charge_percent || 0)
    // Calculate making charge per gram (as percent of metal rate per gram)
    const makingChargePerGram = metalRate * (makingPercent / 100)
    // Calculate total making charge
    const makingCharge = weight * makingChargePerGram
    // Calculate GST base as (weight * metalRate) + (weight * makingChargePerGram)
    const gstBase = metalValue + makingCharge
    // Calculate GST if required
    let gstAmount = 0
    let totalPrice = gstBase
    if (includeGst) {
      const { getGstPercentage, calculateGstAmount } = await import('./gst')
      const gstPercentage = await getGstPercentage()
      gstAmount = calculateGstAmount(gstBase, gstPercentage)
      totalPrice = gstBase + gstAmount
    }
    return { basePrice: gstBase, gstAmount, totalPrice }
  } catch (error) {
    console.error('Error calculating product price:', error)
    // Fallback calculation
    const basePrice = weight * 1000 // Placeholder rate
    return { 
      basePrice: basePrice, 
      gstAmount: 0, 
      totalPrice: basePrice 
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