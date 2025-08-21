import { createClient } from './supabase/client'

export interface GstSetting {
  id: number
  gst_percentage: number
  is_active: boolean
  updated_at: string
}

export async function getGstPercentage(): Promise<number> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('gst_settings')
    .select('gst_percentage')
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching GST percentage:', error)
    return 18.00 // Default GST percentage
  }

  // Only use 18 if value is null or undefined, not if it's 0
  return (data?.gst_percentage ?? 0.00)
}

export async function getGstSettings(): Promise<GstSetting[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('gst_settings')
    .select('*')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching GST settings:', error)
    throw error
  }

  return data || []
}

export function calculateGstAmount(baseAmount: number, gstPercentage: number): number {
  return (baseAmount * gstPercentage) / 100
}

export function calculateTotalWithGst(baseAmount: number, gstPercentage: number): number {
  const gstAmount = calculateGstAmount(baseAmount, gstPercentage)
  return baseAmount + gstAmount
}

export function formatGstPercentage(percentage: number): string {
  return `${percentage.toFixed(2)}%`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount)
} 