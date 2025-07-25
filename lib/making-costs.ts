import { createClient } from './supabase/client'

export interface MakingCost {
  id: number
  metal_type: string
  making_charge_per_gram: number
  wastage_charge_per_gram: number
  updated_at: string
  is_active: boolean
}

export async function getMakingCosts(): Promise<MakingCost[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('making_costs')
    .select('*')
    .eq('is_active', true)
    .order('metal_type')

  if (error) {
    console.error('Error fetching making costs:', error)
    throw error
  }

  return data || []
}

export async function getMakingCostByType(metalType: string): Promise<MakingCost | null> {
  const costs = await getMakingCosts()
  return costs.find(c => c.metal_type === metalType) || null
}

export function calculateTotalMakingCost(
  weight: number,
  metalType: string,
  makingCosts: MakingCost[]
): { makingCharge: number; wastageCharge: number; total: number } {
  const cost = makingCosts.find(c => c.metal_type === metalType)
  
  if (!cost) {
    return { makingCharge: 0, wastageCharge: 0, total: 0 }
  }

  const makingCharge = weight * cost.making_charge_per_gram
  const wastageCharge = weight * cost.wastage_charge_per_gram
  const total = makingCharge + wastageCharge

  return { makingCharge, wastageCharge, total }
}

export function formatMakingCost(cost: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(cost)
}

export function getMetalDisplayName(metalType: string): string {
  switch (metalType) {
    case 'gold_22k': return 'Gold (22K)'
    case 'gold_18k': return 'Gold (18K)'
    case 'silver': return 'Silver'
    default: return metalType
  }
} 